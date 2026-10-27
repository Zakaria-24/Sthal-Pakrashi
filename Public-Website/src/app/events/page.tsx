import { getEvents } from "@/lib/api";
import { EventBoard } from "@/components/pages/event-board";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { formatDateLocalized } from "@/lib/i18n";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.events.title");

export default async function EventsPage() {
  const [{ t, locale }, { data: events }] = await Promise.all([
    getPageContext(),
    getEvents(),
  ]);

  const items = events.map((event) => ({
    id: event._id,
    date: formatDateLocalized(event.startDate, locale),
    category: t(`event.category.${event.category}`),
    title: event.title,
    venue: event.venue,
    description: event.description,
    imageUrl: event.imageUrl,
    featured: event.isFeatured,
    isDemo: event.isDemo,
  }));

  return (
    <>
      <PageHeader
        title={t("page.events.title")}
        description={t("page.events.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.events.crumb") },
        ]}
      />
      <Section size="md" reveal>
        <EventBoard events={items} />
      </Section>
    </>
  );
}
