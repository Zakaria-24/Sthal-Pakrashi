"use client";

import Link from "next/link";
import { useState } from "react";

import { ContentCard } from "@/components/ui/content-card";
import { FilterChips } from "@/components/ui/filter-chips";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { EmptyState } from "@/components/ui/states";
import { useI18n } from "@/lib/i18n/provider";
import type { PostCategory } from "@/lib/types";

const CATEGORIES = [
  "academic",
  "campusLife",
  "events",
  "achievements",
  "studentActivities",
] as const;

type Category = (typeof CATEGORIES)[number];

/** The CMS stores kebab-case category ids; the design's keys are camelCase. */
const FROM_CMS: Record<PostCategory, Category> = {
  academic: "academic",
  "campus-life": "campusLife",
  events: "events",
  achievements: "achievements",
  "student-activities": "studentActivities",
};

export type BlogCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: PostCategory;
  /** Already formatted for the visitor's locale. */
  date: string;
};

/**
 * Blog & News list with category chips. With published posts from the CMS it
 * lists them (each linking to its own page); with none it renders the design's
 * six placeholder articles, cycling through the five categories exactly as the
 * artifact does.
 */
export function BlogBrowser({ posts }: { posts: BlogCard[] }) {
  const { t } = useI18n();
  const [category, setCategory] = useState<"all" | Category>("all");

  const chips = (
    <FilterChips
      label={t("page.blog.filter")}
      value={category}
      onChange={setCategory}
      className="mb-12"
      options={[
        { value: "all", label: t("page.all") },
        ...CATEGORIES.map((key) => ({
          value: key,
          label: t(`blog.category.${key}`),
        })),
      ]}
    />
  );

  if (posts.length > 0) {
    const visible =
      category === "all"
        ? posts
        : posts.filter((post) => FROM_CMS[post.category] === category);
    return (
      <>
        {chips}
        {visible.length === 0 ? (
          <EmptyState message={t("page.blog.empty")} />
        ) : (
          <ul className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,17.5rem),1fr))]">
            {visible.map((post) => (
              <li key={post.id}>
                <ContentCard className="group/post relative h-full overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden bg-surface">
                    <ImageWithFallback
                      src={post.imageUrl}
                      alt=""
                      label=""
                      className="size-full transition-transform duration-500 motion-safe:group-hover/post:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="mb-2 text-small font-bold text-green">
                      {t(`blog.category.${FROM_CMS[post.category]}`)} · {post.date}
                    </p>
                    <h2 className="mb-2 font-heading text-body font-bold text-ink">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-green"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="mb-3.5 text-body-sm text-ink-soft">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="text-body-sm font-bold text-green">
                      {t("page.blog.readMore")}
                    </span>
                  </div>
                </ContentCard>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  const placeholders = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    category: CATEGORIES[i % CATEGORIES.length],
  }));
  const visible =
    category === "all"
      ? placeholders
      : placeholders.filter((p) => p.category === category);

  return (
    <>
      {chips}
      {visible.length === 0 ? (
        <EmptyState message={t("page.blog.empty")} />
      ) : (
        <ul className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,17.5rem),1fr))]">
          {visible.map((post) => (
            <li key={post.id} data-placeholder="true">
              <ContentCard className="group/post h-full overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden bg-surface">
                  <ImageWithFallback
                    alt=""
                    label=""
                    className="size-full transition-transform duration-500 motion-safe:group-hover/post:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="mb-2 text-small font-bold text-green">
                    {t(`blog.category.${post.category}`)} · —
                  </p>
                  <h2 className="mb-2 font-heading text-body font-bold text-ink">
                    {t("page.blog.placeholderTitle")}
                  </h2>
                  <p className="mb-3.5 text-body-sm text-ink-soft">
                    {t("page.blog.placeholderExcerpt")}
                  </p>
                  <span className="text-body-sm font-bold text-green">
                    {t("page.blog.readMore")}
                  </span>
                </div>
              </ContentCard>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
