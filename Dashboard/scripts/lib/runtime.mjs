import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

export const dashboardRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);

// Match Next's local environment convention for explicit maintenance scripts.
for (const filename of [".env.local", ".env"]) {
  const path = resolve(dashboardRoot, filename);
  if (existsSync(path)) process.loadEnvFile(path);
}

export function loadProjectTypeScript(path) {
  const source = readFileSync(path, "utf8");
  const { outputText, diagnostics } = ts.transpileModule(source, {
    fileName: path,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    reportDiagnostics: true,
  });

  const errors = (diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  if (errors.length) {
    throw new Error(`Could not load project module: ${path}`);
  }

  const cjsModule = { exports: {} };
  const localRequire = createRequire(path);
  new Function("require", "module", "exports", outputText)(
    localRequire,
    cjsModule,
    cjsModule.exports,
  );
  return cjsModule.exports;
}

export function databaseConfig() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri || uri.includes("<db-") || uri.includes("<cluster-")) {
    throw new Error("Set a real MONGODB_URI in Dashboard/.env before continuing.");
  }
  return {
    uri,
    dbName: process.env.MONGODB_DB_NAME?.trim() || "school_cms",
  };
}

export function safeErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/mongodb(?:\+srv)?:\/\/[^\s"']+/gi, "<MongoDB URI>");
}

const mongoDns = loadProjectTypeScript(
  resolve(dashboardRoot, "src/lib/mongodb-dns.ts"),
);

export function initializeMongoDns() {
  return mongoDns.initializeMongoDns();
}

// Scripts importing this module load .env.local/.env first, then configure DNS.
initializeMongoDns();
