import { cn } from "@/lib/utils";

/**
 * Marks a block that is showing bundled sample content because the CMS has
 * nothing (or is unreachable) for it. Rendered by callers only when the API
 * layer reports `isFallback`, so it disappears the moment real data exists.
 */
export function SampleBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      data-placeholder="true"
      className={cn(
        "inline-flex items-center rounded-pill border border-dashed border-gold-dark bg-gold-tint px-2.5 py-0.5 text-micro font-semibold text-on-gold-soft",
        className,
      )}
    >
      {label}
    </span>
  );
}
