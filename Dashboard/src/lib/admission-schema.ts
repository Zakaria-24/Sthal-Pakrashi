import { z } from "zod";

const line = z.string().trim().min(1).max(500);

/** Validation for the admission-information singleton. */
export const admissionInfoSchema = z.object({
  academicSession: z.string().trim().max(60).default(""),
  eligibility: z.array(line).max(30).default([]),
  process: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(120),
        description: z.string().trim().max(500).default(""),
      }),
    )
    .max(20)
    .default([]),
  requiredDocuments: z.array(line).max(30).default([]),
  fees: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(120),
        amount: z.string().trim().max(120).default(""),
      }),
    )
    .max(30)
    .default([]),
  importantDates: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(120),
        value: z.string().trim().max(120).default(""),
      }),
    )
    .max(30)
    .default([]),
  instructions: z.string().trim().max(5000).default(""),
});
