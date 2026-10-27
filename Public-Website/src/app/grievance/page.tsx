import { FactList } from "@/components/pages/fact-list";
import { PageHeader } from "@/components/ui/page-header";
import { isRealValue } from "@/lib/format";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.grievance.title");

/**
 * Grievance Redress Officer. The office address falls back to the
 * institution's own address until the officer's is entered; phone and mobile
 * each read "Not published" until filled in.
 */
export default async function GrievancePage() {
  const { t, settings, site } = await getPageContext();
  const officer = settings.grievanceOfficer ?? {};
  const notPublished = t("page.notPublished");
  const pick = (value: string | undefined) =>
    isRealValue(value) ? { value: value as string } : { value: notPublished, missing: true };

  return (
    <>
      <PageHeader
        title={t("page.grievance.title")}
        description={t("page.grievance.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.grievance.crumb") },
        ]}
      />
      <FactList
        facts={[
          { label: t("page.field.name"), ...pick(officer.name) },
          {
            label: t("page.field.designation"),
            value: isRealValue(officer.designation)
              ? officer.designation
              : t("page.grievance.title"),
          },
          {
            label: t("page.field.officeAddress"),
            value: isRealValue(officer.address) ? (officer.address as string) : site.address,
          },
          {
            label: t("page.field.phoneMobile"),
            value: `${isRealValue(officer.phone) ? officer.phone : notPublished} / ${isRealValue(officer.mobile) ? officer.mobile : notPublished}`,
            missing: !isRealValue(officer.phone) && !isRealValue(officer.mobile),
          },
          { label: t("page.field.email"), ...pick(officer.email) },
        ]}
      />
    </>
  );
}
