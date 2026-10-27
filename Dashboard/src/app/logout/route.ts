import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth";

/**
 * Clears the session cookie, then sends the visitor to the login page.
 *
 * This exists to break a redirect loop: `proxy.ts` runs on the Edge and can
 * only check that the cookie's signature is valid, while the dashboard checks
 * the account against the database. A token that is cryptographically fine but
 * belongs to a deleted or deactivated account satisfies the first check and
 * fails the second, so /dashboard would bounce to /login and /login straight
 * back again. Landing here instead removes the cookie, which ends the cycle.
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
