"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/states";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Route-level error boundary. The API layer never throws (it falls back), so
 * this only catches genuine rendering bugs — but when it does, the visitor
 * gets the site chrome and a retry button instead of a blank screen.
 */
export default function RouteError({ reset }: { error: Error; reset: () => void }) {
  const { t } = useI18n();
  return (
    <Container className="py-page">
      <ErrorState
        title={t("common.errorTitle")}
        message={t("common.errorBody")}
        action={<Button onClick={reset}>{t("common.retry")}</Button>}
      />
    </Container>
  );
}
