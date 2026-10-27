import Link from "next/link";

import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** Home / Section / Page trail. The last crumb is the current page. */
export function Breadcrumbs({
  items,
  label,
  className,
}: {
  items: Crumb[];
  /** Accessible name of the landmark. */
  label: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-ink-soft">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="transition-colors duration-150 hover:text-green"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(last && "font-semibold text-green")}
                >
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden className="text-ink-soft/60">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
