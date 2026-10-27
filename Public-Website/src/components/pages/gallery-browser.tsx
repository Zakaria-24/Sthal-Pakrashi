"use client";

import { useMemo, useState } from "react";

import { FilterChips } from "@/components/ui/filter-chips";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { EmptyState } from "@/components/ui/states";
import { useI18n } from "@/lib/i18n/provider";
import { SampleBadge } from "@/components/ui/sample-badge";

export type GalleryPhoto = {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  isDemo?: boolean;
};

/** Design order for the category chips; "other" only appears if it has photos. */
const ORDER = ["campus", "events", "classroom", "sports", "cultural", "other"];

/**
 * Category chips over a uniform photo grid (4 columns, 2 below 640px), photos
 * zooming slightly on hover.
 */
export function GalleryBrowser({ photos }: { photos: GalleryPhoto[] }) {
  const { t } = useI18n();
  const [category, setCategory] = useState("all");

  const options = useMemo(() => {
    const present = new Set(photos.map((p) => p.category));
    const keys = ORDER.filter((key) => key !== "other" || present.has(key));
    return [
      { value: "all", label: t("page.all") },
      ...keys.map((key) => ({
        value: key,
        label: t(`gallery.category.${key}` as "gallery.category.campus"),
      })),
    ];
  }, [photos, t]);

  const visible =
    category === "all" ? photos : photos.filter((p) => p.category === category);

  return (
    <>
      <FilterChips
        label={t("page.gallery.filter")}
        options={options}
        value={category}
        onChange={setCategory}
        className="mb-12"
      />
      {visible.length === 0 ? (
        <EmptyState message={t("page.gallery.empty")} />
      ) : (
        <ul className="grid auto-rows-[7.5rem] grid-cols-2 gap-3.5 sm:auto-rows-[9.375rem] lg:grid-cols-4">
          {visible.map((photo) => (
            <li
              key={photo.id}
              className="group/zoom relative overflow-hidden rounded-card bg-surface"
            >
              <ImageWithFallback
                src={photo.imageUrl}
                alt={photo.title}
                label=""
                className="size-full transition-transform duration-500 motion-safe:group-hover/zoom:scale-110"
              />
              {photo.isDemo && <span className="absolute top-2 left-2"><SampleBadge label={t("common.demoContent")} /></span>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
