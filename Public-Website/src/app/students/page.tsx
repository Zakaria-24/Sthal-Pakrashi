import { getClasses } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Section } from "@/components/ui/section";
import { formatCount } from "@/lib/format";
import { localizeDigits } from "@/lib/i18n";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.students.title");

const TH =
  "px-4.5 py-3.5 font-heading text-small font-bold text-ink-soft";
const TD = "px-4.5 py-3.5 text-body-sm";

export default async function StudentsPage() {
  const [{ t, locale }, { data: classes, isFallback }] = await Promise.all([
    getPageContext(),
    getClasses(),
  ]);

  const boys = classes.reduce((sum, c) => sum + c.boys, 0);
  const girls = classes.reduce((sum, c) => sum + c.girls, 0);
  const total = boys + girls;
  const boysPct = total > 0 ? Math.round((boys / total) * 100) : 0;
  const girlsPct = total > 0 ? 100 - boysPct : 0;
  const n = (value: number) => formatCount(value, locale);
  const sample = isFallback ? (
    <SampleBadge label={t("common.sampleContent")} />
  ) : classes.some((c) => c.isDemo) ? (
    <SampleBadge label={t("common.demoContent")} />
  ) : null;

  return (
    <>
      <PageHeader
        title={t("page.students.title")}
        description={t("page.students.desc")}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.students.crumb") },
        ]}
      />

      {classes.length === 0 ? (
        <Section size="md">
          <EmptyState message={t("page.students.empty")} />
        </Section>
      ) : (
        <>
          <section className="reveal pt-12 md:pt-16">
            <Container>
              <h2 className="mb-5 flex flex-wrap items-center gap-3 font-heading text-subtitle text-ink">
                {t("page.students.summary")}
                {sample}
              </h2>
              <ul className="mb-4 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,12.5rem),1fr))]">
                <li className="rounded-xl bg-surface px-5.5 py-5">
                  <p className="font-heading text-title text-green">{n(boys)}</p>
                  <p className="text-small font-semibold text-ink-soft">
                    {t("page.students.boys")}
                  </p>
                </li>
                <li className="rounded-xl bg-surface px-5.5 py-5">
                  <p className="font-heading text-title text-gold-dark">{n(girls)}</p>
                  <p className="text-small font-semibold text-ink-soft">
                    {t("page.students.girls")}
                  </p>
                </li>
                <li className="rounded-xl bg-green px-5.5 py-5">
                  <p className="font-heading text-title text-white">{n(total)}</p>
                  <p className="text-small font-semibold text-on-green-muted">
                    {t("page.students.total")}
                  </p>
                </li>
              </ul>
              <div
                role="img"
                aria-label={`${t("page.students.boysPct", { pct: boysPct })}, ${t("page.students.girlsPct", { pct: girlsPct })}`}
                className="flex h-3.5 overflow-hidden rounded-pill border border-line"
              >
                <div className="bg-green" style={{ width: `${boysPct}%` }} />
                <div className="bg-gold" style={{ width: `${girlsPct}%` }} />
              </div>
              <div className="mt-2.5 flex gap-4.5 text-small text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden className="size-2.5 rounded-full bg-green" />
                  {t("page.students.boysPct", { pct: boysPct })}
                </span>
                <span className="flex items-center gap-1.5">
                  <span aria-hidden className="size-2.5 rounded-full bg-gold" />
                  {t("page.students.girlsPct", { pct: girlsPct })}
                </span>
              </div>
            </Container>
          </section>

          <Section id="classes" reveal className="pt-11 md:pt-11" size="md">
            <h2 className="mb-6 font-heading text-subtitle text-ink">
              {t("page.students.structure")}
            </h2>
            <div className="overflow-x-auto rounded-card border border-line">
              <table className="w-full min-w-[35rem] border-collapse text-left sm:min-w-[40rem]">
                <thead>
                  <tr className="bg-surface">
                    <th scope="col" className={TH}>{t("page.students.colClass")}</th>
                    <th scope="col" className={TH}>{t("page.students.colShift")}</th>
                    <th scope="col" className={TH}>{t("page.students.colVersion")}</th>
                    <th scope="col" className={TH}>{t("page.students.colSections")}</th>
                    <th scope="col" className={`${TH} text-right`}>{t("page.students.boys")}</th>
                    <th scope="col" className={`${TH} text-right`}>{t("page.students.girls")}</th>
                    <th scope="col" className={`${TH} text-right`}>{t("page.students.total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c._id} className="border-t border-line">
                      <th scope="row" className={`${TD} font-semibold text-ink`}>
                        {c.className}
                        {c.group && c.group !== "none" && (
                          <span className="font-normal text-ink-soft">
                            {" · "}
                            {t(`page.programs.${c.group}` as "page.programs.science")}
                          </span>
                        )}
                      </th>
                      <td className={`${TD} text-ink-soft`}>{t(`shift.${c.shift}`)}</td>
                      <td className={`${TD} text-ink-soft`}>{t(`version.${c.version}`)}</td>
                      <td className={`${TD} text-ink-soft`}>
                        {localizeDigits(c.approvedSections, locale)}
                      </td>
                      <td className={`${TD} text-right text-ink-soft`}>{n(c.boys)}</td>
                      <td className={`${TD} text-right text-ink-soft`}>{n(c.girls)}</td>
                      <td className={`${TD} text-right font-bold text-green`}>
                        {n(c.boys + c.girls)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-line bg-surface">
                    <th
                      scope="row"
                      colSpan={4}
                      className={`${TD} font-heading font-extrabold text-ink`}
                    >
                      {t("page.students.total")}
                    </th>
                    <td className={`${TD} text-right font-extrabold text-ink`}>{n(boys)}</td>
                    <td className={`${TD} text-right font-extrabold text-ink`}>{n(girls)}</td>
                    <td className={`${TD} text-right font-extrabold text-green`}>{n(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="mt-3.5 text-small text-ink-soft">
              {t("page.students.note")}
            </p>
          </Section>
        </>
      )}
    </>
  );
}
