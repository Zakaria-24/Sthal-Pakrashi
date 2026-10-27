import { getCommittee } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { PersonCard } from "@/components/ui/person-card";
import { EmptyState } from "@/components/ui/states";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.committee.title");

export default async function CommitteePage() {
  const [{ t, site }, { data: members, isFallback }] = await Promise.all([
    getPageContext(),
    getCommittee(),
  ]);
  const hasDemo = !isFallback && members.some((item) => item.isDemo);

  // Design placeholder cards while the CMS has only bundled samples.
  const cards = isFallback
    ? Array.from({ length: 6 }, (_, i) => ({
        id: `placeholder-${i}`,
        name: t("page.placeholder.memberName"),
        role: t("page.placeholder.memberRole"),
        photoUrl: "",
        detail: t("page.placeholder.memberDetail"),
      }))
    : members.map((member) => ({
        id: member._id,
        name: member.name,
        role: member.designation,
        photoUrl: member.photoUrl,
        detail: member.education,
      }));

  return (
    <>
      <PageHeader
        title={t("page.committee.title")}
        description={t("page.committee.desc", { name: site.name })}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.committee.crumb") },
        ]}
      />
      <Section size="md" reveal>
        {(isFallback || hasDemo) && (
          <p className="mb-5">
            <SampleBadge label={t(isFallback ? "common.sampleContent" : "common.demoContent")} />
          </p>
        )}
        {cards.length === 0 ? (
          <EmptyState message={t("page.committee.empty")} />
        ) : (
          <ul className="grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,13.75rem),1fr))]">
            {cards.map((card) => (
              <li key={card.id}>
                <PersonCard
                  tone="white"
                  name={card.name}
                  role={card.role}
                  photoUrl={card.photoUrl}
                  photoLabel={isFallback ? "" : undefined}
                  details={[card.detail]}
                />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
