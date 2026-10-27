import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

/**
 * The design's list-page card: rounded, either white with a hairline border or
 * on the surface tint, lifting with a green-tinted shadow on hover.
 */
const TONE = {
  white: "rounded-card border border-line bg-white",
  surface: "rounded-card bg-surface",
} as const;

export function ContentCard({
  tone = "white",
  interactive = true,
  className,
  ...props
}: {
  tone?: keyof typeof TONE;
  /** Adds the hover lift. Turn off for cards that aren't links/buttons. */
  interactive?: boolean;
} & ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(TONE[tone], interactive && "lift-sm", className)}
      {...props}
    />
  );
}
