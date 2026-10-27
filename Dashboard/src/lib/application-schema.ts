import { z } from "zod";

import { APPLICATION_STATUSES } from "@/models/Application";

/**
 * Validation for the public application form. Field names match the public
 * site's form one-to-one. Only what the form collects is required; the extra
 * optional fields (gender, birth registration number, parents, relationship)
 * are accepted so an institution can start collecting them without an API
 * change, but nothing demands them.
 */
const short = (max = 200) => z.string().trim().max(max).default("");
const required = (label: string, max = 200) =>
  z.string().trim().min(1, `${label} is required`).max(max);

const dateOfBirth = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce
    .date({ error: "Date of birth is required" })
    .refine((date) => date.getTime() <= Date.now(), "Date of birth cannot be in the future")
    .refine((date) => date.getFullYear() >= 1980, "Date of birth is not valid"),
);

const phone = z
  .string()
  .trim()
  .min(1, "Guardian phone is required")
  .max(24)
  .regex(/^[0-9+()\-\s]{6,24}$/, "Enter a valid phone number");

const email = z
  .string()
  .trim()
  .max(200)
  .refine((value) => value === "" || z.email().safeParse(value).success, "Enter a valid email address")
  .default("");

export const applicationInputSchema = z.object({
  studentName: required("Student name"),
  studentDob: dateOfBirth,
  gender: z.enum(["", "male", "female", "other"]).default(""),
  birthRegistrationNo: short(40),
  classApplying: required("Class applying for", 60),
  guardianName: required("Guardian name"),
  guardianRelationship: short(60),
  fatherName: short(),
  motherName: short(),
  guardianPhone: phone,
  guardianEmail: email,
  prevSchool: short(),
  prevClass: short(60),
  prevResult: short(60),
});

export type ApplicationInput = z.infer<typeof applicationInputSchema>;

/** Admin edits to an existing application. */
export const applicationUpdateSchema = z
  .object({
    status: z.enum(APPLICATION_STATUSES),
    adminNote: z.string().trim().max(2000),
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "Nothing to update");

/** Number of document slots on the public form. */
export const DOCUMENT_SLOTS = [1, 2, 3, 4, 5] as const;
export const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;
