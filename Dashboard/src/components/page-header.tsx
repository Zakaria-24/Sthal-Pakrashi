import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Padding and max width shared by every dashboard page, so the content column
 * lines up from page to page and tightens on phones.
 */
export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Page title row: a gold-dot eyebrow (as on the public site), the title, a
 * short description and the page's primary actions. Actions drop under the
 * title on narrow screens.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: string;
  description?: ReactNode;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 inline-flex items-center gap-2 text-eyebrow tracking-eyebrow text-brand uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-gold-dark" />
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading text-h1 text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
