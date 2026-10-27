/**
 * Local development database.
 *
 * Starts a real MongoDB server on 127.0.0.1:27017 with its data files kept in
 * `.mongo-data/`, so content you create in the dashboard survives restarts.
 * Nothing in the application code knows about this — the app only reads
 * MONGODB_URI, so pointing at MongoDB Atlas later means editing `.env.local`
 * and nothing else.
 *
 * Usage:  npm run dev:db      (leave running in its own terminal)
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { MongoMemoryServer } from "mongodb-memory-server";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dbPath = resolve(projectRoot, ".mongo-data");
const PORT = Number(process.env.DEV_DB_PORT ?? 27017);

mkdirSync(dbPath, { recursive: true });

console.log("Starting local MongoDB…");
console.log("(first run downloads the MongoDB binary — this can take a minute)");

const server = await MongoMemoryServer.create({
  instance: {
    port: PORT,
    dbPath,
    storageEngine: "wiredTiger",
  },
});

console.log(`\n  MongoDB ready at ${server.getUri()}`);
console.log(`  Data directory: ${dbPath}`);
console.log("\n  Leave this running, then start the app with: npm run dev\n");

async function shutdown() {
  console.log("\nStopping local MongoDB…");
  await server.stop();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
