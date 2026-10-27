"use server";

import { headers } from "next/headers";

import { submitApplication } from "@/lib/api";

/**
 * Admission application submission. The form's fields and chosen documents
 * arrive as FormData and are relayed to the CMS, which is the only place that
 * knows whether admissions are open and the only place that stores anything.
 * The applicant is shown an Application ID only if the CMS returned one.
 */
export type ApplicationResult =
  | { ok: true; id: string }
  | {
      ok: false;
      reason: "closed" | "invalid" | "too-many" | "file" | "unavailable";
    };

export async function submitApplicationAction(
  form: FormData,
): Promise<ApplicationResult> {
  const incoming = await headers();
  const address =
    incoming.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    incoming.get("x-real-ip") ||
    undefined;

  const result = await submitApplication(form, address);
  if (result.ok) return { ok: true, id: result.applicationId };
  return { ok: false, reason: result.reason };
}
