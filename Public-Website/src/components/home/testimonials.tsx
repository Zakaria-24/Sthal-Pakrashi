import { Section, SectionHeader } from "@/components/ui/section";

import { TestimonialCarousel } from "./testimonial-carousel";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  photoUrl?: string;
  /** True for design placeholder copy that real testimonials will replace. */
  placeholder?: boolean;
  isDemo?: boolean;
};

/**
 * Testimonial cards, three at a time; the middle one is the highlighted green
 * card. Shows real alumni testimonials from the CMS when there are any,
 * otherwise the design's placeholder cards (flagged with data-placeholder).
 * More than three rotate through the carousel's pager dots.
 */
export function Testimonials({
  eyebrow,
  title,
  ratingLabel,
  dotLabels,
  items,
  sampleLabel,
}: {
  eyebrow: string;
  title: string;
  ratingLabel: string;
  dotLabels: string[];
  items: Testimonial[];
  sampleLabel?: string;
}) {
  return (
    <Section tone="surface" size="lg" reveal>
      <SectionHeader
        align="center"
        ruled="wide"
        size="low"
        eyebrow={eyebrow}
        title={title}
        sampleLabel={sampleLabel}
        className="mb-11"
      />
      <TestimonialCarousel
        items={items}
        ratingLabel={ratingLabel}
        dotLabels={dotLabels}
      />
    </Section>
  );
}
