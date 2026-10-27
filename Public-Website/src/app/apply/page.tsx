import Link from "next/link";

import { ApplyForm } from "@/components/pages/apply-form";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { getPageContext, titleMetadata } from "@/lib/page-context";

export const generateMetadata = titleMetadata("page.apply.title");

export default async function ApplyPage() {
  const { t, site, settings } = await getPageContext();
  return (
    <>
      <PageHeader
        title={t("page.apply.title")}
        description={t("page.apply.desc", { name: site.name })}
        breadcrumbs={[
          { label: t("common.home"), href: "/" },
          { label: t("page.apply.crumb") },
        ]}
      />
      <Section size="md" reveal contentClassName="max-w-[calc(47.5rem+2*var(--gutter))]">
        {settings.admissionOpen ? (
          <ApplyForm />
        ) : (
          <div className="rounded-card-lg border border-line bg-white px-9 py-11 text-center">
            <h2 className="mb-2.5 font-heading text-h3 font-extrabold text-ink">
              {t("page.apply.closedTitle")}
            </h2>
            <p className="mb-6 text-body-sm text-ink-soft">
              {t("page.apply.closedDesc")}
            </p>
            <Link
              href="/admission-info"
              className={buttonVariants({ variant: "default", shape: "pill" })}
            >
              {t("page.apply.closedButton")}
            </Link>
          </div>
        )}
      </Section>
    </>
  );
}
