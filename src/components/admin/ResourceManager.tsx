import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adminRowsQuery, logActivity } from "@/lib/cms/admin";
import type { FieldConfig, ResourceConfig } from "@/lib/cms/resources";
import { FieldRenderer, slugify } from "@/components/admin/FieldRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/shared/Icon";
import { AppLink } from "@/components/shared/AppLink";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Row = Record<string, unknown>;

const JSON_FIELDS = new Set(["json"]);

function initialValues(config: ResourceConfig, row?: Row): Row {
  const values: Row = {};
  for (const field of config.fields) {
    const existing = row?.[field.name];
    if (existing !== undefined && existing !== null) {
      values[field.name] = JSON_FIELDS.has(field.type) ? JSON.stringify(existing, null, 2) : existing;
    } else if (row) {
      values[field.name] = field.type === "boolean" ? false : null;
    } else {
      values[field.name] = JSON_FIELDS.has(field.type)
        ? JSON.stringify(field.defaultValue ?? [], null, 2)
        : (field.defaultValue ?? (field.type === "boolean" ? false : ""));
    }
  }
  return values;
}

function preparePayload(config: ResourceConfig, values: Row): Row {
  const payload: Row = {};
  for (const field of config.fields) {
    const value = values[field.name];
    if (JSON_FIELDS.has(field.type)) {
      try {
        payload[field.name] = value ? JSON.parse(String(value)) : [];
      } catch {
        throw new Error(`صيغة JSON غير صحيحة في حقل «${field.label}»`);
      }
    } else if (value === "" && field.type !== "text" && field.type !== "textarea" && field.type !== "richtext") {
      payload[field.name] = null;
    } else if (value === "") {
      payload[field.name] = null;
    } else {
      payload[field.name] = value;
    }
  }
  return payload;
}

function labelOf(config: ResourceConfig, row: Row) {
  return String(row["title"] ?? row["name"] ?? row["label"] ?? row["question"] ?? row["author_name"] ?? config.singular);
}

export function ResourceManager({ resourceKey, config }: { resourceKey: string; config: ResourceConfig }) {
  const queryClient = useQueryClient();
  const { data: rows = [], isLoading } = useQuery(adminRowsQuery(config.table, config.orderBy));
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [values, setValues] = useState<Row>({});
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim() || !config.searchColumn) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((row) => String(row[config.searchColumn as string] ?? "").toLowerCase().includes(q));
  }, [rows, search, config.searchColumn]);

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", config.table] });
    await queryClient.invalidateQueries();
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = preparePayload(config, values);
      if (editing) {
        const { error } = await supabase.from(config.table).update(payload as never).eq("id", String(editing["id"]));
        if (error) throw new Error(error.message);
        await logActivity({
          action: "update",
          entityType: config.table,
          entityId: String(editing["id"]),
          entityLabel: labelOf(config, payload),
        });
      } else {
        const { data, error } = await supabase.from(config.table).insert(payload as never).select("id").single();
        if (error) throw new Error(error.message);
        await logActivity({
          action: "create",
          entityType: config.table,
          entityId: data?.id as string,
          entityLabel: labelOf(config, payload),
        });
      }
    },
    onSuccess: async () => {
      await invalidate();
      toast.success("تم الحفظ بنجاح");
      setEditing(null);
      setCreating(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (row: Row) => {
      const { error } = await supabase.from(config.table).delete().eq("id", String(row["id"]));
      if (error) throw new Error(error.message);
      await logActivity({
        action: "delete",
        entityType: config.table,
        entityId: String(row["id"]),
        entityLabel: labelOf(config, row),
      });
    },
    onSuccess: async () => {
      await invalidate();
      toast.success("تم الحذف");
      setDeleteTarget(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => {
    setValues(initialValues(config));
    setEditing(null);
    setCreating(true);
  };
  const openEdit = (row: Row) => {
    setValues(initialValues(config, row));
    setEditing(row);
    setCreating(true);
  };

  const setValue = (field: FieldConfig, value: unknown) => {
    setValues((prev) => {
      const next = { ...prev, [field.name]: value };
      const slugField = config.fields.find((f) => f.type === "slug");
      if (!editing && slugField && (field.name === "title" || field.name === "name") && typeof value === "string") {
        if (!prev[slugField.name]) next[slugField.name] = slugify(value);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {config.searchColumn ? (
            <div className="relative">
              <Icon name="Search" className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث…"
                className="w-56 pe-9"
              />
            </div>
          ) : null}
          <Badge variant="secondary">{filtered.length} عنصر</Badge>
        </div>
        <Button onClick={openCreate}>
          <Icon name="Plus" className="ms-1 size-4" />
          إضافة {config.singular}
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((col) => (
                <TableHead key={col.name} className="text-right">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-32 text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={config.columns.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                  جارٍ التحميل…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={config.columns.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                  لا توجد بيانات بعد.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={String(row["id"])}>
                  {config.columns.map((col) => {
                    const value = row[col.name];
                    return (
                      <TableCell key={col.name} className="max-w-[280px] truncate text-sm">
                        {col.type === "boolean" ? (
                          <Badge variant={value ? "default" : "secondary"}>{value ? "نعم" : "لا"}</Badge>
                        ) : col.type === "badge" ? (
                          <Badge variant="outline">{String(value ?? "-")}</Badge>
                        ) : col.type === "date" ? (
                          value ? new Date(String(value)).toLocaleDateString("ar") : "-"
                        ) : (
                          String(value ?? "-")
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {config.table === "pages" ? (
                        <Button asChild variant="ghost" size="icon" title="بناء الصفحة">
                          <AppLink to={`/admin/pages/${String(row["id"])}`}>
                            <Icon name="LayoutTemplate" className="size-4" />
                          </AppLink>
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="icon" onClick={() => openEdit(row)} title="تعديل">
                        <Icon name="Pencil" className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setDeleteTarget(row)}
                        title="حذف"
                      >
                        <Icon name="Trash2" className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={creating} onOpenChange={(o) => (o ? null : setCreating(false))}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `تعديل ${config.singular}` : `إضافة ${config.singular}`}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            {config.fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={(v) => setValue(field, v)}
              />
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>
              إلغاء
            </Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? "جارٍ الحفظ…" : "حفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(o) => (o ? null : setDeleteTarget(null))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف «{deleteTarget ? labelOf(config, deleteTarget) : ""}» نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && remove.mutate(deleteTarget)}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <p className="text-[11px] text-muted-foreground">المورد: {resourceKey}</p>
    </div>
  );
}
