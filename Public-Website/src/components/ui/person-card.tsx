import { ContentCard } from "@/components/ui/content-card";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { cn } from "@/lib/utils";

/**
 * Centred person card (teachers, staff, committee): circular photo, name,
 * green role line and up to two muted detail lines. Falls back to initials
 * when there is no photo.
 */
export function PersonCard({
  name,
  role,
  details = [],
  photoUrl,
  tone = "surface",
  avatar = "md",
  photoLabel,
}: {
  name: string;
  role?: string;
  details?: string[];
  photoUrl?: string;
  tone?: "surface" | "white";
  /** "lg" = 96px (faculty), "md" = 88px. */
  avatar?: "md" | "lg";
  /** Text on the empty-photo tile; "" leaves it blank (placeholder cards). */
  photoLabel?: string;
}) {
  return (
    <ContentCard
      tone={tone}
      className={cn("text-center", tone === "white" ? "p-6" : "px-4 py-5.5")}
    >
      <ImageWithFallback
        src={photoUrl}
        alt={name}
        label={photoLabel}
        className={cn(
          "mx-auto mb-3.5 aspect-square rounded-full",
          avatar === "lg" ? "size-24" : "size-22",
        )}
      />
      <p className="font-heading text-ui font-bold text-ink">{name}</p>
      {role && (
        <p className="my-0.5 text-small font-semibold text-green">{role}</p>
      )}
      {details.filter(Boolean).map((line, index) => (
        <p
          key={index}
          className={cn("text-xs text-ink-soft", index > 0 && "mt-1")}
        >
          {line}
        </p>
      ))}
    </ContentCard>
  );
}
