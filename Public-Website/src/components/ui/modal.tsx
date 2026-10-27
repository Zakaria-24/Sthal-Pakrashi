"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { ReactNode, RefObject } from "react";

import { CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Accessible overlay built on base-ui's Dialog: focus is trapped and restored,
 * Escape and outside-click close it, and the page behind stops scrolling.
 * Both surfaces fade/slide in via base-ui's data-starting-style /
 * data-ending-style hooks; the slide is gated behind `motion-safe:` so users
 * who prefer reduced motion get a plain fade.
 */

const BACKDROP =
  "fixed inset-0 z-50 bg-scrim-strong transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0";

type ModalCommon = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible name of the dialog. */
  title: string;
  /** Visually hide the title when the design shows none. */
  hideTitle?: boolean;
  description?: string;
  /** Accessible label of the close button. */
  closeLabel: string;
  children: ReactNode;
  className?: string;
  initialFocus?: RefObject<HTMLElement | null>;
};

const MODAL_WIDTH = {
  sm: "max-w-dialog-sm",
  md: "max-w-dialog-md",
  lg: "max-w-dialog-lg",
} as const;

export function Modal({
  open,
  onOpenChange,
  title,
  hideTitle,
  description,
  closeLabel,
  children,
  className,
  initialFocus,
  width = "sm",
  placement = "center",
  showClose = true,
  bare = false,
}: ModalCommon & {
  width?: keyof typeof MODAL_WIDTH;
  /** "top" anchors the panel near the top (search); "center" centres it. */
  placement?: "center" | "top";
  showClose?: boolean;
  /** Skip the white card chrome — the child supplies its own surface. */
  bare?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={BACKDROP} />
        <Dialog.Viewport
          className={cn(
            "fixed inset-0 z-50 flex justify-center overflow-y-auto p-gutter",
            placement === "top" ? "items-start pt-modal-top" : "items-center",
          )}
        >
          <Dialog.Popup
            initialFocus={initialFocus}
            className={cn(
              "relative w-full outline-none transition-[opacity,transform] duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-safe:data-[starting-style]:translate-y-3 motion-safe:data-[ending-style]:translate-y-3",
              MODAL_WIDTH[width],
              !bare && "overflow-hidden rounded-2xl bg-white shadow-modal",
              className,
            )}
          >
            <Dialog.Title
              className={
                hideTitle
                  ? "sr-only"
                  : "px-6 pt-6 font-heading text-h4 text-ink"
              }
            >
              {title}
            </Dialog.Title>
            {description && (
              <Dialog.Description className="sr-only">
                {description}
              </Dialog.Description>
            )}
            {children}
            {showClose && (
              <Dialog.Close
                aria-label={closeLabel}
                className="absolute top-3.5 right-3.5 z-10 inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-soft transition-colors duration-200 hover:bg-green hover:text-white"
              >
                <CloseIcon />
              </Dialog.Close>
            )}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Off-canvas panel that slides in from the right (mobile navigation). */
export function Drawer({
  open,
  onOpenChange,
  title,
  hideTitle = true,
  description,
  children,
  className,
}: Omit<ModalCommon, "closeLabel" | "initialFocus">) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={cn(BACKDROP, "bg-scrim")} />
        <Dialog.Popup
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-drawer flex-col overflow-y-auto bg-white shadow-drawer outline-none transition-transform duration-300 ease-out data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
            className,
          )}
        >
          <Dialog.Title className={hideTitle ? "sr-only" : undefined}>
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="sr-only">
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Close control for use inside a Drawer / bare Modal (needs Dialog context). */
export function DialogCloseButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Dialog.Close
      aria-label={label}
      className={cn(
        "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200",
        className,
      )}
    >
      <CloseIcon />
    </Dialog.Close>
  );
}
