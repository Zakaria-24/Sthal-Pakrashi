import { after } from "next/server";

import { env } from "@/lib/env";

/**
 * The public website caches CMS reads. After a content save, ask it to expire
 * that cache so the change shows on the next visit. Runs after the response
 * is sent, and a failure only means the site refreshes on its own schedule.
 */
export function refreshPublicSite() {
  const base = env.PUBLIC_SITE_URL;
  const secret = env.REVALIDATE_SECRET;
  if (!base || !secret) return;

  after(async () => {
    try {
      const response = await fetch(`${base}/api/revalidate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${secret}` },
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) console.warn(`[public-site] revalidate responded ${response.status}`);
    } catch (error) {
      console.warn("[public-site] revalidate failed:", error instanceof Error ? error.message : error);
    }
  });
}
