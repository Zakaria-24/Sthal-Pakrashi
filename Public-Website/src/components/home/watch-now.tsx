"use client";

import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/ui/container";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { PlayIcon } from "@/components/ui/icons";
import { DialogCloseButton, Modal } from "@/components/ui/modal";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const ROW =
  "flex w-full cursor-pointer items-center gap-2.5 bg-gold px-4.5 py-3.5 text-left font-heading text-body-sm font-bold text-on-gold transition-[filter,transform] duration-200 hover:brightness-95 motion-safe:hover:scale-[1.02]";

/**
 * "Watch Now" teaser overlapping the curriculum band. The gold call-to-action
 * carries the pulse / bounce / shine effects; all three stop under
 * prefers-reduced-motion (see globals.css). With an embeddable CMS video the
 * button opens it in a dialog; otherwise it links to the video gallery.
 */
export function WatchNow({
  imageSrc,
  imageAlt,
  embedUrl,
  videoTitle,
}: {
  imageSrc?: string;
  imageAlt: string;
  /** Privacy-enhanced YouTube embed URL, or null when there's nothing to play. */
  embedUrl: string | null;
  videoTitle: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const label = (
    <>
      <span className="relative flex size-6.5 shrink-0 items-center justify-center">
        <span
          aria-hidden
          className="absolute -inset-1.5 rounded-full border-2 border-on-gold opacity-60 motion-safe:animate-watch-pulse"
        />
        <span className="relative flex size-6.5 items-center justify-center rounded-full border-2 border-on-gold motion-safe:animate-watch-bounce">
          <PlayIcon className="ml-0.5 size-2.5" />
        </span>
      </span>
      <span className="relative overflow-hidden">
        {t("home.watch.cta")}
        <span
          aria-hidden
          className="absolute top-0 -left-[60%] h-full w-[40%] bg-linear-120 from-transparent via-white/75 to-transparent motion-safe:animate-watch-shine"
        />
      </span>
    </>
  );

  return (
    <Container size="mid" className="relative z-10 -mt-10 px-6 md:-mt-36">
      <div className="relative">
        <div className="aspect-[16/6.5] overflow-hidden rounded-3xl bg-surface">
          <ImageWithFallback
            src={imageSrc}
            alt={imageAlt}
            className="size-full"
          />
        </div>

        <div
          className={cn(
            "mt-3 flex min-h-42 w-full flex-col overflow-hidden rounded-2xl shadow-lift-lg",
            "sm:absolute sm:bottom-0 sm:left-10 sm:mt-0 sm:w-70",
          )}
        >
          {embedUrl ? (
            <button
              type="button"
              className={ROW}
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
            >
              {label}
            </button>
          ) : (
            <Link href="/videos" className={ROW}>
              {label}
            </Link>
          )}
          <div className="flex-1 bg-overlay-dark px-4.5 pt-3.5 pb-4 backdrop-blur-sm">
            <p className="text-small leading-[1.55] text-white">{t("home.watch.desc")}</p>
          </div>
        </div>
      </div>

      {embedUrl && (
        <Modal
          open={open}
          onOpenChange={setOpen}
          title={videoTitle || t("home.watch.modalTitle")}
          hideTitle
          bare
          width="lg"
          showClose={false}
          closeLabel={t("home.watch.close")}
        >
          <div className="relative">
            <DialogCloseButton
            label={t("home.watch.close")}
            className="absolute -top-11 right-0 size-9 bg-white text-ink shadow-soft hover:bg-gold"
          />
            <div className="aspect-video overflow-hidden rounded-2xl bg-ink shadow-modal">
            <iframe
              src={embedUrl}
              title={videoTitle || t("home.watch.modalTitle")}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="size-full border-0"
            />
            </div>
          </div>
        </Modal>
      )}
    </Container>
  );
}
