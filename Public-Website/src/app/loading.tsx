import { LoadingState } from "@/components/ui/states";
import { getI18n } from "@/lib/i18n/server";

/** Shown while a page's CMS reads are in flight. */
export default async function Loading() {
  const { t } = await getI18n();
  return <LoadingState label={t("common.loading")} className="min-h-[50dvh]" />;
}
