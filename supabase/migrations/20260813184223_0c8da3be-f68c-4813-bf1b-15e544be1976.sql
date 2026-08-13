-- ===== settings =====
create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "settings public read" on public.site_settings for select using (true);
create policy "settings admin write" on public.site_settings for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create trigger t_site_settings_upd before update on public.site_settings for each row execute function public.update_updated_at_column();

create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  location text not null default 'header',
  label text not null,
  url text not null,
  parent_id uuid references public.navigation_items(id) on delete cascade,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  open_in_new_tab boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.navigation_items to anon, authenticated;
grant insert, update, delete on public.navigation_items to authenticated;
grant all on public.navigation_items to service_role;
alter table public.navigation_items enable row level security;
create policy "nav public read" on public.navigation_items for select using (true);
create policy "nav admin write" on public.navigation_items for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create trigger t_nav_upd before update on public.navigation_items for each row execute function public.update_updated_at_column();

-- ===== pages & sections =====
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  status text not null default 'draft',
  meta_title text,
  meta_description text,
  og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.pages to anon, authenticated;
grant insert, update, delete on public.pages to authenticated;
grant all on public.pages to service_role;
alter table public.pages enable row level security;
create policy "pages public read" on public.pages for select using (status = 'published' or public.is_staff(auth.uid()));
create policy "pages content write" on public.pages for insert to authenticated with check (public.can_manage_content(auth.uid()));
create policy "pages content update" on public.pages for update to authenticated using (public.can_manage_content(auth.uid())) with check (public.can_manage_content(auth.uid()));
create policy "pages admin delete" on public.pages for delete to authenticated using (public.is_admin(auth.uid()));
create trigger t_pages_upd before update on public.pages for each row execute function public.update_updated_at_column();

create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  section_type text not null,
  title text,
  subtitle text,
  content text,
  settings jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.page_sections to anon, authenticated;
grant insert, update, delete on public.page_sections to authenticated;
grant all on public.page_sections to service_role;
alter table public.page_sections enable row level security;
create policy "sections public read" on public.page_sections for select using (true);
create policy "sections content write" on public.page_sections for insert to authenticated with check (public.can_manage_content(auth.uid()));
create policy "sections content update" on public.page_sections for update to authenticated using (public.can_manage_content(auth.uid())) with check (public.can_manage_content(auth.uid()));
create policy "sections content delete" on public.page_sections for delete to authenticated using (public.can_manage_content(auth.uid()));
create trigger t_sections_upd before update on public.page_sections for each row execute function public.update_updated_at_column();

-- ===== services =====
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.service_categories to anon, authenticated;
grant insert, update, delete on public.service_categories to authenticated;
grant all on public.service_categories to service_role;
alter table public.service_categories enable row level security;
create policy "svccat public read" on public.service_categories for select using (true);
create policy "svccat write" on public.service_categories for all to authenticated
  using (public.can_manage_content(auth.uid())) with check (public.can_manage_content(auth.uid()));
create trigger t_svccat_upd before update on public.service_categories for each row execute function public.update_updated_at_column();

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  featured_image text,
  icon text default 'Sparkles',
  category_id uuid references public.service_categories(id) on delete set null,
  features jsonb not null default '[]'::jsonb,
  process_steps jsonb not null default '[]'::jsonb,
  outcomes jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  cta_title text,
  cta_description text,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  is_demo boolean not null default false,
  sort_order int not null default 0,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "services public read" on public.services for select using (is_visible or public.is_staff(auth.uid()));
create policy "services write" on public.services for insert to authenticated with check (public.can_manage_content(auth.uid()));
create policy "services update" on public.services for update to authenticated using (public.can_manage_content(auth.uid())) with check (public.can_manage_content(auth.uid()));
create policy "services delete" on public.services for delete to authenticated using (public.is_admin(auth.uid()));
create trigger t_services_upd before update on public.services for each row execute function public.update_updated_at_column();

-- ===== sectors =====
create table public.sectors (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  icon text default 'Building2',
  image text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.sectors to anon, authenticated;
grant insert, update, delete on public.sectors to authenticated;
grant all on public.sectors to service_role;
alter table public.sectors enable row level security;
create policy "sectors public read" on public.sectors for select using (is_visible or public.is_staff(auth.uid()));
create policy "sectors write" on public.sectors for all to authenticated
  using (public.can_manage_content(auth.uid())) with check (public.can_manage_content(auth.uid()));
create trigger t_sectors_upd before update on public.sectors for each row execute function public.update_updated_at_column();

-- ===== projects =====
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  content text,
  image text,
  gallery jsonb not null default '[]'::jsonb,
  category text,
  client_name text,
  completion_date date,
  results jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  is_visible boolean not null default false,
  is_demo boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "projects public read" on public.projects for select using (is_visible or public.is_staff(auth.uid()));
create policy "projects write" on public.projects for insert to authenticated with check (public.can_manage_content(auth.uid()));
create policy "projects update" on public.projects for update to authenticated using (public.can_manage_content(auth.uid())) with check (public.can_manage_content(auth.uid()));
create policy "projects delete" on public.projects for delete to authenticated using (public.is_admin(auth.uid()));
create trigger t_projects_upd before update on public.projects for each row execute function public.update_updated_at_column();

-- ===== blog =====
create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.blog_categories to anon, authenticated;
grant insert, update, delete on public.blog_categories to authenticated;
grant all on public.blog_categories to service_role;
alter table public.blog_categories enable row level security;
create policy "blogcat public read" on public.blog_categories for select using (true);
create policy "blogcat write" on public.blog_categories for all to authenticated
  using (public.can_manage_content(auth.uid())) with check (public.can_manage_content(auth.uid()));
create trigger t_blogcat_upd before update on public.blog_categories for each row execute function public.update_updated_at_column();

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image text,
  category_id uuid references public.blog_categories(id) on delete set null,
  author text,
  status text not null default 'draft',
  is_featured boolean not null default false,
  is_demo boolean not null default false,
  published_at timestamptz,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
alter table public.blog_posts enable row level security;
create policy "posts public read" on public.blog_posts for select using (status = 'published' or public.is_staff(auth.uid()));
create policy "posts write" on public.blog_posts for insert to authenticated with check (public.can_manage_content(auth.uid()));
create policy "posts update" on public.blog_posts for update to authenticated using (public.can_manage_content(auth.uid())) with check (public.can_manage_content(auth.uid()));
create policy "posts delete" on public.blog_posts for delete to authenticated using (public.is_admin(auth.uid()));
create trigger t_posts_upd before update on public.blog_posts for each row execute function public.update_updated_at_column();

-- ===== testimonials =====
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_title text,
  organization text,
  content text not null,
  avatar text,
  rating int,
  is_approved boolean not null default false,
  is_demo boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "testimonials public read" on public.testimonials for select using (is_approved or public.is_staff(auth.uid()));
create policy "testimonials write" on public.testimonials for all to authenticated
  using (public.can_manage_content(auth.uid())) with check (public.can_manage_content(auth.uid()));
create trigger t_testimonials_upd before update on public.testimonials for each row execute function public.update_updated_at_column();

-- ===== faqs =====
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.faqs to anon, authenticated;
grant insert, update, delete on public.faqs to authenticated;
grant all on public.faqs to service_role;
alter table public.faqs enable row level security;
create policy "faqs public read" on public.faqs for select using (is_visible or public.is_staff(auth.uid()));
create policy "faqs write" on public.faqs for all to authenticated
  using (public.can_manage_content(auth.uid())) with check (public.can_manage_content(auth.uid()));
create trigger t_faqs_upd before update on public.faqs for each row execute function public.update_updated_at_column();

-- ===== leads =====
create table public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  organization text,
  organization_type text,
  requested_service text,
  message text,
  status text not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.consultation_requests to anon, authenticated;
grant select, update, delete on public.consultation_requests to authenticated;
grant all on public.consultation_requests to service_role;
alter table public.consultation_requests enable row level security;
create policy "leads public insert" on public.consultation_requests for insert with check (true);
create policy "leads staff read" on public.consultation_requests for select to authenticated using (public.is_staff(auth.uid()));
create policy "leads admin update" on public.consultation_requests for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "leads admin delete" on public.consultation_requests for delete to authenticated using (public.is_admin(auth.uid()));
create trigger t_leads_upd before update on public.consultation_requests for each row execute function public.update_updated_at_column();

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "msgs public insert" on public.contact_messages for insert with check (true);
create policy "msgs staff read" on public.contact_messages for select to authenticated using (public.is_staff(auth.uid()));
create policy "msgs admin update" on public.contact_messages for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "msgs admin delete" on public.contact_messages for delete to authenticated using (public.is_admin(auth.uid()));
create trigger t_msgs_upd before update on public.contact_messages for each row execute function public.update_updated_at_column();

-- ===== media =====
create table public.media_library (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null,
  public_url text not null,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  folder text default 'general',
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.media_library to anon, authenticated;
grant insert, update, delete on public.media_library to authenticated;
grant all on public.media_library to service_role;
alter table public.media_library enable row level security;
create policy "media public read" on public.media_library for select using (true);
create policy "media write" on public.media_library for all to authenticated
  using (public.can_manage_content(auth.uid())) with check (public.can_manage_content(auth.uid()));
create trigger t_media_upd before update on public.media_library for each row execute function public.update_updated_at_column();

-- ===== audit =====
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  action text not null,
  entity_type text not null,
  entity_id text,
  entity_label text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
grant select, insert on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;
create policy "audit staff read" on public.audit_logs for select to authenticated using (public.is_staff(auth.uid()));
create policy "audit staff insert" on public.audit_logs for insert to authenticated with check (auth.uid() = user_id);