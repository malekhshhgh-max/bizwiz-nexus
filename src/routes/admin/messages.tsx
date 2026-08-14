import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { logActivity, messagesQuery } from "@/lib/cms/admin";
import { MESSAGE_STATUSES } from "@/lib/cms/utils";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const queryClient = useQueryClient();
  const { data: rows = [] } = useQuery(messagesQuery);

  const update = useMutation({
    mutationFn: async ({ id, status, label }: { id: string; status: string; label: string }) => {
      const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
      if (error) throw new Error(error.message);
      await logActivity({ action: "update", entityType: "contact_messages", entityId: id, entityLabel: label, details: { status } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "contact_messages"] });
      toast.success("تم التحديث");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell
      title="رسائل التواصل"
      description="الرسائل الواردة من نموذج التواصل"
      breadcrumbs={[{ label: "لوحة التحكم", to: "/admin" }, { label: "الرسائل" }]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((row) => (
          <Card key={row.id} className="space-y-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{row.full_name}</p>
                <p dir="ltr" className="text-right text-xs text-muted-foreground">
                  {row.email ?? row.phone ?? ""}
                </p>
              </div>
              <Select value={row.status} onValueChange={(status) => update.mutate({ id: row.id, status, label: row.full_name })}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESSAGE_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {row.subject ? <p className="text-sm font-medium">{row.subject}</p> : null}
            <p className="whitespace-pre-line rounded-lg bg-muted p-3 text-sm leading-7">{row.message}</p>
            <p className="text-[11px] text-muted-foreground">{new Date(row.created_at).toLocaleString("ar")}</p>
          </Card>
        ))}
        {rows.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">لا توجد رسائل.</p> : null}
      </div>
    </AdminShell>
  );
}
