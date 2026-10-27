import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { cn } from "@/lib/utils";
import { SampleBadge } from "@/components/ui/sample-badge";

export type HeroStat = { value: string; label: string };
export type HeroAvatar = { src?: string; name: string };

/** Copy and figures for the phone/tablet (≤1024px) hero. */
export type HeroCompact = {
  tag: string;
  titleLines: [string, string, string];
  description: string;
  applyHref: string;
  applyLabel: string;
  learnHref: string;
  learnLabel: string;
  stats: { value: string; label: string; icon: ReactNode }[];
};

/**
 * Homepage hero: eyebrow + headline, avatar stack with the enrolment line, the
 * campus image with its floating stat strip. (The artifact also contains an
 * "Established" seal, but its SVG is display:none — so it is not rendered.)
 * At ≤1024px a separate full-bleed variant takes over: the campus image under
 * a dark green overlay, headline, two buttons and three stat cards.
 * All text arrives already localized; nothing here reads the CMS.
 */
export function Hero({
  tag,
  titleLines,
  imageSrc,
  imageAlt,
  avatars,
  studentsLabel,
  description,
  stats,
  compact,
  demoLabel,
}: {
  tag: string;
  titleLines: [string, string];
  imageSrc?: string;
  imageAlt: string;
  avatars: HeroAvatar[];
  /** e.g. "2,412 Students Enrolled" — omitted when the CMS can't supply it. */
  studentsLabel?: string;
  description: string;
  stats: HeroStat[];
  compact: HeroCompact;
  demoLabel?: string;
}) {
  // Without real alumni photos the artifact's avatar stack stays, as neutral tiles.
  const stack =
    avatars.length > 0
      ? avatars
      : Array.from({ length: 5 }, () => ({ src: undefined, name: "" }));

  return (
    <>
      <CompactHero
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        compact={compact}
        demoLabel={demoLabel}
      />

    <section className="hidden pt-11 lg:block">
      <Container>
        <div className="mb-7.5 grid items-end gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
            {demoLabel && <div className="mb-2"><SampleBadge label={demoLabel} /></div>}
            <p className="mb-3.5 inline-flex animate-rise-in items-center gap-2 text-nav-sm leading-normal font-bold tracking-eyebrow text-green-dark uppercase">
              <span aria-hidden className="size-2 rounded-full bg-gold-dark" />
              {tag}
            </p>
            <h1 className="mb-3 animate-rise-in font-heading text-hero text-ink delay-step-1">
              {titleLines[0]}
              <br />
              {titleLines[1]}
            </h1>
          </div>

          <div className="flex flex-col gap-3.5">
            <ul className="flex -space-x-3" aria-hidden>
              {stack.map((avatar, index) => (
                <li
                  key={`${avatar.name}-${index}`}
                  title={avatar.name || undefined}
                  style={{
                    animationDelay: `calc(var(--motion-stagger) * ${2 + index * 0.5})`,
                  }}
                  className="size-11 animate-rise-in overflow-hidden rounded-full border-3 border-white shadow-soft transition-[translate] duration-200 hover:z-10 motion-safe:hover:-translate-y-1"
                >
                  <ImageWithFallback
                    src={avatar.src}
                    alt={avatar.name}
                    label=""
                    className="size-full"
                  />
                </li>
              ))}
            </ul>
            <div className="animate-rise-in delay-step-4">
              {/* <h1>Test</h1> */}
              {studentsLabel && (
                <p className="mb-1.5 font-heading text-ui font-extrabold text-ink">
                  {studentsLabel}
                </p>
              )}
              <p className="text-body-sm leading-[1.55] text-ink-soft">{description}</p>
            </div>
          </div>
        </div>

        <div className="group/hero relative aspect-[16/7] animate-fade-in-up overflow-hidden delay-step-2 rounded-3xl bg-surface">
          <ImageWithFallback
            priority
            src={imageSrc}
            alt={imageAlt}
            className="size-full transition-transform duration-500 motion-safe:group-hover/hero:scale-[1.04]"
          />

          {stats.length > 0 && (
            <ul className="absolute right-4 bottom-3.5 left-4 flex animate-rise-in delay-step-5flex-wrap gap-3 rounded-xl bg-overlay-green px-3.5 py-3 backdrop-blur-sm min-[901px]:right-auto min-[901px]:bottom-20 min-[901px]:left-11.5 min-[901px]:gap-5.5 min-[901px]:px-5.5 min-[901px]:py-4">
              {stats.map((stat, index) => (
                <li
                  key={stat.label}
                  className={
                    index > 0
                      ? "border-l border-white/20 pl-3 min-[901px]:pl-5.5"
                      : undefined
                  }
                >
                  <p className="font-heading text-stat leading-normal text-white">
                    {stat.value}
                  </p>
                  <p className="text-caption font-semibold text-on-green-muted">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          )}

        </div>
      </Container>
    </section>
    </>
  );
}

/**
 * Phone / tablet hero: full-bleed campus photo under a dark green overlay, the
 * headline anchored to the bottom, buttons stacked on phones and side by side
 * from 769px, and three stat cards (icon above the figure on phones, beside it
 * on tablets).
 */
function CompactHero({
  imageSrc,
  imageAlt,
  compact,
  demoLabel,
}: {
  imageSrc?: string;
  imageAlt: string;
  compact: HeroCompact;
  demoLabel?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-green-dark lg:hidden">
      <div className="absolute inset-0 -z-10">
        <ImageWithFallback
          priority
          src={imageSrc}
          alt={imageAlt}
          className="size-full"
          fallback={<div className="size-full bg-green" />}
        />
        <div className="absolute inset-0 bg-linear-to-b from-green-dark/55 via-green-dark/85 via-45% to-green-dark" />
      </div>

      <Container className="pt-36 pb-8 sm:pt-48 md:pt-72 md:pb-10">
        {demoLabel && <div className="mb-2"><SampleBadge label={demoLabel} /></div>}
        <p className="flex animate-rise-in items-center gap-2.5 font-heading text-ui font-semibold tracking-eyebrow-wide text-white uppercase">
          <span aria-hidden className="size-3.5 shrink-0 rounded-full bg-gold" />
          {compact.tag}
        </p>

        <p
          role="heading"
          aria-level={1}
          className="mt-5 animate-rise-in font-heading text-hero-lg text-white delay-step-1"
        >
          {compact.titleLines.map((line, index) => (
            <span key={line} className="block">
              {line}
              {index < compact.titleLines.length - 1 && " "}
            </span>
          ))}
        </p>

        <p className="mt-5 max-w-lg animate-rise-in text-body-lg text-white/90 delay-step-2">
          {compact.description}
        </p>

        <div className="mt-8 flex animate-rise-in flex-col gap-4 delay-step-3 md:flex-row">
          <Link
            href={compact.applyHref}
            className={cn(
              buttonVariants({ variant: "gold", size: "lg", shape: "pill" }),
              "min-h-14 w-full text-body md:w-auto md:px-10",
            )}
          >
            {compact.applyLabel}
            <ArrowUpRightIcon />
          </Link>
          <Link
            href={compact.learnHref}
            className={cn(
              buttonVariants({
                variant: "outline-light",
                size: "lg",
                shape: "pill",
              }),
              "min-h-14 w-full border-white/80 text-body md:w-auto md:px-10",
            )}
          >
            {compact.learnLabel}
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-3 gap-3 md:gap-4">
          {compact.stats.map((stat, index) => (
            <li
              key={stat.label}
              style={{
                animationDelay: `calc(var(--motion-stagger) * ${4 + index})`,
              }}
              className="flex animate-rise-in flex-col items-center gap-1 rounded-2xl bg-white/8 px-2 py-5 text-center md:py-4"
            >
              <span className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
                <span className="text-gold [&_svg]:size-7 md:[&_svg]:size-6">
                  {stat.icon}
                </span>
                <span className="font-heading text-stat text-white">
                  {stat.value}
                </span>
              </span>
              <span className="text-body-sm text-on-green-soft">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
