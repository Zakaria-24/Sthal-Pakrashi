import { notFound } from "next/navigation";

import { getNoticeById } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { formatDateLocalized } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { SampleBadge } from "@/components/ui/sample-badge";

export async function generateMetadata(props: PageProps<"/notices/[id]">) {
  const { id } = await props.params;
  const notice = await getNoticeById(id);
  return { title: notice?.title ?? "Notice" };
}

/** Deep-linkable version of the notice dialog (home cards and search open it). */
export default async function NoticeDetailPage(
  props: PageProps<"/notices/[id]">,
) {
  const { id } = await props.params;
  const [notice, { t, locale }] = await Promise.all([
    getNoticeById(id),
    getI18n(),
  ]);
  if (!notice) notFound();

  return (
    <>
      <PageHeader
        title={notice.title}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.notices.crumb"), href: "/notices" },
          { label: notice.title },
        ]}
      />
      <Section size="md" width="narrow" reveal>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {notice.isDemo && <SampleBadge label={t("common.demoContent")} />}
          <span className="rounded-pill bg-surface px-3 py-1 font-heading text-xs font-bold text-green">
            {t(`notice.category.${notice.category}`)}
          </span>
          {notice.isPinned && (
            <span className="rounded-pill bg-gold px-2.5 py-1 text-micro font-bold text-on-gold">
              {t("common.pinned")}
            </span>
          )}
          <span className="text-small text-ink-soft">
            {formatDateLocalized(notice.publishedAt, locale)}
          </span>
        </div>
        <p className="mb-6 text-body leading-relaxed whitespace-pre-line text-ink-soft">
          {notice.description}
        </p>
        {notice.attachmentUrl ? (
          <a
            href={notice.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center rounded-pill bg-green px-5 py-2.5 text-small font-semibold text-white transition-colors duration-200 hover:bg-green-dark"
          >
            {t("page.downloadAttachment")}
          </a>
        ) : (
          <span className="inline-block rounded-pill bg-surface px-4 py-2.5 text-small font-semibold text-ink-soft">
            {t("page.noAttachment")}
          </span>
        )}
      </Section>
    </>
  );
}
