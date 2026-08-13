import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="gradient-hero border-b border-border/40 text-primary-foreground">
      <div className="container-page py-16 md:py-20">
        {eyebrow ? <span className="eyebrow text-accent">{eyebrow}</span> : null}
        <h1 className="mt-3 max-w-3xl font-heading text-3xl leading-tight text-balance-ar md:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-8 text-primary-foreground/80">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
