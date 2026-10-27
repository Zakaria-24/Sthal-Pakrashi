import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

export function deterministicOtpId(email) {
  return createHash("sha256").update(email.toLowerCase().trim()).digest("hex").slice(0, 24);
}

export function hashOtpCode(code, secret) {
  return createHmac("sha256", secret).update(code).digest("hex");
}

export function verifyOtpCode(code, storedHash, secret, hashVersion = 2) {
  const actual = hashVersion >= 2
    ? hashOtpCode(code, secret)
    : createHash("sha256").update(code).digest("hex");
  const expectedBuffer = Buffer.from(storedHash, "hex");
  const actualBuffer = Buffer.from(actual, "hex");
  return expectedBuffer.length === actualBuffer.length &&
    timingSafeEqual(expectedBuffer, actualBuffer);
}

export function hashPassword(password, rounds = 12) {
  return bcrypt.hash(password, rounds);
}

export function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
