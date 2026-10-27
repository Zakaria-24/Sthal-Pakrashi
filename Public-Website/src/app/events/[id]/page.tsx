import { notFound } from "next/navigation";

import { getEventById } from "@/lib/api";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { formatDateLocalized } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { SampleBadge } from "@/components/ui/sample-badge";

export async function generateMetadata(props: PageProps<"/events/[id]">) {
  const { id } = await props.params;
  const event = await getEventById(id);
  return { title: event?.title ?? "Event" };
}

/** Deep-linkable version of the event dialog. */
export default async function EventDetailPage(
  props: PageProps<"/events/[id]">,
) {
  const { id } = await props.params;
  const [event, { t, locale }] = await Promise.all([
    getEventById(id),
    getI18n(),
  ]);
  if (!event) notFound();

  return (
    <>
      <PageHeader
        title={event.title}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.events.crumb"), href: "/events" },
          { label: event.title },
        ]}
      />
      <Section size="md" width="narrow" reveal>
        <div className="mb-6 aspect-video overflow-hidden rounded-2xl bg-surface">
          <ImageWithFallback
            src={event.imageUrl}
            alt={event.title}
            className="size-full"
          />
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="inline-block rounded-pill bg-surface px-3 py-1 font-heading text-xs font-bold text-green">
            {t(`event.category.${event.category}`)}
          </span>
          {event.isDemo && <SampleBadge label={t("common.demoContent")} />}
        </div>
        <p className="mb-4 text-small text-ink-soft">
          {[formatDateLocalized(event.startDate, locale), event.venue]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <p className="text-body leading-relaxed whitespace-pre-line text-ink-soft">
          {event.description}
        </p>
      </Section>
    </>
  );
}
