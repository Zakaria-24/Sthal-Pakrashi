import type { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { ok, preflight } from "@/lib/api-response";

/**
 * Lets the public site (and you) check whether the CMS can reach MongoDB
 * without having to interpret a content endpoint's empty result.
 */

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    await connectDB();
    return ok({ status: "ok", database: "connected" }, origin);
  } catch {
    return ok({ status: "degraded", database: "unreachable" }, origin, 503);
  }
}
