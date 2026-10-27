import type { NextRequest } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { ok, preflight } from "@/lib/api-response";
import { fail } from "@/lib/api-response";
import { MongoConnectionError, diagnoseMongoError } from "@/lib/mongodb-diagnostics";

export const runtime = "nodejs";

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
    if (!mongoose.connection.db) throw new Error("MongoDB connection is not initialized");
    await mongoose.connection.db.admin().command({ ping: 1 });
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB ping succeeded but the connection is not ready");
    }
    return ok({ status: "ok", database: "connected" }, origin);
  } catch (error) {
    if (!(error instanceof MongoConnectionError)) {
      console.error("[health] MongoDB ping failed", diagnoseMongoError(error));
    }
    return fail("Database unavailable", 503, origin);
  }
}
