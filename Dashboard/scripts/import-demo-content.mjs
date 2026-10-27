/** Explicit demo-only import; never connects to a remote URI without a second acknowledgement. */
import { createHash } from "node:crypto";
import mongoose from "mongoose";
import { dashboardRoot, databaseConfig, initializeMongoDns, loadProjectTypeScript, safeErrorMessage } from "./lib/runtime.mjs";
import { demoAdmissionInfo, demoContent } from "./demo-content.mjs";

const dryRun = process.argv.includes("--dry-run");
const remoteOptIn = process.argv.includes("--allow-production-demo");
const { uri, dbName } = databaseConfig();
const host = (() => { try { return new URL(uri).hostname.toLowerCase(); } catch { return ""; } })();
const isLocal = ["localhost", "127.0.0.1", "::1"].includes(host);
if (!isLocal && !(remoteOptIn && process.env.DEMO_IMPORT_PRODUCTION_ACK === "I_UNDERSTAND_DEMO_DATA_IS_PUBLIC")) {
  throw new Error("Refusing remote/production demo import. Use a local MongoDB URI, or pass --allow-production-demo and DEMO_IMPORT_PRODUCTION_ACK=I_UNDERSTAND_DEMO_DATA_IS_PUBLIC after reviewing docs.");
}
if (/prod(uction)?/i.test(dbName) && !remoteOptIn) throw new Error("Refusing database name that looks like production.");

const content = loadProjectTypeScript(`${dashboardRoot}/src/models/content.ts`);
const resources = {
  banners: content.Banner, notices: content.Notice, events: content.Event,
  gallery: content.GalleryItem, teachers: content.Teacher, alumni: content.Alumni,
  programs: content.Program,
  messages: content.LeadershipMessage, founders: content.Founder, committee: content.CommitteeMember,
  staff: content.Staff, videos: content.VideoItem, uniform: content.UniformItem,
  recognitions: content.Recognition, classes: content.ClassInfo, documents: content.AcademicDocument,
  posts: content.Post,
};
const { AdmissionInfo } = loadProjectTypeScript(`${dashboardRoot}/src/models/AdmissionInfo.ts`);
let connection;
const report = [];
try {
  initializeMongoDns();
  connection = await mongoose.connect(uri, { dbName, autoIndex: false, serverSelectionTimeoutMS: 8000 });
  for (const [name, Model] of Object.entries(resources)) {
    let inserted = 0, skipped = 0, failed = 0;
    for (const [index, record] of demoContent[name].entries()) {
      const _id = createHash("sha256").update(`sph-demo-v1:${name}:${index}`).digest("hex").slice(0, 24);
      try {
        const existing = await Model.findById(_id).select("isDemo").lean();
        if (existing) { skipped++; continue; }
        if (!dryRun) {
          const validated = new Model({ ...record, _id, isActive: true, isDemo: true });
          await validated.validate();
          await Model.updateOne({ _id }, { $setOnInsert: { ...record, _id, isActive: true, isDemo: true } }, { upsert: true, runValidators: true });
        }
        inserted++;
      } catch (error) {
        failed++;
        console.error(`[demo-import] ${name} record ${index + 1}: ${safeErrorMessage(error)}`);
      }
    }
    report.push({ resource: name, discovered: demoContent[name].length, [dryRun ? "wouldInsert" : "inserted"]: inserted, updated: 0, skipped, failed });
  }
  // Admission info is a singleton without isDemo: only empty fields are filled.
  const info = await AdmissionInfo.findOne({ key: "admission" }).lean();
  const isEmpty = (value) => value == null || (Array.isArray(value) ? value.length === 0 : String(value).trim() === "");
  const fill = Object.fromEntries(Object.entries(demoAdmissionInfo).filter(([key]) => isEmpty(info?.[key])));
  if (!dryRun && Object.keys(fill).length) {
    await AdmissionInfo.updateOne({ key: "admission" }, { $set: fill, $setOnInsert: { key: "admission" } }, { upsert: true, runValidators: true });
  }
  report.push({ resource: "admission-info", discovered: Object.keys(demoAdmissionInfo).length, [dryRun ? "wouldInsert" : "inserted"]: Object.keys(fill).length, updated: 0, skipped: Object.keys(demoAdmissionInfo).length - Object.keys(fill).length, failed: 0 });
  console.table(report);
  const hasFailures = report.some((row) => row.failed);
  console.log(
    dryRun
      ? "Dry run complete; no database writes were made."
      : hasFailures
        ? "Demo import finished with failures; review the per-resource report above."
        : "Demo import complete. Existing records and edits were preserved.",
  );
  if (hasFailures) process.exitCode = 1;
} catch (error) {
  console.error(`[demo-import] ${safeErrorMessage(error)}`);
  process.exitCode = 1;
} finally {
  if (connection) await mongoose.disconnect();
}
