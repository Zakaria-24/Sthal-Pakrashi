import Link from "next/link";

import { FaqAccordion, type FaqItem } from "@/components/home/faq-accordion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export type AidCard = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  tone: "green" | "gold";
};

const CARD = {
  green: {
    box: "bg-green",
    title: "text-white",
    body: "text-on-green-soft",
    link: "text-gold hover:text-white",
  },
  gold: {
    box: "bg-gold",
    title: "text-on-gold",
    body: "text-on-gold-soft",
    link: "text-on-gold hover:text-white",
  },
} as const;

/** FAQ accordion beside the "Admission & Aid" call-out cards. */
export function FaqSection({
  eyebrow,
  title,
  faqs,
  aidEyebrow,
  aidTitle,
  aid,
}: {
  eyebrow: string;
  title: string;
  faqs: FaqItem[];
  aidEyebrow: string;
  aidTitle: string;
  aid: AidCard[];
}) {
  return (
    <section className="reveal py-section">
      <Container size="wide">
        <div className="relative grid gap-12 rounded-4xl px-11 py-12 shadow-soft lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionHeader eyebrow={eyebrow} title={title} size="xs" className="mb-6" />
            <FaqAccordion faqs={faqs} />
          </div>

          <div className="relative max-lg:mt-8 lg:pr-24">
            <p className="flex items-center gap-2.5 py-1 font-heading text-small leading-normal font-bold tracking-eyebrow text-gold-dark">
              <span aria-hidden className="inline-block h-px w-6.5 bg-gold-dark" />
              {aidEyebrow}
            </p>
            <h3 className="mt-1.5 mb-5.5 font-heading text-h3-sm text-balance text-ink">
              {aidTitle}
            </h3>
            <ul className="flex flex-col gap-3.75">
              {aid.map((card) => {
                const style = CARD[card.tone];
                return (
                  <li key={card.title} className={cn("rounded-card p-4.5", style.box)}>
                    <p className={cn("mb-1.5 font-heading text-person font-bold", style.title)}>
                      {card.title}
                    </p>
                    <p className={cn("mb-2.5 text-nav-sm leading-normal", style.body)}>
                      {card.description}
                    </p>
                    <Link
                      href={card.href}
                      className={cn(
                        "inline-flex items-center gap-1 text-nav-sm font-bold transition-[color,transform] duration-200 motion-safe:hover:translate-x-1",
                        style.link,
                      )}
                    >
                      {card.linkLabel} →
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* Decorative cut-out from the artifact; hidden below 1024px like the original. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/design/faq-student.png"
              alt=""
              aria-hidden
              width={337}
              height={505}
              loading="lazy"
              className="pointer-events-none absolute -right-2 -bottom-6 hidden h-[23.6875rem] w-37.5 object-cover lg:block"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
