import "server-only";

import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getSession, type SessionPayload } from "@/lib/auth";

/**
 * Resolves the signed-in user against the database.
 *
 * The session cookie is a stateless JWT, so on its own it keeps working until
 * it expires — even if the account was deleted, deactivated, or had its role
 * reduced in the meantime. Anything that grants access checks here instead of
 * trusting the token's claims, so revoking a user takes effect immediately.
 */
export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session: SessionPayload | null = await getSession();
  if (!session) return null;

  try {
    await connectDB();
    const user = await User.findById(session.sub, { passwordHash: 0 }).lean();
    if (!user || !user.isActive) return null;

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    // A database outage shouldn't hand out access on the strength of an
    // unverifiable token.
    console.error("[auth] could not verify session against database:", error);
    return null;
  }
}
