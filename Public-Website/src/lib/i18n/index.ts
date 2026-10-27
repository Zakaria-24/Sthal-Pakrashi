/**
 * Pure i18n helpers — no React, no next/headers, safe on server and client.
 * (Server cookie access lives in ./server, the client provider in ./provider.)
 */
import { DEFAULT_LOCALE, type Locale } from "./config";
import { bn } from "./messages/bn";
import { en, type MessageKey } from "./messages/en";

export { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, isLocale } from "./config";
export type { Locale } from "./config";
export type { MessageKey } from "./messages/en";

const DICTIONARIES: Record<Locale, Record<string, string>> = { en, bn };

export type MessageParams = Record<string, string | number>;

/**
 * Looks up a static UI string.
 *
 * Localized fallback chain: requested locale → English → the key itself, so a
 * missing or blank Bengali value degrades to English rather than to nothing.
 * Numeric params are rendered with the locale's digits (১২৮২৯৯ in Bengali).
 */
export function translate(
  locale: Locale,
  key: MessageKey,
  params?: MessageParams,
): string {
  const raw = DICTIONARIES[locale]?.[key] || DICTIONARIES[DEFAULT_LOCALE][key] || key;
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? localizeDigits(String(params[name]), locale) : match,
  );
}

export type Translator = (key: MessageKey, params?: MessageParams) => string;

export function createTranslator(locale: Locale): Translator {
  return (key, params) => translate(locale, key, params);
}

/* ------------------------------------------------------------ CMS content */

/**
 * A CMS text value. Today the Dashboard only stores plain strings; the object
 * form is the agreed shape for when bilingual fields are added. Components
 * always read CMS text through `resolveText`, so that upgrade happens in the
 * API mapping layer only.
 */
export type LocalizedText = { en: string; bn?: string };

export function resolveText(
  value: string | LocalizedText | null | undefined,
  locale: Locale,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return (locale === "bn" && value.bn) || value.en || "";
}

/* ---------------------------------------------------------------- numerals */

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Swaps ASCII digits for Bengali digits when the locale is Bengali. */
export function localizeDigits(value: string | number, locale: Locale): string {
  const text = String(value);
  if (locale !== "bn") return text;
  return text.replace(/\d/g, (digit) => BENGALI_DIGITS[Number(digit)]);
}

/* -------------------------------------------------------------------- dates */

const DATE_LOCALE: Record<Locale, string> = { en: "en-GB", bn: "bn-BD" };

export function formatDateLocalized(
  value: string | null | undefined,
  locale: Locale,
): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(DATE_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
