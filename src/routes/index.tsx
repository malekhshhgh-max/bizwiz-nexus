import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { pageSectionsQuery } from "@/lib/cms/api";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionRenderer } from "@/components/site/SectionRenderer";
import { CardsSkeleton, ErrorState } from "@/components/shared/States";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "المستشار العزي للمشروع | استشارات الجودة والتطوير المؤسسي" },
      {
        name: "description",
        content:
          "بيت خبرة سعودي في الاستشارات الإدارية وأنظمة الجودة والتحول المؤسسي، نساعد الجهات على بناء أنظمة عمل مستدامة وقابلة للقياس.",
      },
      { property: "og:title", content: "المستشار العزي للمشروع" },
      {
        property: "og:description",
        content: "شريكك في بناء أنظمة الجودة والتطوير المؤسسي بمعايير احترافية.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data, isPending, error, refetch } = useQuery(pageSectionsQuery("home"));

  return (
    <SiteLayout>
      {isPending ? (
        <div className="container-page py-20">
          <CardsSkeleton count={3} />
        </div>
      ) : error ? (
        <div className="container-page py-20">
          <ErrorState message={error.message} onRetry={() => void refetch()} />
        </div>
      ) : (
        (data?.sections ?? []).map((section) => <SectionRenderer key={section.id} section={section} />)
      )}
    </SiteLayout>
  );
}
