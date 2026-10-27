import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";

import { connectDB } from "@/lib/db";
import { fail, handleError, ok, preflight } from "@/lib/api-response";
import { applicationUpdateSchema } from "@/lib/application-schema";
import { removePrivateFile, signedDownloadUrl } from "@/lib/private-files";
import { requireAdmin } from "@/lib/require-admin";
import { Application } from "@/models/Application";

/**
 * GET    /api/applications/:id   full record + short-lived document links
 * PATCH  /api/applications/:id   { status?, adminNote? }
 * DELETE /api/applications/:id   removes the record and its stored documents
 * Admin only.
 */

type Ctx = { params: Promise<{ id: string }> };

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function GET(request: NextRequest, ctx: Ctx) {
  const origin = request.headers.get("origin");
  try {
    const guard = await requireAdmin(origin);
    if ("response" in guard) return guard.response;

    const { id } = await ctx.params;
    if (!isValidObjectId(id)) return fail("Invalid id", 400, origin);

    await connectDB();
    const application = await Application.findById(id).lean();
    if (!application) return fail("Not found", 404, origin);

    const documents = application.documents.map((doc) => ({
      slot: doc.slot,
      label: doc.label,
      fileName: doc.fileName,
      mimeType: doc.mimeType,
      size: doc.size,
      downloadUrl: signedDownloadUrl(doc),
    }));

    return ok({ ...application, documents }, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const origin = request.headers.get("origin");
  try {
    const guard = await requireAdmin(origin);
    if ("response" in guard) return guard.response;

    const { id } = await ctx.params;
    if (!isValidObjectId(id)) return fail("Invalid id", 400, origin);

    const body = await request.json();
    const changes = applicationUpdateSchema.parse(body);

    await connectDB();
    const current = await Application.findById(id);
    if (!current) return fail("Not found", 404, origin);

    if (changes.adminNote !== undefined) current.adminNote = changes.adminNote;
    if (changes.status !== undefined && changes.status !== current.status) {
      current.status = changes.status;
      current.statusHistory.push({
        status: changes.status,
        at: new Date(),
        by: guard.user.email,
        note: changes.adminNote ?? "",
      });
    }
    await current.save();

    return ok(current.toObject(), origin);
  } catch (error) {
    return handleError(error, origin);
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const origin = request.headers.get("origin");
  try {
    const guard = await requireAdmin(origin);
    if ("response" in guard) return guard.response;

    const { id } = await ctx.params;
    if (!isValidObjectId(id)) return fail("Invalid id", 400, origin);

    await connectDB();
    const deleted = await Application.findByIdAndDelete(id).lean();
    if (!deleted) return fail("Not found", 404, origin);

    await Promise.all(deleted.documents.map((doc) => removePrivateFile(doc)));
    return ok({ deleted: true, id }, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}
