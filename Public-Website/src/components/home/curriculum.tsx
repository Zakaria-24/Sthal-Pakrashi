import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { SampleBadge } from "@/components/ui/sample-badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export type CurriculumRow = { num: string; name: string };

/**
 * Green curriculum band. Its extra bottom padding is intentional: the
 * WatchNow card below overlaps into it.
 */
export function Curriculum({
  eyebrow,
  title,
  image,
  badge,
  rows,
  ctaLabel,
  sampleLabel,
}: {
  eyebrow: string;
  title: string;
  image: { src?: string; alt: string };
  /** "8 Classes Offered" — omitted when the count isn't known. */
  badge?: string;
  rows: CurriculumRow[];
  ctaLabel: string;
  sampleLabel?: string;
}) {
  return (
    <section className="reveal bg-green pt-section pb-42.5">
      <Container
        size="mid"
        className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]"
      >
        <div className="relative rounded-card-lg border-2 border-dashed border-gold p-3.5">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white/10">
            <ImageWithFallback
              src={image.src}
              alt={image.alt}
              className="size-full"
            />
          </div>
          {badge && (
            <p className="absolute bottom-5 -left-2 rounded-lg bg-footer px-4.5 py-3 font-heading text-small font-bold text-white">
              {badge}
            </p>
          )}
        </div>

        <div>
          <p className="mb-2.5 flex flex-wrap items-center gap-2.5 font-heading text-small font-bold tracking-eyebrow text-gold">
            {eyebrow}
            <span aria-hidden className="inline-block h-px w-6.5 bg-gold" />
            {sampleLabel && <SampleBadge label={sampleLabel} />}
          </p>
          <h2 className="mb-6.5 font-heading text-h2-low leading-[1.3] text-balance text-white">
            {title}
          </h2>

          <ul className="mb-6.5 flex flex-col gap-2.5">
            {rows.map((row, index) => (
              <li key={row.num}>
                <Link
                  href="/academics"
                  className={cn(
                    "group/row flex items-center justify-between gap-3 rounded-lg px-4 py-3.25 transition-[background-color,transform] duration-200 hover:bg-gold motion-safe:hover:translate-x-1",
                    index === 0 ? "bg-white/14" : "bg-white/6",
                  )}
                >
                  <span className="font-heading text-nav font-bold text-white transition-colors duration-200 group-hover/row:text-green">
                    {row.num}. {row.name}
                  </span>
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full transition-colors duration-200 group-hover/row:bg-white group-hover/row:text-green",
                      index === 0 ? "bg-gold text-on-gold" : "bg-white/15 text-white",
                    )}
                  >
                    <ArrowUpRightIcon className="size-3" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/academics"
            className={cn(
              buttonVariants({ variant: "outline-light", shape: "pill" }), "px-6",
            )}
          >
            {ctaLabel}
            <ArrowUpRightIcon />
          </Link>
        </div>
      </Container>
    </section>
  );
}
