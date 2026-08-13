import { useQuery } from "@tanstack/react-query";
import {
  faqsQuery,
  list,
  postsQuery,
  projectsQuery,
  sectorsQuery,
  servicesQuery,
  settingsQuery,
  str,
  testimonialsQuery,
  type PageSection,
} from "@/lib/cms/api";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/shared/AppLink";
import { Icon } from "@/components/shared/Icon";
import { ServiceCard } from "@/components/site/ServiceCard";
import { CardsSkeleton, EmptyState } from "@/components/shared/States";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatArabicDate } from "@/lib/cms/utils";
import { cn } from "@/lib/utils";
import { Quote, Star } from "lucide-react";

type Settings = Record<string, unknown>;

function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = "default",
  center = false,
}: {
  id?: string;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  children?: React.ReactNode;
  tone?: "default" | "muted" | "primary";
  center?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24",
        tone === "muted" && "bg-muted/60",
        tone === "primary" && "gradient-hero text-primary-foreground",
      )}
    >
      <div className="container-page">
        {title || eyebrow ? (
          <div className={cn("mb-10 max-w-2xl md:mb-14", center && "mx-auto text-center")}>
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            {title ? <h2 className="mt-2 font-heading text-2xl leading-snug text-balance-ar md:text-4xl">{title}</h2> : null}
            {description ? (
              <p className={cn("mt-4 text-base leading-8", tone === "primary" ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

function HeroSection({ section }: { section: PageSection }) {
  const s = (section.settings ?? {}) as Settings;
  const image = str(s, "image");
  const overlayRaw = s["overlay"];
  const overlay = typeof overlayRaw === "number" ? Math.min(Math.max(overlayRaw, 0), 1) : 0.75;
  return (
    <section className="relative isolate overflow-hidden gradient-hero text-primary-foreground">
      {image ? (
        <>
          <img src={image} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 gradient-hero" style={{ opacity: overlay }} aria-hidden />
        </>
      ) : null}
      <div
        aria-hidden
        className="absolute -top-32 -left-24 size-96 rounded-full bg-accent/15 blur-3xl"
      />
      <div className="container-page relative py-20 md:py-32">
        <div className="max-w-3xl animate-rise">
          {section.subtitle ? <span className="eyebrow">{section.subtitle}</span> : null}
          <h1 className="mt-4 font-heading text-3xl leading-[1.25] text-balance-ar md:text-6xl">{section.title}</h1>
          {section.content ? (
            <p className="mt-6 max-w-2xl text-base leading-9 text-primary-foreground/85 md:text-lg">{section.content}</p>
          ) : null}
          <div className="mt-9 flex flex-wrap gap-3">
            {str(s, "primary_cta_label") ? (
              <Button asChild size="lg" variant="accent">
                <AppLink to={str(s, "primary_cta_url", "/consultation")}>{str(s, "primary_cta_label")}</AppLink>
              </Button>
            ) : null}
            {str(s, "secondary_cta_label") ? (
              <Button asChild size="lg" variant="onDark">
                <AppLink to={str(s, "secondary_cta_url", "/services")}>{str(s, "secondary_cta_label")}</AppLink>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ section }: { section: PageSection }) {
  const s = (section.settings ?? {}) as Settings;
  const stats = list<{ value?: string; label?: string }>(s["stats"]);
  const image = str(s, "image");
  return (
    <SectionShell>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          {section.subtitle ? <span className="eyebrow">{section.subtitle}</span> : null}
          <h2 className="mt-2 font-heading text-2xl leading-snug text-balance-ar md:text-4xl">{section.title}</h2>
          {section.content ? <p className="mt-5 text-base leading-9 text-muted-foreground">{section.content}</p> : null}
          {stats.length ? (
            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <div key={i} className="surface-card p-4">
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  <dd className="mt-1 font-heading text-2xl text-primary">{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {str(s, "cta_label") ? (
            <Button asChild className="mt-8" variant="outline">
              <AppLink to={str(s, "cta_url", "/about")}>{str(s, "cta_label")}</AppLink>
            </Button>
          ) : null}
        </div>
        <div className="relative">
          <div className="aspect-4/3 overflow-hidden rounded-3xl border border-border bg-primary-soft">
            {image ? (
              <img src={image} alt={section.title ?? ""} className="size-full object-cover" loading="lazy" />
            ) : (
              <div className="flex size-full items-center justify-center text-primary/40">
                <Icon name="Building2" className="size-20" />
              </div>
            )}
          </div>
          <div aria-hidden className="absolute -bottom-5 -left-5 -z-10 size-40 rounded-3xl bg-accent/20" />
        </div>
      </div>
    </SectionShell>
  );
}

function ServicesSection({ section }: { section: PageSection }) {
  const s = (section.settings ?? {}) as Settings;
  const { data, isPending } = useQuery(servicesQuery);
  const limitRaw = s["limit"];
  const limit = typeof limitRaw === "number" ? limitRaw : 6;
  const featuredOnly = s["featured_only"] === true;
  let items = data ?? [];
  if (featuredOnly && items.some((i) => i.is_featured)) items = items.filter((i) => i.is_featured);
  items = items.slice(0, limit);

  return (
    <SectionShell tone="muted" eyebrow={section.subtitle} title={section.title} description={section.content}>
      {isPending ? (
        <CardsSkeleton count={6} />
      ) : items.length === 0 ? (
        <EmptyState icon="Layers" title="لم تتم إضافة خدمات بعد." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
      {str(s, "cta_label") ? (
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <AppLink to={str(s, "cta_url", "/services")}>{str(s, "cta_label")}</AppLink>
          </Button>
        </div>
      ) : null}
    </SectionShell>
  );
}

function FeaturesSection({ section }: { section: PageSection }) {
  const s = (section.settings ?? {}) as Settings;
  const items = list<{ title?: string; description?: string; icon?: string }>(s["items"]);
  return (
    <SectionShell eyebrow={section.subtitle} title={section.title} description={section.content}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <div key={i} className="surface-card p-6">
            <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent-foreground">
              <Icon name={item.icon} className="size-5" />
            </span>
            <h3 className="font-heading text-base">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function SectorsSection({ section }: { section: PageSection }) {
  const s = (section.settings ?? {}) as Settings;
  const { data, isPending } = useQuery(sectorsQuery);
  return (
    <SectionShell tone="muted" eyebrow={section.subtitle} title={section.title} description={section.content}>
      {isPending ? (
        <CardsSkeleton count={5} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((sector) => (
            <div key={sector.id} className="surface-card flex gap-4 p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon name={sector.icon} className="size-5" />
              </span>
              <div>
                <h3 className="font-heading text-base">{sector.title}</h3>
                <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{sector.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {str(s, "cta_label") ? (
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <AppLink to={str(s, "cta_url", "/sectors")}>{str(s, "cta_label")}</AppLink>
          </Button>
        </div>
      ) : null}
    </SectionShell>
  );
}

function TimelineSection({ section }: { section: PageSection }) {
  const s = (section.settings ?? {}) as Settings;
  const steps = list<{ number?: string; title?: string; description?: string }>(s["steps"]);
  return (
    <SectionShell eyebrow={section.subtitle} title={section.title} description={section.content}>
      <ol className="relative grid gap-6 md:grid-cols-5">
        {steps.map((step, i) => (
          <li key={i} className="surface-card relative p-6">
            <span className="font-heading text-3xl text-accent">{step.number ?? String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 font-heading text-base">{step.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

function FaqSection({ section }: { section: PageSection }) {
  const s = (section.settings ?? {}) as Settings;
  const { data } = useQuery(faqsQuery);
  const limitRaw = s["limit"];
  const limit = typeof limitRaw === "number" ? limitRaw : 6;
  const items = (data ?? []).slice(0, limit);
  if (items.length === 0) return null;
  return (
    <SectionShell tone="muted" eyebrow={section.subtitle} title={section.title} description={section.content}>
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {items.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} className="surface-card mb-3 px-5">
            <AccordionTrigger className="text-right font-heading text-base hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-8 text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionShell>
  );
}

function TestimonialsSection({ section }: { section: PageSection }) {
  const { data } = useQuery(testimonialsQuery);
  const items = data ?? [];
  if (items.length === 0) return null;
  return (
    <SectionShell eyebrow={section.subtitle} title={section.title} description={section.content}>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((t) => (
          <figure key={t.id} className="surface-card p-6">
            <Quote className="size-6 text-accent" />
            <blockquote className="mt-4 text-sm leading-8 text-muted-foreground">{t.content}</blockquote>
            <figcaption className="mt-5 border-t border-border pt-4">
              <span className="block font-heading text-sm">{t.author_name}</span>
              <span className="text-xs text-muted-foreground">
                {[t.author_title, t.organization].filter(Boolean).join(" — ")}
              </span>
              {t.rating ? (
                <span className="mt-2 flex gap-0.5 text-accent" aria-label={`تقييم ${t.rating} من 5`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </span>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}

function ProjectsSection({ section }: { section: PageSection }) {
  const { data, isPending } = useQuery(projectsQuery);
  const items = (data ?? []).slice(0, 6);
  if (!isPending && items.length === 0) return null;
  return (
    <SectionShell eyebrow={section.subtitle} title={section.title} description={section.content}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project) => (
          <article key={project.id} className="surface-card overflow-hidden">
            <div className="aspect-16/10 bg-primary-soft">
              {project.image ? (
                <img src={project.image} alt={project.title} className="size-full object-cover" loading="lazy" />
              ) : null}
            </div>
            <div className="p-5">
              {project.category ? <span className="eyebrow">{project.category}</span> : null}
              <h3 className="mt-1 font-heading text-base">{project.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function BlogSection({ section }: { section: PageSection }) {
  const { data } = useQuery(postsQuery);
  const items = (data ?? []).slice(0, 3);
  if (items.length === 0) return null;
  return (
    <SectionShell tone="muted" eyebrow={section.subtitle} title={section.title} description={section.content}>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((post) => (
          <AppLink key={post.id} to={`/blog/${post.slug}`} className="surface-card overflow-hidden transition-shadow hover:shadow-elegant">
            <div className="aspect-16/9 bg-primary-soft">
              {post.featured_image ? (
                <img src={post.featured_image} alt={post.title} className="size-full object-cover" loading="lazy" />
              ) : null}
            </div>
            <div className="p-5">
              <span className="text-xs text-muted-foreground">{formatArabicDate(post.published_at)}</span>
              <h3 className="mt-1 font-heading text-base">{post.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
            </div>
          </AppLink>
        ))}
      </div>
    </SectionShell>
  );
}

function CtaSection({ section }: { section: PageSection }) {
  const s = (section.settings ?? {}) as Settings;
  return (
    <section className="py-16 md:py-20">
      <div className="container-page">
        <div className="gradient-hero relative overflow-hidden rounded-3xl px-8 py-14 text-center text-primary-foreground md:px-16">
          <div aria-hidden className="absolute -top-20 -right-10 size-64 rounded-full bg-accent/15 blur-3xl" />
          <h2 className="relative font-heading text-2xl leading-snug text-balance-ar md:text-4xl">{section.title}</h2>
          {section.content ? (
            <p className="relative mx-auto mt-4 max-w-2xl text-base leading-8 text-primary-foreground/80">{section.content}</p>
          ) : null}
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            {str(s, "primary_cta_label") ? (
              <Button asChild size="lg" variant="accent">
                <AppLink to={str(s, "primary_cta_url", "/consultation")}>{str(s, "primary_cta_label")}</AppLink>
              </Button>
            ) : null}
            {str(s, "secondary_cta_label") ? (
              <Button asChild size="lg" variant="onDark">
                <AppLink to={str(s, "secondary_cta_url", "/contact")}>{str(s, "secondary_cta_label")}</AppLink>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function TextSection({ section }: { section: PageSection }) {
  return (
    <SectionShell eyebrow={section.subtitle} title={section.title}>
      {section.content ? (
        <div className="max-w-3xl space-y-4 text-base leading-9 text-muted-foreground">
          {section.content.split("\n").filter(Boolean).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : null}
    </SectionShell>
  );
}

function ImageTextSection({ section }: { section: PageSection }) {
  const s = (section.settings ?? {}) as Settings;
  const image = str(s, "image");
  const reverse = s["reverse"] === true;
  return (
    <SectionShell>
      <div className={cn("grid items-center gap-12 lg:grid-cols-2", reverse && "lg:[direction:ltr]")}>
        <div className={cn(reverse && "lg:[direction:rtl]")}>
          {section.subtitle ? <span className="eyebrow">{section.subtitle}</span> : null}
          <h2 className="mt-2 font-heading text-2xl md:text-3xl">{section.title}</h2>
          <p className="mt-4 text-base leading-9 text-muted-foreground">{section.content}</p>
        </div>
        <div className={cn("aspect-4/3 overflow-hidden rounded-3xl bg-primary-soft", reverse && "lg:[direction:rtl]")}>
          {image ? <img src={image} alt={section.title ?? ""} className="size-full object-cover" loading="lazy" /> : null}
        </div>
      </div>
    </SectionShell>
  );
}

function StatsSection({ section }: { section: PageSection }) {
  const s = (section.settings ?? {}) as Settings;
  const items = list<{ value?: string; label?: string }>(s["items"]);
  if (items.length === 0) return null;
  return (
    <SectionShell tone="muted" eyebrow={section.subtitle} title={section.title} description={section.content} center>
      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <div key={i} className="surface-card p-6 text-center">
            <dd className="font-heading text-3xl text-primary">{item.value}</dd>
            <dt className="mt-2 text-sm text-muted-foreground">{item.label}</dt>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}

function ContactSection({ section }: { section: PageSection }) {
  const { data: settings } = useQuery(settingsQuery);
  const contact = settings?.["contact"];
  const rows = [
    { icon: "Phone", label: "الهاتف", value: str(contact, "phone") },
    { icon: "Mail", label: "البريد الإلكتروني", value: str(contact, "email") },
    { icon: "MapPin", label: "الموقع", value: str(contact, "address") },
    { icon: "Clock", label: "أوقات العمل", value: str(contact, "working_hours") },
  ].filter((r) => r.value);
  return (
    <SectionShell eyebrow={section.subtitle} title={section.title} description={section.content}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((row) => (
          <div key={row.label} className="surface-card p-5">
            <Icon name={row.icon} className="size-5 text-accent" />
            <p className="mt-3 text-xs text-muted-foreground">{row.label}</p>
            <p className="mt-1 text-sm font-medium">{row.value}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export const SECTION_TYPES: { value: string; label: string }[] = [
  { value: "hero", label: "واجهة رئيسية (Hero)" },
  { value: "about", label: "نبذة عنا" },
  { value: "services", label: "شبكة الخدمات" },
  { value: "features", label: "مميزات / لماذا نحن" },
  { value: "sectors", label: "القطاعات" },
  { value: "timeline", label: "منهجية العمل (Timeline)" },
  { value: "stats", label: "إحصائيات" },
  { value: "projects", label: "المشاريع" },
  { value: "testimonials", label: "آراء العملاء" },
  { value: "blog", label: "المقالات" },
  { value: "faq", label: "الأسئلة الشائعة" },
  { value: "text", label: "نص" },
  { value: "image_text", label: "صورة + نص" },
  { value: "contact", label: "معلومات التواصل" },
  { value: "cta", label: "دعوة لاتخاذ إجراء (CTA)" },
];

export function SectionRenderer({ section }: { section: PageSection }) {
  switch (section.section_type) {
    case "hero":
      return <HeroSection section={section} />;
    case "about":
      return <AboutSection section={section} />;
    case "services":
      return <ServicesSection section={section} />;
    case "features":
      return <FeaturesSection section={section} />;
    case "sectors":
      return <SectorsSection section={section} />;
    case "timeline":
      return <TimelineSection section={section} />;
    case "faq":
      return <FaqSection section={section} />;
    case "testimonials":
      return <TestimonialsSection section={section} />;
    case "projects":
      return <ProjectsSection section={section} />;
    case "blog":
      return <BlogSection section={section} />;
    case "stats":
      return <StatsSection section={section} />;
    case "image_text":
      return <ImageTextSection section={section} />;
    case "contact":
      return <ContactSection section={section} />;
    case "cta":
      return <CtaSection section={section} />;
    default:
      return <TextSection section={section} />;
  }
}
