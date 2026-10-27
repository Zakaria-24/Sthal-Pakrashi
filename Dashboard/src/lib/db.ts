import mongoose from "mongoose";

import { env } from "@/lib/env";

/**
 * Next.js hot-reloads modules in development, which would otherwise open a new
 * Mongo connection on every reload until the pool is exhausted. Caching the
 * connection promise on `globalThis` keeps exactly one connection per process.
 */
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalCache = globalThis as typeof globalThis & {
  _mongoose?: MongooseCache;
};

const cached: MongooseCache = globalCache._mongoose ?? {
  conn: null,
  promise: null,
};
globalCache._mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      bufferCommands: false,
      // Fail fast instead of hanging: the public site relies on a quick
      // failure to fall back to its bundled placeholder content.
      serverSelectionTimeoutMS: 8000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset so the next request retries instead of reusing a rejected promise.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
