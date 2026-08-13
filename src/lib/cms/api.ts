import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Tables = Database["public"]["Tables"];
export type Service = Tables["services"]["Row"];
export type ServiceCategory = Tables["service_categories"]["Row"];
export type Sector = Tables["sectors"]["Row"];
export type Project = Tables["projects"]["Row"];
export type BlogPost = Tables["blog_posts"]["Row"];
export type BlogCategory = Tables["blog_categories"]["Row"];
export type Faq = Tables["faqs"]["Row"];
export type Testimonial = Tables["testimonials"]["Row"];
export type NavigationItem = Tables["navigation_items"]["Row"];
export type PageSection = Tables["page_sections"]["Row"];
export type Page = Tables["pages"]["Row"];
export type MediaItem = Tables["media_library"]["Row"];
export type ConsultationRequest = Tables["consultation_requests"]["Row"];
export type ContactMessage = Tables["contact_messages"]["Row"];
export type AuditLog = Tables["audit_logs"]["Row"];

export type SettingsMap = Record<string, Record<string, unknown>>;

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []) as T;
}

export const DEFAULT_SETTINGS: SettingsMap = {
  brand: { site_name: "المستشار العزي للمشروع", tagline: "استشارات الجودة والتطوير المؤسسي", logo_url: "", logo_text: "المستشار العزي" },
  theme: {},
  contact: { whatsapp_float_enabled: true },
  social: {},
  seo: {},
  analytics: {},
  footer: {},
  header: { sticky: true, show_cta: true, cta_label: "اطلب استشارة", cta_url: "/consultation" },
  sections_visibility: {},
};

export function str(obj: Record<string, unknown> | undefined, key: string, fallback = ""): string {
  const v = obj?.[key];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}
export function bool(obj: Record<string, unknown> | undefined, key: string, fallback = false): boolean {
  const v = obj?.[key];
  return typeof v === "boolean" ? v : fallback;
}
export function list<T = Record<string, unknown>>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  staleTime: 60_000,
  queryFn: async (): Promise<SettingsMap> => {
    const rows = unwrap(await supabase.from("site_settings").select("key, value"));
    const map: SettingsMap = { ...DEFAULT_SETTINGS };
    for (const row of rows) {
      map[row.key] = { ...(DEFAULT_SETTINGS[row.key] ?? {}), ...((row.value ?? {}) as Record<string, unknown>) };
    }
    return map;
  },
});

export const navigationQuery = queryOptions({
  queryKey: ["navigation_items"],
  staleTime: 60_000,
  queryFn: async () =>
    unwrap(
      await supabase
        .from("navigation_items")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true }),
    ) as NavigationItem[],
});

export const servicesQuery = queryOptions({
  queryKey: ["services", "public"],
  queryFn: async () =>
    unwrap(
      await supabase
        .from("services")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true }),
    ) as Service[],
});

export const serviceCategoriesQuery = queryOptions({
  queryKey: ["service_categories", "public"],
  queryFn: async () =>
    unwrap(
      await supabase.from("service_categories").select("*").order("sort_order", { ascending: true }),
    ) as ServiceCategory[],
});

export const serviceBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("slug", slug).maybeSingle();
      if (error) throw new Error(error.message);
      return data as Service | null;
    },
  });

export const sectorsQuery = queryOptions({
  queryKey: ["sectors", "public"],
  queryFn: async () =>
    unwrap(
      await supabase.from("sectors").select("*").eq("is_visible", true).order("sort_order", { ascending: true }),
    ) as Sector[],
});

export const projectsQuery = queryOptions({
  queryKey: ["projects", "public"],
  queryFn: async () =>
    unwrap(
      await supabase.from("projects").select("*").eq("is_visible", true).order("sort_order", { ascending: true }),
    ) as Project[],
});

export const faqsQuery = queryOptions({
  queryKey: ["faqs", "public"],
  queryFn: async () =>
    unwrap(
      await supabase.from("faqs").select("*").eq("is_visible", true).order("sort_order", { ascending: true }),
    ) as Faq[],
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials", "public"],
  queryFn: async () =>
    unwrap(
      await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("sort_order", { ascending: true }),
    ) as Testimonial[],
});

export const postsQuery = queryOptions({
  queryKey: ["blog_posts", "public"],
  queryFn: async () =>
    unwrap(
      await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false }),
    ) as BlogPost[],
});

export const blogCategoriesQuery = queryOptions({
  queryKey: ["blog_categories", "public"],
  queryFn: async () =>
    unwrap(await supabase.from("blog_categories").select("*").order("sort_order", { ascending: true })) as BlogCategory[],
});

export const postBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog_post", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
      if (error) throw new Error(error.message);
      return data as BlogPost | null;
    },
  });

export const pageSectionsQuery = (slug: string) =>
  queryOptions({
    queryKey: ["page_sections", slug],
    queryFn: async () => {
      const { data: page, error } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
      if (error) throw new Error(error.message);
      if (!page) return { page: null, sections: [] as PageSection[] };
      const sections = unwrap(
        await supabase
          .from("page_sections")
          .select("*")
          .eq("page_id", page.id)
          .eq("is_visible", true)
          .order("sort_order", { ascending: true }),
      ) as PageSection[];
      return { page: page as Page, sections };
    },
  });
