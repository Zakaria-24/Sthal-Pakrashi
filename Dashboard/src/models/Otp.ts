import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * One-time login codes for the super admin.
 *
 * The code is stored as a hash, not in plain text — read access to the
 * database should not be enough to sign in as the super admin.
 *
 * A TTL index on `expiresAt` removes expired codes. New records use a stable
 * per-email `_id`, keeping concurrent requests from creating duplicate codes.
 */
const OtpSchema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  codeHash: { type: String, required: true },
  hashVersion: { type: Number, default: 2 },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "otp_expiry" });

export type OtpDoc = InferSchemaType<typeof OtpSchema>;

export const Otp: Model<OtpDoc> =
  (models.Otp as Model<OtpDoc>) ?? model<OtpDoc>("Otp", OtpSchema);
