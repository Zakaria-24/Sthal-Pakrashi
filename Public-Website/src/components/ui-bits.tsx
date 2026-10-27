/**
 * Legacy import surface. The public pages built before the redesign import
 * these names from here; each now resolves to the shared design-system
 * component, so those pages pick up the new look without being rewritten.
 * New code should import from `@/components/ui/*` directly.
 */
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { formatDateLocalized, type Locale } from "@/lib/i18n";

export { PageHeader } from "@/components/ui/page-header";
export { Section } from "@/components/ui/section";
export { EmptyState } from "@/components/ui/states";

/** Photo slot with an initials tile when the image is missing or broken. */
export function Photo({
  src,
  alt,
  className,
  label,
}: {
  src?: string;
  alt: string;
  className?: string;
  label?: string;
}) {
  return (
    <ImageWithFallback src={src} alt={alt} label={label} className={className} />
  );
}

/**
 * Locale-aware long date. Pages that have not been moved to the i18n layer
 * yet call this without a locale and keep getting English.
 */
export function formatDate(
  value?: string | null,
  locale: Locale = "en",
): string {
  return formatDateLocalized(value, locale);
}
