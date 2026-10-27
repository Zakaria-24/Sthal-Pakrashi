import { fallbackSettings } from "@/lib/fallback-data";
import {
  localizeDigits,
  resolveText,
  type LocalizedText,
  type Locale,
} from "@/lib/i18n";
import type { SiteSettings } from "@/lib/types";

/**
 * DATA GAP — bilingual identity text.
 *
 * The CMS stores one language per settings field. The finalized design shows
 * Bengali versions of the school name, address and type, and an education
 * board that has no settings field at all. Those Bengali values live here and
 * are used ONLY while the CMS value is still the bundled default — the moment
 * the CMS holds its own value, that value is shown as-is in both languages.
 * Remove this file's overrides once the Dashboard stores bilingual fields.
 */
const DESIGN_DEFAULTS_BN = {
  siteName: "স্থল পাকড়াশী ইন্সটিটিউশন স্কুল ও কলেজ",
  about:
    "স্থল পাকড়াশী ইন্সটিটিউশন স্কুল ও কলেজ ১৮৬৪ সাল থেকে রূপসী, শাহজাদপুর অঞ্চলের সেবা করে আসছে এবং রাজশাহী শিক্ষা বোর্ডের অধীনে উচ্চ মাধ্যমিক পর্যায় পর্যন্ত শিক্ষা প্রদান করছে।",
  address: "রূপসী, শাহজাদপুর, সিরাজগঞ্জ",
  institutionType: "স্কুল ও কলেজ",
} as const;

/** Default shown until the CMS `educationBoard` setting is filled in. */
const EDUCATION_BOARD: { name: LocalizedText; short: LocalizedText } = {
  name: { en: "Rajshahi Education Board", bn: "রাজশাহী শিক্ষা বোর্ড" },
  short: { en: "Rajshahi", bn: "রাজশাহী" },
};

function withDefaultBn(
  value: string,
  fallbackValue: string,
  bnDefault: string,
  locale: Locale,
): string {
  return locale === "bn" && value === fallbackValue ? bnDefault : value;
}

export type SiteText = {
  name: string;
  about: string;
  address: string;
  type: string;
  year: string;
  eiin: string;
  mpo: string;
  board: string;
  boardShort: string;
  /** Whole years since establishment, rounded down to the decade ("160+"). */
  legacyYears: string | null;
};

/** Settings, resolved for one locale, ready to drop into UI strings. */
export function getSiteText(settings: SiteSettings, locale: Locale): SiteText {
  const year = settings.establishedYear;
  const established = Number(year);
  const legacyYears =
    Number.isFinite(established) && established > 0
      ? `${Math.floor((new Date().getFullYear() - established) / 10) * 10}+`
      : null;

  return {
    about: withDefaultBn(
      settings.about,
      fallbackSettings.about,
      DESIGN_DEFAULTS_BN.about,
      locale,
    ),
    name: withDefaultBn(
      settings.siteName,
      fallbackSettings.siteName,
      DESIGN_DEFAULTS_BN.siteName,
      locale,
    ),
    address: withDefaultBn(
      settings.address,
      fallbackSettings.address,
      DESIGN_DEFAULTS_BN.address,
      locale,
    ),
    type: withDefaultBn(
      settings.institutionType,
      fallbackSettings.institutionType,
      DESIGN_DEFAULTS_BN.institutionType,
      locale,
    ),
    year: localizeDigits(year, locale),
    eiin: localizeDigits(settings.eiin, locale),
    mpo: localizeDigits(settings.mpoCode, locale),
    // The CMS's own education board wins; the design's Rajshahi default only
    // stands in while none has been entered.
    board: settings.educationBoard.trim() || resolveText(EDUCATION_BOARD.name, locale),
    boardShort: settings.educationBoard.trim() || resolveText(EDUCATION_BOARD.short, locale),
    legacyYears: legacyYears ? localizeDigits(legacyYears, locale) : null,
  };
}
