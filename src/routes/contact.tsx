import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery, str } from "@/lib/cms/api";
import { whatsappLink } from "@/lib/cms/utils";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/shared/Icon";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | المستشار العزي للمشروع" },
      {
        name: "description",
        content: "تواصل مع فريق المستشار العزي للمشروع عبر النموذج أو الهاتف أو واتساب للاستفسار عن الخدمات الاستشارية.",
      },
      { property: "og:title", content: "تواصل معنا | المستشار العزي" },
      { property: "og:description", content: "قنوات التواصل مع المستشار العزي للمشروع." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  full_name: z.string().trim().min(3, "الاسم مطلوب").max(120),
  email: z.union([z.string().trim().email("البريد الإلكتروني غير صحيح").max(255), z.literal("")]),
  phone: z.union([z.string().trim().min(9, "رقم الجوال غير صحيح").max(20), z.literal("")]),
  subject: z.string().trim().max(160),
  message: z.string().trim().min(10, "الرسالة قصيرة جداً").max(2000, "الرسالة طويلة جداً"),
});

type FormValues = z.infer<typeof schema>;
const EMPTY: FormValues = { full_name: "", email: "", phone: "", subject: "", message: "" };

function ContactPage() {
  const { data: settings } = useQuery(settingsQuery);
  const contact = settings?.["contact"];
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const mutation = useMutation({
    mutationFn: async (input: FormValues) => {
      const { error } = await supabase.from("contact_messages").insert({
        full_name: input.full_name,
        email: input.email || null,
        phone: input.phone || null,
        subject: input.subject || null,
        message: input.message,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setValues(EMPTY);
      toast.success("تم إرسال رسالتك بنجاح.");
    },
    onError: () => toast.error("تعذّر إرسال الرسالة، حاول مرة أخرى."),
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  };

  const whatsapp = str(contact, "whatsapp");

  return (
    <SiteLayout>
      <PageHero eyebrow="تواصل معنا" title="نحن هنا للإجابة على استفساراتك" description="اترك رسالتك وسنعود إليك في أقرب وقت." />
      <section className="py-14 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <form onSubmit={onSubmit} noValidate className="surface-card grid gap-5 p-6 sm:grid-cols-2 md:p-8">
            <div>
              <Label className="mb-2 block text-sm">الاسم الكامل *</Label>
              <Input value={values.full_name} maxLength={120} onChange={(e) => setValues((v) => ({ ...v, full_name: e.target.value }))} />
              {errors.full_name ? <p className="mt-1.5 text-xs text-destructive">{errors.full_name}</p> : null}
            </div>
            <div>
              <Label className="mb-2 block text-sm">رقم الجوال</Label>
              <Input
                value={values.phone}
                dir="ltr"
                className="text-right"
                maxLength={20}
                onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
              />
              {errors.phone ? <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p> : null}
            </div>
            <div>
              <Label className="mb-2 block text-sm">البريد الإلكتروني</Label>
              <Input
                value={values.email}
                type="email"
                dir="ltr"
                className="text-right"
                maxLength={255}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              />
              {errors.email ? <p className="mt-1.5 text-xs text-destructive">{errors.email}</p> : null}
            </div>
            <div>
              <Label className="mb-2 block text-sm">الموضوع</Label>
              <Input value={values.subject} maxLength={160} onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-2 block text-sm">الرسالة *</Label>
              <Textarea
                rows={6}
                value={values.message}
                maxLength={2000}
                onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
              />
              {errors.message ? <p className="mt-1.5 text-xs text-destructive">{errors.message}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" disabled={mutation.isPending}>
                {mutation.isPending ? "جارٍ الإرسال..." : "إرسال الرسالة"}
              </Button>
            </div>
          </form>

          <aside className="space-y-4">
            {[
              { icon: "Phone", label: "الهاتف", value: str(contact, "phone") },
              { icon: "Mail", label: "البريد الإلكتروني", value: str(contact, "email") },
              { icon: "MapPin", label: "الموقع", value: str(contact, "address") },
              { icon: "Clock", label: "أوقات العمل", value: str(contact, "working_hours") },
            ]
              .filter((row) => row.value)
              .map((row) => (
                <div key={row.label} className="surface-card flex items-start gap-3 p-5">
                  <Icon name={row.icon} className="mt-0.5 size-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">{row.label}</p>
                    <p className="mt-1 text-sm font-medium">{row.value}</p>
                  </div>
                </div>
              ))}
            {whatsapp ? (
              <Button asChild variant="outline" className="w-full">
                <a href={whatsappLink(whatsapp)} target="_blank" rel="noreferrer">
                  تواصل عبر واتساب
                </a>
              </Button>
            ) : null}
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
