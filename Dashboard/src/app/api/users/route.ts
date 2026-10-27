import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import { env } from "@/lib/env";
import { User } from "@/models/User";
import { getCurrentUser } from "@/lib/current-user";
import { canManageUsers } from "@/lib/permissions";
import { fail, handleError, ok, preflight } from "@/lib/api-response";

/**
 * Staff accounts. Only the super admin reaches these handlers — `proxy.ts`
 * blocks everyone else, and each handler re-checks as defence in depth.
 */

const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().min(3, "Email is required"),
  role: z.enum(["admin", "moderator"]).default("moderator"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    const session = await getCurrentUser();
    if (!canManageUsers(session?.role)) {
      return fail("Only the super admin can manage users.", 403, origin);
    }

    await connectDB();
    // `passwordHash` is never returned, not even to the super admin.
    const items = await User.find({}, { passwordHash: 0 })
      .sort({ role: 1, name: 1 })
      .lean();

    return ok({ items, total: items.length }, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    const session = await getCurrentUser();
    if (!canManageUsers(session?.role)) {
      return fail("Only the super admin can create users.", 403, origin);
    }

    const body = await request.json();
    const { name, email, role, password } = createUserSchema.parse(body);

    if (email === env.SUPER_ADMIN_EMAIL) {
      return fail(
        "That address is reserved for the super admin.",
        409,
        origin,
      );
    }

    await connectDB();

    if (await User.exists({ email })) {
      return fail("A user with that email already exists.", 409, origin);
    }

    const created = await User.create({
      name,
      email,
      role,
      passwordHash: await bcrypt.hash(password, 12),
      isActive: true,
      createdByEmail: session?.email ?? "",
    });

    const { passwordHash: _omit, ...safe } = created.toObject();
    void _omit;

    return ok(safe, origin, 201);
  } catch (error) {
    return handleError(error, origin);
  }
}
