import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/appearance")({
  component: AppearancePage,
});

function AppearancePage() {
  return (
    <AdminShell
      title="المظهر والهوية"
      description="تخصيص الألوان والخطوط والهوية البصرية للموقع"
      breadcrumbs={[{ label: "لوحة التحكم", to: "/admin" }, { label: "المظهر" }]}
    >
      <Tabs defaultValue="brand" dir="rtl">
        <TabsList>
          <TabsTrigger value="brand">الهوية</TabsTrigger>
          <TabsTrigger value="theme">الألوان والخطوط</TabsTrigger>
          <TabsTrigger value="header">الهيدر</TabsTrigger>
          <TabsTrigger value="footer">الفوتر</TabsTrigger>
        </TabsList>
        <TabsContent value="brand" className="mt-4">
          <SettingsForm
            settingKey="brand"
            title="هوية الموقع"
            fields={[
              { name: "site_name", label: "اسم الموقع", type: "text" },
              { name: "logo_text", label: "نص الشعار", type: "text" },
              { name: "tagline", label: "الشعار النصي", type: "text", full: true },
              { name: "logo_url", label: "شعار الموقع", type: "image", full: true },
              { name: "favicon_url", label: "أيقونة المتصفح", type: "image", full: true },
            ]}
          />
        </TabsContent>
        <TabsContent value="theme" className="mt-4">
          <SettingsForm
            settingKey="theme"
            title="الألوان والخطوط"
            description="القيم بصيغة HSL مثل: 210 90% 30%"
            fields={[
              { name: "primary", label: "اللون الأساسي", type: "text" },
              { name: "accent", label: "اللون المميز", type: "text" },
              { name: "background", label: "لون الخلفية", type: "text" },
              { name: "foreground", label: "لون النص", type: "text" },
              { name: "radius", label: "استدارة الحواف (rem)", type: "text" },
              { name: "font_heading", label: "خط العناوين", type: "text" },
              { name: "font_body", label: "خط النصوص", type: "text" },
            ]}
          />
        </TabsContent>
        <TabsContent value="header" className="mt-4">
          <SettingsForm
            settingKey="header"
            title="إعدادات الهيدر"
            fields={[
              { name: "sticky", label: "هيدر ثابت عند التمرير", type: "boolean" },
              { name: "show_cta", label: "إظهار زر الإجراء", type: "boolean" },
              { name: "cta_label", label: "نص زر الإجراء", type: "text" },
              { name: "cta_url", label: "رابط زر الإجراء", type: "text" },
            ]}
          />
        </TabsContent>
        <TabsContent value="footer" className="mt-4">
          <SettingsForm
            settingKey="footer"
            title="إعدادات الفوتر"
            fields={[
              { name: "about", label: "نبذة الفوتر", type: "textarea", full: true },
              { name: "copyright", label: "نص حقوق النشر", type: "text", full: true },
            ]}
          />
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
}
