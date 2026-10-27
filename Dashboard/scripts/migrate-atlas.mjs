/**
 * Read-only-by-default audit/migration for public content. Source and target
 * always use separate Mongoose connections; apply only inserts missing docs.
 */
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import mongoose from "mongoose";
import { demoContent } from "./demo-content.mjs";

import {
  dashboardRoot,
  initializeMongoDns,
  loadProjectTypeScript,
  safeErrorMessage,
} from "./lib/runtime.mjs";

initializeMongoDns();

const requestedModes = ["--audit", "--dry-run", "--apply"].filter((flag) =>
  process.argv.includes(flag),
);
if (requestedModes.length > 1) {
  throw new Error("Choose only one mode: --audit, --dry-run, or --apply.");
}
const mode = requestedModes.includes("--apply")
  ? "apply"
  : requestedModes.includes("--dry-run")
    ? "dry-run"
    : "audit";
const includeDemo = process.argv.includes("--include-demo");
const includeSettings = process.argv.includes("--include-settings");
const summaryOnly = process.argv.includes("--summary-only");
const targetAcknowledged = process.argv.includes(
  "--confirm-target=Sthal-Pakrashi",
);
const demoAcknowledged = process.argv.includes("--allow-demo-publication");
const settingsAcknowledged = process.argv.includes(
  "--confirm-settings-migration",
);

if (mode === "apply" && !targetAcknowledged) {
  throw new Error(
    "Apply requires --confirm-target=Sthal-Pakrashi after reviewing the dry run.",
  );
}
if (mode === "apply" && includeDemo && !demoAcknowledged) {
  throw new Error(
    "Demo records require --allow-demo-publication because they may become public.",
  );
}
if (mode === "apply" && includeSettings && !settingsAcknowledged) {
  throw new Error(
    "Settings migration requires --confirm-settings-migration after reviewing the local singleton.",
  );
}
if (demoAcknowledged && (!includeDemo || mode !== "apply")) {
  throw new Error(
    "--allow-demo-publication is valid only with --apply --include-demo.",
  );
}
if (settingsAcknowledged && (!includeSettings || mode !== "apply")) {
  throw new Error(
    "--confirm-settings-migration is valid only with --apply --include-settings.",
  );
}

function envValue(name, fallback) {
  return process.env[name]?.trim() || fallback;
}

const sourceUri = envValue(
  "MIGRATION_SOURCE_URI",
  "mongodb://127.0.0.1:27017",
);
const sourceDbName = envValue("MIGRATION_SOURCE_DB", "sth_demo_preview");
const targetUri = process.env.MONGODB_URI?.trim();
const targetDbName = process.env.MONGODB_DB_NAME?.trim() || "school_cms";
if (!targetUri || targetUri.includes("<db-") || targetUri.includes("<cluster-")) {
  throw new Error("Set the Atlas MONGODB_URI in Dashboard/.env.local or .env.");
}
if (targetDbName !== "Sthal-Pakrashi") {
  throw new Error(
    `Target database mismatch: expected Sthal-Pakrashi; configured ${targetDbName}.`,
  );
}
let targetHost;
try {
  const parsed = new URL(targetUri);
  targetHost = parsed.hostname.toLowerCase();
  if (parsed.protocol !== "mongodb+srv:" || !targetHost.endsWith(".mongodb.net")) {
    throw new Error("not Atlas SRV");
  }
} catch {
  throw new Error("MONGODB_URI must be a valid MongoDB Atlas SRV URI.");
}
let sourceHost;
try {
  sourceHost = new URL(sourceUri).hostname.toLowerCase();
} catch {
  throw new Error("MIGRATION_SOURCE_URI is not a valid MongoDB URI.");
}
if (sourceDbName === targetDbName && sourceHost === targetHost) {
  throw new Error("Source and target resolve to the same host and database.");
}

const content = loadProjectTypeScript(
  resolve(dashboardRoot, "src/models/content.ts"),
);
const settingsModule = loadProjectTypeScript(
  resolve(dashboardRoot, "src/models/Settings.ts"),
);
const admissionModule = loadProjectTypeScript(
  resolve(dashboardRoot, "src/models/AdmissionInfo.ts"),
);
const fallback = loadProjectTypeScript(
  resolve(dashboardRoot, "../Public-Website/src/lib/fallback-data.ts"),
);

const contentModels = [
  ["banners", content.Banner],
  ["notices", content.Notice],
  ["events", content.Event],
  ["gallery", content.GalleryItem],
  ["videos", content.VideoItem],
  ["uniform", content.UniformItem],
  ["links", content.UsefulLink],
  ["messages", content.LeadershipMessage],
  ["recognitions", content.Recognition],
  ["classes", content.ClassInfo],
  ["documents", content.AcademicDocument],
  ["teachers", content.Teacher],
  ["staff", content.Staff],
  ["founders", content.Founder],
  ["committee", content.CommitteeMember],
  ["alumni", content.Alumni],
  ["posts", content.Post],
  ["programs", content.Program],
];
const singletonModels = [
  ["settings", settingsModule.Settings, "site"],
  ["admissioninfos", admissionModule.AdmissionInfo, "admission"],
];
const fallbackMappings = [
  ["banners", "fallbackBanners", content.Banner],
  ["notices", "fallbackNotices", content.Notice],
  ["events", "fallbackEvents", content.Event],
  ["gallery", "fallbackGallery", content.GalleryItem],
  ["videos", "fallbackVideos", content.VideoItem],
  ["uniform", "fallbackUniform", content.UniformItem],
  ["links", "fallbackLinks", content.UsefulLink],
  ["messages", "fallbackMessages", content.LeadershipMessage],
  ["recognitions", "fallbackRecognitions", content.Recognition],
  ["classes", "fallbackClasses", content.ClassInfo],
  ["documents", "fallbackDocuments", content.AcademicDocument],
  ["teachers", "fallbackTeachers", content.Teacher],
  ["staff", "fallbackStaff", content.Staff],
  ["founders", "fallbackFounders", content.Founder],
  ["committee", "fallbackCommittee", content.CommitteeMember],
  ["alumni", "fallbackAlumni", content.Alumni],
];

function stableObjectId(resource, item, index) {
  const identity =
    item.slug ||
    item.url ||
    item.email ||
    [item.name, item.designation, item.title].filter(Boolean).join("|") ||
    item._id ||
    String(index);
  const date = item.publishedAt || item.startDate || item.passingYear || "";
  return createHash("sha256")
    .update(`${resource}:${identity}:${date}:${index}`)
    .digest("hex")
    .slice(0, 24);
}

function asPlain(value) {
  return value?.toObject ? value.toObject({ depopulate: true }) : value;
}

function errorCategory(error) {
  const details = [error?.code, error?.name, error?.message]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (/authentication failed|auth failed|bad auth|code 18/.test(details)) return "authentication";
  if (/querysrv|enotfound|eai_again|dns/.test(details)) return "DNS";
  if (/econnrefused|etimedout|econnreset|enetunreach|server selection timed out/.test(details)) return "network";
  return "connection";
}

function connectionOptions(dbName) {
  return { dbName, autoIndex: false, serverSelectionTimeoutMS: 8000 };
}

function makeModels(connection, definitions) {
  return definitions.map(([resource, baseModel, singletonKey]) => {
    const collection = baseModel.collection.name;
    const Model = connection.model(
      baseModel.modelName,
      baseModel.schema,
      collection,
    );
    return { resource, Model, collection, singletonKey };
  });
}

function schemaHasField(schema, field) {
  return Boolean(
    schema.path(field) ||
      schema.nested?.[field] ||
      Object.keys(schema.paths).some((path) => path.startsWith(`${field}.`)),
  );
}

function flattenLeafValues(value, prefix = "", result = {}) {
  for (const [key, child] of Object.entries(value ?? {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child) && !(child instanceof Date)) {
      flattenLeafValues(child, path, result);
    } else if (child !== undefined && child !== null && child !== "") {
      result[path] = child;
    }
  }
  return result;
}

function valueKey(value) {
  return value instanceof Date ? value.toISOString() : JSON.stringify(value);
}

const fallbackByResource = new Map();
for (const [resource, key] of fallbackMappings) {
  const records = Array.isArray(fallback[key]) ? fallback[key] : [];
  fallbackByResource.set(resource, records);
}

const sourceConnection = mongoose.createConnection();
const targetConnection = mongoose.createConnection();
const report = [];
const plannedRecords = [];
const unknownFields = [];

try {
  try {
    await sourceConnection.openUri(sourceUri, connectionOptions(sourceDbName));
  } catch (error) {
    throw new Error(
      `Source MongoDB ${errorCategory(error)} error: ${safeErrorMessage(error)}`,
      { cause: error },
    );
  }
  try {
    await targetConnection.openUri(targetUri, connectionOptions(targetDbName));
  } catch (error) {
    throw new Error(
      `Atlas target MongoDB ${errorCategory(error)} error: ${safeErrorMessage(error)}`,
      { cause: error },
    );
  }

  const definitions = [...contentModels, ...singletonModels];
  const sourceModels = makeModels(sourceConnection, definitions);
  const targetModels = makeModels(targetConnection, definitions);
  const sourceNames = new Map(sourceModels.map((item) => [item.resource, item]));
  const targetNames = new Map(targetModels.map((item) => [item.resource, item]));

  console.log(`Mode: ${mode}${includeDemo ? " (demo records included in plan)" : ""}`);
  console.log(`Source database: ${sourceDbName} (local/explicit source)`);
  console.log(`Target database: ${targetDbName} (Atlas URI credentials hidden)`);

  const sourceCollections = await sourceConnection.db.listCollections().toArray();
  const targetCollections = await targetConnection.db.listCollections().toArray();
  const sourceCollectionNames = new Set(sourceCollections.map((item) => item.name));
  const targetCollectionNames = new Set(targetCollections.map((item) => item.name));
  console.log(
    `Collections present: source=${sourceCollections.length}; target=${targetCollections.length}`,
  );
  console.log(
    `Embedded demo fixture records: ${Object.values(demoContent).reduce((sum, records) => sum + records.length, 0)} (same data source as local demo dataset; not counted twice)`,
  );

  const mappedCollections = new Set(sourceModels.map((item) => item.collection));
  const unmappedCounts = [];
  for (const collection of new Set([
    ...sourceCollectionNames,
    ...targetCollectionNames,
  ])) {
    if (mappedCollections.has(collection)) continue;
    const [sourceCount, targetCount] = await Promise.all([
      sourceCollectionNames.has(collection)
        ? sourceConnection.db.collection(collection).countDocuments()
        : 0,
      targetCollectionNames.has(collection)
        ? targetConnection.db.collection(collection).countDocuments()
        : 0,
    ]);
    unmappedCounts.push({
      collection,
      source: sourceCount,
      target: targetCount,
      migration: "excluded: no public-content model mapping",
    });
  }
  if (unmappedCounts.length) {
    console.log("Unmapped collections (audited, never migrated):");
    console.table(unmappedCounts);
  }

  for (const definition of sourceModels) {
    const sourceModel = sourceNames.get(definition.resource);
    const targetModel = targetNames.get(definition.resource);
    const [sourceTotal, sourceDemo, sourceRecords, targetTotal, targetDemo] =
      await Promise.all([
        sourceModel.Model.countDocuments({}),
        sourceModel.Model.countDocuments({ isDemo: true }).catch(() => 0),
        sourceModel.Model.find({}).lean(),
        targetModel.Model.countDocuments({}),
        targetModel.Model.countDocuments({ isDemo: true }).catch(() => 0),
      ]);

    const candidates = [];
    const seenIds = new Set();
    for (const record of sourceRecords) {
      if (sourceModel.singletonKey && record.key !== sourceModel.singletonKey) continue;
      const id = String(record._id ?? "");
      if (!id || seenIds.has(id)) {
        report.push({
          resource: definition.resource,
          collection: definition.collection,
          sourceTotal,
          sourceDemo,
          targetTotal,
          targetDemo,
          insert: 0,
          alreadyPresent: 0,
          conflict: 0,
          failed: 1,
          note: "missing or duplicate source _id",
        });
        continue;
      }
      seenIds.add(id);
      candidates.push({ record: asPlain(record), origin: record.isDemo ? "demo" : "local" });
    }

    // Only lists used as public fallback are candidates. Identity defaults
    // are intentionally reviewed separately; DATA_GAPS.md labels fields that
    // require official confirmation. Empty fallback lists stay empty.
    const staticRecords = fallbackByResource.get(definition.resource) ?? [];
    if (staticRecords.length && candidates.length === 0 && !sourceModel.singletonKey) {
      for (const [index, original] of staticRecords.entries()) {
        const { _id: _fallbackId, __v: _version, ...fields } = original;
        void _fallbackId;
        void _version;
        candidates.push({
          record: {
            ...fields,
            _id: stableObjectId(definition.resource, original, index),
          },
          origin: "static-fallback",
        });
      }
    }

    const semanticField = definition.resource === "links"
      ? "url"
      : definition.resource === "posts"
        ? "slug"
        : null;
    const sourceSemanticKeys = new Set();
    let insert = 0;
    let alreadyPresent = 0;
    let conflict = 0;
    let failed = 0;
    let demoExcluded = 0;
    let settingsExcluded = 0;

    for (const candidate of candidates) {
      const record = candidate.record;
      const id = record._id;
      if (definition.resource === "settings" && !includeSettings) {
        settingsExcluded++;
        plannedRecords.push({ resource: definition.resource, collection: definition.collection, id: String(id), origin: candidate.origin, action: "excluded-settings-needs-explicit-review" });
        continue;
      }
      if (targetModel.singletonKey) {
        const targetSingleton = await targetModel.Model.findOne({
          key: targetModel.singletonKey,
        })
          .select("_id")
          .lean();
        if (targetSingleton) {
          alreadyPresent++;
          plannedRecords.push({ resource: definition.resource, collection: definition.collection, id: String(id), origin: candidate.origin, action: "skip-existing-singleton" });
          continue;
        }
      }
      const targetById = await targetModel.Model.findById(id)
        .select("_id isDemo key")
        .lean();
      if (targetById) {
        alreadyPresent++;
        plannedRecords.push({ resource: definition.resource, collection: definition.collection, id: String(id), origin: candidate.origin, action: "skip-existing-id" });
        continue;
      }

      if (semanticField && record[semanticField]) {
        const semanticKey = String(record[semanticField]).trim().toLowerCase();
        if (sourceSemanticKeys.has(semanticKey)) {
          conflict++;
          plannedRecords.push({ resource: definition.resource, collection: definition.collection, id: String(id), origin: candidate.origin, action: `skip-duplicate-${semanticField}` });
          continue;
        }
        sourceSemanticKeys.add(semanticKey);
        const matching = await targetModel.Model.findOne({ [semanticField]: record[semanticField] })
          .select("_id")
          .lean();
        if (matching) {
          conflict++;
          plannedRecords.push({ resource: definition.resource, collection: definition.collection, id: String(id), origin: candidate.origin, action: `skip-target-${semanticField}-conflict` });
          continue;
        }
      }

      if (record.isDemo === true && !includeDemo) {
        demoExcluded++;
        plannedRecords.push({ resource: definition.resource, collection: definition.collection, id: String(id), origin: candidate.origin, action: "excluded-demo-needs-explicit-opt-in" });
        continue;
      }

      const unknown = Object.keys(record).filter(
        (field) => !schemaHasField(targetModel.Model.schema, field) && !["_id", "__v"].includes(field),
      );
      if (unknown.length) {
        failed++;
        unknownFields.push({ resource: definition.resource, id: String(id), fields: unknown });
        plannedRecords.push({ resource: definition.resource, collection: definition.collection, id: String(id), origin: candidate.origin, action: "blocked-unknown-fields" });
        continue;
      }

      try {
        const document = new targetModel.Model(record);
        await document.validate();
        const plain = document.toObject({ depopulate: true, minimize: false });
        if (mode === "apply") {
          await targetModel.Model.collection.insertOne(plain);
        }
        insert++;
        plannedRecords.push({ resource: definition.resource, collection: definition.collection, id: String(id), origin: candidate.origin, action: mode === "apply" ? "inserted" : "would-insert" });
      } catch (error) {
        failed++;
        console.error(
          `[migrate] ${definition.resource} validation/write error (${errorCategory(error)}): ${safeErrorMessage(error)}`,
        );
      }
    }

    report.push({
      resource: definition.resource,
      collection: definition.collection,
      sourcePresent: sourceCollectionNames.has(definition.collection),
      targetPresent: targetCollectionNames.has(definition.collection),
      sourceTotal,
      sourceDemo,
      targetTotal,
      targetDemo,
      insert,
      alreadyPresent,
      conflict,
      demoExcluded,
      settingsExcluded,
      failed,
    });
  }

  const sourceSettings = sourceNames.get("settings");
  const sourceSettingsData = await sourceSettings.Model.findOne({ key: "site" }).lean();
  const fallbackSettingFields = Object.keys(fallback.fallbackSettings ?? {}).filter(
    (key) => !["themeColor", "primaryColor"].includes(key),
  );
  const targetSettings = targetNames.get("settings");
  const targetSettingsCount = await targetSettings.Model.countDocuments({ key: "site" });
  const sourceSettingsFields = Object.keys(sourceSettingsData ?? {}).filter(
    (key) => !["_id", "__v", "createdAt", "updatedAt"].includes(key),
  );
  const fallbackSettingLeaves = flattenLeafValues(fallback.fallbackSettings ?? {});
  const sourceSettingLeaves = flattenLeafValues(sourceSettingsData ?? {});
  const settingsMatchingFallback = Object.keys(fallbackSettingLeaves).filter(
    (path) => valueKey(sourceSettingLeaves[path]) === valueKey(fallbackSettingLeaves[path]),
  );
  const settingsDifferingFromFallback = Object.keys(sourceSettingLeaves).filter(
    (path) => path in fallbackSettingLeaves && valueKey(sourceSettingLeaves[path]) !== valueKey(fallbackSettingLeaves[path]),
  );
  console.log("\nSingleton/static review:");
  console.table([
    { resource: "settings", sourceLocal: sourceSettingsData ? 1 : 0, target: targetSettingsCount, fallbackFieldsForManualReview: fallbackSettingFields.length, action: sourceSettingsData ? "source singleton is audited above" : "no source singleton; static identity defaults not auto-migrated" },
    { resource: "admission-info", sourceLocal: await sourceNames.get("admissioninfos").Model.countDocuments({ key: "admission" }), target: await targetNames.get("admissioninfos").Model.countDocuments({ key: "admission" }), action: "singleton preserved; insert only when source exists and target is empty" },
    { resource: "static fallback links", records: (fallback.fallbackLinks ?? []).length, action: "candidates appear in dry-run only when local links collection is empty" },
  ]);
  console.log(
    `Local settings fields (names only; no values): ${sourceSettingsFields.join(", ") || "none"}`,
  );
  console.log(
    `Settings fields matching bundled defaults: ${settingsMatchingFallback.join(", ") || "none"}`,
  );
  console.log(
    `Settings fields differing from bundled defaults: ${settingsDifferingFromFallback.join(", ") || "none"}`,
  );
  console.log(
    `Admission application setting: ${sourceSettingsData ? (sourceSettingsData.admissionOpen === true ? "open" : "closed") : "no local settings record"}; Atlas record ${targetSettingsCount ? "exists" : "missing"}`,
  );
  if (sourceSettingsData?.admissionOpen === true) {
    console.log(
      "Review warning: the local Settings singleton has admissionOpen=true; settings are excluded unless explicitly opted in.",
    );
  }

  console.log("\nResource counts and plan:");
  console.table(report);
  const totals = report.reduce(
    (sum, row) => ({ insert: sum.insert + row.insert, alreadyPresent: sum.alreadyPresent + row.alreadyPresent, conflict: sum.conflict + row.conflict, demoExcluded: sum.demoExcluded + row.demoExcluded, settingsExcluded: sum.settingsExcluded + row.settingsExcluded, failed: sum.failed + row.failed }),
    { insert: 0, alreadyPresent: 0, conflict: 0, demoExcluded: 0, settingsExcluded: 0, failed: 0 },
  );
  console.log(`Totals: ${JSON.stringify(totals)}`);
  console.log("Per-record plan (IDs only):");
  if (summaryOnly) {
    console.log(`Plan entries omitted by --summary-only: ${plannedRecords.length}`);
  } else {
    console.log(JSON.stringify(plannedRecords, null, 2));
  }
  if (unknownFields.length) {
    console.log("Schema fields requiring review:");
    console.log(JSON.stringify(unknownFields, null, 2));
  }
  if (mode === "apply") {
    console.log("Apply finished with insert-only writes; no existing records were updated or deleted.");
  } else {
    console.log(`${mode === "audit" ? "Audit" : "Dry run"} complete; zero database writes were performed.`);
  }
  if (totals.failed) process.exitCode = 1;
} catch (error) {
  console.error(`[migrate] ${safeErrorMessage(error)}`);
  process.exitCode = 1;
} finally {
  await Promise.allSettled([
    sourceConnection.close(),
    targetConnection.close(),
  ]);
}
