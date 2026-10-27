"use client";

import { useState, type ImgHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Every CMS image slot goes through here. Photos are optional in the CMS and
 * remote URLs can 404, so a missing or broken image degrades to a tinted tile
 * (with the subject's initials or a label) instead of a broken-image icon.
 *
 * Plain <img> rather than next/image on purpose: CMS image hosts are not known
 * at build time, so there is no remotePatterns list to optimise against.
 */
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  /** Text shown on the placeholder; defaults to initials of `alt`. */
  label?: string;
  /** Replaces the default placeholder tile entirely. */
  fallback?: ReactNode;
  /** Above-the-fold images: load eagerly and hint high priority. */
  priority?: boolean;
};

export function ImageWithFallback({
  src,
  alt,
  label,
  fallback,
  priority,
  className,
  ...props
}: Props) {
  // Remember *which* src failed, so a new src gets a fresh attempt.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const broken = !src || failedSrc === src;

  if (broken) {
    if (fallback) return <>{fallback}</>;
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "grid place-items-center bg-linear-to-br from-surface to-line font-heading text-h4 font-bold text-green",
          className,
        )}
      >
        {label ?? initials(alt)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={(element) => {
        // An image that failed before hydration never fires onError in React.
        if (element?.complete && element.naturalWidth === 0) {
          queueMicrotask(() => setFailedSrc(src));
        }
      }}
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}

function initials(value: string): string {
  return (
    value
      .split(/\s+/)
      // Skip words that start with punctuation, e.g. "(নমুনা)".
      .filter((word) => /^\p{L}/u.test(word))
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("") || "—"
  );
}
