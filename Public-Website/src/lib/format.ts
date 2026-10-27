import { localizeDigits, type Locale } from "@/lib/i18n";

/** 2412 → "2,412" (or "২,৪১২" in Bengali). */
export function formatCount(value: number, locale: Locale): string {
  return localizeDigits(new Intl.NumberFormat("en-US").format(value), locale);
}

/** Placeholder dashes ("—", "-") and blanks are not real values. */
export function isRealValue(value: string | null | undefined): value is string {
  return Boolean(value && value.trim() && !/^[—–-]+$/.test(value.trim()));
}
