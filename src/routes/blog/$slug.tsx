import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { postBySlugQuery } from "@/lib/cms/api";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { CardsSkeleton, EmptyState } from "@/components/shared/States";
import { formatArabicDate } from "@/lib/cms/utils";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "مقال | المستشار العزي للمشروع" },
      { name: "description", content: "مقال من مدونة المستشار العزي للمشروع." },
      { property: "og:title", content: "مقال | المستشار العزي" },
      { property: "og:description", content: "مقال من مدونة المستشار العزي للمشروع." },
      { property: "og:type", content: "article" },
    ],
  }),
  component: PostDetail,
});

function PostDetail() {
  const { slug } = Route.useParams();
  const { data: post, isPending } = useQuery(postBySlugQuery(slug));

  if (isPending) {
    return (
      <SiteLayout>
        <div className="container-page py-20">
          <CardsSkeleton count={2} />
        </div>
      </SiteLayout>
    );
  }

  if (!post) {
    return (
      <SiteLayout>
        <div className="container-page py-24">
          <EmptyState icon="SearchX" title="المقال غير متوفر" />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow={formatArabicDate(post.published_at)}
        title={post.title}
        {...(post.excerpt ? { description: post.excerpt } : {})}
      />
      <article className="py-14 md:py-20">
        <div className="container-page max-w-3xl">
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt={post.title}
              className="mb-10 aspect-16/9 w-full rounded-2xl object-cover"
            />
          ) : null}
          <div className="space-y-5 text-base leading-9 text-muted-foreground">
            {(post.content ?? "").split("\n").filter(Boolean).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          {post.author ? <p className="mt-10 text-sm text-muted-foreground">بقلم: {post.author}</p> : null}
        </div>
      </article>
    </SiteLayout>
  );
}
