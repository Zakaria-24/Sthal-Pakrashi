import { InfoCard } from "@/components/ui/info-card";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { isRealValue } from "@/lib/format";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.mpo.title");

/**
 * MPO Information — status, MPO code and EIIN from the CMS settings. The
 * status is the CMS `mpoStatus`; while it is unset, a published MPO code
 * implies "Enlisted".
 */
export default async function MpoPage() {
  const { t, settings, site } = await getPageContext();
  const listed = isRealValue(settings.mpoCode);
  const notPublished = t("page.notPublished");
  const status = settings.mpoStatus || (listed ? "enlisted" : "");
  const statusLabel =
    status === "enlisted"
      ? t("page.mpo.enlisted")
      : status === "pending"
        ? t("page.mpo.pending")
        : status === "not-enlisted"
          ? t("page.mpo.notEnlisted")
          : notPublished;

  return (
    <>
      <PageHeader
        title={t("page.mpo.title")}
        description={t("page.mpo.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.mpo.crumb") },
        ]}
      />
      <Section size="md" reveal>
        <ul className="grid gap-4.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,12.5rem),1fr))]">
          <li>
            <InfoCard
              variant="tile"
              label={t("page.mpo.status")}
              value={statusLabel}
              muted={!status}
              className="h-full p-6"
            />
          </li>
          <li>
            <InfoCard
              variant="tile"
              label={t("page.mpo.code")}
              value={listed ? site.mpo : notPublished}
              muted={!listed}
              className="h-full p-6"
            />
          </li>
          <li>
            <InfoCard
              variant="tile"
              label={t("page.mpo.eiin")}
              value={isRealValue(settings.eiin) ? site.eiin : notPublished}
              muted={!isRealValue(settings.eiin)}
              className="h-full p-6"
            />
          </li>
        </ul>
        <p className="mt-5.5 max-w-xl text-body-sm text-ink-soft">
          {t("page.mpo.more")}
        </p>
      </Section>
    </>
  );
}
