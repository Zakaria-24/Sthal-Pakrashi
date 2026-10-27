/** Read-only by default. Writes require both --apply and --confirm-atlas-demo-import. */
import mongoose from "mongoose";

import {
  dashboardRoot,
  databaseConfig,
  initializeMongoDns,
  loadProjectTypeScript,
  safeErrorMessage,
} from "./lib/runtime.mjs";

initializeMongoDns();

const apply = process.argv.includes("--apply");
const explicitlyConfirmed = process.argv.includes(
  "--confirm-atlas-demo-import",
);
if (apply && !explicitlyConfirmed) {
  throw new Error(
    "Atlas writes require both --apply and --confirm-atlas-demo-import.",
  );
}
if (explicitlyConfirmed && !apply) {
  throw new Error("Confirmation flag is only valid together with --apply.");
}

const SOURCE_URI = "mongodb://127.0.0.1:27017";
const SOURCE_DB = "sth_demo_preview";
const TARGET_DB_EXPECTED = "Sthal-Pakrashi";
const EXPECTED_DEMO_COUNTS = {
  banners: 3,
  notices: 8,
  events: 6,
  gallery: 12,
  teachers: 6,
  alumni: 4,
  programs: 4,
};

const { uri: targetUri, dbName: targetDb } = databaseConfig();
let targetHost = "";
try {
  const parsed = new URL(targetUri);
  targetHost = parsed.hostname.toLowerCase();
  if (parsed.protocol !== "mongodb+srv:") {
    throw new Error("The configured target must use an Atlas mongodb+srv URI.");
  }
} catch (error) {
  if (error instanceof Error && error.message.includes("Atlas")) throw error;
  throw new Error("The configured MONGODB_URI is not a valid Atlas SRV URI.");
}
if (!targetHost.endsWith(".mongodb.net")) {
  throw new Error("The configured target host is not a MongoDB Atlas host.");
}
if (targetDb !== TARGET_DB_EXPECTED) {
  throw new Error(
    `Target database mismatch: expected ${TARGET_DB_EXPECTED}; configured ${targetDb}. No database changes were made.`,
  );
}

const content = loadProjectTypeScript(
  `${dashboardRoot}/src/models/content.ts`,
);
const resources = [
  ["banners", content.Banner],
  ["notices", content.Notice],
  ["events", content.Event],
  ["gallery", content.GalleryItem],
  ["teachers", content.Teacher],
  ["alumni", content.Alumni],
  ["programs", content.Program],
];

function errorCategory(error) {
  const parts = [];
  let current = error;
  for (let i = 0; current && i < 4; i++, current = current.cause) {
    parts.push(String(current.code ?? ""), String(current.name ?? ""), String(current.message ?? ""));
  }
  const details = parts.join(" ").toLowerCase();
  if (/authentication failed|auth failed|bad auth|code 18|"code":18/.test(details)) return "authentication";
  if (/querysrv|enotfound|eai_again|dns/.test(details)) return "DNS";
  if (/econnrefused|etimedout|econnreset|enetunreach|server selection timed out/.test(details)) return "network";
  return "connection";
}

async function connect(uri, dbName, role) {
  try {
    return await mongoose.connect(uri, {
      dbName,
      autoIndex: false,
      serverSelectionTimeoutMS: 8000,
    });
  } catch (error) {
    throw new Error(
      `${role} MongoDB ${errorCategory(error)} error: ${safeErrorMessage(error)}`,
      { cause: error },
    );
  }
}

const sourceRecords = new Map();
const sourceCounts = new Map();
const targetCounts = new Map();
const plan = [];
let connected = false;

try {
  console.log(`Source: local MongoDB database ${SOURCE_DB}`);
  await connect(SOURCE_URI, SOURCE_DB, "Source");
  connected = true;

  for (const [name, Model] of resources) {
    const [total, demos, records] = await Promise.all([
      Model.countDocuments({}),
      Model.countDocuments({ isDemo: true }),
      Model.find({ isDemo: true }).lean(),
    ]);
    sourceCounts.set(name, { collection: Model.collection.name, total, demos });
    sourceRecords.set(name, records);
  }

  await mongoose.disconnect();
  connected = false;

  console.log(`Target: MongoDB Atlas database ${targetDb} (URI credentials hidden)`);
  await connect(targetUri, targetDb, "Atlas target");
  connected = true;

  for (const [name, Model] of resources) {
    const [total, demos] = await Promise.all([
      Model.countDocuments({}),
      Model.countDocuments({ isDemo: true }),
    ]);
    targetCounts.set(name, { collection: Model.collection.name, total, demos });

    let wouldInsert = 0;
    let existingDemo = 0;
    let idConflicts = 0;
    let failed = 0;

    for (const sourceRecord of sourceRecords.get(name) ?? []) {
      if (!sourceRecord._id || sourceRecord.isDemo !== true) {
        failed++;
        continue;
      }

      const current = await Model.findById(sourceRecord._id)
        .select("_id isDemo")
        .lean();
      if (current?.isDemo === true) {
        existingDemo++;
        continue;
      }
      if (current) {
        idConflicts++;
        continue;
      }

      try {
        await new Model(sourceRecord).validate();
        if (apply) {
          // Insert only. Existing documents are never updated or replaced.
          await Model.create(sourceRecord);
        }
        wouldInsert++;
      } catch (error) {
        const raced = await Model.findById(sourceRecord._id)
          .select("_id isDemo")
          .lean()
          .catch(() => null);
        if (raced) idConflicts++;
        else {
          failed++;
          console.error(
            `[sync-demo] ${name} record validation/insert failed (${errorCategory(error)}): ${safeErrorMessage(error)}`,
          );
        }
      }
    }

    plan.push({
      resource: name,
      collection: Model.collection.name,
      sourceTotal: sourceCounts.get(name).total,
      sourceDemo: sourceCounts.get(name).demos,
      targetTotal: total,
      targetDemo: demos,
      plannedInsert: wouldInsert,
      existingDemoSkipped: existingDemo,
      unrelatedIdConflictsSkipped: idConflicts,
      failed,
    });
  }

  console.table(plan);
  const sourceMatchesExpected = resources.every(
    ([name]) => sourceCounts.get(name).demos === EXPECTED_DEMO_COUNTS[name],
  );
  const hasFailures = plan.some((row) => row.failed > 0);
  if (!sourceMatchesExpected) {
    console.error("Source demo counts did not match the expected 43 records; no apply run is safe.");
    process.exitCode = 1;
  } else if (hasFailures) {
    console.error("The plan contains failures; no apply run is safe.");
    process.exitCode = 1;
  } else if (apply) {
    console.log("Confirmed Atlas demo import finished. Existing documents were preserved.");
  } else {
    console.log("Dry run only: no MongoDB writes were performed.");
    console.log("An actual Atlas import requires --apply --confirm-atlas-demo-import.");
  }
} catch (error) {
  console.error(`[sync-demo] ${safeErrorMessage(error)}`);
  process.exitCode = 1;
} finally {
  if (connected) await mongoose.disconnect();
}
