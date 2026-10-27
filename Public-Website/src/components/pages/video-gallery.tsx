"use client";

import { useState } from "react";

import { FilterChips } from "@/components/ui/filter-chips";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { PlayIcon } from "@/components/ui/icons";
import { DialogCloseButton, Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/states";
import { Tag } from "@/components/ui/tag";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export type VideoCard = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  /** Privacy-enhanced YouTube embed URL, when the CMS URL is a YouTube link. */
  embedUrl: string | null;
  /** Any other URL — opened in a new tab instead of the dialog. */
  externalUrl: string | null;
};

const ORDER = ["campus", "event", "academic", "cultural", "other"];

/** Category chips + video cards; playable cards open the design's video dialog. */
export function VideoGallery({ videos }: { videos: VideoCard[] }) {
  const { t } = useI18n();
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = videos.find((v) => v.id === activeId);

  const present = new Set(videos.map((v) => v.category));
  const keys = ORDER.filter((key) => key !== "other" || present.has(key));
  const visible =
    category === "all" ? videos : videos.filter((v) => v.category === category);

  const CARD =
    "lift-sm group/video relative overflow-hidden rounded-card border border-line bg-white has-focus-visible:ring-2 has-focus-visible:ring-green";

  return (
    <>
      <FilterChips
        label={t("page.videos.filter")}
        value={category}
        onChange={setCategory}
        className="mb-6.5"
        options={[
          { value: "all", label: t("page.all") },
          ...keys.map((key) => ({
            value: key,
            label: t(`video.category.${key}` as "video.category.campus"),
          })),
        ]}
      />

      {visible.length === 0 ? (
        <EmptyState message={t("page.videos.empty")} />
      ) : (
        <ul className="grid gap-5.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,17.5rem),1fr))]">
          {visible.map((video) => {
            const playable = Boolean(video.embedUrl || video.externalUrl);
            const trigger = "outline-none after:absolute after:inset-0";
            return (
              <li key={video.id} className={cn(CARD, playable && "cursor-pointer")}>
                <div className="relative aspect-video overflow-hidden bg-ink">
                  <ImageWithFallback
                    src={video.thumbnail}
                    alt=""
                    label=""
                    className="size-full transition-transform duration-500 motion-safe:group-hover/video:scale-105"
                  />
                  {playable && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex size-13 items-center justify-center rounded-full bg-white/90 text-green shadow-lift transition-[transform,background-color] duration-200 group-hover/video:bg-gold motion-safe:group-hover/video:scale-110">
                        <PlayIcon className="size-4" />
                      </span>
                    </span>
                  )}
                </div>
                <div className="px-5 py-4.5">
                  <Tag className="mb-2 text-nano">
                    {t(`video.category.${video.category}` as "video.category.campus")}
                  </Tag>
                  <h2 className="mb-1.5 font-heading text-ui leading-snug font-bold text-ink">
                    {video.embedUrl ? (
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        aria-label={`${t("page.videos.play")}: ${video.title}`}
                        onClick={() => {
                          setActiveId(video.id);
                          setOpen(true);
                        }}
                        className={cn(trigger, "cursor-pointer text-left")}
                      >
                        {video.title}
                      </button>
                    ) : video.externalUrl ? (
                      <a
                        href={video.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={trigger}
                      >
                        {video.title}
                      </a>
                    ) : (
                      video.title
                    )}
                  </h2>
                  {video.description && (
                    <p className="text-small leading-relaxed text-ink-soft">
                      {video.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={active?.title ?? t("page.videos.title")}
        hideTitle
        bare
        width="lg"
        showClose={false}
        closeLabel={t("page.videos.close")}
      >
        {active?.embedUrl && (
          <div className="relative">
            <DialogCloseButton
            label={t("page.videos.close")}
            className="absolute -top-11 right-0 size-9 bg-white text-ink shadow-soft hover:bg-gold"
          />
            <div className="aspect-video overflow-hidden rounded-2xl bg-ink shadow-modal">
            <iframe
              src={active.embedUrl}
              title={active.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="size-full border-0"
            />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
