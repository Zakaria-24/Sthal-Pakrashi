"use client";

import { useEffect, useRef } from "react";

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const DURATION_MS = 1400;

/** "1,250+", "৬৬১", "160+" → prefix / number / suffix; null when no number. */
function parse(value: string) {
  const match = value.match(/^(\D*?)([0-9০-৯][0-9০-৯,]*)([^]*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const bengali = /[০-৯]/.test(digits);
  const target = Number(
    digits.replace(/,/g, "").replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d))),
  );
  if (!Number.isFinite(target)) return null;
  return { prefix, suffix, target, bengali, grouped: digits.includes(",") };
}

/**
 * A localized figure that counts up from zero the first time it scrolls into
 * view. Server-rendered with its final value, and only animates figures that
 * start off-screen, so nothing visible ever flips to 0 on hydration. Non-numeric
 * values ("—") and reduced-motion users get the plain text.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    // Write into React's own text node so later renders still update it.
    const node = el?.firstChild;
    const parts = parse(value);
    if (!el || !(node instanceof Text) || !parts || parts.target === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    const grouping = parts.grouped
      ? new Intl.NumberFormat(parts.bengali ? "en-IN" : "en-US")
      : null;
    const format = (n: number) => {
      const plain = grouping ? grouping.format(n) : String(n);
      const digits = parts.bengali
        ? plain.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)])
        : plain;
      return `${parts.prefix}${digits}${parts.suffix}`;
    };

    node.data = format(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          const eased = 1 - (1 - progress) ** 3;
          node.data =
            progress < 1 ? format(Math.round(parts.target * eased)) : value;
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    // No text restore here: on a value change React has already written the
    // new value by the time this cleanup runs.
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
