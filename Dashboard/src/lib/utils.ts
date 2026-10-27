import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * Plain `twMerge` doesn't know about the custom --text-h1/--text-body-lg/...
 * scale declared in globals.css — it only recognises Tailwind's built-in
 * text-xs..text-9xl. Without this it silently drops "text-h1" whenever a
 * component also passes a text-color class like "text-foreground", because
 * it guesses both belong to the same "text colour" group and keeps only the
 * later one. Registering the custom names under "font-size" fixes that.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["h1", "h2", "h3", "body-lg", "body", "body-sm"] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
