"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Accordion, type AccordionItem } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  FacebookIcon,
  YoutubeIcon,
} from "@/components/ui/icons";
import { DialogCloseButton, Drawer } from "@/components/ui/modal";
import { BrandLockup } from "@/components/layout/brand-lockup";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import type { SiteChrome } from "@/components/layout/site-chrome";
import { useI18n } from "@/lib/i18n/provider";
import { NAV, admissionCta, isCurrentPath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Off-canvas menu for <1280px: a green header with the brand and a close
 * button, Home and the accordion groups, then the items that no longer fit in
 * the header — address and EIIN, the Apply Now button and the language toggle.
 * Every navigation row is at least 44px tall.
 */
export function MobileNav({
  open,
  onOpenChange,
  chrome,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chrome: SiteChrome;
}) {
  const { t } = useI18n();
  const pathname = usePathname();
  const cta = admissionCta(chrome.admissionOpen);
  const close = () => onOpenChange(false);

  const groups: AccordionItem[] = NAV.flatMap((entry) => {
    if (entry.type !== "group") return [];
    const groupActive = entry.items.some((item) =>
      isCurrentPath(pathname, item.href),
    );
    return [
      {
        id: entry.id,
        header: (
          <>
            <span className={cn(groupActive && "text-green")}>
              {t(entry.labelKey)}
            </span>
            <ChevronDownIcon className="size-4 transition-transform duration-200 group-aria-expanded/acc:rotate-180" />
          </>
        ),
        content: (
          <ul className="pt-1 pb-2">
            {entry.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={
                    isCurrentPath(pathname, item.href) ? "page" : undefined
                  }
                  className="flex min-h-11 items-center px-3 text-body-sm font-semibold text-ink-soft transition-colors duration-150 hover:text-green aria-[current=page]:text-green"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        ),
      },
    ];
  });

  const homeActive = pathname === "/";

  return (
    // <Drawer
    //   open={open}
    //   onOpenChange={onOpenChange}
    //   title={t("menu.title")}
    //   description={t("a11y.mobileNav")}
    // >
    //   <div className="flex shrink-0 items-center justify-between gap-2.5 bg-green px-4.5 py-4">
    //     <BrandLockup
    //       size="sm"
    //       name={t("brand.name")}
    //       sub={t("brand.sub", { year: chrome.year })}
    //       logoUrl={chrome.logoUrl}
    //       logoAlt={t("brand.logoAlt")}
    //     />
    //     <DialogCloseButton
    //       label={t("menu.close")}
    //       className="size-11 bg-white/15 text-white hover:bg-white/30"
    //     />
    //   </div>

    //   <nav aria-label={t("a11y.mobileNav")} className="px-5 pt-1.5 pb-8">
    //     <Link
    //       href="/"
    //       onClick={close}
    //       aria-current={homeActive ? "page" : undefined}
    //       className={cn(
    //         "flex min-h-12 items-center border-b border-line font-heading text-ui font-bold",
    //         homeActive ? "text-green" : "text-ink",
    //       )}
    //     >
    //       {t("nav.home")}
    //     </Link>
    //     <Accordion
    //       type="multiple"
    //       items={groups}
    //       itemClassName="border-b border-line"
    //       headerClassName="group/acc min-h-12 font-heading text-ui font-bold text-ink"
    //     />
    //   </nav>

    //   <div className="flex shrink-0 flex-col items-start gap-5 px-5 pt-3 pb-8">
    //     <ul className="flex flex-col items-start gap-2 text-body-sm text-ink">
    //       <li className="flex items-center gap-2.5 font-medium">
    //         <PinIcon className="size-4 shrink-0 text-ink-soft" />
    //         {chrome.address}
    //       </li>
    //       <li className="flex items-center gap-2.5 rounded-lg bg-utility py-1.5 pr-3 font-medium">
    //         <IdCardIcon className="size-4 shrink-0 text-ink-soft" />
    //         {t("top.eiin", { eiin: chrome.eiin })}
    //       </li>
    //     </ul>

    //     <Link
    //       href={APPLY_HREF}
    //       onClick={close}
    //       className={cn(
    //         buttonVariants({ variant: "gold", size: "lg" }),
    //         "min-h-11.5 w-full rounded-xl",
    //       )}
    //     >
    //       {t("cta.apply")}
    //       <ArrowUpRightIcon />
    //     </Link>

    //     <div className="flex items-center gap-3">
    //       <LanguageSwitcher size="lg" />
    //       {chrome.facebookUrl && (
    //         <a
    //           href={chrome.facebookUrl}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           aria-label={t("top.facebook")}
    //           className="flex size-10 items-center justify-center rounded-full text-ink-soft transition-colors duration-150 hover:bg-gold/35 hover:text-on-gold"
    //         >
    //           <FacebookIcon className="size-4" />
    //         </a>
    //       )}
    //       {chrome.youtubeUrl && (
    //         <a
    //           href={chrome.youtubeUrl}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           aria-label={t("top.youtube")}
    //           className="flex size-10 items-center justify-center rounded-full text-ink-soft transition-colors duration-150 hover:bg-gold/35 hover:text-on-gold"
    //         >
    //           <YoutubeIcon className="size-4.5" />
    //         </a>
    //       )}
    //     </div>
    //   </div>
    // </Drawer>
    <Drawer
  open={open}
  onOpenChange={onOpenChange}
  title={t("menu.title")}
  description={t("a11y.mobileNav")}
>
  {/* Drawer Header */}
  <div className="flex shrink-0 items-center justify-between gap-2.5 bg-green px-4.5 py-4">
    <BrandLockup
      size="sm"
      name={t("brand.name")}
      sub={t("brand.sub", { year: chrome.year })}
      logoUrl={chrome.logoUrl}
      logoAlt={t("brand.logoAlt")}
    />

    <DialogCloseButton
      label={t("menu.close")}
      className="size-11 bg-white/15 text-white hover:bg-white/30"
    />
  </div>

  {/* Drawer Body */}
  <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
    {/* Navigation */}
    <nav
      aria-label={t("a11y.mobileNav")}
      className="px-5 pt-1.5 pb-6"
    >
      <Link
        href="/"
        onClick={close}
        aria-current={homeActive ? "page" : undefined}
        className={cn(
          "flex min-h-12 items-center border-b border-line font-heading text-ui font-bold",
          homeActive ? "text-green" : "text-ink",
        )}
      >
        {t("nav.home")}
      </Link>

      <Accordion
        type="multiple"
        items={groups}
        itemClassName="border-b border-line"
        headerClassName="group/acc min-h-12 font-heading text-ui font-bold text-ink"
      />
    </nav>

    {/* Drawer Footer - Always pushed to bottom */}
    <div className="mt-auto shrink-0 border-t border-line bg-white px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      {/* Announcement / Institution Info */}
      {/* <ul className="mb-5 flex flex-col gap-2 text-body-sm text-ink">
        <li className="flex items-center gap-2.5 font-medium">
          <PinIcon className="size-4 shrink-0 text-ink-soft" />
          <span>{chrome.address}</span>
        </li>

        <li className="flex w-fit items-center gap-2.5 rounded-lg bg-utility py-1.5 pr-3 font-medium">
          <IdCardIcon className="size-4 shrink-0 text-ink-soft" />
          <span>{t("top.eiin", { eiin: chrome.eiin })}</span>
        </li>
      </ul> */}

      {/* Apply Now */}
      <Link
        href={cta.href}
        onClick={close}
        className={cn(
          buttonVariants({ variant: "gold", size: "lg" }),
          "mb-4 min-h-11.5 w-full rounded-xl",
        )}
      >
        {t(cta.labelKey)}
        <ArrowUpRightIcon />
      </Link>

      {/* Language + Social */}
<div className="flex items-center justify-between gap-3">
  <LanguageSwitcher size="lg" />

  <div className="flex items-center gap-1">
    {/* Facebook */}
    <a
      href={chrome.facebookUrl || "https://www.facebook.com/"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("top.facebook")}
      className={cn(
        "group flex size-10 items-center justify-center rounded-full",
        "text-ink-soft",
        "transition-all duration-200 ease-out",
        "hover:bg-gold hover:text-on-gold",
        "hover:-translate-y-0.5 hover:shadow-md",
        "active:translate-y-0 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2",
      )}
    >
      <FacebookIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
    </a>

    {/* YouTube */}
    <a
      href={chrome.youtubeUrl || "https://www.youtube.com/"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("top.youtube")}
      className={cn(
        "group flex size-10 items-center justify-center rounded-full",
        "text-ink-soft",
        "transition-all duration-200 ease-out",
        "hover:bg-gold hover:text-on-gold",
        "hover:-translate-y-0.5 hover:shadow-md",
        "active:translate-y-0 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2",
      )}
    >
      <YoutubeIcon className="size-4.5 transition-transform duration-200 group-hover:scale-110" />
    </a>
  </div>
</div>
    </div>
  </div>
</Drawer>
  );
}
