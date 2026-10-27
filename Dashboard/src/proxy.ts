import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { canEditSettings, canManageUsers } from "@/lib/permissions";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts`; the behaviour is the same.
 *
 * Three jobs:
 *   1. Redirect signed-out visitors away from /dashboard to /login.
 *   2. Reject unauthenticated writes to the API. Reads of content stay public
 *      so the school website can fetch without credentials.
 *   3. Apply role rules centrally — user management is super-admin only, and
 *      site settings need admin or above.
 *   4. Keep applicants' private data private: /api/applications (every
 *      method, reads included) is admin-only, while the one public write
 *      endpoint is exactly POST /api/apply.
 */

const PUBLIC_API_PREFIXES = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/send-otp",
  "/api/auth/verify-otp",
];

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/** The single public write endpoint: online admission applications. */
const PUBLIC_APPLY_PATH = "/api/apply";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const deny = (message: string, status: number) =>
    NextResponse.json({ success: false, message }, { status });

  if (pathname.startsWith("/api/")) {
    if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return NextResponse.next();
    }

    if (pathname === PUBLIC_APPLY_PATH) return NextResponse.next();

    // Applications hold personal data: signed-in admins only, reads included.
    if (pathname.startsWith("/api/applications")) {
      if (!session) return deny("Authentication required", 401);
      if (!canEditSettings(session.role)) {
        return deny("Only admins can manage applications.", 403);
      }
      return NextResponse.next();
    }

    // Staff lists are not public, so /api/users is gated on every method
    // rather than only on writes.
    if (pathname.startsWith("/api/users")) {
      if (!session) return deny("Authentication required", 401);
      if (!canManageUsers(session.role)) {
        return deny("Only the super admin can manage users.", 403);
      }
      return NextResponse.next();
    }

    if (SAFE_METHODS.has(request.method)) return NextResponse.next();

    if (!session) return deny("Authentication required", 401);

    if (
      (pathname.startsWith("/api/settings") ||
        pathname.startsWith("/api/admission-info")) &&
      !canEditSettings(session.role)
    ) {
      return deny("Your role cannot change site settings.", 403);
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard") && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/dashboard/users") && !canManageUsers(session?.role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    (pathname.startsWith("/dashboard/settings") ||
      pathname.startsWith("/dashboard/admission") ||
      pathname.startsWith("/dashboard/applications")) &&
    !canEditSettings(session?.role)
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/api/:path*"],
};
