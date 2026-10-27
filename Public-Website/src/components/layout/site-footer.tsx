import Link from "next/link";

import { BrandLockup } from "@/components/layout/brand-lockup";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { getI18n } from "@/lib/i18n/server";
import { FOOTER_COLUMNS } from "@/lib/navigation";
import { getSiteText } from "@/lib/site-text";
import type { SiteSettings } from "@/lib/types";

const FOOTER_LINK =
  "text-body-sm text-footer-muted transition-[color,transform] duration-200 hover:text-gold motion-safe:hover:translate-x-0.5";

/** Dark footer: brand, two link columns, contact, and the legal strip. */
export async function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { locale, t } = await getI18n();
  const site = getSiteText(settings, locale);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-footer px-gutter pt-16 pb-6 text-footer-text">
      <Container
        className="grid gap-10 border-b border-white/10 px-0 pb-10 [grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))]"
      >
        <div>
          <BrandLockup
            name={t("brand.footerName")}
            logoUrl={settings.logoUrl}
            logoAlt={t("brand.logoAlt")}
            className="mb-3.5"
          />
          <p className="text-body-sm text-footer-muted">
            {t("footer.tagline", { place: site.address, year: site.year })}
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.id} aria-labelledby={`footer-${column.id}`}>
            <h2
              id={`footer-${column.id}`}
              className="mb-4 font-heading text-ui font-bold text-white"
            >
              {t(column.titleKey)}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className={FOOTER_LINK}>
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="mb-4 font-heading text-ui font-bold text-white">
            {t("footer.contact")}
          </h2>
          <ul className="flex flex-col gap-2.5 text-body-sm text-footer-muted">
            <li>{site.address}</li>
            <li>{t("top.eiin", { eiin: site.eiin })}</li>
            <li>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 transition-[color,gap] duration-200 hover:gap-2.5 hover:text-gold"
              >
                {t("footer.contact")}
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-wrap justify-between gap-3 px-0 pt-5.5 text-small text-footer-muted">
        <span>{t("footer.copyright", { year, name: site.name })}</span>
        <span>
          {t("footer.board", { year: site.year, board: site.board })}
        </span>
      </Container>
    </footer>
  );
}
