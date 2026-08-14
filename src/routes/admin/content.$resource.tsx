import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { RESOURCES } from "@/lib/cms/resources";

export const Route = createFileRoute("/admin/content/$resource")({
  component: ContentResourcePage,
});

function ContentResourcePage() {
  const { resource } = Route.useParams();
  const config = RESOURCES[resource];

  if (!config) {
    return (
      <AdminShell title="المورد غير موجود">
        <p className="text-sm text-muted-foreground">لا يوجد مورد باسم «{resource}».</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={config.title}
      description={config.description}
      breadcrumbs={[{ label: "لوحة التحكم", to: "/admin" }, { label: config.title }]}
    >
      <ResourceManager resourceKey={resource} config={config} />
    </AdminShell>
  );
}
