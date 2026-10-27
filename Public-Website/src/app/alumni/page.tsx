import { getAlumni } from "@/lib/api";
import { ContentCard } from "@/components/ui/content-card";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { localizeDigits } from "@/lib/i18n";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.alumni.title");

export default async function AlumniPage() {
  const [{ t, locale, site }, { data: alumni, isFallback }] =
    await Promise.all([getPageContext(), getAlumni()]);

  return (
    <>
      <PageHeader
        title={t("page.alumni.title")}
        description={t("page.alumni.desc", { name: site.name })}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.alumni.crumb") },
        ]}
      />
      <Section size="md" reveal>
        {isFallback && (
          <p className="mb-5">
            <SampleBadge label={t("common.sampleContent")} />
          </p>
        )}
        {alumni.length === 0 ? (
          <EmptyState message={t("page.alumni.empty")} />
        ) : (
          <ul className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,16.25rem),1fr))]">
            {alumni.map((person) => (
              <li key={person._id}>
                <ContentCard className="h-full p-6">
                  <div className="mb-3.5 flex items-center gap-3.5">
                    <ImageWithFallback
                      src={person.photoUrl}
                      alt={person.name}
                      className="size-14 shrink-0 rounded-full"
                    />
                    <div className="min-w-0">
                      <p className="font-heading text-ui font-bold text-ink">
                        {person.name}
                      </p>
                      {person.isDemo && <SampleBadge label={t("common.demoContent")} />}
                      {person.occupation && (
                        <p className="text-small font-semibold text-green">
                          {person.occupation}
                        </p>
                      )}
                      {person.passingYear && (
                        <p className="text-xs text-ink-soft">
                          {t("page.passingYear", {
                            year: localizeDigits(person.passingYear, locale),
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  {person.testimonial && (
                    <p className="text-small leading-relaxed text-ink-soft italic">
                      “{person.testimonial}”
                    </p>
                  )}
                </ContentCard>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
