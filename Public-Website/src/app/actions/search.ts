"use server";

import { searchContent } from "@/lib/api";
import type { SearchContentResult } from "@/lib/search";

/**
 * Server action behind the header search modal. The CMS base URL is a
 * server-only environment value, so the browser cannot call the Dashboard
 * directly; it calls this instead, and this delegates to the shared API layer.
 */
export async function searchSiteAction(
  term: string,
): Promise<SearchContentResult> {
  return searchContent(typeof term === "string" ? term : "");
}
