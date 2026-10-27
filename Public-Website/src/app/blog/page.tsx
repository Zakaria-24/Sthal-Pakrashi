import { getPosts } from "@/lib/api";
import { BlogBrowser } from "@/components/pages/blog-browser";
import { PageHeader } from "@/components/ui/page-header";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { formatDateLocalized } from "@/lib/i18n";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.blog.title");

export default async function BlogPage() {
  const [{ t, locale }, { data: posts }] = await Promise.all([
    getPageContext(),
    getPosts(),
  ]);
  return (
    <>
      <PageHeader
        title={t("page.blog.title")}
        description={t("page.blog.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.blog.crumb") },
        ]}
      />
      <Section size="md" reveal>
        {(posts.length === 0 || posts.some((post) => post.isDemo)) && (
          <p className="mb-5">
            <SampleBadge
              label={t(posts.length === 0 ? "common.sampleContent" : "common.demoContent")}
            />
          </p>
        )}
        <BlogBrowser
          posts={posts.map((post) => ({
            id: post._id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            imageUrl: post.imageUrl,
            category: post.category,
            date: formatDateLocalized(post.publishedAt, locale),
          }))}
        />
      </Section>
    </>
  );
}
