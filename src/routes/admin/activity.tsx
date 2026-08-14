import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { auditLogsQuery } from "@/lib/cms/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/activity")({
  component: ActivityPage,
});

const ACTION_LABELS: Record<string, string> = {
  create: "إضافة",
  update: "تعديل",
  delete: "حذف",
  publish: "نشر",
  settings: "إعدادات",
  upload: "رفع ملف",
  role: "صلاحيات",
};

function ActivityPage() {
  const { data: logs = [] } = useQuery(auditLogsQuery);
  return (
    <AdminShell
      title="سجل النشاط"
      description="آخر 200 عملية تمت على المحتوى والإعدادات"
      breadcrumbs={[{ label: "لوحة التحكم", to: "/admin" }, { label: "سجل النشاط" }]}
    >
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الإجراء</TableHead>
              <TableHead className="text-right">العنصر</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">المستخدم</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge variant="outline">{ACTION_LABELS[log.action] ?? log.action}</Badge>
                </TableCell>
                <TableCell className="max-w-[240px] truncate text-sm">{log.entity_label ?? "-"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{log.entity_type}</TableCell>
                <TableCell className="text-xs">{log.user_email ?? "-"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(log.created_at).toLocaleString("ar")}
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  لا يوجد نشاط مسجل.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </AdminShell>
  );
}
