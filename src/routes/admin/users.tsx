import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { logActivity } from "@/lib/cms/admin";
import { ROLE_LABELS, useAuth, type AppRole } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

const ROLES = Object.keys(ROLE_LABELS) as AppRole[];

function UsersPage() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  const { data } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const [profiles, roles] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: true }),
        supabase.from("user_roles").select("*"),
      ]);
      if (profiles.error) throw new Error(profiles.error.message);
      if (roles.error) throw new Error(roles.error.message);
      return { profiles: profiles.data ?? [], roles: roles.data ?? [] };
    },
  });

  const setRole = useMutation({
    mutationFn: async ({ userId, role, email }: { userId: string; role: AppRole; email: string }) => {
      const del = await supabase.from("user_roles").delete().eq("user_id", userId);
      if (del.error) throw new Error(del.error.message);
      const ins = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (ins.error) throw new Error(ins.error.message);
      await logActivity({ action: "role", entityType: "user_roles", entityId: userId, entityLabel: email, details: { role } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("تم تحديث الصلاحية");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell
      title="المستخدمون والأدوار"
      description="إدارة صلاحيات فريق العمل"
      breadcrumbs={[{ label: "لوحة التحكم", to: "/admin" }, { label: "المستخدمون" }]}
    >
      {!isAdmin ? (
        <p className="mb-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          العرض فقط — تعديل الأدوار متاح للمديرين.
        </p>
      ) : null}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المستخدم</TableHead>
              <TableHead className="text-right">البريد</TableHead>
              <TableHead className="text-right">الدور</TableHead>
              <TableHead className="text-right">تاريخ الانضمام</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.profiles ?? []).map((profile) => {
              const current = (data?.roles ?? []).find((r) => r.user_id === profile.id)?.role as AppRole | undefined;
              return (
                <TableRow key={profile.id}>
                  <TableCell className="text-sm">{profile.full_name ?? "-"}</TableCell>
                  <TableCell dir="ltr" className="text-right text-xs">{profile.email ?? "-"}</TableCell>
                  <TableCell>
                    {isAdmin ? (
                      <Select
                        value={current ?? "none"}
                        onValueChange={(role) =>
                          setRole.mutate({ userId: profile.id, role: role as AppRole, email: profile.email ?? "" })
                        }
                      >
                        <SelectTrigger className="h-8 w-40 text-xs">
                          <SelectValue placeholder="بدون دور" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {ROLE_LABELS[role]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary">{current ? ROLE_LABELS[current] : "بدون دور"}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString("ar")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </AdminShell>
  );
}
