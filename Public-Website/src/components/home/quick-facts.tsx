import { Container } from "@/components/ui/container";

export type QuickFact = { label: string; value: string };

/** Full-width green strip of registration facts (EIIN, MPO, board, type, year). */
export function QuickFacts({ facts }: { facts: QuickFact[] }) {
  if (facts.length === 0) return null;
  return (
    <section className="reveal mt-14 bg-green py-8.5">
      <Container>
        <ul className="grid grid-fit-47.5 gap-5">
          {facts.map((fact) => (
            <li
              key={fact.label}
              className="px-3 py-1 text-center text-white max-sm:p-2 sm:border-r sm:border-white/15"
            >
              <p className="mb-1 font-heading text-xl font-extrabold">
                {fact.value}
              </p>
              <p className="text-small font-semibold tracking-wide text-on-green-soft">
                {fact.label}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
