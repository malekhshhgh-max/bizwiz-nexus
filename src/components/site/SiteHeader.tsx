import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AppLink } from "@/components/shared/AppLink";
import { useQuery } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationQuery, settingsQuery, str, bool } from "@/lib/cms/api";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useQuery(settingsQuery);
  const { data: nav } = useQuery(navigationQuery);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const brand = settings?.["brand"];
  const header = settings?.["header"];
  const items = (nav ?? []).filter((i) => i.location === "header");
  const logo = str(brand, "logo_url");
  const siteName = str(brand, "site_name", "المستشار العزي للمشروع");

  return (
    <header
      className={cn(
        "top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl",
        bool(header, "sticky", true) ? "sticky" : "relative",
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
        <AppLink to="/" className="flex items-center gap-3" aria-label={siteName}>
          {logo ? (
            <img src={logo} alt={siteName} className="h-11 w-auto object-contain" />
          ) : (
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary font-heading text-lg font-bold text-primary-foreground">
              ع
            </span>
          )}
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-heading text-base font-bold">{siteName}</span>
            <span className="text-xs text-muted-foreground">{str(brand, "tagline")}</span>
          </span>
        </AppLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="القائمة الرئيسية">
          {items.map((item) => {
            const active = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url));
            return (
              <AppLink
                key={item.id}
                to={item.url}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-foreground",
                  active && "bg-primary-soft text-primary",
                )}
              >
                {item.label}
              </AppLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {bool(header, "show_cta", true) ? (
            <Button asChild className="hidden md:inline-flex">
              <AppLink to={str(header, "cta_url", "/consultation")}>{str(header, "cta_label", "اطلب استشارة")}</AppLink>
            </Button>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            className="flex size-11 items-center justify-center rounded-lg border border-border lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="قائمة الجوال">
            {items.map((item) => (
              <AppLink
                key={item.id}
                to={item.url}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
              >
                {item.label}
              </AppLink>
            ))}
            <Button asChild className="mt-2">
              <AppLink to={str(header, "cta_url", "/consultation")} onClick={() => setOpen(false)}>
                {str(header, "cta_label", "اطلب استشارة")}
              </AppLink>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
