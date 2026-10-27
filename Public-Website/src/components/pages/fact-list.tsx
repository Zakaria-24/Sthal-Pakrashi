import { InfoCard } from "@/components/ui/info-card";
import { Section } from "@/components/ui/section";

export type Fact = { label: string; value: string; missing?: boolean };

/**
 * The single 640px column of label/value cards used by the Information
 * Service Centre and Grievance Officer pages.
 */
export function FactList({ facts }: { facts: Fact[] }) {
  return (
    <Section size="md" reveal contentClassName="max-w-[calc(40rem+2*var(--gutter))]">
      <ul className="flex flex-col gap-4.5">
        {facts.map((fact) => (
          <li key={fact.label}>
            <InfoCard
              label={fact.label}
              value={fact.value}
              muted={fact.missing}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
