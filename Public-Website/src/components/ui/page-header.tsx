import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { H1, Text } from "@/components/typography";
import { getI18n } from "@/lib/i18n/server";

/**
 * Surface-tinted band at the top of every inner page: breadcrumb trail, H1 and
 * an optional lead paragraph (48px above, 56px below). With no `breadcrumbs`
 * it shows Home / <title>.
 */
export async function PageHeader({
  title,
  description,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
}) {
  const { t } = await getI18n();
  const crumbs = breadcrumbs ?? [
    { label: t("common.home"), href: "/" },
    { label: title },
  ];

  return (
    <div className="bg-surface pt-band-top pb-band-bottom">
      <Container>
        <Breadcrumbs
          items={crumbs}
          label={t("common.breadcrumb")}
          className="mb-2.5 animate-rise-in"
        />
        <H1 className="animate-rise-in delay-step-1">{title}</H1>
        {description && (
          <Text size="lg" className="mt-2.5 max-w-2xl animate-rise-in text-ink-soft delay-step-2">
            {description}
          </Text>
        )}
      </Container>
    </div>
  );
}
