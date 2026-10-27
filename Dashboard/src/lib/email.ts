import "server-only";

import nodemailer from "nodemailer";

import { env } from "@/lib/env";

/**
 * OTP delivery. Follows the same approach as the PersoFin server.
 *
 * SMTP is optional on purpose: with no credentials configured the code is
 * printed to the dev console instead of emailed, so the dashboard is usable
 * immediately after copying it to a new school.
 */

const transporter = env.hasSmtp
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      // No connection pooling: on a serverless host each invocation may be a
      // fresh or a frozen-then-thawed container, and a pooled connection from
      // an earlier invocation is often stale by the time it is reused —
      // nodemailer only discovers that mid-send, then hangs on a dead socket
      // until socketTimeout. A fresh connection costs a TLS handshake each
      // time but behaves predictably.
      //
      // These are deliberately generous. Because there is no pool, every send
      // pays the full connect + greeting cost, and Gmail's handshake has been
      // measured at over 10s from some networks — tighter limits produce
      // "couldn't send the code" failures that come and go with the weather.
      connectionTimeout: env.SMTP_TIMEOUT_MS,
      greetingTimeout: env.SMTP_TIMEOUT_MS,
      socketTimeout: env.SMTP_TIMEOUT_MS * 2,
    })
  : null;

/**
 * Checks the SMTP credentials so a bad password shows up in the server log
 * rather than as silently undelivered codes.
 */
export async function verifyEmailTransport(): Promise<void> {
  if (!transporter) {
    console.info(
      "[email] SMTP not configured — login codes will be printed to this console.",
    );
    return;
  }
  try {
    await transporter.verify();
    console.info("[email] SMTP ready.");
  } catch (error) {
    console.error(
      "[email] SMTP verification FAILED — login codes will not be delivered:",
      error,
    );
  }
}

export async function sendOtpEmail(
  to: string,
  code: string,
  siteName: string,
): Promise<void> {
  if (!transporter) {
    console.info(
      `\n[OTP] ${to} -> ${code}  (expires in ${env.OTP_EXPIRES_MINUTES}m, SMTP not configured)\n`,
    );
    return;
  }

  await transporter.sendMail({
    from: `"${siteName}" <${env.SMTP_FROM || env.SMTP_USER}>`,
    to,
    subject: `Your ${siteName} login code`,
    text: `Your login code is ${code}. It expires in ${env.OTP_EXPIRES_MINUTES} minutes.`,
    html: `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:440px;margin:0 auto;padding:32px 24px;">
        <h2 style="margin:0 0 4px;font-size:18px;color:#0f172a;">${siteName}</h2>
        <p style="margin:0 0 28px;font-size:14px;color:#64748b;">Your one-time login code</p>
        <div style="background:#f1f5f9;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#1e293b;">${code}</span>
        </div>
        <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
          This code expires in <strong style="color:#334155;">${env.OTP_EXPIRES_MINUTES} minutes</strong>.
          If you didn't try to sign in, you can safely ignore this email — no action is needed.
        </p>
      </div>
    `,
  });
}
