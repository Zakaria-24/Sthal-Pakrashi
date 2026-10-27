"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type TransitionEvent,
} from "react";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { QuoteIcon, StarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

import type { Testimonial } from "./testimonials";

/** Cards on screen at once from md up; the middle one is the green card. */
const VISIBLE = 3;
const AUTOPLAY_MS = 6000;
/** Same as the track's gap-6.5. */
const GAP = "var(--spacing) * 6.5";

/**
 * Sliding testimonial track: one card per view on phones, three from md up,
 * stepping one card at a time. The first VISIBLE cards are cloned onto the end
 * so the loop slides on into them, then snaps back to the start unseen. Each
 * pager dot is a starting card; it auto-advances (paused on hover/focus and
 * under reduced motion). With three or fewer items nothing slides and the
 * cards sit in the plain grid.
 */
export function TestimonialCarousel({
  items,
  ratingLabel,
  dotLabels,
}: {
  items: Testimonial[];
  ratingLabel: string;
  /** Localized "Show testimonial N" per item, for the pager buttons. */
  dotLabels: string[];
}) {
  const pageable = items.length > VISIBLE;
  const [start, setStart] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 48.0625rem)");
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!pageable || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setStart((current) => (current >= items.length ? 0 : current + 1)),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(timer);
  }, [pageable, paused, items.length]);

  // Re-enable the slide one frame after an unseen snap back to the start.
  useEffect(() => {
    if (animate) return;
    const frame = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => setAnimate(true)),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [animate]);

  function handleTransitionEnd(event: TransitionEvent<HTMLUListElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    if (start >= items.length) {
      setAnimate(false);
      setStart(0);
    }
  }

  if (!pageable) {
    return (
      <ul className="grid grid-fit-60 items-center gap-6.5">
        {items.map((item, index) => (
          <TestimonialCard
            key={`${item.name}-${index}`}
            item={item}
            featured={index === 1}
            ratingLabel={ratingLabel}
          />
        ))}
      </ul>
    );
  }

  const track = [...items, ...items.slice(0, VISIBLE)];
  const featuredIndex = wide ? start + 1 : start;
  const activeDot = start % items.length;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Clip only sideways; the padding leaves room for the scaled card and
          shadows, and the negative margin cancels it in the layout. */}
      <div className="-my-4 overflow-x-clip py-4">
        <ul
          onTransitionEnd={handleTransitionEnd}
          className={cn(
            "flex items-center gap-6.5 [--per:1] md:[--per:3]",
            animate
              ? "transition-transform duration-700 ease-(--ease-soft) motion-reduce:transition-none"
              : "transition-none",
          )}
          style={{
            transform: `translateX(calc(${-start} * (100% + ${GAP}) / var(--per)))`,
          }}
        >
          {track.map((item, index) => (
            <TestimonialCard
              key={index}
              item={item}
              featured={index === featuredIndex}
              ratingLabel={ratingLabel}
              hidden={index >= items.length}
              instant={!animate}
              style={{
                flexBasis: `calc((100% - (var(--per) - 1) * ${GAP}) / var(--per))`,
              }}
            />
          ))}
        </ul>
      </div>

      <div className="mt-9 flex justify-center gap-2">
        {items.map((item, index) => {
          const active = index === activeDot;
          return (
            <button
              key={`${item.name}-${index}`}
              type="button"
              aria-label={dotLabels[index]}
              aria-current={active ? "true" : undefined}
              onClick={() => setStart(index)}
              className={cn(
                "h-2 cursor-pointer rounded-pill transition-[width,background-color] duration-300",
                active ? "w-5.5 bg-gold" : "w-2 bg-line hover:bg-gold-dark",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

function TestimonialCard({
  item,
  featured,
  ratingLabel,
  hidden,
  instant,
  style,
}: {
  item: Testimonial;
  featured: boolean;
  ratingLabel: string;
  /** Loop clone: kept out of the accessibility tree. */
  hidden?: boolean;
  /** Skip colour/scale transitions (during the unseen snap back). */
  instant?: boolean;
  style?: CSSProperties;
}) {
  return (
    <li
      aria-hidden={hidden || undefined}
      data-placeholder={item.placeholder ? "true" : undefined}
      style={style}
      className={cn(
        "relative shrink-0 rounded-2xl",
        instant
          ? "transition-none **:transition-none"
          : "transition-[transform,box-shadow,background-color,padding] duration-500",
        featured
          ? "z-10 bg-green px-6 pt-9 pb-7.5 shadow-lift-lg md:scale-[1.06]"
          : "bg-white px-6 pt-7.5 pb-6.5 motion-safe:hover:-translate-y-1.5 hover:shadow-lift",
      )}
    >
      <ImageWithFallback
        src={item.photoUrl}
        alt={item.name}
        className="mb-4 size-14.5 rounded-full border-3 border-white shadow-soft"
      />
      <div
        role="img"
        aria-label={ratingLabel}
        className={cn(
          "mb-3.5 flex min-h-5.25 items-center gap-0.5 transition-colors duration-500",
          featured ? "text-gold" : "text-gold-dark",
        )}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} className="size-3.5" />
        ))}
      </div>
      <blockquote
        className={cn(
          "mb-5.5 text-quote transition-colors duration-500",
          featured ? "text-on-green-soft" : "text-ink-soft",
        )}
      >
        {item.quote}
      </blockquote>
      <div className="flex min-w-0 items-center justify-between gap-2.5">
        <div className="min-w-0">
          <p
            className={cn(
              "truncate font-heading text-person font-bold transition-colors duration-500",
              featured ? "text-white" : "text-ink",
            )}
          >
            {item.name}
          </p>
          <p
            className={cn(
              "truncate text-xs leading-normal transition-colors duration-500",
              featured ? "text-on-green-soft" : "text-ink-soft",
            )}
          >
            {item.role}
          </p>
        </div>
        <span
          aria-hidden
          className={cn(
            "flex size-8.5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-500",
            featured ? "border-gold text-gold" : "border-green text-green",
          )}
        >
          <QuoteIcon className="size-3.5" />
        </span>
      </div>
    </li>
  );
}
