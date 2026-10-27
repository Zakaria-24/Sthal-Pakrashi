"use client";

import { THEME_PRESETS } from "@/lib/theme-presets";
import { useThemeColor } from "@/hooks/use-theme-color";
import { cn } from "@/lib/utils";

/**
 * Nine-swatch focus-colour picker. Clicking a swatch re-skins the whole
 * dashboard instantly (see useThemeColor) — buttons, links, active nav
 * state and focus rings all read from the four tokens this rewrites.
 */
export function ThemeSwatchPicker({ initialKey }: { initialKey: string }) {
  const { themeKey, select, pending } = useThemeColor(initialKey);
  const activePreset = THEME_PRESETS.find((p) => p.key === themeKey);

  return (
    <div className="space-y-3">
      <div
        role="radiogroup"
        aria-label="Focus colour"
        className="flex flex-wrap gap-3"
      >
        {THEME_PRESETS.map((preset) => {
          const active = preset.key === themeKey;
          return (
            <button
              key={preset.key}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={preset.label}
              title={preset.label}
              disabled={pending}
              onClick={() => select(preset.key)}
              className={cn(
                "h-9 w-9 shrink-0 rounded-full border-2 transition-transform disabled:cursor-not-allowed disabled:opacity-60",
                active
                  ? "border-foreground scale-110"
                  : "border-transparent hover:scale-105",
              )}
              style={{ backgroundColor: preset.brand }}
            />
          );
        })}
      </div>
      {activePreset && (
        <p className="text-muted-foreground text-xs">
          Current: <span className="font-medium">{activePreset.label}</span>
        </p>
      )}
    </div>
  );
}
