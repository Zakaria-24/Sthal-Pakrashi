import { createHash, timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

import { CMS_CACHE_TAG } from "@/lib/api";

/**
 * Called by the Dashboard after every content save, so cached CMS reads expire
 * at once instead of after CMS_REVALIDATE_SECONDS. Authenticated with the
 * shared REVALIDATE_SECRET (same value in both apps) as a Bearer token.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  if (!secret) {
    return Response.json({ revalidated: false, message: "Not configured" }, { status: 503 });
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  // Compare digests so the check takes the same time whatever the input.
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!timingSafeEqual(digest(token), digest(secret))) {
    return Response.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
  }

  // Expire immediately: the next visit fetches fresh content.
  revalidateTag(CMS_CACHE_TAG, { expire: 0 });
  return Response.json({ revalidated: true, now: Date.now() });
}
