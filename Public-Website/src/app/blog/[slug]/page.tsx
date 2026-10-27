import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPostBySlug } from "@/lib/api";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { PageHeader } from "@/components/ui/page-header";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { formatDateLocalized } from "@/lib/i18n";
import { getPageContext } from "@/lib/page-context";
import type { PostCategory } from "@/lib/types";

const CATEGORY_KEY = {
  academic: "blog.category.academic",
  "campus-life": "blog.category.campusLife",
  events: "blog.category.events",
  achievements: "blog.category.achievements",
  "student-activities": "blog.category.studentActivities",
} as const satisfies Record<PostCategory, string>;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post?.title ?? "Blog & News" };
}

/** One published blog & news article. Drafts are never returned by the API. */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [{ t, locale }, post] = await Promise.all([
    getPageContext(),
    getPostBySlug(slug),
  ]);
  if (!post) notFound();

  const paragraphs = post.content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <>
      <PageHeader
        title={post.title}
        description={[
          t(CATEGORY_KEY[post.category]),
          formatDateLocalized(post.publishedAt, locale),
          post.author ? t("page.blog.by", { author: post.author }) : "",
        ]
          .filter(Boolean)
          .join(" · ")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.blog.crumb"), href: "/blog" },
          { label: post.title },
        ]}
      />
      <Section size="md" reveal contentClassName="max-w-[calc(47.5rem+2*var(--gutter))]">
        {post.isDemo && (
          <p className="mb-5">
            <SampleBadge label={t("common.demoContent")} />
          </p>
        )}
        {post.imageUrl && (
          <div className="mb-8 aspect-[16/9] overflow-hidden rounded-card bg-surface">
            <ImageWithFallback
              src={post.imageUrl}
              alt={post.title}
              label=""
              className="size-full"
            />
          </div>
        )}
        <div className="space-y-4 text-body leading-relaxed text-ink-soft">
          {paragraphs.map((block, index) => (
            <p key={index} className="whitespace-pre-line">
              {block}
            </p>
          ))}
        </div>
        <Link
          href="/blog"
          className="mt-10 inline-block text-body-sm font-bold text-green transition-colors duration-150 hover:text-gold-dark"
        >
          {t("page.blog.back")}
        </Link>
      </Section>
    </>
  );
}
