import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

/** Small surface-tinted pill (category / audience / level labels). */
export function Tag({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "inline-block rounded-pill bg-surface px-2.5 py-1 font-heading text-micro font-bold text-green",
        className,
      )}
      {...props}
    />
  );
}
