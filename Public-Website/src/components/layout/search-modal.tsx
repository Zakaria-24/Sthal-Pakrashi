"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { searchSiteAction } from "@/app/actions/search";
import { SearchIcon } from "@/components/ui/icons";
import { DialogCloseButton, Modal } from "@/components/ui/modal";
import { useI18n } from "@/lib/i18n/provider";
import type { MessageKey } from "@/lib/i18n";
import { flattenNav } from "@/lib/navigation";
import {
  MAX_QUERY_LENGTH,
  MIN_QUERY_LENGTH,
  hitHref,
  type SearchHit,
  type SearchHitType,
} from "@/lib/search";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 250;

const TYPE_LABEL: Record<SearchHitType, MessageKey> = {
  notice: "search.type.notice",
  event: "search.type.event",
  teacher: "search.type.teacher",
  staff: "search.type.staff",
  alumni: "search.type.alumni",
  gallery: "search.type.gallery",
  video: "search.type.video",
  document: "search.type.document",
};

const SUGGESTIONS: MessageKey[] = [
  "nav.noticeEvents.notices",
  "nav.people.alumni",
  "nav.schoolLife.uniform",
];

type ResultRow = { key: string; title: string; meta: string; href: string };

type Remote = {
  /** The query these results answer — stale results are never shown. */
  query: string;
  hits: SearchHit[];
  unavailable: boolean;
};

/**
 * Full-screen search overlay. Page results are matched instantly against the
 * navigation data; content results (notices, events, people, documents) come
 * from the existing CMS list endpoints through a server action, debounced and
 * race-safe. Combobox keyboard model: ↑/↓ move, Enter opens, Esc closes.
 */
export function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);

  const [query, setQuery] = useState("");
  const [remote, setRemote] = useState<Remote | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const trimmed = query.trim();
  const canSearch = trimmed.length >= MIN_QUERY_LENGTH;
  const settled = remote?.query === trimmed;

  // Debounced, race-safe content search.
  useEffect(() => {
    if (!open || !canSearch) return;
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      let next: Remote;
      try {
        const result = await searchSiteAction(trimmed);
        next = { query: trimmed, ...result };
      } catch {
        next = { query: trimmed, hits: [], unavailable: true };
      }
      if (id === requestId.current) setRemote(next);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [open, canSearch, trimmed]);

  const rows = useMemo<ResultRow[]>(() => {
    if (!canSearch) return [];
    const needle = trimmed.toLowerCase();
    const pages: ResultRow[] = flattenNav()
      .map((leaf) => ({ leaf, label: t(leaf.labelKey) }))
      .filter(({ label }) => label.toLowerCase().includes(needle))
      .map(({ leaf, label }) => ({
        key: `page-${leaf.id}`,
        title: label,
        meta: t("search.type.page"),
        href: leaf.href,
      }));
    const content: ResultRow[] = (settled ? remote.hits : []).map((hit) => ({
      key: `${hit.type}-${hit.id}`,
      title: hit.title,
      meta: [t(TYPE_LABEL[hit.type]), hit.detail].filter(Boolean).join(" · "),
      href: hitHref(hit),
    }));
    return [...pages, ...content];
  }, [canSearch, trimmed, settled, remote, t]);

  const loading = canSearch && !settled;
  const activeRow = rows[Math.min(activeIndex, Math.max(rows.length - 1, 0))];
  const activeId = activeRow ? `search-option-${activeRow.key}` : undefined;

  function handleOpenChange(next: boolean) {
    if (!next) {
      setQuery("");
      setRemote(null);
      setActiveIndex(0);
    }
    onOpenChange(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (rows.length === 0) return;
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + step + rows.length) % rows.length);
    } else if (event.key === "Enter" && activeRow) {
      event.preventDefault();
      router.push(activeRow.href);
      handleOpenChange(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={t("search.title")}
      hideTitle
      closeLabel={t("search.close")}
      showClose={false}
      placement="top"
      width="md"
      initialFocus={inputRef}
      className="rounded-2xl"
    >
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <SearchIcon className="size-4.5 text-green" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={rows.length > 0}
          aria-controls="search-results"
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          maxLength={MAX_QUERY_LENGTH}
          value={query}
          placeholder={t("search.placeholder")}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-ui text-ink outline-none placeholder:text-ink-soft/70 [&::-webkit-search-cancel-button]:hidden"
        />
        <DialogCloseButton
          label={t("search.close")}
          className="size-8 bg-surface text-ink-soft hover:bg-green hover:text-white"
        />
      </div>

      <div
        id="search-results"
        role="listbox"
        aria-label={t("search.title")}
        aria-busy={loading}
        className="max-h-[50dvh] overflow-y-auto p-2"
      >
        {!canSearch && (
          <div className="px-4 py-6 text-center text-body-sm text-ink-soft">
            <p>{t("search.hint")}</p>
            <p className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-small font-semibold">
                {t("search.suggestions")}:
              </span>
              {SUGGESTIONS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setQuery(t(key))}
                  className="min-h-9 cursor-pointer rounded-pill bg-surface px-4 text-small font-semibold text-ink transition-colors duration-150 hover:bg-green hover:text-white"
                >
                  {t(key)}
                </button>
              ))}
            </p>
          </div>
        )}

        {rows.map((row, index) => (
          <Link
            key={row.key}
            id={`search-option-${row.key}`}
            role="option"
            aria-selected={row === activeRow}
            href={row.href}
            onClick={() => handleOpenChange(false)}
            onMouseMove={() => setActiveIndex(index)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg px-3.5 py-3 text-ink transition-[background-color,transform] duration-150 motion-safe:aria-selected:translate-x-1",
              row === activeRow && "bg-surface",
            )}
          >
            <span className="min-w-0 truncate text-ui font-semibold">
              {row.title}
            </span>
            <span className="shrink-0 text-xs text-ink-soft">{row.meta}</span>
          </Link>
        ))}

        {loading && (
          <p
            role="status"
            className="px-4 py-4 text-center text-body-sm text-ink-soft"
          >
            {t("search.loading")}
          </p>
        )}

        {canSearch && settled && rows.length === 0 && (
          <p
            role="status"
            className="px-4 py-8 text-center text-body-sm text-ink-soft"
          >
            {remote.unavailable ? t("search.unavailable") : t("search.empty")}
          </p>
        )}

        {canSearch && settled && rows.length > 0 && remote.unavailable && (
          <p className="px-4 py-3 text-center text-small text-ink-soft">
            {t("search.unavailable")}
          </p>
        )}
      </div>

      <p className="hidden border-t border-line px-5 py-2.5 text-xs text-ink-soft sm:block">
        {t("search.keys")}
      </p>
    </Modal>
  );
}
