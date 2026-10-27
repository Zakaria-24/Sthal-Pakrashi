"use client";

import { cn } from "@/lib/utils";

export type ChipOption<T extends string = string> = {
  value: T;
  label: string;
};

/**
 * Pill-shaped filter group (gallery / video / blog categories). Single
 * selection; each chip is a toggle button with aria-pressed and a 40px target.
 */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group. */
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-10 cursor-pointer rounded-pill px-4.5 text-small font-semibold transition-colors duration-200",
              active
                ? "bg-green text-white"
                : "bg-surface text-ink hover:bg-line",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
