import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { env } from "@/lib/env";
import { MongoConnectionError, diagnoseMongoError } from "@/lib/mongodb-diagnostics";

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
  // Never reflect an arbitrary Origin, especially when credentials are enabled.
  if (origin && allowed.includes(origin)) {
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

  if (error instanceof MongoConnectionError) {
    return fail("Database unavailable. Check server diagnostics and database configuration.", 503, origin);
  }

  const message = error instanceof Error ? error.message : "Unexpected error";

  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    if (code === 11000) return fail("A record with these details already exists.", 409, origin);
  }

  // A Mongo connection failure is the expected case when credentials are wrong
  // or the cluster is unreachable — surface it as 503 so the public site knows
  // to use its fallback data rather than treating it as a real empty result.
  if (/mongoose|mongodb|querysrv|querytxt|econnrefused|etimedout|server selection|mongodb_dns_servers/i.test(message)) {
    console.error("[api] database operation failed", diagnoseMongoError(error));
    return fail("Database unavailable", 503, origin);
  }

  console.error("[api] unhandled error", {
    name: error instanceof Error ? error.name : "UnknownError",
    message: message
      .replace(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi, "<MongoDB URI>")
      .slice(0, 500),
  });
  return fail("Unexpected server error", 500, origin);
}
