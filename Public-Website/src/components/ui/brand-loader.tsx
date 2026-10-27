import { cn } from "@/lib/utils";

/**
 * Branded loading screen: the school mark in the header's green tile, a gold
 * arc circling it, a soft halo and a shimmer bar, over faint content
 * skeletons. Pure CSS, so it renders from the server before any JavaScript.
 * It fades in only after --motion-loader-delay; fast loads never show it.
 *
 * `fullscreen` covers the viewport (used before the header can render);
 * otherwise it fills the page area under the header.
 */
export function BrandLoader({
  label,
  name,
  fullscreen = false,
}: {
  /** Localized "Loading…" for screen readers and the caption. */
  label: string;
  /** School name shown under the mark. */
  name: string;
  fullscreen?: boolean;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex animate-loader-in flex-col items-center justify-center px-4",
        fullscreen ? "min-h-dvh bg-white" : "min-h-[70dvh] py-16",
      )}
    >
      <div className="relative grid size-28 place-items-center">
        {/* Halo and arc sit behind the tile. */}
        <span aria-hidden className="absolute inset-3 animate-loader-halo rounded-full bg-gold/35" />
        <svg aria-hidden viewBox="0 0 112 112" className="absolute inset-0 animate-loader-arc">
          <circle cx="56" cy="56" r="52" fill="none" strokeWidth="3" className="stroke-line" />
          <circle
            cx="56"
            cy="56"
            r="52"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="90 237"
            className="stroke-gold"
          />
        </svg>
        <span className="relative grid size-18 place-items-center rounded-2xl bg-green shadow-lift">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-11">
            <path d="M12 2 22 7v3H2V7Z" className="animate-loader-roof fill-gold" />
            <path d="M4 11h16v9H4Z" className="fill-white/15 stroke-white" strokeWidth={1.4} />
            <path d="M9 20v-5h6v5" className="stroke-gold" strokeWidth={1.4} />
          </svg>
        </span>
      </div>

      <p className="mt-6 text-center font-heading text-ui font-bold text-ink">{name}</p>
      <p className="mt-1 text-small text-ink-soft">{label}</p>
      <span aria-hidden className="mt-4 block h-1 w-40 overflow-hidden rounded-pill bg-surface">
        <span className="block h-full w-1/3 animate-loader-shimmer rounded-pill bg-linear-to-r from-green via-gold to-green" />
      </span>

      {!fullscreen && (
        <div aria-hidden className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-5 opacity-60 sm:grid-cols-3">
          {[0, 1, 2].map((card) => (
            <div key={card} className={cn("rounded-card bg-surface p-5", card > 0 && "max-sm:hidden")}>
              <div className="aspect-[4/3] rounded-lg bg-line/60" />
              <div className="mt-4 h-3 w-3/4 rounded-pill bg-line/70" />
              <div className="mt-2.5 h-3 w-1/2 rounded-pill bg-line/50" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
