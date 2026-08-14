import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { logActivity, mediaQuery } from "@/lib/cms/admin";
import { uploadMedia } from "@/components/admin/MediaPicker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/Icon";

export const Route = createFileRoute("/admin/media")({
  component: MediaPage,
});

function MediaPage() {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery(mediaQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useMutation({
    mutationFn: async (files: FileList) => {
      for (const file of Array.from(files)) await uploadMedia(file);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "media_library"] });
      toast.success("تم رفع الملفات");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (item: { id: string; storage_path: string; file_name: string }) => {
      await supabase.storage.from("media").remove([item.storage_path]);
      const { error } = await supabase.from("media_library").delete().eq("id", item.id);
      if (error) throw new Error(error.message);
      await logActivity({ action: "delete", entityType: "media_library", entityId: item.id, entityLabel: item.file_name });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "media_library"] });
      toast.success("تم الحذف");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell
      title="مكتبة الوسائط"
      description="إدارة الصور والملفات المستخدمة في الموقع"
      breadcrumbs={[{ label: "لوحة التحكم", to: "/admin" }, { label: "مكتبة الوسائط" }]}
      actions={
        <>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.target.files?.length) upload.mutate(e.target.files);
              e.target.value = "";
            }}
          />
          <Button onClick={() => inputRef.current?.click()} disabled={upload.isPending}>
            <Icon name="Upload" className="ms-1 size-4" />
            {upload.isPending ? "جارٍ الرفع…" : "رفع ملفات"}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-4/3 bg-muted">
              <img src={item.public_url} alt={item.alt_text ?? item.file_name} className="size-full object-cover" />
            </div>
            <div className="space-y-2 p-3">
              <p className="truncate text-xs font-medium">{item.file_name}</p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-[11px]"
                  onClick={() => {
                    void navigator.clipboard.writeText(item.public_url);
                    toast.success("تم نسخ الرابط");
                  }}
                >
                  نسخ الرابط
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => remove.mutate({ id: item.id, storage_path: item.storage_path, file_name: item.file_name })}
                >
                  <Icon name="Trash2" className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {items.length === 0 ? (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">لم تُرفع أي ملفات بعد.</p>
        ) : null}
      </div>
    </AdminShell>
  );
}
