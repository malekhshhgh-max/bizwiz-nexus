import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { allSettingsQuery, saveSettings } from "@/lib/cms/admin";
import { FieldRenderer } from "@/components/admin/FieldRenderer";
import type { FieldConfig } from "@/lib/cms/resources";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SettingsForm({
  settingKey,
  title,
  description,
  fields,
}: {
  settingKey: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
}) {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery(allSettingsQuery);
  const [values, setValues] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (settings) setValues({ ...(settings[settingKey] ?? {}) });
  }, [settings, settingKey]);

  const save = useMutation({
    mutationFn: async () => saveSettings(settingKey, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success("تم حفظ الإعدادات");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card className="space-y-4 p-5">
      <div>
        <h2 className="font-heading text-base">{title}</h2>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <FieldRenderer
            key={field.name}
            field={field}
            value={values[field.name] ?? (field.type === "boolean" ? false : "")}
            onChange={(v) => setValues((prev) => ({ ...prev, [field.name]: v }))}
          />
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "جارٍ الحفظ…" : "حفظ"}
        </Button>
      </div>
    </Card>
  );
}
