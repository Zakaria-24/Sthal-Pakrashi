import { InfoCard } from "@/components/ui/info-card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { isRealValue } from "@/lib/format";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.contact.title");

/**
 * Contact. Identity facts come from settings; the office card shows phone,
 * email and hours once the CMS has them, otherwise the design's "will be
 * published" note. The map is the CMS embed when set, else the design's
 * striped placeholder.
 */
export default async function ContactPage() {
  const { t, settings, site } = await getPageContext();

  const office = [
    [t("page.contact.phone"), settings.phone],
    [t("page.field.mobile"), settings.mobile],
    [t("page.contact.email"), settings.email],
    [t("page.contact.officeHours"), settings.officeHours],
  ].filter(([, value]) => isRealValue(value));

  return (
    <>
      <PageHeader
        title={t("page.contact.title")}
        description={t("page.contact.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.contact.crumb") },
        ]}
      />

      <Section
        reveal
        contentClassName="grid gap-10 lg:grid-cols-2"
      >
        <div className="flex flex-col gap-4.5">
          <InfoCard label={t("page.contact.name")} value={site.name} />
          <InfoCard label={t("page.contact.address")} value={site.address} />
          <div className="grid gap-4.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,9.375rem),1fr))]">
            <InfoCard
              label={t("page.contact.eiin")}
              value={isRealValue(settings.eiin) ? site.eiin : t("page.notPublished")}
              muted={!isRealValue(settings.eiin)}
            />
            <InfoCard
              label={t("page.contact.mpo")}
              value={isRealValue(settings.mpoCode) ? site.mpo : t("page.notPublished")}
              muted={!isRealValue(settings.mpoCode)}
            />
            <InfoCard label={t("page.contact.board")} value={site.board} />
          </div>
          <div className="rounded-card bg-surface p-6">
            <p className="mb-1.5 font-heading text-body-sm font-bold text-green">
              {t("page.contact.office")}
            </p>
            {office.length === 0 ? (
              <p className="text-body-sm text-ink-soft">
                {t("page.contact.officePending")}
              </p>
            ) : (
              <dl className="space-y-1.5 text-body-sm">
                {office.map(([label, value]) => (
                  <div key={label} className="flex flex-wrap gap-x-2">
                    <dt className="text-ink-soft">{label}:</dt>
                    <dd className="font-semibold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        {isRealValue(settings.mapEmbedUrl) ? (
          <iframe
            src={settings.mapEmbedUrl}
            title={t("page.contact.mapTitle")}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="min-h-85 w-full rounded-2xl border-0 bg-surface"
          />
        ) : (
          <div
            role="img"
            aria-label={t("page.contact.mapTitle")}
            className="flex min-h-85 items-center justify-center rounded-2xl bg-[repeating-linear-gradient(135deg,var(--stripe-a),var(--stripe-a)_12px,var(--stripe-b)_12px,var(--stripe-b)_24px)] p-5 text-center font-mono text-small text-stripe-text"
          >
            {t("page.contact.mapPlaceholder", { place: site.address })}
          </div>
        )}
      </Section>
    </>
  );
}
