import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FieldConfig } from "@/lib/cms/resources";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { cn } from "@/lib/utils";

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function useRelationOptions(from: FieldConfig["optionsFrom"]) {
  return useQuery({
    queryKey: ["admin", "options", from],
    enabled: Boolean(from),
    queryFn: async () => {
      const { data, error } = await supabase.from(from as "service_categories").select("id, name").order("name");
      if (error) throw new Error(error.message);
      return (data ?? []) as { id: string; name: string }[];
    },
  });
}

export function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const { data: relationOptions = [] } = useRelationOptions(field.optionsFrom);
  const id = `field-${field.name}`;
  const text = typeof value === "string" ? value : value == null ? "" : String(value);

  const control = (() => {
    switch (field.type) {
      case "boolean":
        return (
          <div className="flex h-9 items-center gap-3">
            <Switch id={id} checked={value === true} onCheckedChange={(checked) => onChange(checked)} />
            <span className="text-xs text-muted-foreground">{value === true ? "مفعّل" : "غير مفعّل"}</span>
          </div>
        );
      case "number":
        return (
          <Input
            id={id}
            type="number"
            value={value === null || value === undefined ? "" : Number(value)}
            onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          />
        );
      case "date":
        return (
          <Input
            id={id}
            type="date"
            value={text ? text.slice(0, 10) : ""}
            onChange={(e) => onChange(e.target.value ? e.target.value : null)}
          />
        );
      case "textarea":
        return <Textarea id={id} rows={3} value={text} onChange={(e) => onChange(e.target.value)} />;
      case "richtext":
        return <Textarea id={id} rows={10} value={text} onChange={(e) => onChange(e.target.value)} className="font-mono text-xs leading-6" />;
      case "json":
        return (
          <Textarea
            id={id}
            rows={6}
            dir="ltr"
            className="font-mono text-xs"
            value={typeof value === "string" ? value : JSON.stringify(value ?? [], null, 2)}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "image":
        return <MediaPicker value={text} onChange={(url) => onChange(url)} />;
      case "select": {
        const options = field.optionsFrom
          ? relationOptions.map((o) => ({ value: o.id, label: o.name }))
          : (field.options ?? []);
        return (
          <Select value={text || "__none"} onValueChange={(v) => onChange(v === "__none" ? null : v)}>
            <SelectTrigger id={id}>
              <SelectValue placeholder="اختر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">بدون</SelectItem>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      case "icon":
        return (
          <Input id={id} dir="ltr" value={text} onChange={(e) => onChange(e.target.value)} placeholder="Sparkles" />
        );
      case "slug":
        return <Input id={id} dir="ltr" value={text} onChange={(e) => onChange(slugify(e.target.value))} />;
      default:
        return <Input id={id} value={text} onChange={(e) => onChange(e.target.value)} />;
    }
  })();

  return (
    <div className={cn("space-y-1.5", field.full && "md:col-span-2")}>
      <Label htmlFor={id} className="text-xs">
        {field.label}
        {field.required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {control}
      {field.help ? <p className="text-[11px] text-muted-foreground" dir="auto">{field.help}</p> : null}
    </div>
  );
}
