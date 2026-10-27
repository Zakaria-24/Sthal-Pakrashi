import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Section, SectionHeader } from "@/components/ui/section";
import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";

export type AdmissionStep = {
  title: string;
  description: string;
  icon: ReactNode;
};

export type AdmissionStat = {
  label: string;
  value: string;
  icon: ReactNode;
};

/** "How to get admitted": three step cards, then a row of school figures. */
export function AdmissionSection({
  eyebrow,
  title,
  steps,
  stats,
  applyHref,
  applyLabel,
}: {
  eyebrow: string;
  title: string;
  steps: AdmissionStep[];
  stats: AdmissionStat[];
  applyHref: string;
  applyLabel: string;
}) {
  return (
    <Section tone="surface" size="lg" reveal>
      <SectionHeader align="center" eyebrow={eyebrow} title={title} className="mb-12" />

      <ol className="mb-14 grid grid-fit-60 gap-6.5">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="lift flex flex-col rounded-card-lg bg-white px-6.5 pt-8.5 pb-6.5"
          >
            <span className="mb-5 flex size-12.5 items-center justify-center rounded-full bg-gold-tint text-gold-dark">
              {step.icon}
            </span>
            <h3 className="mb-2.5 font-heading text-h4 leading-normal text-ink">{step.title}</h3>
            <p className="mb-6 flex-1 text-nav leading-[1.6] text-ink-soft">
              {step.description}
            </p>
            <Link
              href={applyHref}
              className={cn(
                buttonVariants({
                  variant: index === 1 ? "default" : "soft",
                  shape: "pill",
                }),
                "self-start border-0 px-4.75 py-2.75 text-nav leading-normal motion-safe:hover:translate-x-0.5",
              )}
            >
              {applyLabel}
              <ArrowUpRightIcon />
            </Link>
          </li>
        ))}
      </ol>

      {stats.length > 0 && (
        <ul className="grid grid-fit-45 items-stretch max-sm:grid-cols-2">
          {stats.map((stat, index) => (
            <li key={stat.label} className="flex">
              <StatCard
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                tone={index % 2 === 0 ? "green" : "light"}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
