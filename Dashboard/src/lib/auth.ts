import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import { env } from "@/lib/env";

export const SESSION_COOKIE = "school_cms_session";

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

function secretKey(): Uint8Array {
  return new TextEncoder().encode(env.JWT_SECRET);
}

export async function createSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${env.SESSION_MAX_AGE_DAYS}d`)
    .sign(secretKey());
}

/**
 * Verifies a session token. Uses `jose` rather than `jsonwebtoken` because
 * this also runs in `proxy.ts`, which executes on the Edge runtime where
 * Node crypto APIs are unavailable.
 */
export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string") return null;
    return {
      sub: payload.sub,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: String(payload.role ?? "admin"),
    };
  } catch {
    return null;
  }
}

/** Reads the current session in Server Components and Route Handlers. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: env.SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
