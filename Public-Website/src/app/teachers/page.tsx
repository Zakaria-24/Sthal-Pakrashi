import { getLeadershipMessages, getTeachers } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { PersonCard } from "@/components/ui/person-card";
import { PortraitBand } from "@/components/ui/portrait-band";
import { EmptyState } from "@/components/ui/states";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { pickLeader } from "@/lib/leadership";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.teachers.title");

export default async function TeachersPage() {
  const [{ t, site }, { data: teachers, isFallback }, leaderRes] =
    await Promise.all([getPageContext(), getTeachers(), getLeadershipMessages()]);
  const leader = pickLeader(leaderRes.data, leaderRes.isFallback);
  const sample = t("common.sampleContent");

  // While the CMS has only bundled samples, show the design's placeholder
  // cards rather than invented named teachers.
  const cards = isFallback
    ? Array.from({ length: 8 }, (_, i) => ({
        id: `placeholder-${i}`,
        name: t("page.placeholder.teacherName"),
        role: t("page.placeholder.teacherRole"),
        photoUrl: "",
        subject: t("page.placeholder.subject"),
        qualification: t("page.placeholder.qualification"),
        isDemo: false,
      }))
    : teachers.map((teacher) => ({
        id: teacher._id,
        name: teacher.name,
        role: teacher.designation,
        photoUrl: teacher.photoUrl,
        subject: teacher.subject,
        qualification: teacher.qualification,
        isDemo: teacher.isDemo,
      }));

  return (
    <>
      <PageHeader
        title={t("page.teachers.title")}
        description={t("page.teachers.desc", { name: site.name })}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.teachers.crumb") },
        ]}
      />

      <PortraitBand
        id="head"
        label={t("page.teachers.headTag")}
        name={leader?.name || t("page.about.leaderPlaceholderName")}
        role={
          leader?.designation ||
          t("page.about.leaderPlaceholderRole", { name: site.name })
        }
        photoUrl={leader?.photoUrl}
      >
        {(!leader || leader.isDemo) && (
          <SampleBadge label={leader ? t("common.demoContent") : sample} className="mt-3" />
        )}
      </PortraitBand>

      <Section size="md" reveal>
        <h2 className="mb-7 flex flex-wrap items-center justify-center gap-3 text-center font-heading text-title text-ink">
          {t("page.teachers.faculty")}
          {isFallback && <SampleBadge label={sample} />}
        </h2>
        {cards.length === 0 ? (
          <EmptyState message={t("page.teachers.empty")} />
        ) : (
          <ul className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,12.5rem),1fr))]">
            {cards.map((card) => (
              <li key={card.id}>
                <PersonCard
                  avatar="lg"
                  name={card.name}
                  role={card.role}
                  photoUrl={card.photoUrl}
                  photoLabel={isFallback ? "" : undefined}
                  details={[card.subject, card.qualification]}
                />
                {card.isDemo && <div className="mt-2 text-center"><SampleBadge label={t("common.demoContent")} /></div>}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
