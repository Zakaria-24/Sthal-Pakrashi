import { promises as dnsPromises, getServers, setServers } from "node:dns";
import { isIP } from "node:net";

const sameServers = (a: string[], b: string[]) =>
  a.length === b.length && a.every((server, index) => server === b[index]);

/**
 * Apply the optional MONGODB_DNS_SERVERS override before SRV lookups.
 *
 * Node keeps separate resolvers for the callback API and `dns.promises`, and
 * the MongoDB driver resolves mongodb+srv records through `dns.promises`. Both
 * are checked on every call rather than behind a one-time flag, so a resolver
 * that was never set (or was reset after start-up) is corrected before the
 * next connection attempt. Re-checking is two in-memory reads.
 */
export function initializeMongoDns(): string[] {
  const configured = process.env.MONGODB_DNS_SERVERS?.trim();
  if (!configured) return [];

  const servers = configured.split(",").map((server) => server.trim());
  if (servers.some((server) => !server || isIP(server) === 0)) {
    throw new Error(
      "MONGODB_DNS_SERVERS must be a comma-separated list of IPv4 or IPv6 addresses.",
    );
  }

  try {
    if (!sameServers(getServers(), servers)) setServers(servers);
    if (!sameServers(dnsPromises.getServers(), servers)) {
      dnsPromises.setServers(servers);
    }
  } catch {
    throw new Error("Node.js could not apply MONGODB_DNS_SERVERS.");
  }

  return servers;
}
