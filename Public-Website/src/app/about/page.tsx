import { getGallery, getLeadershipMessages } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { InfoCard } from "@/components/ui/info-card";
import { PageHeader } from "@/components/ui/page-header";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { H2 } from "@/components/typography";
import { isRealValue } from "@/lib/format";
import { pickLeader } from "@/lib/leadership";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.about.title");

export default async function AboutPage() {
  const [{ t, settings, site }, { data: gallery }, leaderRes] =
    await Promise.all([
      getPageContext(),
      getGallery(1),
      getLeadershipMessages(),
    ]);
  const leader = pickLeader(leaderRes.data, leaderRes.isFallback);

  const params = {
    name: site.name,
    year: site.year,
    place: site.address,
    board: site.board,
    eiin: site.eiin,
    mpo: site.mpo,
  };
  const notPublished = t("page.notPublished");
  const val = (raw: string, shown: string) =>
    isRealValue(raw) ? shown : notPublished;

  const profile = [
    { label: t("page.about.institutionName"), value: site.name, muted: false },
    { label: t("page.about.institutionType"), value: val(settings.institutionType, site.type), muted: !isRealValue(settings.institutionType) },
    { label: "EIIN", value: val(settings.eiin, site.eiin), muted: !isRealValue(settings.eiin) },
    { label: t("page.about.institutionCode"), value: val(settings.institutionCode, settings.institutionCode), muted: !isRealValue(settings.institutionCode) },
    { label: t("page.about.establishedYear"), value: val(settings.establishedYear, site.year), muted: !isRealValue(settings.establishedYear) },
    { label: t("page.about.address"), value: site.address, muted: false },
    { label: t("page.about.mpoCode"), value: val(settings.mpoCode, site.mpo), muted: !isRealValue(settings.mpoCode) },
    { label: t("page.about.board"), value: site.board, muted: false },
  ];

  const cards = [
    { title: t("page.about.mission"), text: settings.missionStatement },
    { title: t("page.about.vision"), text: settings.visionStatement },
    { title: t("page.about.recognition"), text: t("page.about.recognitionText", params) },
  ].filter((card) => card.text);

  return (
    <>
      <PageHeader
        title={t("page.about.title")}
        description={t("page.about.desc", params)}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.about.crumb") },
        ]}
      />

      <Section
        reveal
        contentClassName="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
      >
        <div className="aspect-square overflow-hidden rounded-2xl bg-surface">
          <ImageWithFallback
            src={gallery[0]?.imageUrl}
            alt={gallery[0]?.title ?? t("home.about.imageAlt")}
            className="size-full"
          />
        </div>
        <div>
          <p className="font-heading text-small font-bold tracking-eyebrow text-gold-dark">
            {t("page.about.historyTag")}
          </p>
          <H2 className="mt-2.5 mb-4.5 text-balance">
            {t("page.about.historyTitle", params)}
          </H2>
          <p className="mb-4 text-body text-ink-soft">
            {t("page.about.p1", params)}
          </p>
          <p className="text-body text-ink-soft">{t("page.about.p2", params)}</p>
        </div>
      </Section>

      {cards.length > 0 && (
        <Section id="mission" tone="surface" reveal>
          <ul className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(13.75rem,1fr))]">
            {cards.map((card) => (
              <li
                key={card.title}
                className="rounded-card border border-line bg-white p-6.5"
              >
                <h3 className="mb-2 font-heading text-h4 text-green">
                  {card.title}
                </h3>
                <p className="text-body-sm text-ink-soft">{card.text}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="profile" reveal>
        <h2 className="mb-2.5 text-center font-heading text-title text-ink">
          {t("page.about.profileTitle")}
        </h2>
        <p className="mb-7 text-center text-body-sm text-ink-soft">
          {t("page.about.profileDesc", params)}
        </p>
        <ul className="grid gap-4.5 [grid-template-columns:repeat(auto-fit,minmax(11.875rem,1fr))]">
          {profile.map((item) => (
            <li key={item.label}>
              <InfoCard
                variant="tile"
                label={item.label}
                value={item.value}
                muted={item.muted}
                className="h-full"
              />
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6.5 max-w-2xl text-center text-body-sm leading-relaxed text-pretty text-ink-soft">
          {t("page.about.profileSummary", params)}
        </p>
      </Section>

      <section className="reveal bg-green py-section-sm">
        <Container
          size="narrow"
          className="grid items-center gap-9 lg:grid-cols-[0.7fr_1.3fr]"
        >
          <div className="aspect-square overflow-hidden rounded-card bg-white/10">
            <ImageWithFallback
              src={leader?.photoUrl}
              alt={leader?.name ?? t("page.about.leaderPlaceholderName")}
              className="size-full"
            />
          </div>
          <div>
            <p className="mb-3 flex flex-wrap items-center gap-2.5 font-heading text-small font-bold tracking-eyebrow text-gold">
              {t("page.about.leadershipTag")}
              {(!leader || leader.isDemo) && (
                <SampleBadge label={t(leader ? "common.demoContent" : "common.sampleContent")} />
              )}
            </p>
            <blockquote className="mb-4.5 text-body-lg leading-relaxed text-on-green-soft italic">
              “{leader?.message || t("page.about.leaderPlaceholderQuote", params)}”
            </blockquote>
            <p className="font-heading text-ui font-bold text-white">
              {leader?.name || t("page.about.leaderPlaceholderName")}
            </p>
            <p className="text-body-sm text-on-green-muted">
              {leader?.designation || t("page.about.leaderPlaceholderRole", params)}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
