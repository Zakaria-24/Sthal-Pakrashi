import type { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";
import { fail, handleError, ok, preflight } from "@/lib/api-response";
import { requireAdmin } from "@/lib/require-admin";
import { APPLICATION_STATUSES, Application } from "@/models/Application";

/**
 * GET /api/applications?status=&search=&class=&page=&limit=
 * Admin only. Returns a page of applications (without document links) plus the
 * number of applications in each status for the dashboard's filter tabs.
 */

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    const guard = await requireAdmin(origin);
    if ("response" in guard) return guard.response;

    const params = request.nextUrl.searchParams;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    const status = params.get("status");
    if (status) {
      if (!(APPLICATION_STATUSES as readonly string[]).includes(status)) {
        return fail("Unknown status", 400, origin);
      }
      query.status = status;
    }

    const classApplying = params.get("class")?.trim();
    if (classApplying) query.classApplying = classApplying;

    const search = params.get("search")?.trim();
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = ["applicationId", "studentName", "guardianName", "guardianPhone"].map(
        (field) => ({ [field]: { $regex: escaped, $options: "i" } }),
      );
    }

    const limit = Math.min(Number(params.get("limit")) || 25, 100);
    const page = Math.max(Number(params.get("page")) || 1, 1);

    await connectDB();
    const [rows, total, byStatus] = await Promise.all([
      Application.find(query, { statusHistory: 0 })
        .sort({ submittedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Application.countDocuments(query),
      Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    const counts: Record<string, number> = Object.fromEntries(
      APPLICATION_STATUSES.map((s) => [s, 0]),
    );
    for (const row of byStatus) counts[row._id] = row.count;

    const items = rows.map(({ documents, ...rest }) => ({
      ...rest,
      documentCount: documents?.length ?? 0,
    }));

    return ok({ items, total, page, limit, counts }, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}
