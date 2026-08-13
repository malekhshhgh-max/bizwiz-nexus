import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/cms/api";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { AppLink } from "@/components/shared/AppLink";
import { CardsSkeleton, EmptyState } from "@/components/shared/States";
import { formatArabicDate } from "@/lib/cms/utils";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "المدونة | المستشار العزي للمشروع" },
      {
        name: "description",
        content: "مقالات ورؤى في الجودة والتطوير المؤسسي والحوكمة والتخطيط الاستراتيجي من فريق المستشار العزي.",
      },
      { property: "og:title", content: "المدونة | المستشار العزي" },
      { property: "og:description", content: "مقالات ورؤى في الجودة والتطوير المؤسسي." },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data, isPending } = useQuery(postsQuery);
  const posts = data ?? [];

  return (
    <SiteLayout>
      <PageHero eyebrow="المدونة" title="رؤى ومقالات" description="مقالات عملية في الجودة والتطوير المؤسسي والحوكمة." />
      <section className="py-14 md:py-20">
        <div className="container-page">
          {isPending ? (
            <CardsSkeleton count={6} />
          ) : posts.length === 0 ? (
            <EmptyState icon="Newspaper" title="لا توجد مقالات منشورة حالياً." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <AppLink
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="surface-card overflow-hidden transition-shadow hover:shadow-elegant"
                >
                  <div className="aspect-16/9 bg-primary-soft">
                    {post.featured_image ? (
                      <img src={post.featured_image} alt={post.title} className="size-full object-cover" loading="lazy" />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-muted-foreground">{formatArabicDate(post.published_at)}</span>
                    <h2 className="mt-1 font-heading text-base leading-snug">{post.title}</h2>
                    {post.excerpt ? (
                      <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
                    ) : null}
                  </div>
                </AppLink>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
