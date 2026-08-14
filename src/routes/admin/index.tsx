import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminCountsQuery, auditLogsQuery, consultationsQuery } from "@/lib/cms/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";
import { AppLink } from "@/components/shared/AppLink";
import { LEAD_STATUS_LABELS } from "@/lib/cms/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const STATS: { key: string; label: string; icon: string; to: string }[] = [
  { key: "services", label: "الخدمات", icon: "Briefcase", to: "/admin/content/services" },
  { key: "pages", label: "الصفحات", icon: "Files", to: "/admin/content/pages" },
  { key: "posts", label: "المقالات", icon: "Newspaper", to: "/admin/content/blog" },
  { key: "projects", label: "المشاريع", icon: "FolderKanban", to: "/admin/content/projects" },
  { key: "leads", label: "طلبات جديدة", icon: "ClipboardList", to: "/admin/consultations" },
  { key: "messages", label: "رسائل جديدة", icon: "Mail", to: "/admin/messages" },
  { key: "media", label: "ملفات الوسائط", icon: "Images", to: "/admin/media" },
  { key: "testimonials", label: "آراء العملاء", icon: "Quote", to: "/admin/content/testimonials" },
];

function AdminDashboard() {
  const { data: counts } = useQuery(adminCountsQuery);
  const { data: logs = [] } = useQuery(auditLogsQuery);
  const { data: leads = [] } = useQuery(consultationsQuery);

  return (
    <AdminShell title="لوحة المعلومات" description="نظرة عامة على المحتوى والطلبات والنشاط">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <AppLink key={stat.key} to={stat.to}>
            <Card className="flex items-center gap-4 p-5 transition hover:border-primary">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon name={stat.icon} className="size-5" />
              </span>
              <div>
                <p className="font-heading text-2xl">{counts?.[stat.key] ?? 0}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          </AppLink>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base">أحدث طلبات الاستشارة</h2>
            <Button asChild variant="ghost" size="sm">
              <AppLink to="/admin/consultations">عرض الكل</AppLink>
            </Button>
          </div>
          <ul className="space-y-3">
            {leads.slice(0, 6).map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{lead.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {lead.requested_service ?? lead.organization ?? lead.phone}
                  </p>
                </div>
                <Badge variant="secondary">{LEAD_STATUS_LABELS[lead.status] ?? lead.status}</Badge>
              </li>
            ))}
            {leads.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">لا توجد طلبات بعد.</p> : null}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base">آخر النشاطات</h2>
            <Button asChild variant="ghost" size="sm">
              <AppLink to="/admin/activity">سجل النشاط</AppLink>
            </Button>
          </div>
          <ul className="space-y-3">
            {logs.slice(0, 8).map((log) => (
              <li key={log.id} className="flex items-start gap-3 border-b border-border/60 pb-3 last:border-0">
                <Icon name="Activity" className="mt-0.5 size-4 text-accent" />
                <div className="min-w-0">
                  <p className="truncate text-sm">
                    {log.action} — {log.entity_label ?? log.entity_type}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {log.user_email} · {new Date(log.created_at).toLocaleString("ar")}
                  </p>
                </div>
              </li>
            ))}
            {logs.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">لا يوجد نشاط بعد.</p> : null}
          </ul>
        </Card>
      </div>
    </AdminShell>
  );
}
