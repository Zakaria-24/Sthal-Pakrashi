import type { ReactNode } from "react";

import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";

/**
 * A figure with a label and an icon, as used in the admission stat row.
 * `tone` swaps between the solid green and the white outlined treatments.
 */
const TONE = {
  green: {
    card: "border-line-strong bg-green text-white hover:border-gold-dark",
    value: "text-white",
    label: "text-on-green-soft",
    icon: "text-gold",
  },
  light: {
    card: "border-line-strong bg-white text-ink hover:border-green",
    value: "text-ink",
    label: "text-ink-soft",
    icon: "text-green",
  },
} as const;

export function StatCard({
  value,
  label,
  icon,
  tone = "light",
  className,
}: {
  value: string;
  label: string;
  icon?: ReactNode;
  tone?: keyof typeof TONE;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3.5 rounded-sm border p-5.5 transition-[transform,border-color] duration-200 motion-safe:hover:-translate-y-1",
        t.card,
        className,
      )}
    >
      {icon && (
        <span className={cn("flex size-11 shrink-0 items-center justify-center", t.icon)}>
          {icon}
        </span>
      )}
      <div>
        <div className={cn("font-heading text-stat leading-normal tabular-nums", t.value)}>
          <CountUp value={value} />
        </div>
        <div className={cn("text-nav-sm leading-normal font-semibold", t.label)}>{label}</div>
      </div>
    </div>
  );
}
