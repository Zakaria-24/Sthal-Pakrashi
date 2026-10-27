import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * One-time login codes for the super admin.
 *
 * The code is stored as a hash, not in plain text — read access to the
 * database should not be enough to sign in as the super admin.
 *
 * `expires: 900` puts a TTL index on `createdAt`, so MongoDB removes stale
 * documents on its own and the collection cannot grow unbounded.
 */
const OtpSchema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: 900 },
});

export type OtpDoc = InferSchemaType<typeof OtpSchema>;

export const Otp: Model<OtpDoc> =
  (models.Otp as Model<OtpDoc>) ?? model<OtpDoc>("Otp", OtpSchema);
