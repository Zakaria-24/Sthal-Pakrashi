import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Dashboard accounts.
 *
 * Two distinct sign-in methods, deliberately not interchangeable:
 *
 *   superAdmin        — one account, created from the terminal with
 *                       `npm run bootstrap:super-admin`, which also sets and
 *                       resets its password. Signs in with that password, or
 *                       with a one-time code sent to SUPER_ADMIN_EMAIL.
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
    /** bcrypt hash. The super admin's is set from the terminal only. */
    passwordHash: { type: String, default: "" },
    /** Incremented when the password changes to invalidate prior JWT sessions. */
    credentialVersion: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    createdByEmail: { type: String, default: "" },
  },
  { timestamps: true },
);

// The role is assigned only by server-side setup/admin code. The partial
// unique index makes the single-super-admin invariant safe under concurrent
// bootstrap commands while allowing multiple regular staff accounts.
UserSchema.index(
  { role: 1 },
  {
    unique: true,
    partialFilterExpression: { role: "superAdmin" },
    name: "one_super_admin",
  },
);

export type UserDoc = InferSchemaType<typeof UserSchema>;

export const User: Model<UserDoc> =
  (models.User as Model<UserDoc>) ?? model<UserDoc>("User", UserSchema);
