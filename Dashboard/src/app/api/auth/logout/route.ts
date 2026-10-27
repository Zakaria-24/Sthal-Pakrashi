import type { NextRequest } from "next/server";

import { clearSessionCookie } from "@/lib/auth";
import { handleError, ok, preflight } from "@/lib/api-response";

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    await clearSessionCookie();
    return ok({ loggedOut: true }, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}
