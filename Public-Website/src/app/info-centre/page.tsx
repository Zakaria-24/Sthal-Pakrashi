import { FactList } from "@/components/pages/fact-list";
import { PageHeader } from "@/components/ui/page-header";
import { isRealValue } from "@/lib/format";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.infoCentre.title");

/** Information Service Centre — every card reads "Not published" until filled in. */
export default async function InfoCentrePage() {
  const { t, settings, site } = await getPageContext();
  const centre = settings.infoCentre ?? {};
  const notPublished = t("page.notPublished");
  const pick = (value: string | undefined) =>
    isRealValue(value) ? { value: value as string } : { value: notPublished, missing: true };

  return (
    <>
      <PageHeader
        title={t("page.infoCentre.title")}
        description={t("page.infoCentre.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.infoCentre.crumb") },
        ]}
      />
      <FactList
        facts={[
          { label: t("page.field.address"), value: isRealValue(centre.address) ? centre.address : site.address },
          { label: t("page.field.mobile"), ...pick(centre.mobile) },
          { label: t("page.field.phone"), ...pick(centre.phone) },
          { label: t("page.field.email"), ...pick(centre.email) },
        ]}
      />
    </>
  );
}
