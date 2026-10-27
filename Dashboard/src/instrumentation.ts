/**
 * Next.js calls register() once per server runtime and awaits it before the
 * server accepts requests. Configure Node's resolver here, before any route
 * handler can import Mongoose or request an Atlas mongodb+srv connection.
 *
 * The import must stay inside this `if` block (not after an early return):
 * webpack only drops a branch whose condition is a compile-time constant, and
 * otherwise bundles `node:dns` into the Edge build, which cannot load it.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeMongoDns } = await import("./lib/mongodb-dns");
    const servers = initializeMongoDns();
    console.info(
      `[dns] Node runtime initialized MongoDB DNS (${servers.length ? `${servers.length} configured resolver(s)` : "system resolver"}).`,
    );
  }
}
