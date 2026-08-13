export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "slug"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "icon"
  | "json"
  | "date";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  optionsFrom?: "service_categories" | "blog_categories";
  full?: boolean;
  defaultValue?: unknown;
};

export type ResourceConfig = {
  table:
    | "services"
    | "service_categories"
    | "sectors"
    | "projects"
    | "blog_posts"
    | "blog_categories"
    | "faqs"
    | "testimonials"
    | "navigation_items"
    | "pages";
  title: string;
  singular: string;
  description?: string;
  orderBy: { column: string; ascending: boolean };
  columns: { name: string; label: string; type?: "text" | "boolean" | "badge" | "date" }[];
  searchColumn?: string;
  fields: FieldConfig[];
};

const STATUS_OPTIONS = [
  { value: "draft", label: "مسودة" },
  { value: "published", label: "منشور" },
  { value: "archived", label: "مؤرشف" },
];

export const RESOURCES: Record<string, ResourceConfig> = {
  services: {
    table: "services",
    title: "الخدمات",
    singular: "خدمة",
    description: "إدارة الخدمات الاستشارية وتفاصيلها الكاملة.",
    orderBy: { column: "sort_order", ascending: true },
    searchColumn: "title",
    columns: [
      { name: "title", label: "الخدمة" },
      { name: "slug", label: "الرابط" },
      { name: "is_featured", label: "مميزة", type: "boolean" },
      { name: "is_visible", label: "ظاهرة", type: "boolean" },
      { name: "sort_order", label: "الترتيب" },
    ],
    fields: [
      { name: "title", label: "عنوان الخدمة", type: "text", required: true, full: true },
      { name: "slug", label: "الرابط (slug)", type: "slug", required: true },
      { name: "icon", label: "الأيقونة", type: "icon" },
      { name: "category_id", label: "التصنيف", type: "select", optionsFrom: "service_categories" },
      { name: "sort_order", label: "الترتيب", type: "number", defaultValue: 0 },
      { name: "short_description", label: "وصف مختصر", type: "textarea", full: true },
      { name: "full_description", label: "الوصف التفصيلي", type: "richtext", full: true },
      { name: "featured_image", label: "صورة الخدمة", type: "image", full: true },
      { name: "features", label: "المميزات", type: "json", full: true, help: '[{"title":"","description":"","icon":"Check"}]', defaultValue: [] },
      { name: "process_steps", label: "خطوات التنفيذ", type: "json", full: true, help: '[{"title":"","description":""}]', defaultValue: [] },
      { name: "outcomes", label: "المخرجات", type: "json", full: true, help: '["مخرج 1","مخرج 2"]', defaultValue: [] },
      { name: "faq", label: "أسئلة شائعة", type: "json", full: true, help: '[{"question":"","answer":""}]', defaultValue: [] },
      { name: "cta_title", label: "عنوان دعوة الإجراء", type: "text" },
      { name: "cta_description", label: "وصف دعوة الإجراء", type: "text" },
      { name: "meta_title", label: "عنوان SEO", type: "text" },
      { name: "meta_description", label: "وصف SEO", type: "textarea", full: true },
      { name: "is_featured", label: "خدمة مميزة", type: "boolean", defaultValue: false },
      { name: "is_visible", label: "ظاهرة في الموقع", type: "boolean", defaultValue: true },
    ],
  },
  "service-categories": {
    table: "service_categories",
    title: "تصنيفات الخدمات",
    singular: "تصنيف",
    orderBy: { column: "sort_order", ascending: true },
    searchColumn: "name",
    columns: [
      { name: "name", label: "التصنيف" },
      { name: "slug", label: "الرابط" },
      { name: "sort_order", label: "الترتيب" },
      { name: "is_visible", label: "ظاهر", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "اسم التصنيف", type: "text", required: true },
      { name: "slug", label: "الرابط", type: "slug", required: true },
      { name: "description", label: "الوصف", type: "textarea", full: true },
      { name: "sort_order", label: "الترتيب", type: "number", defaultValue: 0 },
      { name: "is_visible", label: "ظاهر", type: "boolean", defaultValue: true },
    ],
  },
  sectors: {
    table: "sectors",
    title: "القطاعات",
    singular: "قطاع",
    orderBy: { column: "sort_order", ascending: true },
    searchColumn: "title",
    columns: [
      { name: "title", label: "القطاع" },
      { name: "sort_order", label: "الترتيب" },
      { name: "is_visible", label: "ظاهر", type: "boolean" },
    ],
    fields: [
      { name: "title", label: "اسم القطاع", type: "text", required: true },
      { name: "icon", label: "الأيقونة", type: "icon" },
      { name: "description", label: "الوصف", type: "textarea", full: true },
      { name: "sort_order", label: "الترتيب", type: "number", defaultValue: 0 },
      { name: "is_visible", label: "ظاهر", type: "boolean", defaultValue: true },
    ],
  },
  projects: {
    table: "projects",
    title: "المشاريع وقصص النجاح",
    singular: "مشروع",
    orderBy: { column: "sort_order", ascending: true },
    searchColumn: "title",
    columns: [
      { name: "title", label: "المشروع" },
      { name: "category", label: "التصنيف" },
      { name: "is_visible", label: "ظاهر", type: "boolean" },
    ],
    fields: [
      { name: "title", label: "اسم المشروع", type: "text", required: true },
      { name: "client_name", label: "اسم العميل", type: "text" },
      { name: "category", label: "التصنيف", type: "text" },
      { name: "description", label: "الوصف", type: "textarea", full: true },
      { name: "image", label: "الصورة", type: "image", full: true },
      { name: "results", label: "النتائج", type: "json", full: true, help: '["نتيجة 1"]', defaultValue: [] },
      { name: "sort_order", label: "الترتيب", type: "number", defaultValue: 0 },
      { name: "is_visible", label: "ظاهر", type: "boolean", defaultValue: true },
    ],
  },
  blog: {
    table: "blog_posts",
    title: "المقالات",
    singular: "مقال",
    orderBy: { column: "created_at", ascending: false },
    searchColumn: "title",
    columns: [
      { name: "title", label: "المقال" },
      { name: "status", label: "الحالة", type: "badge" },
      { name: "published_at", label: "تاريخ النشر", type: "date" },
    ],
    fields: [
      { name: "title", label: "عنوان المقال", type: "text", required: true, full: true },
      { name: "slug", label: "الرابط", type: "slug", required: true },
      { name: "category_id", label: "التصنيف", type: "select", optionsFrom: "blog_categories" },
      { name: "author", label: "الكاتب", type: "text" },
      { name: "status", label: "الحالة", type: "select", options: STATUS_OPTIONS, defaultValue: "draft" },
      { name: "published_at", label: "تاريخ النشر", type: "date" },
      { name: "featured_image", label: "صورة الغلاف", type: "image", full: true },
      { name: "excerpt", label: "مقتطف", type: "textarea", full: true },
      { name: "content", label: "المحتوى", type: "richtext", full: true },
      { name: "meta_title", label: "عنوان SEO", type: "text" },
      { name: "meta_description", label: "وصف SEO", type: "textarea", full: true },
      { name: "is_featured", label: "مقال مميز", type: "boolean", defaultValue: false },
    ],
  },
  "blog-categories": {
    table: "blog_categories",
    title: "تصنيفات المدونة",
    singular: "تصنيف",
    orderBy: { column: "sort_order", ascending: true },
    searchColumn: "name",
    columns: [
      { name: "name", label: "التصنيف" },
      { name: "slug", label: "الرابط" },
    ],
    fields: [
      { name: "name", label: "اسم التصنيف", type: "text", required: true },
      { name: "slug", label: "الرابط", type: "slug", required: true },
      { name: "sort_order", label: "الترتيب", type: "number", defaultValue: 0 },
    ],
  },
  faqs: {
    table: "faqs",
    title: "الأسئلة الشائعة",
    singular: "سؤال",
    orderBy: { column: "sort_order", ascending: true },
    searchColumn: "question",
    columns: [
      { name: "question", label: "السؤال" },
      { name: "sort_order", label: "الترتيب" },
      { name: "is_visible", label: "ظاهر", type: "boolean" },
    ],
    fields: [
      { name: "question", label: "السؤال", type: "text", required: true, full: true },
      { name: "answer", label: "الإجابة", type: "textarea", required: true, full: true },
      { name: "category", label: "التصنيف", type: "text" },
      { name: "sort_order", label: "الترتيب", type: "number", defaultValue: 0 },
      { name: "is_visible", label: "ظاهر", type: "boolean", defaultValue: true },
    ],
  },
  testimonials: {
    table: "testimonials",
    title: "آراء العملاء",
    singular: "رأي",
    orderBy: { column: "sort_order", ascending: true },
    searchColumn: "author_name",
    columns: [
      { name: "author_name", label: "العميل" },
      { name: "organization", label: "الجهة" },
      { name: "is_visible", label: "ظاهر", type: "boolean" },
    ],
    fields: [
      { name: "author_name", label: "اسم العميل", type: "text", required: true },
      { name: "author_title", label: "المسمى الوظيفي", type: "text" },
      { name: "organization", label: "الجهة", type: "text" },
      { name: "avatar", label: "الصورة الشخصية", type: "image" },
      { name: "content", label: "نص الرأي", type: "textarea", required: true, full: true },
      { name: "rating", label: "التقييم (1-5)", type: "number", defaultValue: 5 },
      { name: "sort_order", label: "الترتيب", type: "number", defaultValue: 0 },
      { name: "is_visible", label: "ظاهر", type: "boolean", defaultValue: true },
    ],
  },
  navigation: {
    table: "navigation_items",
    title: "القوائم والروابط",
    singular: "رابط",
    description: "روابط القائمة الرئيسية والتذييل.",
    orderBy: { column: "sort_order", ascending: true },
    searchColumn: "label",
    columns: [
      { name: "label", label: "العنوان" },
      { name: "url", label: "الرابط" },
      { name: "location", label: "الموضع", type: "badge" },
      { name: "is_visible", label: "ظاهر", type: "boolean" },
    ],
    fields: [
      { name: "label", label: "نص الرابط", type: "text", required: true },
      { name: "url", label: "المسار", type: "text", required: true, help: "مثال: /services" },
      {
        name: "location",
        label: "الموضع",
        type: "select",
        defaultValue: "header",
        options: [
          { value: "header", label: "القائمة الرئيسية" },
          { value: "footer", label: "التذييل" },
        ],
      },
      { name: "sort_order", label: "الترتيب", type: "number", defaultValue: 0 },
      { name: "is_visible", label: "ظاهر", type: "boolean", defaultValue: true },
    ],
  },
  pages: {
    table: "pages",
    title: "الصفحات",
    singular: "صفحة",
    description: "صفحات الموقع، ولكل صفحة أقسام قابلة للبناء.",
    orderBy: { column: "created_at", ascending: true },
    searchColumn: "title",
    columns: [
      { name: "title", label: "الصفحة" },
      { name: "slug", label: "الرابط" },
      { name: "status", label: "الحالة", type: "badge" },
    ],
    fields: [
      { name: "title", label: "عنوان الصفحة", type: "text", required: true },
      { name: "slug", label: "الرابط", type: "slug", required: true },
      { name: "status", label: "الحالة", type: "select", options: STATUS_OPTIONS, defaultValue: "published" },
      { name: "meta_title", label: "عنوان SEO", type: "text" },
      { name: "meta_description", label: "وصف SEO", type: "textarea", full: true },
      { name: "og_image", label: "صورة المشاركة", type: "image", full: true },
    ],
  },
};
