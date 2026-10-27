"use client";

import { useState } from "react";

import { ArrowRightIcon } from "@/components/ui/icons";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/states";
import { useI18n } from "@/lib/i18n/provider";
import { SampleBadge } from "@/components/ui/sample-badge";

export type NoticeItem = {
  id: string;
  /** "12 March 2026" — already localized. */
  date: string;
  /** Localized category label. */
  category: string;
  title: string;
  description: string;
  pinned: boolean;
  attachmentUrl: string;
  isDemo?: boolean;
};

/** Notice cards; each opens the design's detail dialog. */
export function NoticeBoard({
  notices,
  className,
}: {
  notices: NoticeItem[];
  className?: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = notices.find((n) => n.id === activeId);

  if (notices.length === 0) {
    return <EmptyState message={t("page.notices.empty")} />;
  }

  return (
    <>
      <ul
        className={
          className ??
          "grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,17.5rem),1fr))]"
        }
      >
        {notices.map((notice) => (
          <li
            key={notice.id}
            className="lift-sm group/notice relative rounded-card border border-line bg-white p-6 hover:border-green has-focus-visible:ring-2 has-focus-visible:ring-green"
          >
            <div className="mb-2.5 flex items-start justify-between gap-2.5">
              <p className="text-small font-semibold text-ink-soft">
                {[notice.date, notice.category].filter(Boolean).join(" · ")}
              </p>
              {notice.pinned && (
                <span className="shrink-0 rounded-pill bg-gold px-2.5 py-1 text-micro font-bold text-on-gold">
                  {t("common.pinned")}
                </span>
              )}
            </div>
            {notice.isDemo && <div className="mb-2"><SampleBadge label={t("common.demoContent")} /></div>}
            <h3 className="mb-2.5 font-heading text-h4 text-ink">
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => {
                  setActiveId(notice.id);
                  setOpen(true);
                }}
                className="cursor-pointer text-left outline-none after:absolute after:inset-0"
              >
                {notice.title}
              </button>
            </h3>
            <p className="mb-4 line-clamp-4 text-body-sm text-ink-soft">
              {notice.description}
            </p>
            <span className="inline-flex items-center gap-1.5 font-heading text-body-sm font-bold text-green transition-[gap] duration-200 group-hover/notice:gap-2.5">
              {t("common.viewDetails")}
              <ArrowRightIcon className="size-3.5" />
            </span>
          </li>
        ))}
      </ul>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={active?.title ?? t("page.notices.title")}
        hideTitle
        closeLabel={t("page.close")}
        width="md"
      >
        {active && (
          <div className="px-6.5 py-7.5 md:px-8">
            <div className="mb-3.5 flex items-start gap-3 pr-12">
              <span className="rounded-pill bg-surface px-3 py-1 font-heading text-xs font-bold text-green">
                {active.category}
              </span>
              {active.pinned && (
                <span className="rounded-pill bg-gold px-2.5 py-1 text-micro font-bold text-on-gold">
                  {t("common.pinned")}
                </span>
              )}
            </div>
            {active.date && (
              <p className="mb-2 text-small text-ink-soft">{active.date}</p>
            )}
            <h3 className="mb-3.5 font-heading text-h3 font-extrabold text-ink">
              {active.title}
            </h3>
            <p className="mb-5 text-body-sm leading-relaxed whitespace-pre-line text-ink-soft">
              {active.description}
            </p>
            {active.attachmentUrl ? (
              <a
                href={active.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center rounded-pill bg-green px-4 py-2.5 text-small font-semibold text-white transition-colors duration-200 hover:bg-green-dark"
              >
                {t("page.downloadAttachment")}
              </a>
            ) : (
              <span className="inline-block rounded-pill bg-surface px-4 py-2.5 text-small font-semibold text-ink-soft">
                {t("page.noAttachment")}
              </span>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
