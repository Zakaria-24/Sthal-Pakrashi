"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  ArrowUpRightIcon,
  FacebookIcon,
  IdCardIcon,
  MenuIcon,
  PinIcon,
  SearchIcon,
  YoutubeIcon,
} from "@/components/ui/icons";
import { IconButton } from "@/components/ui/icon-button";
import { BrandLockup } from "@/components/layout/brand-lockup";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchModal } from "@/components/layout/search-modal";
import type { SiteChrome } from "@/components/layout/site-chrome";
import { useI18n } from "@/lib/i18n/provider";
import { admissionCta } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Sticky header. At ≥1280px: a green brand block to the left of a utility bar
 * (address, EIIN, social, language) and the main row (navigation, search, Apply
 * CTA). Below 1280px only the green bar remains — logo, search and menu
 * buttons — and the utility bar, Apply CTA and language toggle live inside the
 * off-canvas drawer (see MobileNav).
 */
export function SiteHeader({ chrome }: { chrome: SiteChrome }) {
  const { t } = useI18n();
  const cta = admissionCta(chrome.admissionOpen);
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Route changes close overlays (adjust state during render — no effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setDrawerOpen(false);
    setSearchOpen(false);
  }

  // Once the page scrolls, a soft shadow separates the sticky header.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ctrl/⌘ + K opens search from anywhere.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:font-bold focus:text-on-gold"
      >
        {t("a11y.skip")}
      </a>

      <header
        style={{ viewTransitionName: "site-header" }}
        className={cn(
          "sticky top-0 z-40 bg-white transition-shadow duration-300",
          scrolled && "shadow-soft",
        )}
      >
        <div className="flex flex-col desk:flex-row">
          <div className="flex w-full shrink-0 items-center bg-green desk:w-auto">
            <Link
              href="/"
              className="flex min-w-0 flex-1 items-center px-4.5 py-3.5 transition-colors duration-200 hover:bg-green-dark desk:flex-none"
            >
              <BrandLockup
                size="lg"
                name={t("brand.name")}
                sub={t("brand.sub", { year: chrome.year })}
                logoUrl={chrome.logoUrl}
                logoAlt={t("brand.logoAlt")}
              />
            </Link>

            {/* Mobile / tablet: search and menu sit in the green bar. */}
            <div className="flex shrink-0 items-center gap-2 pr-3 sm:gap-3 sm:pr-4 desk:hidden">
              <IconButton
                label={t("search.open")}
                variant="on-green"
                onClick={() => setSearchOpen(true)}
                className="size-11"
              >
                <SearchIcon />
              </IconButton>
              <IconButton
                label={t("menu.open")}
                variant="on-green"
                aria-haspopup="dialog"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
                className="size-11"
              >
                <MenuIcon />
              </IconButton>
            </div>
          </div>

          <div className="hidden w-full min-w-0 flex-col desk:flex">
  {/* Utility / Announcement bar */}
  <div className="flex flex-wrap items-center justify-between gap-x-4.5 gap-y-2 bg-utility px-5 py-1.75 text-xs leading-normal text-ink-soft">
    {/* Institution Info */}
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <li className="flex items-center gap-1.5 font-bold">
        <PinIcon className="size-3" />
        {chrome.address}
      </li>

      <li className="flex items-center gap-1.5 font-bold">
        <IdCardIcon className="size-3" />
        {t("top.eiin", { eiin: chrome.eiin })}
      </li>
    </ul>

    {/* Social + Language */}
    <div className="flex items-center gap-1.5">
      {/* Facebook */}
    <a
      href={chrome.facebookUrl || "https://www.facebook.com/"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("top.facebook")}
      className={cn(
        "group flex size-6 items-center justify-center rounded-full",
        "text-ink-soft",
        "transition-[color,transform] duration-200 ease-out",
        "hover:text-gold-dark",
        "hover:-translate-y-0.5",
        "active:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2",
      )}
    >
      <FacebookIcon className="size-4.5 transition-transform duration-200 group-hover:scale-110" />
    </a>

    {/* YouTube */}
    <a
      href={chrome.youtubeUrl || "https://www.youtube.com/"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("top.youtube")}
      className={cn(
        "group flex size-6 items-center justify-center rounded-full",
        "text-ink-soft",
        "transition-[color,transform] duration-200 ease-out",
        "hover:text-gold-dark",
        "hover:-translate-y-0.5",
        "active:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2",
      )}
    >
      <YoutubeIcon className="size-4.5 transition-transform duration-200 group-hover:scale-110" />
    </a>

      {/* Language */}
      <LanguageSwitcher />
    </div>
  </div>

  {/* Main row */}
  <div className="flex items-center justify-between gap-2.5 border-b border-line bg-white px-4 py-3 wide:px-5">
    <DesktopNav />

    <div className="ml-auto flex shrink-0 items-center gap-2.5">
      {/* Search */}
      <IconButton
        label={t("search.open")}
        onClick={() => setSearchOpen(true)}
        className="size-9 motion-safe:hover:scale-108"
      >
        <SearchIcon />
      </IconButton>

      {/* Apply Now */}
      <Link
        href={cta.href}
        className={cn(
          buttonVariants({ variant: "gold", size: "sm" }),
          "min-h-9.75 px-3.5",
          "hover:bg-gold hover:text-green hover:shadow-cta",
          "motion-safe:hover:-translate-y-0.5",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-green focus-visible:ring-offset-2",
        )}
      >
        {t(cta.labelKey)}
        <ArrowUpRightIcon />
      </Link>
    </div>
  </div>
</div>
        </div>
      </header>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNav open={drawerOpen} onOpenChange={setDrawerOpen} chrome={chrome} />
    </>
  );
}
