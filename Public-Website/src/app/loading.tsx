import { BrandLoader } from "@/components/ui/brand-loader";
import { getI18n } from "@/lib/i18n/server";

/** Shown under the header while a page's CMS reads are in flight. */
export default async function Loading() {
  const { t } = await getI18n();
  return <BrandLoader label={t("common.loading")} name={t("brand.name")} />;
}
