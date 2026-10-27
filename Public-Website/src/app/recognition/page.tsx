import { getRecognitions } from "@/lib/api";
import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { formatDateLocalized } from "@/lib/i18n";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.recognition.title");

type Card = {
  id: string;
  title: string;
  category: string;
  level: string;
  authority: string;
  memo: string;
  issueDate: string;
  expiryDate: string;
  documentUrl: string;
};

/**
 * Recognition & Approval. Real CMS records when present; while the CMS only
 * has bundled samples the page shows the design's four placeholder cards
 * (every field "Not published"), marked as sample content.
 */
export default async function RecognitionPage() {
  const [{ t, locale, site }, { data: records, isFallback }] =
    await Promise.all([getPageContext(), getRecognitions()]);
  const hasDemo = !isFallback && records.some((item) => item.isDemo);
  const notPublished = t("page.notPublished");

  const cards: Card[] = isFallback
    ? (
        [
          ["p1", "permission", "level.secondary"],
          ["p2", "recognition", "level.secondary"],
          ["p3", "permission", "level.higherSecondary"],
          ["p4", "recognition", "level.higherSecondary"],
        ] as const
      ).map(([key, category, level]) => ({
        id: key,
        title: t(`page.recognition.${key}`),
        category: t(`recognition.category.${category}`),
        level: t(level),
        authority: site.board,
        memo: notPublished,
        issueDate: notPublished,
        expiryDate: notPublished,
        documentUrl: "",
      }))
    : records.map((r) => ({
        id: r._id,
        title: r.title,
        category: t(`recognition.category.${r.category}`),
        level: r.level,
        authority: r.issuedBy || notPublished,
        memo: r.memoNumber || notPublished,
        issueDate: formatDateLocalized(r.issueDate, locale) || notPublished,
        expiryDate: formatDateLocalized(r.expiryDate, locale) || notPublished,
        documentUrl: r.documentUrl,
      }));

  return (
    <>
      <PageHeader
        title={t("page.recognition.title")}
        description={t("page.recognition.desc", { board: site.board })}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.recognition.crumb") },
        ]}
      />
      <Section size="md" reveal>
        {(isFallback || hasDemo) && (
          <p className="mb-5">
            <SampleBadge label={t(isFallback ? "common.sampleContent" : "common.demoContent")} />
          </p>
        )}
        <ul className="grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,17.5rem),1fr))]">
          {cards.map((card) => {
            const rows = [
              [t("page.recognition.authority"), card.authority],
              [t("page.recognition.memo"), card.memo],
              [t("page.recognition.issueDate"), card.issueDate],
              [t("page.recognition.expiryDate"), card.expiryDate],
            ];
            return (
              <li key={card.id}>
                <ContentCard className="h-full p-6 hover:border-green">
                  <div className="mb-3.5 flex items-start justify-between gap-2.5">
                    <span className="rounded-pill bg-surface px-2.5 py-1 font-heading text-micro font-bold text-green">
                      {card.category}
                    </span>
                    <span className="text-xs font-semibold text-ink-soft">
                      {card.level}
                    </span>
                  </div>
                  <h2 className="mb-3.5 font-heading text-body font-bold text-ink">
                    {card.title}
                  </h2>
                  <dl className="flex flex-col gap-2 text-small text-ink-soft">
                    {rows.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex justify-between gap-2.5 border-t border-line pt-2"
                      >
                        <dt>{label}</dt>
                        <dd className="text-right font-semibold text-ink">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {card.documentUrl ? (
                    <a
                      href={card.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-10 items-center rounded-pill bg-green px-4 text-xs font-semibold text-white transition-colors duration-200 hover:bg-green-dark"
                    >
                      {t("page.viewDocument")}
                    </a>
                  ) : (
                    <span className="mt-4 inline-block rounded-pill bg-surface px-3.5 py-2 text-xs font-semibold text-ink-soft">
                      {t("page.recognition.docNotPublished")}
                    </span>
                  )}
                </ContentCard>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
