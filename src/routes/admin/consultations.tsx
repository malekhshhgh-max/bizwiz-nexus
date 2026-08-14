import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { consultationsQuery, logActivity } from "@/lib/cms/admin";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/cms/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/shared/Icon";

export const Route = createFileRoute("/admin/consultations")({
  component: ConsultationsPage,
});

function ConsultationsPage() {
  const queryClient = useQueryClient();
  const { data: rows = [], isLoading } = useQuery(consultationsQuery);
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<(typeof rows)[number] | null>(null);
  const [notes, setNotes] = useState("");

  const update = useMutation({
    mutationFn: async ({ id, patch, label }: { id: string; patch: Record<string, unknown>; label: string }) => {
      const { error } = await supabase.from("consultation_requests").update(patch as never).eq("id", id);
      if (error) throw new Error(error.message);
      await logActivity({ action: "update", entityType: "consultation_requests", entityId: id, entityLabel: label, details: patch });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "consultation_requests"] });
      toast.success("تم التحديث");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <AdminShell
      title="طلبات الاستشارة"
      description="متابعة الطلبات الواردة وتحديث حالتها"
      breadcrumbs={[{ label: "لوحة التحكم", to: "/admin" }, { label: "طلبات الاستشارة" }]}
      actions={
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">مقدم الطلب</TableHead>
              <TableHead className="text-right">الجهة</TableHead>
              <TableHead className="text-right">الخدمة</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">تفاصيل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">جارٍ التحميل…</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">لا توجد طلبات.</TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{row.full_name}</p>
                    <p dir="ltr" className="text-right text-xs text-muted-foreground">{row.phone}</p>
                  </TableCell>
                  <TableCell className="text-sm">{row.organization ?? "-"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">{row.requested_service ?? "-"}</TableCell>
                  <TableCell>
                    <Select
                      value={row.status}
                      onValueChange={(value) => update.mutate({ id: row.id, patch: { status: value }, label: row.full_name })}
                    >
                      <SelectTrigger className="h-8 w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LEAD_STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(row.created_at).toLocaleDateString("ar")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setActive(row);
                        setNotes(row.notes ?? "");
                      }}
                    >
                      <Icon name="Eye" className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={Boolean(active)} onOpenChange={(o) => (o ? null : setActive(null))}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          {active ? (
            <div className="space-y-3 text-sm">
              <Row label="الاسم" value={active.full_name} />
              <Row label="الجوال" value={active.phone} />
              <Row label="البريد" value={active.email ?? "-"} />
              <Row label="الجهة" value={active.organization ?? "-"} />
              <Row label="نوع الجهة" value={active.organization_type ?? "-"} />
              <Row label="الخدمة" value={active.requested_service ?? "-"} />
              <div>
                <p className="text-xs text-muted-foreground">الرسالة</p>
                <p className="mt-1 whitespace-pre-line rounded-lg bg-muted p-3">{active.message ?? "-"}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">ملاحظات داخلية</p>
                <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{LEAD_STATUS_LABELS[active.status] ?? active.status}</Badge>
                <Button
                  size="sm"
                  onClick={() =>
                    update.mutate(
                      { id: active.id, patch: { notes }, label: active.full_name },
                      { onSuccess: () => setActive(null) },
                    )
                  }
                >
                  حفظ الملاحظات
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}
