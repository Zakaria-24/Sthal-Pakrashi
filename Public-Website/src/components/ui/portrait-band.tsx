import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

/**
 * Full-width green band with a square portrait beside a label, name and role
 * (teachers' "Head Teacher", the founder page). It stacks below 1024px.
 */
export function PortraitBand({
  id,
  label,
  name,
  role,
  photoUrl,
  children,
}: {
  id?: string;
  label: string;
  name: string;
  role?: string;
  photoUrl?: string;
  /** Extra muted lines under the role (e.g. education). */
  children?: ReactNode;
}) {
  return (
    <section id={id} className="reveal bg-green py-16">
      <Container
        size="narrow"
        className="grid items-center gap-8 lg:grid-cols-[0.6fr_1.4fr]"
      >
        <div className="aspect-square overflow-hidden rounded-card-lg bg-white/10">
          <ImageWithFallback
            src={photoUrl}
            alt={name}
            className="size-full"
          />
        </div>
        <div>
          <p className="mb-2.5 font-heading text-small font-bold tracking-eyebrow text-gold">
            {label}
          </p>
          <p className="mb-1 font-heading text-stat text-white">{name}</p>
          {role && <p className="text-body-sm text-on-green-muted">{role}</p>}
          {children}
        </div>
      </Container>
    </section>
  );
}
