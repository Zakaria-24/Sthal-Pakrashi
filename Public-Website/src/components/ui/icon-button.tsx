import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Circular icon-only button. `label` is required: an icon alone has no
 * accessible name. 40px minimum target on every variant.
 */
const VARIANT = {
  /** Hairline ring on white; fills green on hover (header search). */
  outline:
    "border-line bg-white text-ink hover:bg-green hover:text-white motion-safe:hover:scale-105",
  /** Tinted square-ish surface (hamburger). */
  soft: "border-transparent bg-surface text-ink hover:bg-line",
  /** Translucent white for use on green. */
  "on-green":
    "border-transparent bg-white/15 text-white hover:bg-white/30",
} as const;

export type IconButtonVariant = keyof typeof VARIANT;

export function IconButton({
  label,
  variant = "outline",
  className,
  children,
  type = "button",
  ...props
}: {
  label: string;
  variant?: IconButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-[background-color,color,transform] duration-200",
        VARIANT[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
