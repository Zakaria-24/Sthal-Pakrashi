import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";

export type UsefulLinkItem = { id: string; title: string; url: string };

/** Official education portals as a row of pill links. */
export function UsefulLinks({
  title,
  description,
  links,
}: {
  title: string;
  description: string;
  links: UsefulLinkItem[];
}) {
  if (links.length === 0) return null;
  return (
    <Section size="none" reveal className="pb-17.5">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-card-lg bg-surface px-8 py-9">
        <div className="max-w-65">
          <h2 className="mb-1.5 font-heading text-h4 leading-normal font-extrabold text-ink">
            {title}
          </h2>
          <p className="text-small leading-[1.6] text-ink-soft">{description}</p>
        </div>
        <ul className="flex flex-1 flex-wrap gap-2.5">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-white px-4 py-2.5 text-nav-sm leading-normal font-semibold text-ink transition-[background-color,color,transform] duration-200 hover:bg-green hover:text-white motion-safe:hover:-translate-y-0.5"
              >
                {link.title}
                <ArrowUpRightIcon className="size-2.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
