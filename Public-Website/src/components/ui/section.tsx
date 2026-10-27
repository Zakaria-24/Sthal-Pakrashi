import type { ReactNode } from "react";

import { Container, type ContainerSize } from "@/components/ui/container";
import { SampleBadge } from "@/components/ui/sample-badge";
import { H2, Text } from "@/components/typography";
import { cn } from "@/lib/utils";

/**
 * Standard page band. `tone` picks the full-bleed background, `size` the
 * vertical rhythm (80px home sections, 64–72px for page content), and
 * `width` the inner max width. `reveal` fades the band up as it scrolls in.
 *
 * The optional title/description/action props render a SectionHeader, which
 * keeps the older `<Section title="…">` call sites working unchanged.
 */
const TONE = {
  plain: "",
  surface: "bg-surface",
  green: "bg-green text-white",
} as const;

const SIZE = {
  /** 48px on phones, 72px from 768px — page content. */
  default: "py-12 md:py-page",
  /** 48px on phones, 64px from 768px — list/grid pages. */
  md: "py-12 md:py-16",
  /** 80px at every width — homepage sections (the artifact never shrinks them). */
  lg: "py-section",
  none: "",
} as const;

export function Section({
  id,
  tone = "plain",
  size = "default",
  width = "site",
  reveal = false,
  className,
  contentClassName,
  title,
  description,
  action,
  children,
}: {
  id?: string;
  tone?: keyof typeof TONE;
  size?: keyof typeof SIZE;
  width?: ContainerSize;
  reveal?: boolean;
  className?: string;
  contentClassName?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(TONE[tone], SIZE[size], reveal && "reveal", className)}
    >
      <Container size={width} className={contentClassName}>
        {(title || action) && (
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              {title && <H2>{title}</H2>}
              {description && (
                <Text size="sm" className="mt-1">
                  {description}
                </Text>
              )}
            </div>
            {action}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

/**
 * Eyebrow + heading (+ description) block used at the top of home sections.
 * `ruled` adds the design's short gold rules either side of a centred eyebrow.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  ruled = false,
  sampleLabel,
  action,
  size = "lg",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** "dark" is for use on green backgrounds. */
  tone?: "light" | "dark";
  ruled?: boolean | "wide";
  /** When set, marks the section as showing bundled sample content. */
  sampleLabel?: string;
  action?: ReactNode;
  /** Heading scale: lg 36px, mid 34px, low 32px, xs 30px (the artifact varies it per section). */
  size?: "lg" | "mid" | "low" | "xs";
  className?: string;
}) {
  const center = align === "center";
  const rule = cn(
    "inline-block h-px shrink-0",
    ruled === "wide" ? "w-8.5" : "w-7.5",
    tone === "dark" ? "bg-gold" : "bg-gold-dark",
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        center && "justify-center text-center",
        className,
      )}
    >
      <div className={cn(center && "flex flex-col items-center")}>
        {eyebrow && (
          <p
            className={cn(
              "flex items-center font-heading font-bold",
              ruled === "wide" && "gap-3.5 text-small tracking-eyebrow",
              ruled === true && "gap-3 text-nav-sm leading-normal tracking-eyebrow-wide",
              !ruled && "pt-1 pb-0.5 text-small leading-normal tracking-eyebrow",
              center && "justify-center",
              tone === "dark" ? "text-gold" : "text-gold-dark",
            )}
          >
            {ruled && <span aria-hidden className={rule} />}
            {eyebrow}
            {ruled && <span aria-hidden className={rule} />}
            {sampleLabel && <SampleBadge label={sampleLabel} className="-my-1" />}
          </p>
        )}
        <H2
          className={cn(
            "mt-2.5 leading-normal text-balance",
            ruled === "wide" && "mt-3.5",
            size === "mid" && "text-h2-mid leading-[1.3]",
            size === "low" && "text-h2-low",
            size === "xs" && "text-title leading-normal",
            tone === "dark" && "text-white",
          )}
        >
          {title}
        </H2>
        {description && (
          <Text
            size="base"
            className={cn(
              "mt-3 max-w-2xl",
              tone === "dark" && "text-on-green-soft",
            )}
          >
            {description}
          </Text>
        )}
      </div>
      {action}
    </div>
  );
}
