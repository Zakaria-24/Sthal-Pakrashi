import type { UserRole } from "@/models/User";

/**
 * What each role may do. Kept free of server-only imports so the dashboard UI
 * can hide controls the current user cannot use.
 *
 * The super admin is the only account that can manage users and passwords —
 * that is the whole point of the split: staff accounts are administered, not
 * self-served.
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  superAdmin: "Super admin",
  admin: "Admin",
  moderator: "Moderator",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  superAdmin: "Full control, including users and their passwords.",
  admin: "Manages all content and site settings.",
  moderator: "Manages content only.",
};

/** Roles the super admin is allowed to hand out. */
export const ASSIGNABLE_ROLES = ["admin", "moderator"] as const;

export function canManageUsers(role: string | undefined): boolean {
  return role === "superAdmin";
}

export function canEditSettings(role: string | undefined): boolean {
  return role === "superAdmin" || role === "admin";
}

export function canEditContent(role: string | undefined): boolean {
  return role === "superAdmin" || role === "admin" || role === "moderator";
}
