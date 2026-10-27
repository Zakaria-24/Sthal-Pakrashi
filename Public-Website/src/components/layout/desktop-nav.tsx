"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Dropdown, DROPDOWN_ITEM } from "@/components/ui/dropdown";
import { useI18n } from "@/lib/i18n/provider";
import { NAV, isCurrentPath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Desktop (≥1280px) navigation, rendered from the NAV data. Groups open on
 * hover or keyboard, one at a time. Under 1440px the type and gaps tighten;
 * the row never wraps (narrower screens use the drawer instead).
 */
export function DesktopNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);

  // Navigating dismisses any open menu (adjust state during render — no effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenId(null);
  }

  function setOpen(id: string, open: boolean) {
    setOpenId((current) => (open ? id : current === id ? null : current));
  }

  return (
    <nav
      aria-label={t("a11y.primaryNav")}
      className="hidden min-w-0 flex-nowrap items-center gap-x-0.5 wide:gap-x-1.5 desk:flex"
    >
      {NAV.map((entry) => {
        if (entry.type === "link") {
          const active = isCurrentPath(pathname, entry.href);
          return (
            <Link
              key={entry.id}
              href={entry.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-block rounded-md px-1 py-2 text-nav-sm font-semibold whitespace-nowrap transition-[color,transform] duration-200 hover:text-gold-dark wide:text-nav motion-safe:hover:-translate-y-0.75",
                active ? "font-bold text-green" : "text-ink",
              )}
            >
              {t(entry.labelKey)}
            </Link>
          );
        }

        const groupActive = entry.items.some((item) =>
          isCurrentPath(pathname, item.href),
        );
        return (
          <Dropdown
            key={entry.id}
            label={t(entry.labelKey)}
            active={groupActive}
            open={openId === entry.id}
            onOpenChange={(open) => setOpen(entry.id, open)}
          >
            {entry.items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={DROPDOWN_ITEM}
                onClick={() => setOpenId(null)}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </Dropdown>
        );
      })}
    </nav>
  );
}
