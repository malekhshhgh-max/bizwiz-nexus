import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { servicesQuery, settingsQuery, str } from "@/lib/cms/api";
import { ORGANIZATION_TYPES, whatsappLink } from "@/lib/cms/utils";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/shared/Icon";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "اطلب استشارة | المستشار العزي للمشروع" },
      {
        name: "description",
        content: "املأ نموذج طلب الاستشارة وسيتواصل معك فريق المستشار العزي لتحديد احتياج جهتك ونطاق العمل المناسب.",
      },
      { property: "og:title", content: "اطلب استشارة | المستشار العزي" },
      { property: "og:description", content: "احجز استشارتك الأولية مع فريق المستشار العزي للمشروع." },
    ],
  }),
  component: ConsultationPage,
});

const schema = z.object({
  full_name: z.string().trim().min(3, "الاسم مطلوب (3 أحرف على الأقل)").max(120, "الاسم طويل جداً"),
  phone: z
    .string()
    .trim()
    .min(9, "رقم الجوال غير صحيح")
    .max(20, "رقم الجوال طويل جداً")
    .regex(/^[0-9+\-\s()]+$/, "رقم الجوال غير صحيح"),
  email: z.union([z.string().trim().email("البريد الإلكتروني غير صحيح").max(255), z.literal("")]),
  organization: z.string().trim().max(160, "اسم الجهة طويل جداً"),
  organization_type: z.string().trim().max(80),
  requested_service: z.string().trim().max(160),
  message: z.string().trim().max(2000, "الرسالة طويلة جداً"),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  full_name: "",
  phone: "",
  email: "",
  organization: "",
  organization_type: "",
  requested_service: "",
  message: "",
};

function ConsultationPage() {
  const { data: services } = useQuery(servicesQuery);
  const { data: settings } = useQuery(settingsQuery);
  const contact = settings?.["contact"];
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: async (input: FormValues) => {
      const { error } = await supabase.from("consultation_requests").insert({
        full_name: input.full_name,
        phone: input.phone,
        email: input.email || null,
        organization: input.organization || null,
        organization_type: input.organization_type || null,
        requested_service: input.requested_service || null,
        message: input.message || null,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setDone(true);
      setValues(EMPTY);
      toast.success("تم استلام طلبك بنجاح، سنتواصل معك قريباً.");
    },
    onError: () => toast.error("تعذّر إرسال الطلب، يرجى المحاولة مرة أخرى."),
  });

  const set = (key: keyof FormValues) => (value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

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
      toast.error("يرجى تصحيح الحقول المطلوبة.");
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  };

  const whatsapp = str(contact, "whatsapp");

  return (
    <SiteLayout>
      <PageHero
        eyebrow="ابدأ الآن"
        title="اطلب استشارتك الأولى"
        description="شاركنا احتياج جهتك وسيتواصل معك أحد المستشارين لتحديد نطاق العمل والخطوات القادمة."
      />

      <section className="py-14 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="surface-card p-6 md:p-8">
            {done ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto size-12 text-accent" />
                <h2 className="mt-4 font-heading text-xl">تم استلام طلبك</h2>
                <p className="mt-2 text-sm leading-8 text-muted-foreground">
                  شكراً لثقتك، سيتواصل معك فريقنا خلال يوم عمل واحد.
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setDone(false)}>
                  إرسال طلب آخر
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" noValidate>
                <Field label="الاسم الكامل *" error={errors.full_name}>
                  <Input value={values.full_name} onChange={(e) => set("full_name")(e.target.value)} maxLength={120} />
                </Field>
                <Field label="رقم الجوال *" error={errors.phone}>
                  <Input
                    value={values.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    inputMode="tel"
                    dir="ltr"
                    className="text-right"
                    maxLength={20}
                  />
                </Field>
                <Field label="البريد الإلكتروني" error={errors.email}>
                  <Input
                    value={values.email}
                    onChange={(e) => set("email")(e.target.value)}
                    type="email"
                    dir="ltr"
                    className="text-right"
                    maxLength={255}
                  />
                </Field>
                <Field label="اسم الجهة" error={errors.organization}>
                  <Input value={values.organization} onChange={(e) => set("organization")(e.target.value)} maxLength={160} />
                </Field>
                <Field label="نوع الجهة" error={errors.organization_type}>
                  <select
                    value={values.organization_type}
                    onChange={(e) => set("organization_type")(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <option value="">اختر نوع الجهة</option>
                    {ORGANIZATION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="الخدمة المطلوبة" error={errors.requested_service}>
                  <select
                    value={values.requested_service}
                    onChange={(e) => set("requested_service")(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <option value="">اختر الخدمة</option>
                    {(services ?? []).map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="تفاصيل إضافية" error={errors.message}>
                    <Textarea
                      value={values.message}
                      onChange={(e) => set("message")(e.target.value)}
                      rows={5}
                      maxLength={2000}
                      placeholder="اكتب نبذة مختصرة عن احتياج جهتك..."
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" disabled={mutation.isPending} className="w-full sm:w-auto">
                    {mutation.isPending ? "جارٍ الإرسال..." : "إرسال الطلب"}
                  </Button>
                </div>
              </form>
            )}
          </div>

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
                <a href={whatsappLink(whatsapp, "السلام عليكم، أرغب بطلب استشارة")} target="_blank" rel="noreferrer">
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-2 block text-sm">{label}</Label>
      {children}
      {error ? <p className="mt-1.5 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
