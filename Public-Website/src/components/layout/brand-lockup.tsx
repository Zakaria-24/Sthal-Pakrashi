import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { cn } from "@/lib/utils";

/** The design's school mark — used whenever the CMS has no logo (or it fails). */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("size-9 shrink-0", className)}
    >
      <path d="M12 2 22 7v3H2V7Z" className="fill-gold" />
      <path d="M4 11h16v9H4Z" className="fill-white/15" />
      <path d="M4 11h16v9H4Z" className="stroke-white" strokeWidth={1.4} />
      <path d="M9 20v-5h6v5" className="stroke-gold" strokeWidth={1.4} />
    </svg>
  );
}

/**
 * Logo + two-line school name, sized for the header, drawer or footer.
 * Purely presentational: strings arrive already translated, so it works from
 * both server (footer) and client (header) components.
 */
export function BrandLockup({
  name,
  sub,
  logoUrl,
  logoAlt,
  size = "md",
  className,
}: {
  name: string;
  sub?: string;
  logoUrl?: string;
  logoAlt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const mark =
    size === "sm" ? "size-8.5" : size === "lg" ? "size-9.5" : "size-9";
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      {logoUrl ? (
        <ImageWithFallback
          src={logoUrl}
          alt={logoAlt}
          className={cn(mark, "shrink-0 object-contain")}
          fallback={<BrandMark className={mark} />}
        />
      ) : (
        <BrandMark className={mark} />
      )}
      <span className="flex min-w-0 flex-col leading-tight">
        <span
          className={cn(
            "font-heading font-extrabold text-white",
            size === "sm" ? "text-small" : "text-ui",
            // Keeps the header name to two lines on the narrowest phones.
            size === "lg" && "max-[22.5rem]:text-small",
            size === "lg" && "desk:whitespace-nowrap",
          )}
        >
          {name}
        </span>
        {sub && (
          <span className="text-nano font-semibold tracking-wider whitespace-nowrap text-on-green-muted">
            {sub}
          </span>
        )}
      </span>
    </span>
  );
}
