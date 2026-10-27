import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali, Poppins } from "next/font/google";
import { Suspense, ViewTransition } from "react";
import "./globals.css";

import { getSettings } from "@/lib/api";
import { getPreset, presetToCss } from "@/lib/theme-presets";
import type { Locale } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/provider";
import { BrandLoader } from "@/components/ui/brand-loader";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSiteText } from "@/lib/site-text";

/*
 * Type system from the finalized design: Inter for body, Poppins for headings,
 * Noto Sans Bengali for Bengali glyphs (neither Inter nor Poppins has them).
 * The CSS variable names are consumed by the --font-* tokens in globals.css.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/** Title and description follow the CMS, so rebranding needs no code change. */
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSettings();
  return {
    title: {
      default: settings.tagline
        ? `${settings.siteName} — ${settings.tagline}`
        : settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.about.slice(0, 160),
    ...(settings.faviconUrl ? { icons: { icon: settings.faviconUrl } } : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, t } = await getI18n();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${poppins.variable} ${notoSansBengali.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <I18nProvider locale={locale}>
          {/*
            Header and footer need the CMS settings. Behind this boundary the
            document shell streams at once, so a slow or cold CMS shows the
            brand loader instead of a blank page.
          */}
          <Suspense
            fallback={<BrandLoader fullscreen label={t("common.loading")} name={t("brand.name")} />}
          >
            <SiteChrome locale={locale}>{children}</SiteChrome>
          </Suspense>
        </I18nProvider>
      </body>
    </html>
  );
}

/** Theme override, header, page and footer: everything that reads settings. */
async function SiteChrome({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const { data: settings } = await getSettings();
  const site = getSiteText(settings, locale);

  /*
   * A school picks its focus colour from 10 presets in the dashboard
   * (Settings.themeColor); primaryColor is the older raw-CSS escape hatch,
   * kept for a shade the presets don't cover. When getSettings() itself
   * falls back to bundled placeholder data (API down, or fetch failed) both
   * fields come back "" here, so nothing renders and the design-palette
   * values in the BRAND block of globals.css are what the page uses.
   *
   * NOTE (Phase 2): the redesigned components read the fixed design palette
   * (--green / --gold), so this override only recolours the legacy --brand*
   * consumers. See DATA_GAPS.md.
   */
  const themeCss = settings.primaryColor
    ? `:root{--brand:${settings.primaryColor};}`
    : settings.themeColor
      ? presetToCss(getPreset(settings.themeColor))
      : null;

  return (
    <>
      {/*
        Same id the client-side theme picker in the Dashboard writes to
        (theme-presets.ts) — kept in sync so any future client-side use on
        this site updates the same tag rather than creating a duplicate.
      */}
      {themeCss && (
        <style
          id="theme-preset-override"
          dangerouslySetInnerHTML={{ __html: themeCss }}
        />
      )}
      <SiteHeader
        chrome={{
          logoUrl: settings.logoUrl,
          address: site.address,
          eiin: site.eiin,
          year: site.year,
          admissionOpen: settings.admissionOpen,
          facebookUrl: settings.socialLinks.facebook,
          youtubeUrl: settings.socialLinks.youtube,
        }}
      />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {/* Route changes fade/rise the page content (see globals.css). */}
        <ViewTransition default="page">{children}</ViewTransition>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
