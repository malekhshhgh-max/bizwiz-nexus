import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AdminShell
      title="الإعدادات العامة و SEO"
      description="بيانات التواصل، الروابط الاجتماعية، وإعدادات محركات البحث"
      breadcrumbs={[{ label: "لوحة التحكم", to: "/admin" }, { label: "الإعدادات" }]}
    >
      <Tabs defaultValue="contact" dir="rtl">
        <TabsList>
          <TabsTrigger value="contact">التواصل</TabsTrigger>
          <TabsTrigger value="social">التواصل الاجتماعي</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>
        <TabsContent value="contact" className="mt-4">
          <SettingsForm
            settingKey="contact"
            title="بيانات التواصل"
            fields={[
              { name: "phone", label: "رقم الهاتف", type: "text" },
              { name: "whatsapp", label: "رقم واتساب", type: "text" },
              { name: "email", label: "البريد الإلكتروني", type: "text" },
              { name: "address", label: "العنوان", type: "text" },
              { name: "working_hours", label: "أوقات العمل", type: "text" },
              { name: "whatsapp_float_enabled", label: "إظهار زر واتساب العائم", type: "boolean" },
              { name: "whatsapp_message", label: "رسالة واتساب الافتراضية", type: "textarea", full: true },
            ]}
          />
        </TabsContent>
        <TabsContent value="social" className="mt-4">
          <SettingsForm
            settingKey="social"
            title="روابط التواصل الاجتماعي"
            fields={[
              { name: "twitter", label: "X (تويتر)", type: "text" },
              { name: "linkedin", label: "لينكدإن", type: "text" },
              { name: "instagram", label: "إنستقرام", type: "text" },
              { name: "youtube", label: "يوتيوب", type: "text" },
              { name: "snapchat", label: "سناب شات", type: "text" },
              { name: "tiktok", label: "تيك توك", type: "text" },
            ]}
          />
        </TabsContent>
        <TabsContent value="seo" className="mt-4">
          <SettingsForm
            settingKey="seo"
            title="إعدادات SEO العامة"
            fields={[
              { name: "default_title", label: "العنوان الافتراضي", type: "text", full: true },
              { name: "default_description", label: "الوصف الافتراضي", type: "textarea", full: true },
              { name: "keywords", label: "الكلمات المفتاحية", type: "text", full: true },
              { name: "og_image", label: "صورة المشاركة الافتراضية", type: "image", full: true },
              { name: "canonical_domain", label: "النطاق الأساسي", type: "text" },
            ]}
          />
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <SettingsForm
            settingKey="analytics"
            title="أدوات القياس"
            fields={[
              { name: "ga_id", label: "Google Analytics ID", type: "text" },
              { name: "gtm_id", label: "Google Tag Manager ID", type: "text" },
              { name: "tiktok_pixel", label: "TikTok Pixel", type: "text" },
              { name: "meta_pixel", label: "Meta Pixel", type: "text" },
            ]}
          />
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
}
