"use client";

import { useMemo, useState } from "react";

import { ArrowUpRightIcon, ChevronDownIcon, SearchIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Modal } from "@/components/ui/modal";
import { Section, SectionHeader } from "@/components/ui/section";
import { useI18n } from "@/lib/i18n/provider";
import { localizeDigits } from "@/lib/i18n";

export type FinderAlumnus = {
  id: string;
  name: string;
  photoUrl: string;
  passingYear: string;
  occupation: string;
  testimonial: string;
  isDemo?: boolean;
};

const MAX_CARDS = 6;

/**
 * "Find your alumni" — pill search bar (passing-year filter + text search) over
 * a card grid, each card opening a detail dialog.
 *
 * DATA GAP: the design filters by career category (Higher Study / Career /
 * Entrepreneur). The CMS alumni record has no such field, so the filter here
 * is the alumnus' passing year, which it does have.
 */
export function AlumniFinder({
  alumni,
  sampleLabel,
}: {
  alumni: FinderAlumnus[];
  sampleLabel?: string;
}) {
  const { t, locale } = useI18n();
  const [year, setYear] = useState("all");
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const years = useMemo(
    () =>
      [...new Set(alumni.map((a) => a.passingYear).filter(Boolean))].sort(
        (a, b) => b.localeCompare(a),
      ),
    [alumni],
  );

  const matches = useMemo(() => {
    const needle = text.trim().toLowerCase();
    return alumni.filter(
      (a) =>
        (year === "all" || a.passingYear === year) &&
        (!needle ||
          [a.name, a.occupation, a.passingYear].some((value) =>
            value.toLowerCase().includes(needle),
          )),
    );
  }, [alumni, year, text]);

  const active = alumni.find((a) => a.id === activeId);
  const suggestions = useMemo(
    () => [...new Set(alumni.flatMap((a) => [a.name, a.occupation]).filter(Boolean))],
    [alumni],
  );
  const batch = (value: string) =>
    t("home.finder.batch", { year: value });

  function show(id: string) {
    setActiveId(id);
    setOpen(true);
  }

  return (
    <Section tone="surface" size="lg" reveal width="wide">
      <SectionHeader
        align="center"
        ruled
        size="mid"
        eyebrow={t("home.finder.tag")}
        title={t("home.finder.title")}
        sampleLabel={sampleLabel}
        className="mb-9"
      />

      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="mx-auto mb-14 flex max-w-[46rem] flex-wrap items-center gap-2 rounded-3xl bg-white p-2 shadow-soft sm:flex-nowrap sm:rounded-pill"
      >
        <div className="relative shrink-0 border-line sm:border-r">
          <label htmlFor="finder-year" className="sr-only">
            {t("home.finder.filterLabel")}
          </label>
          <select
            id="finder-year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="min-h-12 cursor-pointer appearance-none bg-transparent py-3 pr-9 pl-4 text-small font-semibold text-ink outline-none"
          >
            <option value="all">{t("home.finder.allYears")}</option>
            {years.map((value) => (
              <option key={value} value={value}>
                {localizeDigits(value, locale)}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-ink-soft" />
        </div>

        <div className="flex min-w-32 flex-1 items-center gap-2 px-2">
          <SearchIcon className="text-ink-soft" />
          <label htmlFor="finder-search" className="sr-only">
            {t("home.finder.searchLabel")}
          </label>
          <input
            id="finder-search"
            type="search"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={t("home.finder.placeholder")}
            autoComplete="off"
            list="finder-suggestions"
            className="min-h-12 w-full bg-transparent text-small text-ink outline-none placeholder:text-ink-soft"
          />
          <datalist id="finder-suggestions">
            {suggestions.map((value) => (
              <option key={value} value={value} />
            ))}
          </datalist>
        </div>

        <Button type="submit" variant="gold" shape="pill" size="lg" className="w-full sm:w-auto">
          {t("home.finder.search")}
        </Button>
      </form>

      {matches.length === 0 ? (
        <EmptyState message={t("home.finder.empty")} />
      ) : (
        <ul className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))]">
          {matches.slice(0, MAX_CARDS).map((person) => (
            <li
              key={person.id}
              className="lift group/card relative overflow-hidden rounded-card bg-white has-focus-visible:ring-2 has-focus-visible:ring-green"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                <ImageWithFallback
                  src={person.photoUrl}
                  alt={person.name}
                  className="size-full transition-transform duration-500 motion-safe:group-hover/card:scale-[1.06]"
                />
                {person.passingYear && (
                  <span className="absolute top-3 left-3 rounded-pill bg-green px-3 py-1 font-heading text-micro font-bold whitespace-nowrap text-white">
                    {batch(localizeDigits(person.passingYear, locale))}
                  </span>
                )}
              </div>
              <div className="px-5 py-5.5">
                <h3 className="font-heading text-h4 text-ink">
                  <button
                    type="button"
                    onClick={() => show(person.id)}
                    className="cursor-pointer text-left outline-none after:absolute after:inset-0"
                  >
                    {person.name}
                  </button>
                </h3>
                {person.occupation && (
                  <p className="mt-1 text-small text-ink-soft">
                    {person.occupation}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 font-heading text-small font-bold text-green transition-colors duration-200 group-hover/card:text-gold-dark">
                  {t("common.findNow")}
                  <ArrowUpRightIcon className="size-3.5" />
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={active?.name ?? t("home.finder.tag")}
        hideTitle
        closeLabel={t("home.finder.close")}
      >
        {active && (
          <>
            <div className="aspect-video overflow-hidden bg-surface">
              <ImageWithFallback
                src={active.photoUrl}
                alt={active.name}
                className="size-full"
              />
            </div>
            <div className="px-6.5 pt-6.5 pb-7.5">
              {active.passingYear && (
                <p className="mb-2.5 font-heading text-small font-bold tracking-wide text-green">
                  {batch(localizeDigits(active.passingYear, locale))}
                </p>
              )}
              <h3 className="font-heading text-h3 text-ink">{active.name}</h3>
              {active.occupation && (
                <p className="mt-1 mb-4 text-body-sm font-semibold text-ink-soft">
                  {active.occupation}
                </p>
              )}
              {active.testimonial && (
                <p className="text-body-sm leading-relaxed text-ink-soft">
                  {active.testimonial}
                </p>
              )}
            </div>
          </>
        )}
      </Modal>
    </Section>
  );
}
