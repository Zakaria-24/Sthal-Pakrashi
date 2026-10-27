import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getCurrentUser } from "@/lib/current-user";
import { canManageUsers } from "@/lib/permissions";
import { pickProvided } from "@/lib/parse";
import { fail, handleError, ok, preflight } from "@/lib/api-response";

/**
 * Update or remove a staff account — super admin only.
 *
 * This is also where passwords are changed: staff have no way to change their
 * own, by design, so the super admin sets a new one here.
 */

const updateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  role: z.enum(["admin", "moderator"]).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

type Ctx = RouteContext<"/api/users/[id]">;

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const origin = request.headers.get("origin");
  try {
    const session = await getCurrentUser();
    if (!canManageUsers(session?.role)) {
      return fail("Only the super admin can change users.", 403, origin);
    }

    const { id } = await ctx.params;
    if (!isValidObjectId(id)) return fail("Invalid id", 400, origin);

    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const update = pickProvided(parsed as Record<string, unknown>, body);

    // Swap the plaintext password for its hash before it touches the database.
    if (typeof update.password === "string") {
      update.passwordHash = await bcrypt.hash(update.password, 12);
      delete update.password;
    }

    await connectDB();

    const target = await User.findById(id);
    if (!target) return fail("Not found", 404, origin);
    if (target.role === "superAdmin") {
      return fail("The super admin account cannot be edited here.", 403, origin);
    }

    const updated = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      projection: { passwordHash: 0 },
    }).lean();

    return ok(updated, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const origin = request.headers.get("origin");
  try {
    const session = await getCurrentUser();
    if (!canManageUsers(session?.role)) {
      return fail("Only the super admin can remove users.", 403, origin);
    }

    const { id } = await ctx.params;
    if (!isValidObjectId(id)) return fail("Invalid id", 400, origin);

    await connectDB();

    const target = await User.findById(id);
    if (!target) return fail("Not found", 404, origin);
    if (target.role === "superAdmin") {
      return fail("The super admin account cannot be removed.", 403, origin);
    }

    await User.findByIdAndDelete(id);
    return ok({ deleted: true, id }, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}
