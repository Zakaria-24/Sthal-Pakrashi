import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * Plain `twMerge` doesn't know about the custom --text-*, --radius-* and
 * --shadow-* names declared in globals.css — it only recognises Tailwind's
 * built-ins. Without this it silently drops "text-h1" whenever a component
 * also passes a text-color class like "text-foreground", because it guesses
 * both belong to the same "text colour" group and keeps only the later one.
 * Registering the custom names under the right groups fixes that.
 *
 * Keep these lists in sync with the @theme block in globals.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      // Custom --spacing-* names, so px-gutter / py-section merge with px-6 / py-12.
      spacing: [
        "gutter",
        "section",
        "section-sm",
        "page",
        "band-top",
        "band-bottom",
        "modal-top",
      ],
    },
    classGroups: {
      "font-size": [
        {
          text: [
            "hero",
            "hero-lg",
            "h1",
            "h2",
            "h3",
            "title",
            "h2-mid",
            "h2-low",
            "h3-sm",
            "copy",
            "nav-sm",
            "quote",
            "caption",
            "person",
            "subtitle",
            "h4",
            "stat",
            "body-lg",
            "body",
            "ui",
            "nav",
            "body-sm",
            "small",
            "micro",
            "nano",
          ],
        },
      ],
      rounded: [{ rounded: ["card", "card-lg", "pill"] }],
      shadow: [
        {
          shadow: [
            "soft",
            "lift",
            "lift-sm",
            "lift-lg",
            "dropdown",
            "drawer",
            "modal",
            "cta",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
