import type { NextRequest } from "next/server";
import { createHash, randomInt } from "node:crypto";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import { env } from "@/lib/env";
import { Otp } from "@/models/Otp";
import { User } from "@/models/User";
import { Settings } from "@/models/Settings";
import { sendOtpEmail } from "@/lib/email";
import { fail, handleError, ok, preflight } from "@/lib/api-response";

/**
 * Issues a one-time login code.
 *
 * Only the super admin signs in this way. Staff accounts use a password set
 * for them by the super admin, so a code request for any other address is
 * refused rather than silently doing nothing.
 */

const schema = z.object({
  email: z.string().trim().min(1, "Email is required"),
});

const hashCode = (code: string) => createHash("sha256").update(code).digest("hex");

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  try {
    const body = await request.json();
    const { email } = schema.parse(body);
    const normalised = email.toLowerCase().trim();

    if (normalised !== env.SUPER_ADMIN_EMAIL) {
      return fail(
        "One-time codes are only for the super admin. Staff should sign in with their password.",
        403,
        origin,
      );
    }

    await connectDB();

    // The super admin account is created on first use and always kept active,
    // so the owner can never be locked out of their own dashboard.
    const superAdmin = await User.findOneAndUpdate(
      { email: normalised },
      {
        $set: { role: "superAdmin", isActive: true },
        $setOnInsert: { name: env.SUPER_ADMIN_NAME, email: normalised },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    // Throttle resends so the address can't be flooded.
    const existing = await Otp.findOne({ email: normalised }).sort({
      createdAt: -1,
    });
    if (existing) {
      const age = (Date.now() - existing.createdAt.getTime()) / 1000;
      if (age < env.OTP_RESEND_SECONDS) {
        return fail(
          `Please wait ${Math.ceil(env.OTP_RESEND_SECONDS - age)}s before requesting another code.`,
          429,
          origin,
        );
      }
    }

    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");

    await Otp.deleteMany({ email: normalised });
    await Otp.create({
      email: normalised,
      codeHash: hashCode(code),
      expiresAt: new Date(Date.now() + env.OTP_EXPIRES_MINUTES * 60 * 1000),
    });

    const settings = await Settings.findOne({ key: "site" }).lean();
    const siteName = settings?.siteName || "School CMS";

    /*
     * Awaited on purpose: on a serverless host the container can be frozen the
     * moment the response is sent, which would cut a fire-and-forget send off
     * mid-delivery while the client had already been told "sent".
     */
    try {
      await sendOtpEmail(normalised, code, siteName);
    } catch (error) {
      console.error(`[auth] failed to deliver code to ${normalised}:`, error);
      return fail("Couldn't send the code. Please try again.", 503, origin);
    }

    return ok(
      {
        sent: true,
        expiresInMinutes: env.OTP_EXPIRES_MINUTES,
        // Tells the UI to mention the terminal instead of the inbox.
        delivery: env.hasSmtp ? "email" : "console",
        name: superAdmin.name,
      },
      origin,
    );
  } catch (error) {
    return handleError(error, origin);
  }
}
