import type { NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import { env } from "@/lib/env";
import { Otp } from "@/models/Otp";
import { User } from "@/models/User";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { fail, handleError, ok, preflight } from "@/lib/api-response";

const schema = z.object({
  email: z.string().trim().min(1, "Email is required"),
  code: z.string().trim().min(1, "Code is required"),
});

const hashCode = (code: string) => createHash("sha256").update(code).digest("hex");

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  try {
    const body = await request.json();
    const { email, code } = schema.parse(body);
    const normalised = email.toLowerCase().trim();

    await connectDB();

    const record = await Otp.findOne({ email: normalised });
    if (!record) {
      return fail("No code was requested for this address.", 401, origin);
    }

    if (record.expiresAt.getTime() < Date.now()) {
      await Otp.deleteMany({ email: normalised });
      return fail("That code has expired. Request a new one.", 401, origin);
    }

    // Cap guesses so a 6-digit code can't be brute-forced within its lifetime.
    if (record.attempts >= env.OTP_MAX_ATTEMPTS) {
      await Otp.deleteMany({ email: normalised });
      return fail("Too many incorrect attempts. Request a new code.", 429, origin);
    }

    if (record.codeHash !== hashCode(code)) {
      record.attempts += 1;
      await record.save();
      const left = env.OTP_MAX_ATTEMPTS - record.attempts;
      return fail(
        left > 0
          ? `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} remaining.`
          : "Incorrect code. Request a new one.",
        401,
        origin,
      );
    }

    // Single-use: consume every outstanding code for this address.
    await Otp.deleteMany({ email: normalised });

    const user = await User.findOne({ email: normalised });
    if (!user || !user.isActive) {
      return fail("Account not found or deactivated.", 403, origin);
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
