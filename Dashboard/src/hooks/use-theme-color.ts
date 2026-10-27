"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { api } from "@/lib/client-api";
import { applyPresetToDocument, getPreset } from "@/lib/theme-presets";

/**
 * Drives the focus-colour picker in Settings.
 *
 * Selecting a swatch re-skins the document immediately — no round trip — and
 * only then persists the choice. If the save fails, the colour rolls back so
 * the picker never shows a selection that didn't actually take.
 */
export function useThemeColor(initialKey: string) {
  const [themeKey, setThemeKey] = useState(initialKey);
  const [pending, startTransition] = useTransition();

  function select(nextKey: string) {
    const previousKey = themeKey;
    const preset = getPreset(nextKey);

    setThemeKey(nextKey);
    applyPresetToDocument(preset);

    startTransition(async () => {
      try {
        await api.updateSettings({ themeColor: nextKey });
        toast.success(`Focus colour set to ${preset.label}`);
      } catch (error) {
        setThemeKey(previousKey);
        applyPresetToDocument(getPreset(previousKey));
        toast.error(
          error instanceof Error ? error.message : "Couldn't save the colour",
        );
      }
    });
  }

  return { themeKey, select, pending };
}
