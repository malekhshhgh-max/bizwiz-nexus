import { AppLink } from "@/components/shared/AppLink";
import { Icon } from "@/components/shared/Icon";
import { ArrowLeft } from "lucide-react";
import type { Service } from "@/lib/cms/api";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <AppLink
      to={`/services/${service.slug}`}
      className="group surface-card flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon name={service.icon} className="size-5" />
      </span>
      <h3 className="font-heading text-lg leading-snug">{service.title}</h3>
      {service.short_description ? (
        <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{service.short_description}</p>
      ) : null}
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        تفاصيل الخدمة
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
      </span>
    </AppLink>
  );
}
