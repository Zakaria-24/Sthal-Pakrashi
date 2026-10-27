import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The three non-happy-path states every data section can be in. They take
 * their text as props so they work from server and client components alike.
 */

export function EmptyState({
  message,
  title,
  action,
  className,
}: {
  message: string;
  title?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-dashed border-line-strong px-6 py-12 text-center",
        className,
      )}
    >
      {title && (
        <p className="mb-1.5 font-heading text-h4 text-ink">{title}</p>
      )}
      <p className="text-body-sm text-ink-soft">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingState({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-16 text-body-sm text-ink-soft",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-8 rounded-full border-2 border-line border-t-green motion-safe:animate-spin"
      />
      {label}
    </div>
  );
}

export function ErrorState({
  title,
  message,
  action,
  className,
}: {
  title: string;
  message: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-card border border-destructive/30 bg-destructive/5 px-6 py-12 text-center",
        className,
      )}
    >
      <p className="mb-1.5 font-heading text-h4 text-ink">{title}</p>
      <p className="text-body-sm text-ink-soft">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
