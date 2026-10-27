import { getFounders } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { PortraitBand } from "@/components/ui/portrait-band";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.founder.title");

/**
 * Founder page. The bundled sample founder belongs to another school, so while
 * the CMS has no real founder the page shows the design's placeholder.
 */
export default async function FounderPage() {
  const [{ t, site }, { data: founders, isFallback }] = await Promise.all([
    getPageContext(),
    getFounders(),
  ]);
  const founder = isFallback ? null : founders[0];
  const notPublished = t("page.notPublished");

  return (
    <>
      <PageHeader
        title={t("page.founder.title")}
        description={t("page.founder.desc", { name: site.name })}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.founder.crumb") },
        ]}
      />

      <PortraitBand
        label={t("page.founder.label")}
        name={founder?.name || t("page.founder.placeholderName")}
        role={founder?.designation || t("page.founder.label")}
        photoUrl={founder?.photoUrl}
      >
        <p className="mt-1.5 text-small text-on-green-muted">
          {t("page.founder.education")}: {founder?.education || notPublished}
        </p>
        {(!founder || founder.isDemo) && (
          <SampleBadge
            label={t(founder ? "common.demoContent" : "common.sampleContent")}
            className="mt-3"
          />
        )}
      </PortraitBand>

      <Section size="md" width="narrow" reveal>
        <p className="mb-3 font-heading text-small font-bold tracking-eyebrow text-gold-dark">
          {t("page.founder.message")}
        </p>
        <blockquote className="text-body-lg leading-loose text-ink-soft italic">
          “
          {founder?.message ||
            t("page.founder.placeholderMessage", { place: site.address })}
          ”
        </blockquote>
      </Section>
    </>
  );
}
