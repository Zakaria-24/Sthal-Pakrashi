import type { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { Settings } from "@/models/Settings";
import { settingsSchema } from "@/lib/resource-config";
import { handleError, ok, preflight } from "@/lib/api-response";
import { refreshPublicSite } from "@/lib/public-site";
import { pickProvided } from "@/lib/parse";

/**
 * Site settings are a singleton, so this sits outside the `[resource]` CRUD
 * routes: GET always returns a document (creating an empty one on first call)
 * and PATCH upserts.
 */

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    await connectDB();
    const settings = await Settings.findOneAndUpdate(
      { key: "site" },
      { $setOnInsert: { key: "site" } },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    ).lean();

    return ok(settings, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}

export async function PATCH(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    const body = await request.json();
    const parsed = settingsSchema.partial().parse(body) as Record<
      string,
      unknown
    >;
    const update = pickProvided(parsed, body);

    await connectDB();
    const updated = await Settings.findOneAndUpdate({ key: "site" }, update, {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }).lean();

    refreshPublicSite();
    return ok(updated, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}
