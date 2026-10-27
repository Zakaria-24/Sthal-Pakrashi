import Link from "next/link";
import type { ReactNode } from "react";
import { CountUp } from "@/components/ui/count-up";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Section } from "@/components/ui/section";
import { H2 } from "@/components/typography";
import { cn } from "@/lib/utils";

export type AboutFigure = { value: string; label: string; icon?: ReactNode };

/** "A legacy of education since …" — two overlapping photos beside the story. */
export function AboutTeaser({
  eyebrow,
  title,
  paragraphs,
  primaryImage,
  secondaryImage,
  figures,
  readMore,
}: {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  primaryImage: { src?: string; alt: string };
  secondaryImage: { src?: string; alt: string };
  figures: AboutFigure[];
  readMore: string;
}) {
  return (
    <Section size="lg" reveal contentClassName="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative">
        <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
          <ImageWithFallback
            src={primaryImage.src}
            alt={primaryImage.alt}
            className="size-full"
          />
        </div>
        <div className="absolute -bottom-4 left-0 aspect-[5/4] w-[56%] overflow-hidden rounded-card border-5 border-white bg-surface shadow-lift-sm sm:-left-4">
          <ImageWithFallback
            src={secondaryImage.src}
            alt={secondaryImage.alt}
            className="size-full"
          />
        </div>
      </div>

      <div>
        <p className="font-heading pt-1 pb-0.5 text-small leading-normal font-bold tracking-eyebrow text-gold-dark">
          {eyebrow}
        </p>
        <H2 className="mt-2.5 mb-4.5 leading-normal text-balance">{title}</H2>
        {paragraphs.map((text, index) => (
          <p
            key={index}
            className={cn(
              "text-copy text-ink-soft",
              index === paragraphs.length - 1 ? "mb-6.5" : "mb-4",
            )}
          >
            {text}
          </p>
        ))}

        {figures.length > 0 && (
          <ul className="mb-7 flex flex-wrap gap-7">
            {figures.map((figure) => (
              <li key={figure.label} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface text-green [&_svg]:size-5.5"
                >
                  {figure.icon}
                </span>
                <span>
                  <CountUp
                    value={figure.value}
                    className="block font-heading text-xl font-extrabold text-green tabular-nums"
                  />
                  <span className="block text-small font-semibold text-ink-soft">
                    {figure.label}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/about"
          className="inline-flex items-center gap-1.5 font-heading text-ui font-bold text-green transition-[gap,color] duration-200 hover:gap-2.5 hover:text-gold-dark"
        >
          {readMore}
          <ArrowRightIcon />
        </Link>
      </div>
    </Section>
  );
}
