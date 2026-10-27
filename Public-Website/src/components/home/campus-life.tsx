import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export type CampusImage = { src?: string; alt: string };

/**
 * Bento gallery: a large lead photo, a tall one, three small ones and a green
 * call-to-action tile. Below 640px it becomes a two-column grid with the lead
 * photo spanning both columns.
 */
const CELLS = [
  "col-span-2 row-span-2", // lead
  "row-span-2", // tall
  "", // small
  "", // small
  "", // small
] as const;

export function CampusLife({
  eyebrow,
  title,
  images,
  ctaTitle,
  ctaLabel,
  sampleLabel,
}: {
  eyebrow: string;
  title: string;
  images: CampusImage[];
  ctaTitle: string;
  ctaLabel: string;
  sampleLabel?: string;
}) {
  // The CTA tile sits between the 3rd and 4th photo, as in the design.
  const [lead, tall, small1, small2, small3] = CELLS.map((_, i) => images[i]);
  const photo = (image: CampusImage | undefined, cell: string) => (
    <li
      className={cn(
        "group/zoom overflow-hidden rounded-card bg-surface",
        cell,
      )}
    >
      <ImageWithFallback
        src={image?.src}
        alt={image?.alt ?? ""}
        className="size-full transition-transform duration-500 motion-safe:group-hover/zoom:scale-[1.06]"
      />
    </li>
  );

  return (
    <Section size="lg" reveal>
      <SectionHeader
        align="center"
        eyebrow={eyebrow}
        title={title}
        sampleLabel={sampleLabel}
        className="mb-9"
      />
      <ul className="grid auto-rows-[7.5rem] grid-cols-2 gap-3.5 sm:auto-rows-[9.375rem] sm:grid-cols-4">
        {photo(lead, CELLS[0])}
        {photo(tall, CELLS[1])}
        {photo(small1, CELLS[2])}
        <li className="flex flex-col justify-center rounded-card bg-green p-4.5 text-white transition-[background-color,transform,box-shadow] duration-200 hover:bg-green-dark hover:shadow-lift-lg motion-safe:hover:-translate-y-1">
          <p className="mb-1.5 font-heading text-body-sm font-bold">{ctaTitle}</p>
          <Link
            href="/gallery"
            className="group/cta inline-flex items-center gap-1.5 text-small font-bold text-gold transition-[gap,color] duration-200 hover:gap-2.5 hover:text-white"
          >
            {ctaLabel}
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </li>
        {photo(small2, CELLS[3])}
        {photo(small3, CELLS[4])}
      </ul>
    </Section>
  );
}
