import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Design-system button. Variants map to the finalized design:
 *   default       — solid green (primary action)
 *   gold          — solid gold with dark text (admission / conversion CTA)
 *   soft          — surface tint that fills green on hover
 *   outline       — white with a hairline border
 *   outline-light — hairline white border for dark/green backgrounds
 * `shape="pill"` gives the 100px-radius search/CTA look.
 *
 * To style a next/link as a button use `buttonVariants(...)` on the <Link>.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 border border-transparent bg-clip-padding font-heading font-bold whitespace-nowrap outline-none select-none transition-[background-color,color,border-color,transform,translate,scale,box-shadow] duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-green text-white hover:bg-green-dark",
        gold: "bg-gold text-on-gold hover:bg-gold-dark",
        soft: "bg-surface text-ink hover:bg-green hover:text-white",
        outline:
          "border-line bg-white text-ink hover:bg-surface aria-expanded:bg-surface",
        "outline-light":
          "border-white/40 text-white hover:border-gold hover:bg-gold hover:text-on-gold",
        secondary: "bg-secondary text-secondary-foreground hover:bg-line",
        ghost: "text-ink hover:bg-surface aria-expanded:bg-surface",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "font-sans font-semibold text-green underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-10 px-4 text-body-sm",
        xs: "min-h-8 px-2.5 text-micro",
        sm: "min-h-9 px-3 text-small",
        lg: "min-h-12 px-6 text-ui",
        icon: "size-10",
        "icon-xs": "size-8",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
      shape: {
        rounded: "rounded-lg",
        pill: "rounded-pill",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "rounded",
  render,
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      render={render}
      // A rendered <a>/<Link> is not a native button; say so, or base-ui logs
      // a dev error on every call site that uses `render={<Link … />}`.
      nativeButton={nativeButton ?? !render}
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
