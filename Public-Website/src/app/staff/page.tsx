import { getStaff } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { PersonCard } from "@/components/ui/person-card";
import { EmptyState } from "@/components/ui/states";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { getPageContext, titleMetadata } from "@/lib/page-context";
import type { Staff } from "@/lib/types";

export const generateMetadata = titleMetadata("page.staff.title");

/**
 * The design splits staff into "Administrative" and "Support"; the CMS staff
 * record carries that as `staffType`. Records saved before the field existed
 * have none and count as administrative.
 */
function groupByType(staff: Staff[], adminTitle: string, supportTitle: string) {
  const admin = staff.filter((m) => (m.staffType ?? "administrative") === "administrative");
  const support = staff.filter((m) => m.staffType === "support");
  return [
    [adminTitle, admin],
    [supportTitle, support],
  ].filter(([, members]) => (members as Staff[]).length > 0) as [string, Staff[]][];
}

export default async function StaffPage() {
  const [{ t }, { data: staff, isFallback }] = await Promise.all([
    getPageContext(),
    getStaff(),
  ]);
  const hasDemo = !isFallback && staff.some((item) => item.isDemo);
  // Bundled samples → the design's two placeholder groups; real records →
  // grouped by staff type.
  const person = (id: string, role: string, dept: string) => ({
    id,
    name: t("page.placeholder.staffName"),
    role,
    department: dept,
    photoUrl: "",
  });
  const groups: [string, { id: string; name: string; role: string; department: string; photoUrl: string }[]][] = isFallback
    ? [
        [
          t("page.staff.admin"),
          Array.from({ length: 4 }, (_, i) =>
            person(`admin-${i}`, t("page.placeholder.adminRole"), t("page.placeholder.adminDept")),
          ),
        ],
        [
          t("page.staff.support"),
          Array.from({ length: 4 }, (_, i) =>
            person(`support-${i}`, t("page.placeholder.supportRole"), t("page.placeholder.supportDept")),
          ),
        ],
      ]
    : groupByType(staff, t("page.staff.admin"), t("page.staff.support")).map(([title, members]) => [
        title,
        members.map((m) => ({
          id: m._id,
          name: m.name,
          role: m.designation,
          department: m.department,
          photoUrl: m.photoUrl,
        })),
      ]);

  return (
    <>
      <PageHeader
        title={t("page.staff.title")}
        description={t("page.staff.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.staff.crumb") },
        ]}
      />
      <Section size="md" reveal>
        {(isFallback || hasDemo) && (
          <p className="mb-5">
            <SampleBadge label={t(isFallback ? "common.sampleContent" : "common.demoContent")} />
          </p>
        )}
        {groups.length === 0 ? (
          <EmptyState message={t("page.staff.empty")} />
        ) : (
          groups.map(([department, members]) => (
            <div key={department} className="mb-14 last:mb-0">
              <h2 className="mb-6 font-heading text-subtitle text-ink">
                {department}
              </h2>
              <ul className="grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,12.5rem),1fr))]">
                {members.map((member) => (
                  <li key={member.id}>
                    <PersonCard
                      name={member.name}
                      role={member.role}
                      photoUrl={member.photoUrl}
                      photoLabel={isFallback ? "" : undefined}
                      details={[member.department]}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </Section>
    </>
  );
}
