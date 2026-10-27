import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Dashboard accounts.
 *
 * Two distinct sign-in methods, deliberately not interchangeable:
 *
 *   superAdmin        — one account, defined by SUPER_ADMIN_EMAIL. Signs in
 *                       with a one-time code sent to that address. Has no
 *                       password at all, so there is nothing to leak or reset.
 *   admin / moderator — created by the super admin, who also sets and changes
 *                       their password. They sign in with email + password and
 *                       cannot change it themselves.
 */
export const USER_ROLES = ["superAdmin", "admin", "moderator"] as const;
export type UserRole = (typeof USER_ROLES)[number];

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "moderator",
      required: true,
    },
    /** Absent for the super admin, who signs in by one-time code. */
    passwordHash: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    createdByEmail: { type: String, default: "" },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof UserSchema>;

export const User: Model<UserDoc> =
  (models.User as Model<UserDoc>) ?? model<UserDoc>("User", UserSchema);
