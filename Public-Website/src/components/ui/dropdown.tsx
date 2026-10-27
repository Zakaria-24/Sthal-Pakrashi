"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Hover-open navigation dropdown. Open state is owned by the parent so only
 * one menu is open at a time. Mouse: opens on enter, closes shortly after
 * leave (the delay stops the panel flickering when the pointer crosses the
 * gap). Keyboard: Enter/Space/ArrowDown opens, ArrowUp/Down moves between
 * items, Escape closes and returns focus to the trigger. The panel stays
 * mounted and animates opacity/translate, so open and close are both smooth.
 */
const CLOSE_DELAY_MS = 140;

export function Dropdown({
  label,
  active,
  open,
  onOpenChange,
  children,
}: {
  label: ReactNode;
  /** Highlights the trigger when a child route is current. */
  active?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Menu items — anchors or buttons; they receive arrow-key navigation. */
  children: ReactNode;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const items = () =>
    Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>("a[href],button") ?? [],
    );

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      onOpenChange(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    if (!open) {
      onOpenChange(true);
      // Wait a frame so the panel is visible and therefore focusable.
      requestAnimationFrame(() => items()[0]?.focus());
      return;
    }
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === "ArrowDown"
        ? list[(index + 1) % list.length]
        : list[(index - 1 + list.length) % list.length];
    next?.focus();
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => {
        clearTimer();
        onOpenChange(true);
      }}
      onMouseLeave={() => {
        clearTimer();
        timer.current = setTimeout(() => onOpenChange(false), CLOSE_DELAY_MS);
      }}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          onOpenChange(false);
        }
      }}
      onKeyDown={onKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={id}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "flex cursor-pointer items-center gap-1 rounded-md px-1 py-2 font-sans text-nav-sm font-semibold whitespace-nowrap transition-[color,transform] duration-200 hover:text-gold-dark wide:text-nav motion-safe:hover:-translate-y-0.75",
          active ? "font-bold text-green" : open ? "text-green" : "text-ink",
        )}
      >
        {label}
        <ChevronDownIcon
          className={cn(
            "size-3 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        ref={panelRef}
        id={id}
        className={cn(
          "absolute top-full left-0 z-50 min-w-52 rounded-xl border border-line bg-white p-1.5 shadow-dropdown transition-[opacity,transform,visibility] duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-2 opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Row style shared by dropdown links. */
export const DROPDOWN_ITEM =
  "block rounded-lg px-3.5 py-2.5 text-body-sm font-semibold text-ink transition-[background-color,color,padding] duration-200 hover:bg-surface hover:pl-5 hover:text-green focus-visible:bg-surface focus-visible:text-green";
