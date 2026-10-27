/**
 * Focus-colour presets, matching the picker in the Dashboard's Settings page.
 *
 * The public site never lets a visitor change this — it just reads whichever
 * key the school picked (Settings.themeColor) and applies the matching preset
 * so the site's brand colour follows the dashboard automatically. The four
 * --brand* custom properties this rewrites are read by every themed surface
 * (buttons, links, nav, focus rings) — see the BRAND block in globals.css,
 * which also hardcodes the "indigo" values below directly, so the site
 * renders correctly even before Settings loads or if the API is unreachable.
 *
 * Duplicated verbatim in Dashboard/src/lib/theme-presets.ts: the two apps
 * deploy independently and must not import across that boundary.
 */

export type ThemePreset = {
  key: string;
  label: string;
  /** Applied in light mode. */
  brand: string;
  brandForeground: string;
  brandHover: string;
  brandSubtle: string;
  /** Applied when the `.dark` class is present. */
  dark: {
    brand: string;
    brandForeground: string;
    brandHover: string;
    brandSubtle: string;
  };
};

export const THEME_PRESETS: readonly ThemePreset[] = [
  {
    key: "slate",
    label: "Slate",
    brand: "oklch(0.40 0.02 250)",
    brandForeground: "oklch(0.99 0 0)",
    brandHover: "oklch(0.32 0.02 250)",
    brandSubtle: "oklch(0.95 0.01 250)",
    dark: {
      brand: "oklch(0.65 0.02 250)",
      brandForeground: "oklch(0.15 0.01 250)",
      brandHover: "oklch(0.72 0.02 250)",
      brandSubtle: "oklch(0.28 0.02 250)",
    },
  },
  {
    key: "sky",
    label: "Sky",
    brand: "oklch(0.50 0.14 205)",
    brandForeground: "oklch(0.99 0 0)",
    brandHover: "oklch(0.43 0.14 205)",
    brandSubtle: "oklch(0.96 0.02 205)",
    dark: {
      brand: "oklch(0.70 0.12 205)",
      brandForeground: "oklch(0.17 0.02 205)",
      brandHover: "oklch(0.76 0.12 205)",
      brandSubtle: "oklch(0.28 0.045 205)",
    },
  },
  {
    key: "blue",
    label: "Blue",
    brand: "oklch(0.50 0.15 228)",
    brandForeground: "oklch(0.99 0 0)",
    brandHover: "oklch(0.43 0.15 228)",
    brandSubtle: "oklch(0.96 0.02 228)",
    dark: {
      brand: "oklch(0.70 0.13 228)",
      brandForeground: "oklch(0.17 0.02 228)",
      brandHover: "oklch(0.76 0.13 228)",
      brandSubtle: "oklch(0.28 0.045 228)",
    },
  },
  {
    // Matches the pre-existing hardcoded fallback exactly, so picking
    // "Indigo" — the default — never causes a visual jump.
    key: "indigo",
    label: "Indigo",
    brand: "oklch(0.48 0.14 250)",
    brandForeground: "oklch(0.99 0 0)",
    brandHover: "oklch(0.42 0.14 250)",
    brandSubtle: "oklch(0.96 0.02 250)",
    dark: {
      brand: "oklch(0.68 0.13 250)",
      brandForeground: "oklch(0.16 0.02 250)",
      brandHover: "oklch(0.75 0.13 250)",
      brandSubtle: "oklch(0.28 0.04 250)",
    },
  },
  {
    key: "teal",
    label: "Teal",
    brand: "oklch(0.50 0.12 190)",
    brandForeground: "oklch(0.99 0 0)",
    brandHover: "oklch(0.43 0.12 190)",
    brandSubtle: "oklch(0.96 0.02 190)",
    dark: {
      brand: "oklch(0.70 0.10 190)",
      brandForeground: "oklch(0.17 0.02 190)",
      brandHover: "oklch(0.76 0.10 190)",
      brandSubtle: "oklch(0.28 0.04 190)",
    },
  },
  {
    key: "green",
    label: "Green",
    brand: "#03594e",
    brandForeground: "#ffffff",
    brandHover: "#024841",
    brandSubtle: "#eef4f1",
    dark: {
      brand: "#66c5b3",
      brandForeground: "#06211d",
      brandHover: "#8bd7c8",
      brandSubtle: "#183d36",
    },
  },
  {
    // Light background colour: dark foreground text, in both modes.
    key: "amber",
    label: "Amber",
    brand: "oklch(0.78 0.15 85)",
    brandForeground: "oklch(0.20 0.03 85)",
    brandHover: "oklch(0.70 0.15 85)",
    brandSubtle: "oklch(0.96 0.03 85)",
    dark: {
      brand: "oklch(0.80 0.13 85)",
      brandForeground: "oklch(0.20 0.03 85)",
      brandHover: "oklch(0.74 0.13 85)",
      brandSubtle: "oklch(0.30 0.06 85)",
    },
  },
  {
    key: "orange",
    label: "Orange",
    brand: "oklch(0.68 0.18 50)",
    brandForeground: "oklch(0.18 0.03 50)",
    brandHover: "oklch(0.60 0.18 50)",
    brandSubtle: "oklch(0.96 0.03 50)",
    dark: {
      brand: "oklch(0.74 0.15 50)",
      brandForeground: "oklch(0.18 0.03 50)",
      brandHover: "oklch(0.68 0.15 50)",
      brandSubtle: "oklch(0.30 0.06 50)",
    },
  },
  {
    key: "red",
    label: "Red",
    brand: "oklch(0.55 0.19 22)",
    brandForeground: "oklch(0.99 0 0)",
    brandHover: "oklch(0.48 0.19 22)",
    brandSubtle: "oklch(0.96 0.03 22)",
    dark: {
      brand: "oklch(0.70 0.16 22)",
      brandForeground: "oklch(0.17 0.02 22)",
      brandHover: "oklch(0.76 0.16 22)",
      brandSubtle: "oklch(0.29 0.05 22)",
    },
  },
  {
    key: "pink",
    label: "Pink",
    brand: "oklch(0.55 0.18 345)",
    brandForeground: "oklch(0.99 0 0)",
    brandHover: "oklch(0.48 0.18 345)",
    brandSubtle: "oklch(0.96 0.02 345)",
    dark: {
      brand: "oklch(0.70 0.15 345)",
      brandForeground: "oklch(0.17 0.02 345)",
      brandHover: "oklch(0.76 0.15 345)",
      brandSubtle: "oklch(0.28 0.05 345)",
    },
  },
] as const;

export const DEFAULT_THEME_KEY = "green";

/** Never throws: an unknown or missing key resolves to the default preset. */
export function getPreset(key?: string | null): ThemePreset {
  return (
    THEME_PRESETS.find((preset) => preset.key === key) ??
    THEME_PRESETS.find((preset) => preset.key === DEFAULT_THEME_KEY)!
  );
}

/** The two CSS rules that override the BRAND block for a given preset. */
export function presetToCss(preset: ThemePreset): string {
  return `:root{--brand:${preset.brand};--brand-foreground:${preset.brandForeground};--brand-hover:${preset.brandHover};--brand-subtle:${preset.brandSubtle};}\n.dark{--brand:${preset.dark.brand};--brand-foreground:${preset.dark.brandForeground};--brand-hover:${preset.dark.brandHover};--brand-subtle:${preset.dark.brandSubtle};}`;
}

const OVERRIDE_STYLE_ID = "theme-preset-override";

/**
 * Applies a preset to the current document immediately — used so the picker
 * re-skins the whole UI with no round trip, before the save even resolves.
 *
 * Writes to the same <style id="theme-preset-override"> tag the server
 * renders (see app/dashboard/layout.tsx), so this updates it in place rather
 * than creating a competing rule.
 */
export function applyPresetToDocument(preset: ThemePreset): void {
  let styleEl = document.getElementById(
    OVERRIDE_STYLE_ID,
  ) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = OVERRIDE_STYLE_ID;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = presetToCss(preset);
}
