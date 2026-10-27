/**
 * Locale configuration. Pure module — safe to import from server and client.
 *
 * Two kinds of text exist on this site and they are kept apart on purpose:
 *   A. Static UI text (menus, buttons, section headings) → dictionaries in
 *      ./messages, always available in every locale.
 *   B. CMS content (notice titles, teacher names, …) → whatever the Dashboard
 *      API returns. It is resolved through `resolveText` so bilingual CMS
 *      fields can be added later without touching any component.
 */

export const LOCALES = ["en", "bn"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Cookie the language switcher writes and the root layout reads. */
export const LOCALE_COOKIE = "spi-lang";

/** One year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
