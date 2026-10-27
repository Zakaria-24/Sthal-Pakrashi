import { getUniform } from "@/lib/api";
import { ContentCard } from "@/components/ui/content-card";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { PageHeader } from "@/components/ui/page-header";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.uniform.title");

/**
 * School Uniform. While the CMS has only bundled samples the page shows the
 * design's four placeholder items (boys, girls, sports, winter), marked as
 * sample content; real records replace them as soon as they exist.
 */
export default async function UniformPage() {
  const [{ t }, { data: items, isFallback }] = await Promise.all([
    getPageContext(),
    getUniform(),
  ]);
  const hasDemo = !isFallback && items.some((item) => item.isDemo);

  const cards = isFallback
    ? (["u1", "u2", "u3", "u4"] as const).map((key) => ({
        id: key,
        audience: t(`page.uniform.${key}.audience`),
        title: t(`page.uniform.${key}.title`),
        description: t(`page.uniform.${key}.desc`),
        imageUrl: "",
      }))
    : items.map((item) => ({
        id: item._id,
        audience: [t(`uniform.audience.${item.audience}`), item.classLabel]
          .filter(Boolean)
          .join(" · "),
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
      }));

  return (
    <>
      <PageHeader
        title={t("page.uniform.title")}
        description={t("page.uniform.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.uniform.crumb") },
        ]}
      />
      <Section size="md" reveal>
        {(isFallback || hasDemo) && (
          <p className="mb-5">
            <SampleBadge label={t(isFallback ? "common.sampleContent" : "common.demoContent")} />
          </p>
        )}
        <ul className="grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))]">
          {cards.map((card) => (
            <li key={card.id}>
              <ContentCard className="group/uniform h-full overflow-hidden">
                <div className="aspect-[4/5] overflow-hidden bg-surface">
                  <ImageWithFallback
                    src={card.imageUrl}
                    alt={card.title}
                    label=""
                    className="size-full transition-transform duration-500 motion-safe:group-hover/uniform:scale-105"
                  />
                </div>
                <div className="p-5">
                  <Tag>{card.audience}</Tag>
                  <h2 className="mt-2.5 mb-1.5 font-heading text-ui font-bold text-ink">
                    {card.title}
                  </h2>
                  <p className="text-small text-ink-soft">{card.description}</p>
                </div>
              </ContentCard>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
