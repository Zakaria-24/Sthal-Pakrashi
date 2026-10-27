import type { NextRequest } from "next/server";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { DEFAULT_PUBLIC_FILTER, getResourceConfig } from "@/lib/resource-config";
import { RESOURCE_MODELS } from "@/lib/resource-models";
import { fail, handleError, ok, preflight } from "@/lib/api-response";
import { refreshPublicSite } from "@/lib/public-site";
import type { ResourceSlug } from "@/lib/resource-config";

/**
 * One handler serves the list endpoint of every content type. Adding a new
 * content type needs no new route file — just a registry entry.
 *
 * GET  /api/<resource>?activeOnly=true&limit=10&page=1&search=&category=
 * POST /api/<resource>
 *
 * Reads are public, but only for published content: a request without a
 * dashboard session is always narrowed to the resource's public filter
 * (`isActive`, or `status: "published"` for posts), so drafts and hidden
 * items cannot be listed by leaving `activeOnly` out of the query string.
 */

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/[resource]">,
) {
  const origin = request.headers.get("origin");

  try {
    const { resource } = await ctx.params;
    const config = getResourceConfig(resource);
    if (!config) return fail(`Unknown resource "${resource}"`, 404, origin);

    const model = RESOURCE_MODELS[resource as ResourceSlug];
    const params = request.nextUrl.searchParams;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    // The public site only ever wants published items; the dashboard wants all.
    // Signed-out callers cannot opt out of the filter.
    const session = await getSession();
    if (!session || params.get("activeOnly") === "true") {
      Object.assign(query, config.publicFilter ?? DEFAULT_PUBLIC_FILTER);
    }

    const category = params.get("category");
    if (category) query.category = category;

    const featured = params.get("featured");
    if (featured === "true") query.isFeatured = true;

    const search = params.get("search")?.trim();
    if (search && config.searchFields.length > 0) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = config.searchFields.map((field) => ({
        [field]: { $regex: escaped, $options: "i" },
      }));
    }

    const limit = Math.min(Number(params.get("limit")) || 100, 200);
    const page = Math.max(Number(params.get("page")) || 1, 1);

    await connectDB();

    const [items, total] = await Promise.all([
      model
        .find(query)
        .sort(config.defaultSort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      model.countDocuments(query),
    ]);

    return ok({ items, total, page, limit }, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/[resource]">,
) {
  const origin = request.headers.get("origin");

  try {
    const { resource } = await ctx.params;
    const config = getResourceConfig(resource);
    if (!config) return fail(`Unknown resource "${resource}"`, 404, origin);

    const model = RESOURCE_MODELS[resource as ResourceSlug];
    const body = await request.json();
    const parsed = config.createSchema.parse(body) as Record<string, unknown>;

    await connectDB();
    const created = await model.create(parsed);

    refreshPublicSite();
    return ok(created.toObject(), origin, 201);
  } catch (error) {
    return handleError(error, origin);
  }
}
