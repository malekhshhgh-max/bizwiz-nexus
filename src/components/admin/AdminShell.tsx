import { useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AppLink } from "@/components/shared/AppLink";
import { useAuth, ROLE_LABELS } from "@/hooks/useAuth";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = { label: string; to: string; icon: string; search?: Record<string, string> };

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "عام",
    items: [
      { label: "لوحة المعلومات", to: "/admin", icon: "LayoutDashboard" },
      { label: "الصفحات", to: "/admin/content/pages", icon: "Files" },
    ],
  },
  {
    title: "المحتوى",
    items: [
      { label: "الخدمات", to: "/admin/content/services", icon: "Briefcase" },
      { label: "تصنيفات الخدمات", to: "/admin/content/service-categories", icon: "FolderTree" },
      { label: "المشاريع", to: "/admin/content/projects", icon: "FolderKanban" },
      { label: "القطاعات", to: "/admin/content/sectors", icon: "Building2" },
      { label: "المقالات", to: "/admin/content/blog", icon: "Newspaper" },
      { label: "تصنيفات المقالات", to: "/admin/content/blog-categories", icon: "Tags" },
      { label: "الأسئلة الشائعة", to: "/admin/content/faqs", icon: "MessagesSquare" },
      { label: "آراء العملاء", to: "/admin/content/testimonials", icon: "Quote" },
    ],
  },
  {
    title: "التواصل",
    items: [
      { label: "طلبات الاستشارة", to: "/admin/consultations", icon: "ClipboardList" },
      { label: "الرسائل", to: "/admin/messages", icon: "Mail" },
    ],
  },
  {
    title: "المظهر",
    items: [
      { label: "مكتبة الوسائط", to: "/admin/media", icon: "Images" },
      { label: "المظهر والهوية", to: "/admin/appearance", icon: "Palette" },
      { label: "القوائم والروابط", to: "/admin/content/navigation", icon: "Menu" },
      { label: "الإعدادات وSEO", to: "/admin/settings", icon: "Settings" },
    ],
  },
  {
    title: "النظام",
    items: [
      { label: "المستخدمون والأدوار", to: "/admin/users", icon: "Users" },
      { label: "سجل النشاط", to: "/admin/activity", icon: "History" },
    ],
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-6 p-4">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-wide text-muted-foreground">{group.title}</p>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <AppLink
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon name={item.icon} className="size-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </AppLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({
  title,
  description,
  breadcrumbs,
  actions,
  children,
}: {
  title: string;
  description?: string | undefined;
  breadcrumbs?: { label: string; to?: string }[] | undefined;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user, roles, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex w-full">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-l border-border bg-background lg:block">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Icon name="ShieldCheck" className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">لوحة التحكم</p>
              <p className="text-[11px] text-muted-foreground">نظام إدارة المحتوى</p>
            </div>
          </div>
          <NavLinks />
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="فتح القائمة">
                  <Icon name="Menu" className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 overflow-y-auto p-0">
                <SheetTitle className="border-b border-border px-5 py-4 text-sm">لوحة التحكم</SheetTitle>
                <NavLinks onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              {breadcrumbs?.length ? (
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
                  {breadcrumbs.map((b, i) => (
                    <span key={i} className="flex items-center gap-1">
                      {b.to ? (
                        <AppLink to={b.to} className="hover:text-foreground">
                          {b.label}
                        </AppLink>
                      ) : (
                        <span>{b.label}</span>
                      )}
                      {i < breadcrumbs.length - 1 ? <span>/</span> : null}
                    </span>
                  ))}
                </div>
              ) : null}
              <h1 className="truncate font-heading text-lg md:text-xl">{title}</h1>
              {description ? <p className="truncate text-xs text-muted-foreground">{description}</p> : null}
            </div>

            <div className="flex items-center gap-2">
              {actions}
              <div className="hidden text-left sm:block">
                <p className="max-w-[160px] truncate text-xs font-medium">{user?.email}</p>
                <p className="text-[11px] text-muted-foreground">
                  {roles.map((r) => ROLE_LABELS[r]).join("، ") || "بدون دور"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => void signOut()} aria-label="تسجيل الخروج">
                <Icon name="LogOut" className="size-4" />
              </Button>
            </div>
          </header>

          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
