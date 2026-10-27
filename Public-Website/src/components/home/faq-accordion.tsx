"use client";

import { Accordion } from "@/components/ui/accordion";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type FaqItem = { id: string; question: string; answer: string };

/**
 * FAQ list, as in the artifact: each row is a filled pill (surface, gold on
 * hover, green when open) with a » chip and a +/− chip, and rows toggle
 * independently — several can be open at once.
 */
export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  return (
    <Accordion
      type="multiple"
      items={faqs.map((faq) => ({
        id: faq.id,
        header: faq.question,
        content: (
          <p className="pr-2 pb-3 pl-11 text-small text-ink-soft">{faq.answer}</p>
        ),
      }))}
      headerClassName={(open) =>
        cn(
          "group/faq min-h-12 gap-0 rounded-xl px-4.5 py-4 transition-[background-color,transform] duration-200",
          open
            ? "mb-1.5 bg-green"
            : "mb-3 bg-surface hover:bg-gold motion-safe:hover:translate-x-1",
        )
      }
      renderHeader={(item, open) => (
        <>
          <span className="flex items-center gap-3">
            <span
              aria-hidden
              className={cn(
                "flex size-5.5 shrink-0 items-center justify-center rounded-full text-micro transition-[transform,background-color,color] duration-200",
                open
                  ? "rotate-90 bg-white/20 text-white"
                  : "bg-white text-green",
              )}
            >
              »
            </span>
            <span
              className={cn(
                "font-heading text-person font-bold transition-colors duration-200",
                open ? "text-white" : "text-ink group-hover/faq:text-green",
              )}
            >
              {item.header}
            </span>
          </span>
          <span
            className={cn(
              "ml-2.5 flex size-6 shrink-0 items-center justify-center rounded-full transition-[background-color,color] duration-200",
              open ? "bg-white/20 text-white" : "bg-white text-green",
            )}
          >
            {open ? <MinusIcon className="size-3.5" /> : <PlusIcon className="size-3.5" />}
          </span>
        </>
      )}
    />
  );
}
