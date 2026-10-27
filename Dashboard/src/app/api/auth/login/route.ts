import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import { env } from "@/lib/env";
import { User } from "@/models/User";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { fail, handleError, ok, preflight } from "@/lib/api-response";

/**
 * Password sign-in for staff accounts (admin / moderator).
 *
 * Their passwords are set and changed by the super admin only — there is no
 * self-service change or reset anywhere in this system. The super admin does
 * not have a password and cannot sign in here; that account uses a one-time
 * code (`/api/auth/send-otp`).
 */

const schema = z.object({
  email: z.string().trim().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  try {
    const body = await request.json();
    const { email, password } = schema.parse(body);
    const normalised = email.toLowerCase().trim();

    if (normalised === env.SUPER_ADMIN_EMAIL) {
      return fail(
        "The super admin signs in with a one-time code, not a password.",
        403,
        origin,
      );
    }

    await connectDB();

    const user = await User.findOne({ email: normalised });

    // Same response whether the account is missing or the password is wrong,
    // so this endpoint can't be used to enumerate staff addresses.
    if (!user || !user.passwordHash) {
      return fail("Invalid email or password", 401, origin);
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) return fail("Invalid email or password", 401, origin);

    if (!user.isActive) {
      return fail("This account has been deactivated.", 403, origin);
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = await createSessionToken({
      sub: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    });
    await setSessionCookie(token);

    return ok(
      {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      origin,
    );
  } catch (error) {
    return handleError(error, origin);
  }
}
