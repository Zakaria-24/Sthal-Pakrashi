import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // Locally this app owns its dependencies, so tracing stops at this folder.
  // Not on Vercel: it sets the root to the repo itself, and an app-level root
  // there makes it look for the build output at <repo>/.next (ENOENT).
  ...(process.env.VERCEL
    ? {}
    : { outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)) }),
};

export default nextConfig;
