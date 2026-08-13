import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { list, serviceBySlugQuery, str } from "@/lib/cms/api";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { CardsSkeleton, EmptyState } from "@/components/shared/States";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/shared/AppLink";
import { Icon } from "@/components/shared/Icon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/services/$slug")({
  head: () => ({
    meta: [
      { title: "تفاصيل الخدمة | المستشار العزي للمشروع" },
      { name: "description", content: "تفاصيل الخدمة الاستشارية ومخرجاتها وخطوات تنفيذها." },
      { property: "og:title", content: "تفاصيل الخدمة | المستشار العزي" },
      { property: "og:description", content: "تفاصيل الخدمة الاستشارية ومخرجاتها وخطوات تنفيذها." },
    ],
  }),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data: service, isPending } = useQuery(serviceBySlugQuery(slug));

  if (isPending) {
    return (
      <SiteLayout>
        <div className="container-page py-20">
          <CardsSkeleton count={3} />
        </div>
      </SiteLayout>
    );
  }

  if (!service) {
    return (
      <SiteLayout>
        <div className="container-page py-24">
          <EmptyState icon="SearchX" title="الخدمة غير متوفرة" description="ربما تم تعديل رابط الخدمة." />
        </div>
      </SiteLayout>
    );
  }

  const features = list<{ title?: string; description?: string; icon?: string }>(service.features);
  const steps = list<{ title?: string; description?: string }>(service.process_steps);
  const outcomes = list<string | { title?: string }>(service.outcomes);
  const faq = list<{ question?: string; answer?: string }>(service.faq);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="خدمة استشارية"
        title={service.title}
        {...(service.short_description ? { description: service.short_description } : {})}
      />

      <section className="py-14 md:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div>
            {service.full_description ? (
              <div className="space-y-4 text-base leading-9 text-muted-foreground">
                {service.full_description.split("\n").filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}

            {features.length ? (
              <div className="mt-12">
                <h2 className="font-heading text-xl md:text-2xl">ما الذي تشمله الخدمة؟</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {features.map((f, i) => (
                    <div key={i} className="surface-card p-5">
                      <Icon name={f.icon} className="size-5 text-accent" />
                      <h3 className="mt-3 font-heading text-base">{f.title}</h3>
                      {f.description ? (
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{f.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {steps.length ? (
              <div className="mt-12">
                <h2 className="font-heading text-xl md:text-2xl">خطوات التنفيذ</h2>
                <ol className="mt-6 space-y-4">
                  {steps.map((step, i) => (
                    <li key={i} className="surface-card flex gap-4 p-5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-heading text-base">{step.title}</h3>
                        {step.description ? (
                          <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{step.description}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {faq.length ? (
              <div className="mt-12">
                <h2 className="font-heading text-xl md:text-2xl">أسئلة شائعة حول الخدمة</h2>
                <Accordion type="single" collapsible className="mt-6">
                  {faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="surface-card mb-3 px-5">
                      <AccordionTrigger className="text-right font-heading text-base hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-8 text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            {outcomes.length ? (
              <div className="surface-card p-6">
                <h2 className="font-heading text-base">المخرجات المتوقعة</h2>
                <ul className="mt-4 space-y-3">
                  {outcomes.map((o, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-7 text-muted-foreground">
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-accent" />
                      <span>{typeof o === "string" ? o : (o.title ?? "")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="gradient-hero mt-6 rounded-2xl p-6 text-primary-foreground">
              <h2 className="font-heading text-lg">{str(service, "cta_title", "هل تحتاج هذه الخدمة؟")}</h2>
              <p className="mt-2 text-sm leading-7 text-primary-foreground/80">
                {str(service, "cta_description", "احجز استشارة أولية ونساعدك في تحديد نطاق العمل المناسب لجهتك.")}
              </p>
              <Button asChild variant="accent" className="mt-5 w-full">
                <AppLink to="/consultation">اطلب استشارة</AppLink>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
