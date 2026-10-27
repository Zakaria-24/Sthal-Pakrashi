import "server-only";

import { getSettings } from "@/lib/api";
import type { MessageKey } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { getSiteText } from "@/lib/site-text";

/**
 * What nearly every inner page needs first: the visitor's locale, a bound
 * translator, the CMS settings and the locale-resolved site text.
 */
export async function getPageContext() {
  const [{ locale, t }, { data: settings }] = await Promise.all([
    getI18n(),
    getSettings(),
  ]);
  return { locale, t, settings, site: getSiteText(settings, locale) };
}

/** `generateMetadata` for a page whose title is a static i18n key. */
export function titleMetadata(key: MessageKey) {
  return async () => {
    const { t } = await getI18n();
    return { title: t(key) };
  };
}
