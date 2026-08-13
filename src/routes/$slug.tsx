import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { pageSectionsQuery } from "@/lib/cms/api";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { SectionRenderer } from "@/components/site/SectionRenderer";
import { CardsSkeleton, EmptyState } from "@/components/shared/States";

export const Route = createFileRoute("/$slug")({
  head: () => ({
    meta: [
      { title: "صفحة | المستشار العزي للمشروع" },
      { name: "description", content: "صفحة محتوى من موقع المستشار العزي للمشروع." },
      { property: "og:title", content: "المستشار العزي للمشروع" },
      { property: "og:description", content: "صفحة محتوى من موقع المستشار العزي للمشروع." },
    ],
  }),
  component: DynamicPage,
});

function DynamicPage() {
  const { slug } = Route.useParams();
  const { data, isPending } = useQuery(pageSectionsQuery(slug));

  if (isPending) {
    return (
      <SiteLayout>
        <div className="container-page py-20">
          <CardsSkeleton count={3} />
        </div>
      </SiteLayout>
    );
  }

  if (!data?.page) {
    return (
      <SiteLayout>
        <div className="container-page py-24">
          <EmptyState icon="FileQuestion" title="الصفحة غير موجودة" description="ربما تم نقل هذه الصفحة أو حذفها." />
        </div>
      </SiteLayout>
    );
  }

  const hasHero = data.sections.some((s) => s.section_type === "hero");

  return (
    <SiteLayout>
      {hasHero ? null : (
        <PageHero title={data.page.title} {...(data.page.meta_description ? { description: data.page.meta_description } : {})} />
      )}
      {data.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </SiteLayout>
  );
}
