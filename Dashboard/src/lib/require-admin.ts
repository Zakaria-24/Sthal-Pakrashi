import "server-only";

import type { NextResponse } from "next/server";

import { fail } from "@/lib/api-response";
import { getCurrentUser, type CurrentUser } from "@/lib/current-user";
import { canEditSettings } from "@/lib/permissions";

/**
 * Guard for endpoints that expose private data. `proxy.ts` already turns away
 * requests without a session, but a JWT stays valid until it expires; this
 * re-checks the account in the database (active, and still an admin) so a
 * removed or demoted user loses access immediately.
 */
export async function requireAdmin(
  origin: string | null,
): Promise<{ user: CurrentUser } | { response: NextResponse }> {
  const user = await getCurrentUser();
  if (!user) return { response: fail("Authentication required", 401, origin) };
  if (!canEditSettings(user.role)) {
    return { response: fail("Only admins can manage applications.", 403, origin) };
  }
  return { user };
}
