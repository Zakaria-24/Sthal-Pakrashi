import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * An online admission application. Private by design: nothing in this model is
 * ever returned by a public endpoint — the applicant only ever gets back the
 * application ID. Uploaded documents are stored as private Cloudinary assets;
 * only their storage identifiers live here, never a public URL.
 */
export const APPLICATION_STATUSES = [
  "submitted",
  "under-review",
  "accepted",
  "rejected",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

const DocumentSchema = new Schema(
  {
    /** Which of the form's document slots this file fills (1–5). */
    slot: { type: Number, required: true },
    label: { type: String, default: "" },
    fileName: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    size: { type: Number, default: 0 },
    publicId: { type: String, required: true },
    resourceType: { type: String, default: "image" },
    format: { type: String, default: "" },
  },
  { _id: false },
);

const StatusEntrySchema = new Schema(
  {
    status: { type: String, enum: APPLICATION_STATUSES, required: true },
    at: { type: Date, default: () => new Date() },
    by: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  { _id: false },
);

const ApplicationSchema = new Schema(
  {
    applicationId: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: APPLICATION_STATUSES, default: "submitted", index: true },
    /** Academic session at the time of submission (from the admission info). */
    session: { type: String, default: "" },

    /* --- student --- */
    studentName: { type: String, required: true, trim: true },
    studentDob: { type: Date, required: true },
    gender: { type: String, enum: ["", "male", "female", "other"], default: "" },
    birthRegistrationNo: { type: String, default: "", trim: true },
    classApplying: { type: String, required: true, trim: true },

    /* --- guardian --- */
    guardianName: { type: String, required: true, trim: true },
    guardianRelationship: { type: String, default: "", trim: true },
    fatherName: { type: String, default: "", trim: true },
    motherName: { type: String, default: "", trim: true },
    guardianPhone: { type: String, required: true, trim: true },
    guardianEmail: { type: String, default: "", trim: true, lowercase: true },

    /* --- previous institution --- */
    prevSchool: { type: String, default: "", trim: true },
    prevClass: { type: String, default: "", trim: true },
    prevResult: { type: String, default: "", trim: true },

    documents: { type: [DocumentSchema], default: [] },

    /* --- handling --- */
    adminNote: { type: String, default: "" },
    statusHistory: { type: [StatusEntrySchema], default: [] },
    submittedAt: { type: Date, default: () => new Date(), index: true },
  },
  { timestamps: true },
);

export type ApplicationDoc = InferSchemaType<typeof ApplicationSchema>;

export const Application: Model<ApplicationDoc> =
  (models.Application as Model<ApplicationDoc>) ??
  model<ApplicationDoc>("Application", ApplicationSchema);
