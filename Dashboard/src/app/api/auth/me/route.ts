import type { NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { fail, handleError, ok, preflight } from "@/lib/api-response";

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    // Resolved against the database, so a revoked account reports as signed out
    // even while its cookie is still technically valid.
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401, origin);
    return ok(user, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}
