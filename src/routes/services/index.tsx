import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { serviceCategoriesQuery, servicesQuery } from "@/lib/cms/api";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { ServiceCard } from "@/components/site/ServiceCard";
import { CardsSkeleton, EmptyState } from "@/components/shared/States";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "خدماتنا الاستشارية | المستشار العزي للمشروع" },
      {
        name: "description",
        content:
          "باقة متكاملة من الخدمات الاستشارية: أنظمة الجودة، الهيكلة المؤسسية، التخطيط الاستراتيجي، الحوكمة، وتأهيل الجهات للاعتماد.",
      },
      { property: "og:title", content: "خدماتنا الاستشارية" },
      { property: "og:description", content: "خدمات استشارية متخصصة في الجودة والتطوير المؤسسي." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services, isPending } = useQuery(servicesQuery);
  const { data: categories } = useQuery(serviceCategoriesQuery);
  const [active, setActive] = useState<string>("all");

  const items = (services ?? []).filter((s) => active === "all" || s.category_id === active);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="خدماتنا"
        title="خدمات استشارية تبني أنظمة عمل مستدامة"
        description="نعمل معك من التشخيص حتى التطبيق والقياس، بمنهجية عملية تناسب طبيعة جهتك وحجمها."
      />
      <section className="py-14 md:py-20">
        <div className="container-page">
          {(categories ?? []).length > 0 ? (
            <div className="mb-10 flex flex-wrap gap-2">
              {[{ id: "all", name: "جميع الخدمات" }, ...(categories ?? [])].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActive(cat.id)}
                  className={cn(
                    "rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors",
                    active === cat.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          ) : null}

          {isPending ? (
            <CardsSkeleton count={9} />
          ) : items.length === 0 ? (
            <EmptyState icon="Layers" title="لا توجد خدمات في هذا التصنيف." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
