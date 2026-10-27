import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

/**
 * Centres content at one of the design's max widths and applies the fluid side
 * gutter (24px → 18 → 16 → 14 as the viewport narrows, defined by --gutter).
 */
const WIDTH = {
  /** 1240px — the primary content width. */
  site: "max-w-site",
  /** 1180px — finder and FAQ blocks. */
  wide: "max-w-wide",
  /** 1160px — curriculum and video blocks. */
  mid: "max-w-mid",
  /** 1000px — narrow text/portrait blocks. */
  narrow: "max-w-narrow",
} as const;

export type ContainerSize = keyof typeof WIDTH;

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: ContainerSize;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "size">;

export function Container<T extends ElementType = "div">({
  as,
  size = "site",
  className,
  ...props
}: ContainerProps<T>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag
      className={cn("mx-auto w-full px-gutter", WIDTH[size], className)}
      {...props}
    />
  );
}
