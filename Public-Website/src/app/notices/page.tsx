import { getNotices } from "@/lib/api";
import { NoticeBoard } from "@/components/pages/notice-board";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { formatDateLocalized } from "@/lib/i18n";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.notices.title");

export default async function NoticesPage() {
  const [{ t, locale }, { data: notices }] = await Promise.all([
    getPageContext(),
    getNotices(),
  ]);

  // Pinned first, otherwise the API's own order (newest first).
  const items = [...notices]
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
    .map((notice) => ({
      id: notice._id,
      date: formatDateLocalized(notice.publishedAt, locale),
      category: t(`notice.category.${notice.category}`),
      title: notice.title,
      description: notice.description,
      pinned: notice.isPinned,
      attachmentUrl: notice.attachmentUrl,
      isDemo: notice.isDemo,
    }));

  return (
    <>
      <PageHeader
        title={t("page.notices.title")}
        description={t("page.notices.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.notices.crumb") },
        ]}
      />
      <Section size="md" reveal>
        <NoticeBoard notices={items} />
      </Section>
    </>
  );
}
