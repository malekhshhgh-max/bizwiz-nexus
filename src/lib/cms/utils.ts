export function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return base || `item-${Date.now()}`;
}

export function whatsappLink(number: string, message?: string): string {
  const digits = (number || "").replace(/[^\d]/g, "");
  if (!digits) return "";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function formatArabicDate(value?: string | null): string {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("ar", { dateStyle: "long" }).format(new Date(value));
  } catch {
    return "";
  }
}

export const LEAD_STATUSES = [
  { value: "new", label: "جديد" },
  { value: "viewed", label: "تمت المشاهدة" },
  { value: "contacted", label: "تم التواصل" },
  { value: "qualified", label: "مؤهل" },
  { value: "converted", label: "تم التحويل" },
  { value: "closed", label: "مغلق" },
] as const;

export const ORGANIZATION_TYPES = [
  "جمعية أهلية",
  "نادٍ رياضي",
  "مؤسسة أو منشأة",
  "جهة حكومية",
  "مبادرة أو مشروع",
  "أخرى",
] as const;
