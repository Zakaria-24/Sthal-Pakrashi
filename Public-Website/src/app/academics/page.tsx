import Link from "next/link";

import { getPrograms } from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";
import { ActivityIcon, BookIcon, FlaskIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { localizeDigits } from "@/lib/i18n";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.programs.title");

const EYEBROW =
  "flex flex-wrap items-center gap-2.5 font-heading text-small font-bold tracking-eyebrow text-gold-dark";

/**
 * Academic Information (the design's "Academic Programs"): the secondary
 * classes, the higher-secondary groups and an admissions call-out. Each list
 * comes from the CMS (Dashboard → Academic Programs); a level the CMS has not
 * filled in shows the design's own copy with a "Sample content" mark.
 */
export default async function AcademicsPage() {
  const [{ t, locale, site }, { data: programs }] = await Promise.all([
    getPageContext(),
    getPrograms(),
  ]);

  const secondary = programs.filter((p) => p.level === "secondary");
  const higher = programs.filter((p) => p.level === "higher-secondary");
  const sampleBadge = <SampleBadge label={t("common.sampleContent")} />;
  const demoBadge = <SampleBadge label={t("common.demoContent")} />;

  const classTiles = secondary.length
    ? secondary.map((p) => ({ key: p._id, label: p.title }))
    : [6, 7, 8, 9, 10].map((n) => ({
        key: String(n),
        label: t("page.programs.class", { n: localizeDigits(n, locale) }),
      }));

  const icons = [
    <FlaskIcon key="f" className="size-5.5" />,
    <BookIcon key="b" className="size-5.5" />,
    <ActivityIcon key="a" className="size-5.5" />,
  ];
  const groupCards = higher.length
    ? higher.map((p, index) => ({
        key: p._id,
        icon: icons[index % icons.length],
        title: p.title,
        description: p.description,
      }))
    : (["science", "humanities", "business"] as const).map((key, index) => ({
        key,
        icon: icons[index],
        title: t(`page.programs.${key}`),
        description: t(`page.programs.${key}Desc`),
      }));

  return (
    <>
      <PageHeader
        title={t("page.programs.title")}
        description={t("page.programs.desc", { board: site.board })}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.programs.crumb") },
        ]}
      />

      <Section reveal contentClassName="space-y-11">
        <div>
          <p className={EYEBROW}>
            {t("page.programs.secondaryTag")}
            {secondary.length === 0 ? sampleBadge : secondary.some((p) => p.isDemo) && demoBadge}
          </p>
          <h2 className="mt-2.5 mb-6 font-heading text-title text-ink">
            {t("page.programs.secondaryTitle")}
          </h2>
          <ul className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(10rem,1fr))]">
            {classTiles.map((tile) => (
              <li
                key={tile.key}
                className="rounded-card bg-surface p-6 text-center"
              >
                <BookIcon className="mx-auto mb-2 size-6 text-green" />
                <p className="font-heading text-stat text-green">{tile.label}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={EYEBROW}>
            {t("page.programs.hsTag")}
            {higher.length === 0 ? sampleBadge : higher.some((p) => p.isDemo) && demoBadge}
          </p>
          <h2 className="mt-2.5 mb-6 font-heading text-title text-ink">
            {t("page.programs.hsTitle")}
          </h2>
          <ul className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(16.25rem,1fr))]">
            {groupCards.map((group) => (
              <li
                key={group.key}
                className="rounded-card border border-line bg-white p-7"
              >
                <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-surface text-green">
                  {group.icon}
                </span>
                <h3 className="mb-2 font-heading text-h3 text-ink">
                  {group.title}
                </h3>
                {group.description && (
                  <p className="text-body-sm text-ink-soft">
                    {group.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section size="none" reveal className="pb-16 md:pb-section-sm">
        <div className="rounded-card-lg bg-surface p-8 text-center md:p-10">
          <h3 className="mb-2.5 font-heading text-h3 font-extrabold text-ink">
            {t("page.programs.ctaTitle")}
          </h3>
          <p className="mb-5 text-body-sm text-ink-soft">
            {t("page.programs.ctaDesc")}
          </p>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            {t("page.programs.ctaButton")}
          </Link>
        </div>
      </Section>
    </>
  );
}
