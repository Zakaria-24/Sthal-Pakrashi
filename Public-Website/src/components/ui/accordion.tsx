"use client";

import { useId, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Accessible accordion. Each header is a real <button> with aria-expanded /
 * aria-controls; the panel animates height through a grid-rows transition (no
 * measuring, no layout jump) and is `inert` while closed so its contents drop
 * out of the tab order.
 */
export type AccordionItem = {
  id: string;
  header: ReactNode;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  /** "single" keeps one panel open; "multiple" lets each toggle freely. */
  type?: "single" | "multiple";
  defaultOpen?: string[];
  /** Renders a header's row; receives the open state for icon/colour swaps. */
  renderHeader?: (item: AccordionItem, open: boolean) => ReactNode;
  className?: string;
  itemClassName?: string;
  headerClassName?: string | ((open: boolean) => string);
  panelClassName?: string;
};

export function Accordion({
  items,
  type = "single",
  defaultOpen = [],
  renderHeader,
  className,
  itemClassName,
  headerClassName,
  panelClassName,
}: AccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen);

  function toggle(id: string) {
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      return type === "single" ? [id] : [...current, id];
    });
  }

  return (
    <div className={className}>
      {items.map((item) => {
        const open = openIds.includes(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className={itemClassName}>
            <button
              type="button"
              id={buttonId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-3 text-left",
                typeof headerClassName === "function"
                  ? headerClassName(open)
                  : headerClassName,
              )}
            >
              {renderHeader ? renderHeader(item, open) : item.header}
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div
                inert={!open}
                className={cn(
                  "min-h-0 overflow-hidden transition-opacity duration-300",
                  open ? "opacity-100" : "opacity-0",
                  panelClassName,
                )}
              >
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
