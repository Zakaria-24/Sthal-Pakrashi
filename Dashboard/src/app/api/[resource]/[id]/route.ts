import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { DEFAULT_PUBLIC_FILTER, getResourceConfig } from "@/lib/resource-config";
import { RESOURCE_MODELS } from "@/lib/resource-models";
import { fail, handleError, ok, preflight } from "@/lib/api-response";
import { pickProvided } from "@/lib/parse";
import type { ResourceSlug } from "@/lib/resource-config";

/** Single-item handlers shared by every content type. */

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

type Ctx = RouteContext<"/api/[resource]/[id]">;

type Resolved =
  | { kind: "error"; message: string; status: number }
  | {
      kind: "ok";
      config: NonNullable<ReturnType<typeof getResourceConfig>>;
      model: (typeof RESOURCE_MODELS)[ResourceSlug];
      id: string;
    };

async function resolve(ctx: Ctx): Promise<Resolved> {
  const { resource, id } = await ctx.params;
  const config = getResourceConfig(resource);
  if (!config) {
    return {
      kind: "error",
      message: `Unknown resource "${resource}"`,
      status: 404,
    };
  }
  if (!isValidObjectId(id)) {
    return { kind: "error", message: "Invalid id", status: 400 };
  }
  return {
    kind: "ok",
    config,
    model: RESOURCE_MODELS[resource as ResourceSlug],
    id,
  };
}

export async function GET(request: NextRequest, ctx: Ctx) {
  const origin = request.headers.get("origin");
  try {
    const resolved = await resolve(ctx);
    if (resolved.kind === "error") {
      return fail(resolved.message, resolved.status, origin);
    }

    // Same rule as the list: signed-out callers only reach published items.
    const session = await getSession();
    const filter = session
      ? { _id: resolved.id }
      : { _id: resolved.id, ...(resolved.config.publicFilter ?? DEFAULT_PUBLIC_FILTER) };

    await connectDB();
    const item = await resolved.model.findOne(filter).lean();
    if (!item) return fail("Not found", 404, origin);

    return ok(item, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const origin = request.headers.get("origin");
  try {
    const resolved = await resolve(ctx);
    if (resolved.kind === "error") {
      return fail(resolved.message, resolved.status, origin);
    }

    const body = await request.json();
    const parsed = resolved.config.updateSchema.parse(body) as Record<
      string,
      unknown
    >;
    const update = pickProvided(parsed, body);

    await connectDB();
    const updated = await resolved.model
      .findByIdAndUpdate(resolved.id, update, {
        returnDocument: "after",
        runValidators: true,
      })
      .lean();
    if (!updated) return fail("Not found", 404, origin);

    return ok(updated, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const origin = request.headers.get("origin");
  try {
    const resolved = await resolve(ctx);
    if (resolved.kind === "error") {
      return fail(resolved.message, resolved.status, origin);
    }

    await connectDB();
    const deleted = await resolved.model.findByIdAndDelete(resolved.id).lean();
    if (!deleted) return fail("Not found", 404, origin);

    return ok({ deleted: true, id: resolved.id }, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}
