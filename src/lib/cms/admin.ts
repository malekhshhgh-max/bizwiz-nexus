import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AdminTable = keyof Database["public"]["Tables"];

export type AuditAction = "create" | "update" | "delete" | "publish" | "settings" | "upload" | "role";

export async function logActivity(params: {
  action: AuditAction | string;
  entityType: string;
  entityId?: string | null;
  entityLabel?: string | null;
  details?: Record<string, unknown>;
}) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return;
  await supabase.from("audit_logs").insert({
    user_id: user.id,
    user_email: user.email ?? null,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    entity_label: params.entityLabel ?? null,
    details: (params.details ?? {}) as never,
  });
}

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []) as T;
}

export const adminRowsQuery = (table: AdminTable, orderBy: { column: string; ascending: boolean }) =>
  queryOptions({
    queryKey: ["admin", table],
    queryFn: async () =>
      unwrap(
        await supabase.from(table).select("*").order(orderBy.column, { ascending: orderBy.ascending }),
      ) as Record<string, unknown>[],
  });

export const adminCountsQuery = queryOptions({
  queryKey: ["admin", "counts"],
  queryFn: async () => {
    const tables: { key: string; table: AdminTable; filter?: [string, string] }[] = [
      { key: "services", table: "services" },
      { key: "pages", table: "pages" },
      { key: "posts", table: "blog_posts" },
      { key: "projects", table: "projects" },
      { key: "leads", table: "consultation_requests", filter: ["status", "new"] },
      { key: "messages", table: "contact_messages", filter: ["status", "new"] },
      { key: "media", table: "media_library" },
      { key: "testimonials", table: "testimonials" },
    ];
    const entries = await Promise.all(
      tables.map(async (t) => {
        let q = supabase.from(t.table).select("id", { count: "exact", head: true });
        if (t.filter) q = q.eq(t.filter[0], t.filter[1]);
        const { count, error } = await q;
        if (error) throw new Error(error.message);
        return [t.key, count ?? 0] as const;
      }),
    );
    return Object.fromEntries(entries) as Record<string, number>;
  },
});

export const auditLogsQuery = queryOptions({
  queryKey: ["admin", "audit_logs"],
  queryFn: async () =>
    unwrap(
      await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200),
    ) as Database["public"]["Tables"]["audit_logs"]["Row"][],
});

export const consultationsQuery = queryOptions({
  queryKey: ["admin", "consultation_requests"],
  queryFn: async () =>
    unwrap(
      await supabase.from("consultation_requests").select("*").order("created_at", { ascending: false }),
    ) as Database["public"]["Tables"]["consultation_requests"]["Row"][],
});

export const messagesQuery = queryOptions({
  queryKey: ["admin", "contact_messages"],
  queryFn: async () =>
    unwrap(
      await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ) as Database["public"]["Tables"]["contact_messages"]["Row"][],
});

export const mediaQuery = queryOptions({
  queryKey: ["admin", "media_library"],
  queryFn: async () =>
    unwrap(
      await supabase.from("media_library").select("*").order("created_at", { ascending: false }),
    ) as Database["public"]["Tables"]["media_library"]["Row"][],
});

export const allPagesQuery = queryOptions({
  queryKey: ["admin", "pages", "all"],
  queryFn: async () =>
    unwrap(await supabase.from("pages").select("*").order("created_at", { ascending: true })) as Database["public"]["Tables"]["pages"]["Row"][],
});

export const pageSectionsAdminQuery = (pageId: string) =>
  queryOptions({
    queryKey: ["admin", "page_sections", pageId],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("page_sections")
          .select("*")
          .eq("page_id", pageId)
          .order("sort_order", { ascending: true }),
      ) as Database["public"]["Tables"]["page_sections"]["Row"][],
  });

export const allSettingsQuery = queryOptions({
  queryKey: ["admin", "site_settings"],
  queryFn: async () => {
    const rows = unwrap(await supabase.from("site_settings").select("key, value")) as {
      key: string;
      value: Record<string, unknown>;
    }[];
    const map: Record<string, Record<string, unknown>> = {};
    for (const r of rows) map[r.key] = (r.value ?? {}) as Record<string, unknown>;
    return map;
  },
});

export async function saveSettings(key: string, value: Record<string, unknown>) {
  const { error } = await supabase.from("site_settings").upsert({ key, value: value as never }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  await logActivity({ action: "settings", entityType: "site_settings", entityLabel: key, details: { key } });
}

export async function signedMediaUrl(path: string): Promise<string> {
  const { data } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
  return data?.signedUrl ?? "";
}
