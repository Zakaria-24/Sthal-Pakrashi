import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { env } from "@/lib/env";

/**
 * Every API response goes through here so the public site can rely on one
 * envelope shape: `{ success, data }` or `{ success, message, issues }`.
 */

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS;
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
  if (origin && (allowed.includes("*") || allowed.includes(origin))) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

export function ok<T>(data: T, origin: string | null = null, status = 200) {
  return NextResponse.json(
    { success: true, data },
    { status, headers: corsHeaders(origin) },
  );
}

export function fail(
  message: string,
  status = 400,
  origin: string | null = null,
  issues?: unknown,
) {
  return NextResponse.json(
    { success: false, message, ...(issues ? { issues } : {}) },
    { status, headers: corsHeaders(origin) },
  );
}

export function preflight(origin: string | null) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

/** Converts thrown errors into a consistent response instead of a 500 HTML page. */
export function handleError(error: unknown, origin: string | null = null) {
  if (error instanceof ZodError) {
    return fail("Validation failed", 422, origin, error.issues);
  }

  const message = error instanceof Error ? error.message : "Unexpected error";

  // A Mongo connection failure is the expected case when credentials are wrong
  // or the cluster is unreachable — surface it as 503 so the public site knows
  // to use its fallback data rather than treating it as a real empty result.
  if (
    message.includes("ECONNREFUSED") ||
    message.includes("ETIMEDOUT") ||
    message.toLowerCase().includes("server selection") ||
    message.includes("MongooseServerSelectionError") ||
    message.includes("Missing required environment variable")
  ) {
    console.error("[api] database unavailable:", message);
    return fail("Database unavailable", 503, origin);
  }

  console.error("[api] unhandled error:", error);
  return fail(message, 500, origin);
}
