import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Singleton holding the editable admission information page: who may apply,
 * how, with which documents, at what cost and when. Every list is optional —
 * an empty list means "not published yet", and the public site then shows its
 * own "Not published / Announced via notice" state instead of inventing rules.
 */
const AdmissionInfoSchema = new Schema(
  {
    key: { type: String, default: "admission", unique: true, immutable: true },

    /** The academic session applications are for, e.g. "2027". */
    academicSession: { type: String, default: "" },

    /** One eligibility rule per entry. */
    eligibility: { type: [String], default: [] },

    /** Ordered application steps. */
    process: {
      type: [{ title: String, description: String, _id: false }],
      default: [],
    },

    /** Documents an applicant must bring or upload. */
    requiredDocuments: { type: [String], default: [] },

    /** Fee rows, e.g. { label: "Admission fee", amount: "…" }. */
    fees: {
      type: [{ label: String, amount: String, _id: false }],
      default: [],
    },

    /** Date rows, e.g. { label: "Application deadline", value: "…" }. */
    importantDates: {
      type: [{ label: String, value: String, _id: false }],
      default: [],
    },

    /** Free-text instructions shown with the admission notices. */
    instructions: { type: String, default: "" },
  },
  { timestamps: true },
);

export type AdmissionInfoDoc = InferSchemaType<typeof AdmissionInfoSchema>;

export const AdmissionInfo: Model<AdmissionInfoDoc> =
  (models.AdmissionInfo as Model<AdmissionInfoDoc>) ??
  model<AdmissionInfoDoc>("AdmissionInfo", AdmissionInfoSchema);
