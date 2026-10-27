/**
 * Idempotently imports the current Public-Website fallback content.
 *
 * Existing non-empty settings and existing records are preserved. Lists use
 * deterministic ObjectIds and $setOnInsert, so reruns cannot duplicate them
 * or overwrite edits made later in the Dashboard.
 */
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import mongoose from "mongoose";

import {
  dashboardRoot,
  databaseConfig,
  initializeMongoDns,
  loadProjectTypeScript,
  safeErrorMessage,
} from "./lib/runtime.mjs";

const dryRun = process.argv.includes("--dry-run");
const sourcePath = resolve(
  dashboardRoot,
  "../Public-Website/src/lib/fallback-data.ts",
);
const source = loadProjectTypeScript(sourcePath);
const settingsModule = loadProjectTypeScript(
  resolve(dashboardRoot, "src/models/Settings.ts"),
);
const contentModule = loadProjectTypeScript(
  resolve(dashboardRoot, "src/models/content.ts"),
);

const resources = [
  ["banners", "fallbackBanners", contentModule.Banner],
  ["notices", "fallbackNotices", contentModule.Notice],
  ["events", "fallbackEvents", contentModule.Event],
  ["gallery", "fallbackGallery", contentModule.GalleryItem],
  ["videos", "fallbackVideos", contentModule.VideoItem],
  ["uniform", "fallbackUniform", contentModule.UniformItem],
  ["links", "fallbackLinks", contentModule.UsefulLink],
  ["messages", "fallbackMessages", contentModule.LeadershipMessage],
  ["recognitions", "fallbackRecognitions", contentModule.Recognition],
  ["classes", "fallbackClasses", contentModule.ClassInfo],
  ["documents", "fallbackDocuments", contentModule.AcademicDocument],
  ["teachers", "fallbackTeachers", contentModule.Teacher],
  ["staff", "fallbackStaff", contentModule.Staff],
  ["founders", "fallbackFounders", contentModule.Founder],
  ["committee", "fallbackCommittee", contentModule.CommitteeMember],
  ["alumni", "fallbackAlumni", contentModule.Alumni],
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

function flattenNonEmpty(value, prefix = "", entries = {}) {
  for (const [key, child] of Object.entries(value ?? {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      flattenNonEmpty(child, path, entries);
    } else if (typeof child === "string" ? child.trim() !== "" : child != null) {
      entries[path] = child;
    }
  }
  return entries;
}

function getPath(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

const summary = [];
let connection;

try {
  initializeMongoDns();
  const { uri, dbName } = databaseConfig();
  // autoIndex:false guarantees --dry-run performs reads only.
  connection = await mongoose.connect(uri, {
    dbName,
    autoIndex: false,
    serverSelectionTimeoutMS: 8000,
  });

  const Settings = settingsModule.Settings;
  const settingsExists = await Settings.findOne({ key: "site" }).lean();
  const importedSettings = source.fallbackSettings;
  const settingFields = flattenNonEmpty(importedSettings);

  if (!settingsExists) {
    summary.push({
      collection: "settings",
      discovered: 1,
      created: dryRun ? 1 : 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      action: dryRun ? "would create site settings" : "created site settings",
    });
    if (!dryRun) {
      await Settings.updateOne(
        { key: "site" },
        { $setOnInsert: { ...importedSettings, key: "site" } },
        { upsert: true },
      );
      summary.at(-1).created = 1;
    }
  } else {
    const missing = Object.fromEntries(
      Object.entries(settingFields).filter(([path]) => {
        const current = getPath(settingsExists, path);
        return current === undefined || current === null || current === "";
      }),
    );
    const updatedCount = Object.keys(missing).length;
    if (!dryRun && updatedCount) {
      await Settings.updateOne({ _id: settingsExists._id }, { $set: missing });
    }
    summary.push({
      collection: "settings",
      discovered: 1,
      created: 0,
      updated: dryRun ? updatedCount : updatedCount,
      skipped: updatedCount ? 0 : 1,
      failed: 0,
      action: updatedCount
        ? `${dryRun ? "would fill" : "filled"} ${updatedCount} blank fields; existing values preserved`
        : "already populated; preserved",
    });
  }

  for (const [resource, sourceKey, Model] of resources) {
    const records = Array.isArray(source[sourceKey]) ? source[sourceKey] : [];
    let created = 0;
    let skipped = 0;
    let failed = 0;

    for (const [index, original] of records.entries()) {
      try {
        const { _id: _fallbackId, __v: _version, ...fields } = original;
        void _fallbackId;
        void _version;
        const _id = stableObjectId(resource, original, index);
        const existing = await Model.exists({ _id });
        if (existing) {
          skipped += 1;
          continue;
        }

        if (!dryRun) {
          const result = await Model.updateOne(
            { _id },
            { $setOnInsert: { _id, ...fields } },
            { upsert: true, runValidators: true },
          );
          if (result.upsertedCount) created += 1;
          else skipped += 1;
        } else {
          created += 1;
        }
      } catch (error) {
        failed += 1;
        console.error(
          `[db:import] ${resource} record ${index + 1} failed: ${safeErrorMessage(error)}`,
        );
      }
    }

    summary.push({
      collection: Model.collection.name,
      discovered: records.length,
      created,
      updated: 0,
      skipped,
      failed,
    });
  }

  console.log(`${dryRun ? "Dry run" : "Import"} summary:`);
  console.table(summary);
  console.log(
    dryRun
      ? "Dry run completed; no database writes were made."
      : "Import completed. Existing dashboard content was preserved.",
  );

  if (summary.some((item) => item.failed > 0)) process.exitCode = 1;
} catch (error) {
  console.error(`[db:import] ${safeErrorMessage(error)}`);
  process.exitCode = 1;
} finally {
  if (connection) await mongoose.disconnect();
}
