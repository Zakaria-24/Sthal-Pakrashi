import Link from "next/link";
import type { ReactNode } from "react";

import { getAdmissionInfo, getAdmissionNotices } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { formatDateLocalized, localizeDigits } from "@/lib/i18n";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.admission.title");

const CARD = "rounded-card border border-line bg-white p-6";
const CARD_TITLE = "mb-3 font-heading text-ui font-bold text-green";

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className={CARD}>
      <h2 className={CARD_TITLE}>{title}</h2>
      {children}
    </li>
  );
}

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="flex flex-col gap-2.5">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-3 text-body-sm">
          <dt className="text-ink-soft">{label}</dt>
          <dd className="text-right font-semibold text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Admission Info. Eligibility, process, documents, fees and dates come from the
 * CMS (Dashboard → Admission info). Anything the institution has not published
 * keeps the design's own wording: the design's copy for the first three, and
 * "Not published" / "Announced via notice" for fees and dates.
 * "Relevant Notices" lists notices filed under the "admission" category.
 */
export default async function AdmissionInfoPage() {
  const [{ t, locale, site }, { data: info }, { data: relevant }] =
    await Promise.all([getPageContext(), getAdmissionInfo(), getAdmissionNotices(4)]);

  const steps = [1, 2, 3] as const;
  const docs = [1, 2, 3, 4, 5] as const;
  const notPublished = t("page.notPublished");
  const viaNotice = t("page.viaNotice");

  const eligibility = info.eligibility.length
    ? info.eligibility
    : ([1, 2, 3] as const).map((n) => t(`page.admission.el${n}`, { board: site.board }));
  const processSteps = info.process.length
    ? info.process.map((step) => ({ title: step.title, description: step.description }))
    : steps.map((n) => ({
        title: t(`home.admission.step${n}.title`),
        description: t(`home.admission.step${n}.desc`),
      }));
  const documents = info.requiredDocuments.length
    ? info.requiredDocuments
    : docs.map((n) => t(`page.admission.doc${n}`));
  const feeRows: [string, string][] = info.fees.length
    ? info.fees.map((row) => [row.label, row.amount.trim() || notPublished])
    : [
        [t("page.admission.feeForm"), notPublished],
        [t("page.admission.feeAdmission"), notPublished],
        [t("page.admission.feeTuition"), notPublished],
      ];
  const dateRows: [string, string][] = info.importantDates.length
    ? info.importantDates.map((row) => [row.label, row.value.trim() || viaNotice])
    : [
        [t("page.admission.dateForm"), viaNotice],
        [t("page.admission.dateDeadline"), viaNotice],
        [t("page.admission.dateResult"), viaNotice],
      ];

  return (
    <>
      <PageHeader
        title={t("page.admission.title")}
        description={t("page.admission.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.admission.crumb") },
        ]}
      />

      <Section size="md" reveal>
        <ul className="grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,16.25rem),1fr))]">
          <Card title={t("page.admission.eligibility")}>
            <ul className="list-disc space-y-1 pl-4.5 text-body-sm leading-relaxed text-ink-soft">
              {eligibility.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </Card>

          <Card title={t("page.admission.process")}>
            <ol className="flex flex-col gap-2.5">
              {processSteps.map((step, index) => (
                <li key={step.title} className="flex items-start gap-2.5">
                  <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-surface text-micro font-bold text-green">
                    {localizeDigits(index + 1, locale)}
                  </span>
                  <span className="text-small leading-relaxed text-ink-soft">
                    <b className="text-ink">{step.title}</b>
                    {step.description && <> — {step.description}</>}
                  </span>
                </li>
              ))}
            </ol>
          </Card>

          <Card title={t("page.admission.docs")}>
            <ul className="list-disc space-y-1 pl-4.5 text-body-sm leading-relaxed text-ink-soft">
              {documents.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </Card>

          <Card title={t("page.admission.fees")}>
            <Rows rows={feeRows} />
          </Card>

          <Card title={t("page.admission.dates")}>
            <Rows rows={dateRows} />
          </Card>

          {info.instructions.trim() && (
            <Card title={t("page.admission.instructions")}>
              <p className="text-body-sm leading-relaxed whitespace-pre-line text-ink-soft">
                {info.instructions}
              </p>
            </Card>
          )}

          <Card title={t("page.admission.previous")}>
            <p className="text-body-sm leading-relaxed text-ink-soft">
              {t("page.admission.previousDesc")}
            </p>
            <Link
              href="/students"
              className="mt-3 inline-block text-small font-bold text-green transition-colors duration-150 hover:text-gold-dark"
            >
              {t("page.admission.viewStats")}
            </Link>
          </Card>
        </ul>

        <div className="mt-5.5">
          <h2 className="mb-3.5 font-heading text-ui font-bold text-ink">
            {t("page.admission.relevant")}
          </h2>
          {relevant.length > 0 && (
            <ul className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))]">
              {relevant.map((notice) => (
                <li
                  key={notice._id}
                  className="lift-sm relative rounded-xl border border-line bg-white p-4.5 has-focus-visible:ring-2 has-focus-visible:ring-green"
                >
                  <p className="mb-1.5 text-xs text-ink-soft">
                    {formatDateLocalized(notice.publishedAt, locale)}
                  </p>
                  <Link
                    href={`/notices/${notice._id}`}
                    className="text-body-sm font-bold text-ink outline-none after:absolute after:inset-0"
                  >
                    {notice.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/notices"
            className="mt-3.5 inline-block text-body-sm font-bold text-green transition-colors duration-150 hover:text-gold-dark"
          >
            {t("page.admission.allNotices")}
          </Link>
        </div>
      </Section>
    </>
  );
}
