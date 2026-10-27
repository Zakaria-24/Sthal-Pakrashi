"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
  type ReactNode,
} from "react";

import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from "./config";
import { createTranslator, type Translator } from "./index";

type I18nContextValue = {
  locale: Locale;
  t: Translator;
  /** Persists the choice in a cookie and re-renders server components. */
  setLocale: (next: Locale) => void;
  /** True while the server is re-rendering after a language change. */
  isSwitching: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isSwitching, startTransition] = useTransition();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      // The root layout reads this cookie on the server, so a refresh is all
      // it takes for every server component — and <html lang> — to follow.
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
      startTransition(() => router.refresh());
    },
    [locale, router],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: createTranslator(locale), setLocale, isSwitching }),
    [locale, setLocale, isSwitching],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside <I18nProvider>");
  return context;
}
