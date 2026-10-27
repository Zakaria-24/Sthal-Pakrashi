import mongoose from "mongoose";

import { env } from "@/lib/env";
import { initializeMongoDns } from "@/lib/mongodb-dns";
import { MongoConnectionError } from "@/lib/mongodb-diagnostics";

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
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;
  if (cached.conn && mongoose.connection.readyState !== 1) cached.conn = null;

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        // Run immediately before connect() so this is ordered ahead of the
        // MongoDB driver's mongodb+srv SRV/TXT queries in the Node runtime.
        initializeMongoDns();
        return await mongoose.connect(env.MONGODB_URI, {
          dbName: env.MONGODB_DB_NAME,
          bufferCommands: false,
          serverSelectionTimeoutMS: 12000,
        });
      } catch (error) {
        throw new MongoConnectionError(error);
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset so the next request retries instead of reusing a rejected promise.
    cached.promise = null;
    cached.conn = null;
    const failure = error instanceof MongoConnectionError
      ? error
      : new MongoConnectionError(error);
    console.error("[db] MongoDB connection failed", failure.diagnostic);
    throw failure;
  }

  return cached.conn;
}
