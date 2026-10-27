import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { EmptyState } from "@/components/ui/states";
import { Section, SectionHeader } from "@/components/ui/section";
import { SampleBadge } from "@/components/ui/sample-badge";

export type NoticeCard = {
  id: string;
  /** "12 March 2026 · Examination" — already localized. */
  meta: string;
  title: string;
  description: string;
  pinned: boolean;
  isDemo?: boolean;
};

/** Latest notices as lift-on-hover cards; each links to its detail page. */
export function NoticeCenter({
  eyebrow,
  title,
  notices,
  viewAll,
  viewDetails,
  pinnedLabel,
  emptyMessage,
  sampleLabel,
  demoLabel,
}: {
  eyebrow: string;
  title: string;
  notices: NoticeCard[];
  viewAll: string;
  viewDetails: string;
  pinnedLabel: string;
  emptyMessage: string;
  sampleLabel?: string;
  demoLabel: string;
}) {
  return (
    <Section size="lg" reveal>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        sampleLabel={sampleLabel}
        className="mb-9"
        action={
          <Link
            href="/notices"
            className="inline-flex items-center gap-1.5 font-heading text-ui font-bold text-green transition-[gap,color] duration-200 hover:gap-2.5 hover:text-gold-dark"
          >
            {viewAll}
            <ArrowRightIcon />
          </Link>
        }
      />

      {notices.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <ul className="grid grid-fit-70 gap-5.5">
          {notices.map((notice) => (
            <li
              key={notice.id}
              className="lift-sm group/notice relative flex flex-col rounded-card border border-line bg-white p-6 hover:border-green has-focus-visible:ring-2 has-focus-visible:ring-green"
            >
              <div className="mb-2.5 flex items-start justify-between gap-2.5">
                <p className="text-small font-semibold text-ink-soft">
                  {notice.meta}
                </p>
                {notice.pinned && (
                  <span className="shrink-0 rounded-pill bg-gold px-2.5 py-1 text-micro font-bold text-on-gold">
                    {pinnedLabel}
                  </span>
                )}
              </div>
              {notice.isDemo && <div className="mb-2"><SampleBadge label={demoLabel} /></div>}
              <h3 className="mb-2.5 font-heading text-h4 text-ink">
                <Link
                  href={`/notices/${notice.id}`}
                  className="outline-none after:absolute after:inset-0"
                >
                  {notice.title}
                </Link>
              </h3>
              <p className="mb-4 line-clamp-3 flex-1 text-body-sm text-ink-soft">
                {notice.description}
              </p>
              <span className="inline-flex items-center gap-1.5 font-heading text-body-sm font-bold text-green transition-[gap] duration-200 group-hover/notice:gap-2.5">
                {viewDetails}
                <ArrowRightIcon className="size-3.5" />
              </span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
