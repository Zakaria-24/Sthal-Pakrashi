/**
 * Turns a CMS video URL into something an <iframe> can play. Only YouTube
 * links are embeddable today (that is what the Dashboard's video field is
 * documented for); anything else returns null and the caller links out.
 * Uses the privacy-enhanced youtube-nocookie domain.
 */
export function getYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");
  let id: string | null = null;

  if (host === "youtu.be") {
    id = parsed.pathname.slice(1).split("/")[0] || null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (parsed.pathname === "/watch") id = parsed.searchParams.get("v");
    else {
      const match = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{6,})/);
      id = match?.[1] ?? null;
    }
  }

  return id && /^[\w-]{6,}$/.test(id) ? id : null;
}

export function toEmbedUrl(url: string | null | undefined): string | null {
  const id = getYoutubeId(url);
  return id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
    : null;
}

/** YouTube's own thumbnail for a video URL, when it is a YouTube link. */
export function youtubeThumbnail(url: string | null | undefined): string | null {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
