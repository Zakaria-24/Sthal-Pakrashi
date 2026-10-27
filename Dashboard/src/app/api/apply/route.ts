import type { NextRequest } from "next/server";
import { randomBytes } from "node:crypto";

import { connectDB } from "@/lib/db";
import { fail, handleError, ok, preflight } from "@/lib/api-response";
import {
  applicationInputSchema,
  DOCUMENT_SLOTS,
  MAX_DOCUMENT_BYTES,
} from "@/lib/application-schema";
import { sniffDocument } from "@/lib/file-sniff";
import {
  removePrivateFile,
  storePrivateFile,
  type StoredFile,
} from "@/lib/private-files";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { env } from "@/lib/env";
import { AdmissionInfo } from "@/models/AdmissionInfo";
import { Application } from "@/models/Application";
import { Settings } from "@/models/Settings";

/**
 * POST /api/apply — the only public write endpoint.
 *
 * multipart/form-data:
 *   data          JSON string with the form fields (see application-schema.ts)
 *   document_1…5  optional files (PDF, JPEG, PNG or WEBP, up to 5 MB each)
 *   label_1…5     optional text label for each file
 *
 * Only accepted while admissions are open. The response contains nothing but
 * the new application ID — no stored data is ever echoed back.
 */

const MAX_REQUEST_BYTES = 30 * 1024 * 1024;
const PER_CLIENT = { max: 5, windowMs: 60 * 60 * 1000 };
const GLOBAL = { max: 300, windowMs: 60 * 60 * 1000 };

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

/** e.g. APP-2027-7K3QF9 — random, so IDs cannot be enumerated. */
function newApplicationId(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  const code = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  return `APP-${new Date().getFullYear()}-${code}`;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const uploaded: StoredFile[] = [];

  try {
    const perClient = checkRateLimit(`apply:${clientKey(request.headers)}`, PER_CLIENT.max, PER_CLIENT.windowMs);
    const overall = checkRateLimit("apply:all", GLOBAL.max, GLOBAL.windowMs);
    if (!perClient.allowed || !overall.allowed) {
      const response = fail("Too many applications from this connection. Please try again later.", 429, origin);
      response.headers.set("Retry-After", String(Math.max(perClient.retryAfterSeconds, overall.retryAfterSeconds)));
      return response;
    }

    const declared = Number(request.headers.get("content-length") ?? 0);
    if (declared > MAX_REQUEST_BYTES) {
      return fail("The application is too large.", 413, origin);
    }

    await connectDB();

    const settings = await Settings.findOne({ key: "site" }, { admissionOpen: 1 }).lean();
    if (!settings?.admissionOpen) {
      return fail("Admissions are currently closed.", 403, origin);
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return fail("Send the application as multipart/form-data.", 415, origin);
    }

    let raw: unknown;
    try {
      raw = JSON.parse(String(form.get("data") ?? ""));
    } catch {
      return fail("The application data is missing or not valid JSON.", 400, origin);
    }
    const input = applicationInputSchema.parse(raw);

    // Validate every file before touching storage.
    const files: { slot: number; label: string; file: File; bytes: Uint8Array }[] = [];
    for (const slot of DOCUMENT_SLOTS) {
      const entry = form.get(`document_${slot}`);
      if (!(entry instanceof File) || entry.size === 0) continue;
      if (entry.size > MAX_DOCUMENT_BYTES) {
        return fail(`Document ${slot} is larger than 5 MB.`, 413, origin);
      }
      const bytes = new Uint8Array(await entry.arrayBuffer());
      if (!sniffDocument(bytes)) {
        return fail(`Document ${slot} must be a PDF, JPEG, PNG or WEBP file.`, 415, origin);
      }
      files.push({
        slot,
        label: String(form.get(`label_${slot}`) ?? "").trim().slice(0, 100),
        file: entry,
        bytes,
      });
    }
    if (files.length > 0 && !env.hasCloudinary) {
      return fail("Document uploads are not configured on this server.", 501, origin);
    }

    const applicationId = newApplicationId();
    const documents = [];
    for (const { slot, label, file, bytes } of files) {
      const type = sniffDocument(bytes)!;
      let stored: StoredFile;
      try {
        stored = await storePrivateFile(Buffer.from(bytes), applicationId, slot);
      } catch (error) {
        await Promise.all(uploaded.map((file) => removePrivateFile(file)));
        // Storage refused the file itself (e.g. a corrupt PDF): tell the
        // applicant which document to fix. Anything else is our problem.
        const refused = (error as { http_code?: number }).http_code === 400;
        console.error("[apply] document upload failed:", error);
        return refused
          ? fail(`Document ${slot} could not be read. Please upload a valid PDF or image.`, 415, origin)
          : fail("Could not store the documents right now. Please try again later.", 502, origin);
      }
      uploaded.push(stored);
      documents.push({
        slot,
        label,
        fileName: file.name.slice(0, 120),
        mimeType: type.mimeType,
        size: file.size,
        ...stored,
      });
    }

    const admission = await AdmissionInfo.findOne({ key: "admission" }, { academicSession: 1 }).lean();

    await Application.create({
      ...input,
      applicationId,
      session: admission?.academicSession ?? "",
      documents,
      statusHistory: [{ status: "submitted", by: "applicant", note: "" }],
    });

    return ok({ applicationId, status: "submitted" }, origin, 201);
  } catch (error) {
    // Do not leave orphaned private files behind when the record was not saved.
    await Promise.all(uploaded.map((file) => removePrivateFile(file)));
    return handleError(error, origin);
  }
}
