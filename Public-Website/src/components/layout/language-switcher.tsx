"use client";

import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * EN / বাং toggle. Choosing a language writes the locale cookie and re-renders
 * the server components (see I18nProvider), so both static UI text and the
 * document's lang attribute switch together. The Bengali label is set in the
 * Bengali face explicitly — it must never fall back to Poppins/Inter.
 */
export function LanguageSwitcher({
  size = "sm",
  className,
}: {
  size?: "sm" | "lg";
  className?: string;
}) {
  const { locale, t, setLocale, isSwitching } = useI18n();

  const options: { value: Locale; label: string; aria: string }[] = [
    { value: "en", label: t("lang.en"), aria: t("lang.switchToEn") },
    {
      value: "bn",
      label: t(size === "lg" ? "lang.bnFull" : "lang.bn"),
      aria: t("lang.switchToBn"),
    },
  ];

  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      aria-busy={isSwitching}
      className={cn("flex gap-0.5 rounded-pill bg-pill p-0.5", className)}
    >
      {options.map((option) => {
        const active = locale === option.value;
        return (
          <button
            key={option.value}
            type="button"
            lang={option.value}
            aria-pressed={active}
            aria-label={option.aria}
            onClick={() => setLocale(option.value)}
            className={cn(
              "cursor-pointer rounded-pill font-bold transition-colors duration-150",
              size === "lg"
                ? "min-h-10 min-w-12 px-4 text-small"
                : "px-3 py-1.25 text-micro leading-normal",
              option.value === "bn" && "font-bengali",
              active
                ? "bg-gold text-on-gold"
                : "text-ink-soft hover:bg-gold/35 hover:text-on-gold",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
