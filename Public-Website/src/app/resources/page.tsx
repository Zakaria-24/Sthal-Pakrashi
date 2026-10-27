import Link from "next/link";
import type { ReactNode } from "react";

import { getAcademicDocuments } from "@/lib/api";
import { ArrowUpRightIcon, BookIcon, CalendarIcon, ClockIcon, FileStackIcon, ListIcon } from "@/components/ui/icons";
import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import { getPageContext, titleMetadata } from "@/lib/page-context";
import type { AcademicDocument } from "@/lib/types";

export const generateMetadata = titleMetadata("page.resources.title");

type Category = AcademicDocument["category"];

/** The five cards, in the design's order. `id` doubles as the nav anchor. */
const CARDS: {
  category: Category;
  titleKey:
    | "page.resources.routine"
    | "page.resources.syllabus"
    | "page.resources.examRoutine"
    | "page.resources.bookList"
    | "page.resources.other";
  icon: ReactNode;
}[] = [
  { category: "routine", titleKey: "page.resources.routine", icon: <ClockIcon className="size-5" /> },
  { category: "syllabus", titleKey: "page.resources.syllabus", icon: <BookIcon className="size-5" /> },
  { category: "exam-routine", titleKey: "page.resources.examRoutine", icon: <CalendarIcon className="size-5" /> },
  { category: "book-list", titleKey: "page.resources.bookList", icon: <ListIcon className="size-5" /> },
  { category: "other", titleKey: "page.resources.other", icon: <FileStackIcon className="size-5" /> },
];

/**
 * Academic Resources. Each card reads "Coming soon" until the CMS has a
 * document in that category, then lists the downloadable files.
 *
 * The chips under each title show the documents' class label, academic year and
 * shift (when a specific shift is set); they are omitted when there are none.
 */
export default async function ResourcesPage() {
  const [{ t }, { data: documents, isFallback }] = await Promise.all([
    getPageContext(),
    getAcademicDocuments(),
  ]);
  // Bundled samples are not real documents — show the design's "Coming soon".
  const real = isFallback ? [] : documents;

  return (
    <>
      <PageHeader
        title={t("page.resources.title")}
        description={t("page.resources.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.resources.crumb") },
        ]}
      />

      <Section size="md" reveal>
        {real.some((d) => d.isDemo) && (
          <p className="mb-5">
            <SampleBadge label={t("common.demoContent")} />
          </p>
        )}
        <ul className="grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))]">
          {CARDS.map((card) => {
            const files = real.filter((d) => d.category === card.category);
            const chips = [
              ...new Set(
                files
                  .flatMap((d) => [
                    d.classLabel,
                    d.academicYear,
                    d.shift && d.shift !== "none"
                      ? t(`shift.${d.shift}` as "shift.day")
                      : "",
                  ])
                  .filter(Boolean),
              ),
            ].slice(0, 3);
            return (
              <li key={card.category} id={card.category} className="scroll-mt-28">
                <ContentCard className="flex h-full flex-col gap-3 p-6">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-surface text-gold-dark">
                    {card.icon}
                  </span>
                  <h2 className="font-heading text-body font-bold text-ink">
                    {t(card.titleKey)}
                  </h2>
                  {chips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {chips.map((chip) => (
                        <Tag key={chip}>{chip}</Tag>
                      ))}
                    </div>
                  )}
                  {files.length === 0 ? (
                    <p className="text-small text-ink-soft">
                      {t("page.resources.comingSoon")}
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {files.map((file) => (
                        <li key={file._id} className="text-small">
                          {file.fileUrl ? (
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-green transition-colors duration-150 hover:text-gold-dark"
                            >
                              {file.title}
                              <ArrowUpRightIcon className="size-3.5" />
                            </a>
                          ) : (
                            <span className="text-ink-soft">{file.title}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </ContentCard>
              </li>
            );
          })}
        </ul>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-4 rounded-card bg-surface px-7 py-6.5">
          <div>
            <p className="mb-1.5 font-heading text-body font-bold text-ink">
              {t("page.resources.noticesTitle")}
            </p>
            <p className="text-body-sm text-ink-soft">
              {t("page.resources.noticesDesc")}
            </p>
          </div>
          <Link
            href="/notices"
            className="inline-flex min-h-11 items-center rounded-pill bg-green px-5.5 font-heading text-small font-bold text-white transition-[background-color,color,transform] duration-200 hover:bg-gold hover:text-on-gold motion-safe:hover:-translate-y-0.5"
          >
            {t("page.resources.noticesButton")}
          </Link>
        </div>
      </Section>
    </>
  );
}
