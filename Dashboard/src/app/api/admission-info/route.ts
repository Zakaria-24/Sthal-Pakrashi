import type { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { admissionInfoSchema } from "@/lib/admission-schema";
import { handleError, ok, preflight } from "@/lib/api-response";
import { pickProvided } from "@/lib/parse";
import { AdmissionInfo } from "@/models/AdmissionInfo";

/**
 * Admission information singleton (public read, admin write).
 * GET always returns a document — an empty one on first call — and PATCH
 * upserts, exactly like /api/settings.
 */

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    await connectDB();
    const info = await AdmissionInfo.findOneAndUpdate(
      { key: "admission" },
      { $setOnInsert: { key: "admission" } },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    ).lean();
    return ok(info, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}

export async function PATCH(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    const body = await request.json();
    const parsed = admissionInfoSchema.partial().parse(body) as Record<string, unknown>;
    const update = pickProvided(parsed, body);

    await connectDB();
    const updated = await AdmissionInfo.findOneAndUpdate({ key: "admission" }, update, {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }).lean();
    return ok(updated, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}
