import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  experimental: {
    // The application form posts up to five 5 MB documents through a server
    // action; the default 1 MB body limit would reject them.
    serverActions: { bodySizeLimit: "30mb" },
    // Route changes run inside a browser view transition; the page content
    // animates via <ViewTransition> in the root layout.
    viewTransition: true,
  },
  // This app owns its dependencies and deploys independently of the sibling app.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  /*
   * Two pre-redesign pages have no counterpart in the finalized design; their
   * content now lives on pages that do, so old links and bookmarks follow it.
   */
  async redirects() {
    return [
      { source: "/institution-info", destination: "/about#profile", permanent: false },
      { source: "/administration", destination: "/committee", permanent: false },
    ];
  },
};

export default nextConfig;
