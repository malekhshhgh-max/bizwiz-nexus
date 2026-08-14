import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { allPagesQuery, logActivity, pageSectionsAdminQuery } from "@/lib/cms/admin";
import { SECTION_TYPES, SectionRenderer } from "@/components/site/SectionRenderer";
import { FieldRenderer } from "@/components/admin/FieldRenderer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/shared/Icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Database } from "@/integrations/supabase/types";

type Section = Database["public"]["Tables"]["page_sections"]["Row"];

export const Route = createFileRoute("/admin/pages/$id")({
  component: PageBuilder,
});

function PageBuilder() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: pages = [] } = useQuery(allPagesQuery);
  const { data: sections = [] } = useQuery(pageSectionsAdminQuery(id));
  const page = pages.find((p) => p.id === id);
  const [editing, setEditing] = useState<Section | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [preview, setPreview] = useState(false);

  const invalidate = () => queryClient.invalidateQueries();

  const addSection = useMutation({
    mutationFn: async (type: string) => {
      const { error } = await supabase.from("page_sections").insert({
        page_id: id,
        section_type: type,
        title: SECTION_TYPES.find((t) => t.value === type)?.label ?? type,
        settings: {},
        sort_order: sections.length,
      });
      if (error) throw new Error(error.message);
      await logActivity({ action: "create", entityType: "page_sections", entityLabel: type, details: { page_id: id } });
    },
    onSuccess: async () => {
      await invalidate();
      toast.success("تمت إضافة القسم");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const patchSection = useMutation({
    mutationFn: async ({ sectionId, patch }: { sectionId: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("page_sections").update(patch as never).eq("id", sectionId);
      if (error) throw new Error(error.message);
      await logActivity({ action: "update", entityType: "page_sections", entityId: sectionId, entityLabel: page?.title ?? "" });
    },
    onSuccess: async () => {
      await invalidate();
      setEditing(null);
      toast.success("تم الحفظ");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeSection = useMutation({
    mutationFn: async (sectionId: string) => {
      const { error } = await supabase.from("page_sections").delete().eq("id", sectionId);
      if (error) throw new Error(error.message);
      await logActivity({ action: "delete", entityType: "page_sections", entityId: sectionId });
    },
    onSuccess: async () => {
      await invalidate();
      toast.success("تم حذف القسم");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const move = async (index: number, direction: -1 | 1) => {
    const target = sections[index + direction];
    const current = sections[index];
    if (!target || !current) return;
    await supabase.from("page_sections").update({ sort_order: target.sort_order }).eq("id", current.id);
    await supabase.from("page_sections").update({ sort_order: current.sort_order }).eq("id", target.id);
    await invalidate();
  };

  const openEditor = (section: Section) => {
    setEditing(section);
    setDraft({
      title: section.title ?? "",
      subtitle: section.subtitle ?? "",
      content: section.content ?? "",
      settings: JSON.stringify(section.settings ?? {}, null, 2),
      is_visible: section.is_visible,
    });
  };

  return (
    <AdminShell
      title={`بناء الصفحة: ${page?.title ?? ""}`}
      description={`المسار: /${page?.slug ?? ""}`}
      breadcrumbs={[{ label: "لوحة التحكم", to: "/admin" }, { label: "الصفحات", to: "/admin/content/pages" }, { label: page?.title ?? "" }]}
      actions={
        <>
          <Select onValueChange={(type) => addSection.mutate(type)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="إضافة قسم…" />
            </SelectTrigger>
            <SelectContent>
              {SECTION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setPreview((p) => !p)}>
            <Icon name={preview ? "PenLine" : "Eye"} className="ms-1 size-4" />
            {preview ? "تحرير" : "معاينة"}
          </Button>
        </>
      }
    >
      {preview ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          {sections.filter((s) => s.is_visible).map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <Card key={section.id} className="flex flex-wrap items-center gap-3 p-4">
              <Icon name="GripVertical" className="size-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{section.title ?? section.section_type}</p>
                <p className="text-[11px] text-muted-foreground">
                  {SECTION_TYPES.find((t) => t.value === section.section_type)?.label ?? section.section_type}
                </p>
              </div>
              <Badge variant={section.is_visible ? "default" : "secondary"}>
                {section.is_visible ? "ظاهر" : "مخفي"}
              </Badge>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => void move(index, -1)} disabled={index === 0}>
                  <Icon name="ArrowUp" className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => void move(index, 1)}
                  disabled={index === sections.length - 1}
                >
                  <Icon name="ArrowDown" className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    patchSection.mutate({ sectionId: section.id, patch: { is_visible: !section.is_visible } })
                  }
                >
                  <Icon name={section.is_visible ? "EyeOff" : "Eye"} className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEditor(section)}>
                  <Icon name="Pencil" className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeSection.mutate(section.id)}
                >
                  <Icon name="Trash2" className="size-4" />
                </Button>
              </div>
            </Card>
          ))}
          {sections.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">لا توجد أقسام. ابدأ بإضافة قسم من الأعلى.</p>
          ) : null}
        </div>
      )}

      <Dialog open={Boolean(editing)} onOpenChange={(o) => (o ? null : setEditing(null))}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تحرير القسم</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: "title", label: "العنوان", type: "text" as const, full: true },
              { name: "subtitle", label: "العنوان الفرعي", type: "text" as const },
              { name: "is_visible", label: "ظاهر", type: "boolean" as const },
              { name: "content", label: "النص", type: "textarea" as const, full: true },
              {
                name: "settings",
                label: "إعدادات القسم (JSON)",
                type: "json" as const,
                full: true,
                help: "مثال: {\"items\": [{\"title\":\"\",\"description\":\"\"}]}",
              },
            ].map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                value={draft[field.name]}
                onChange={(v) => setDraft((prev) => ({ ...prev, [field.name]: v }))}
              />
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              إلغاء
            </Button>
            <Button
              onClick={() => {
                if (!editing) return;
                let settings: unknown;
                try {
                  settings = JSON.parse(String(draft["settings"] || "{}"));
                } catch {
                  toast.error("صيغة JSON غير صحيحة");
                  return;
                }
                patchSection.mutate({
                  sectionId: editing.id,
                  patch: {
                    title: draft["title"] || null,
                    subtitle: draft["subtitle"] || null,
                    content: draft["content"] || null,
                    is_visible: draft["is_visible"] === true,
                    settings,
                  },
                });
              }}
            >
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
