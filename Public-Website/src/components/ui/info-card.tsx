import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Label-over-value card used for contact / registration facts. `variant="tile"`
 * is the centred stat tile (large green value, small label beneath).
 */
export function InfoCard({
  label,
  value,
  variant = "row",
  muted = false,
  className,
}: {
  label: string;
  value: ReactNode;
  variant?: "row" | "tile";
  /** Dims the value — used for "Not published" placeholders. */
  muted?: boolean;
  className?: string;
}) {
  if (variant === "tile") {
    return (
      <div
        className={cn(
          "rounded-card bg-surface p-5.5 text-center",
          className,
        )}
      >
        <p
          className={cn(
            "font-heading text-h4 font-extrabold text-green",
            muted && "text-ink-soft",
          )}
        >
          {value}
        </p>
        <p className="mt-1 text-small font-semibold text-ink-soft">{label}</p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-card bg-surface p-6", className)}>
      <p className="mb-1.5 font-heading text-body-sm font-bold text-green">
        {label}
      </p>
      <p className={cn("text-ui text-ink", muted && "text-ink-soft")}>{value}</p>
    </div>
  );
}
