"use client";

import { useState } from "react";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/states";
import { useI18n } from "@/lib/i18n/provider";
import { SampleBadge } from "@/components/ui/sample-badge";

export type EventItem = {
  id: string;
  date: string;
  category: string;
  title: string;
  venue: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  isDemo?: boolean;
};

/** Event cards (photo, featured badge, date · category, venue) with a dialog. */
export function EventBoard({ events }: { events: EventItem[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = events.find((e) => e.id === activeId);

  if (events.length === 0) {
    return <EmptyState message={t("page.events.empty")} />;
  }

  return (
    <>
      <ul className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,17.5rem),1fr))]">
        {events.map((event) => (
          <li
            key={event.id}
            className="lift-sm group/event relative overflow-hidden rounded-card border border-line bg-white has-focus-visible:ring-2 has-focus-visible:ring-green"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-surface">
              <ImageWithFallback
                src={event.imageUrl}
                alt={event.title}
                className="size-full transition-transform duration-500 motion-safe:group-hover/event:scale-105"
              />
              {event.featured && (
                <span className="absolute top-3 left-3 rounded-pill bg-gold px-2.5 py-1 text-micro font-bold text-on-gold">
                  {t("page.featured")}
                </span>
              )}
              {event.isDemo && <span className="absolute right-3 top-3"><SampleBadge label={t("common.demoContent")} /></span>}
            </div>
            <div className="p-5">
              <p className="mb-2 text-small font-bold text-green">
                {[event.date, event.category].filter(Boolean).join(" · ")}
              </p>
              <h3 className="mb-2 font-heading text-body font-bold text-ink">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => {
                    setActiveId(event.id);
                    setOpen(true);
                  }}
                  className="cursor-pointer text-left outline-none after:absolute after:inset-0"
                >
                  {event.title}
                </button>
              </h3>
              {event.venue && (
                <p className="text-body-sm text-ink-soft">{event.venue}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={active?.title ?? t("page.events.title")}
        hideTitle
        closeLabel={t("page.close")}
        width="md"
      >
        {active && (
          <>
            <div className="h-50 overflow-hidden bg-surface">
              <ImageWithFallback
                src={active.imageUrl}
                alt={active.title}
                className="size-full"
              />
            </div>
            <div className="px-6.5 py-7 md:px-7.5">
              <span className="mb-3 inline-block rounded-pill bg-surface px-3 py-1 font-heading text-xs font-bold text-green">
                {active.category}
              </span>
              <p className="mb-2 text-small text-ink-soft">
                {[active.date, active.venue].filter(Boolean).join(" · ")}
              </p>
              <h3 className="mb-3.5 font-heading text-h3 font-extrabold text-ink">
                {active.title}
              </h3>
              <p className="text-body-sm leading-relaxed whitespace-pre-line text-ink-soft">
                {active.description}
              </p>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
