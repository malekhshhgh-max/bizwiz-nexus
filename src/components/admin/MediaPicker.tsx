import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logActivity, mediaQuery, signedMediaUrl } from "@/lib/cms/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@/components/shared/Icon";
import { cn } from "@/lib/utils";

export async function uploadMedia(file: File, folder = "general") {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "3600" });
  if (error) throw new Error(error.message);
  const url = await signedMediaUrl(path);
  const { data: auth } = await supabase.auth.getUser();
  const { data, error: insertError } = await supabase
    .from("media_library")
    .insert({
      file_name: file.name,
      storage_path: path,
      public_url: url,
      mime_type: file.type,
      size_bytes: file.size,
      folder,
      uploaded_by: auth.user?.id ?? null,
    })
    .select()
    .single();
  if (insertError) throw new Error(insertError.message);
  await logActivity({ action: "upload", entityType: "media_library", entityId: data.id, entityLabel: file.name });
  return data;
}

export function MediaPicker({
  value,
  onChange,
  label = "اختر صورة",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const { data: items = [] } = useQuery({ ...mediaQuery, enabled: open });
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useMutation({
    mutationFn: (file: File) => uploadMedia(file),
    onSuccess: async (row) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "media_library"] });
      onChange(row.public_url);
      toast.success("تم رفع الملف");
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="رابط الصورة أو اخترها من المكتبة" />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              <Icon name="Images" className="ms-1 size-4" />
              المكتبة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{label}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) upload.mutate(file);
                  e.target.value = "";
                }}
              />
              <Button type="button" onClick={() => inputRef.current?.click()} disabled={upload.isPending}>
                <Icon name="Upload" className="ms-1 size-4" />
                {upload.isPending ? "جارٍ الرفع…" : "رفع ملف جديد"}
              </Button>
            </div>
            <div className="grid max-h-[55vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.public_url);
                    setOpen(false);
                  }}
                  className={cn(
                    "overflow-hidden rounded-lg border border-border text-right transition hover:border-primary",
                    value === item.public_url && "ring-2 ring-primary",
                  )}
                >
                  <span className="block aspect-4/3 bg-muted">
                    <img src={item.public_url} alt={item.alt_text ?? item.file_name} className="size-full object-cover" />
                  </span>
                  <span className="block truncate p-2 text-[11px]">{item.file_name}</span>
                </button>
              ))}
              {items.length === 0 ? (
                <p className="col-span-full py-8 text-center text-sm text-muted-foreground">لا توجد ملفات بعد.</p>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {value ? (
        <div className="h-24 w-36 overflow-hidden rounded-lg border border-border bg-muted">
          <img src={value} alt="" className="size-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}
