import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Wraps the type-scale tokens defined in globals.css (text-h1, text-body-lg,
 * ...) so pages stop hand-picking sizes like "text-3xl font-semibold" —
 * every heading and paragraph in the app should go through one of these.
 *
 * Colour is applied here, not in the CSS tokens: headings use text-foreground
 * and the small paragraph size defaults to text-muted-foreground, both of
 * which already track light/dark mode. Override with `className` when a
 * specific instance needs something else (e.g. text-brand on a stat number).
 */

type HeadingProps = ComponentPropsWithoutRef<"h1">;

export function H1({ className, children, ...props }: HeadingProps) {
  return (
    <h1 className={cn("text-h1 text-foreground", className)} {...props}>
      {children}
    </h1>
  );
}

export function H2({ className, children, ...props }: HeadingProps) {
  return (
    <h2 className={cn("text-h2 text-foreground", className)} {...props}>
      {children}
    </h2>
  );
}

export function H3({ className, children, ...props }: HeadingProps) {
  return (
    <h3 className={cn("text-h3 text-foreground", className)} {...props}>
      {children}
    </h3>
  );
}

type TextSize = "lg" | "base" | "sm";

const TEXT_SIZE_CLASS: Record<TextSize, string> = {
  lg: "text-body-lg text-foreground",
  base: "text-body text-foreground",
  sm: "text-body-sm text-muted-foreground",
};

export function Text({
  size = "base",
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"p"> & { size?: TextSize; children?: ReactNode }) {
  return (
    <p className={cn(TEXT_SIZE_CLASS[size], className)} {...props}>
      {children}
    </p>
  );
}
