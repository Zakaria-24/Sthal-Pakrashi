import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/** Closing green call-to-action panel. */
export function CtaBanner({
  title,
  description,
  buttonLabel,
  href,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}) {
  return (
    <Section size="none" reveal className="py-17.5">
      <div className="relative overflow-hidden rounded-3xl bg-green px-5 py-12 text-center sm:px-10 sm:py-14">
        <span
          aria-hidden
          className="absolute -top-15 -right-10 size-50 rounded-full bg-gold opacity-15"
        />
        <h2 className="relative mb-3.5 font-heading text-h2-low text-balance text-white">
          {title}
        </h2>
        <p className="relative mx-auto mb-7 max-w-2xl text-copy text-on-green-soft">
          {description}
        </p>
        <Link
          href={href}
          className={cn(
            buttonVariants({ variant: "outline-light", size: "lg" }),
            "relative min-h-13 max-w-full border-white px-7.5 whitespace-normal",
          )}
        >
          {buttonLabel}
          <ArrowUpRightIcon />
        </Link>
      </div>
    </Section>
  );
}
