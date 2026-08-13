import { AppLink } from "@/components/shared/AppLink";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { navigationQuery, settingsQuery, str, bool } from "@/lib/cms/api";
import { Icon } from "@/components/shared/Icon";

const SOCIALS: { key: string; icon: string; label: string }[] = [
  { key: "twitter", icon: "Twitter", label: "إكس" },
  { key: "linkedin", icon: "Linkedin", label: "لينكدإن" },
  { key: "instagram", icon: "Instagram", label: "إنستغرام" },
  { key: "youtube", icon: "Youtube", label: "يوتيوب" },
];

export function SiteFooter() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: nav } = useQuery(navigationQuery);
  const brand = settings?.["brand"];
  const footer = settings?.["footer"];
  const contact = settings?.["contact"];
  const social = settings?.["social"];
  const items = (nav ?? []).filter((i) => i.location === "footer");
  const siteName = str(brand, "site_name", "المستشار العزي للمشروع");

  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <h2 className="font-heading text-lg font-bold">{siteName}</h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-primary-foreground/75">{str(footer, "description")}</p>
          {bool(footer, "show_social", true) ? (
            <div className="mt-5 flex gap-2">
              {SOCIALS.filter((s) => str(social, s.key)).map((s) => (
                <a
                  key={s.key}
                  href={str(social, s.key)}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                >
                  <Icon name={s.icon} className="size-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-accent">روابط سريعة</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {items.map((item) => (
              <li key={item.id}>
                <AppLink to={item.url} className="text-primary-foreground/75 transition-colors hover:text-primary-foreground">
                  {item.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-accent">معلومات التواصل</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
            {str(contact, "phone") ? (
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <a href={`tel:${str(contact, "phone")}`} dir="ltr">{str(contact, "phone")}</a>
              </li>
            ) : null}
            {str(contact, "email") ? (
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <a href={`mailto:${str(contact, "email")}`} dir="ltr">{str(contact, "email")}</a>
              </li>
            ) : null}
            {str(contact, "address") ? (
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                <span>{str(contact, "address")}</span>
              </li>
            ) : null}
            {str(contact, "working_hours") ? (
              <li className="flex items-center gap-2">
                <Clock className="size-4 shrink-0" />
                <span>{str(contact, "working_hours")}</span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-foreground/60 sm:flex-row">
          <span>© {new Date().getFullYear()} {siteName} — {str(footer, "copyright", "جميع الحقوق محفوظة")}</span>
          <AppLink to="/admin" className="transition-colors hover:text-primary-foreground">لوحة التحكم</AppLink>
        </div>
      </div>
    </footer>
  );
}
