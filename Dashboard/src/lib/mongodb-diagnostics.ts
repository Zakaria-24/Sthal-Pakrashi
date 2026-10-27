export type MongoErrorCategory =
  | "DNS"
  | "network"
  | "authentication"
  | "TLS"
  | "configuration"
  | "connection";

export type MongoErrorDiagnostic = {
  category: MongoErrorCategory;
  code: string;
  message: string;
  action: string;
};

function errorChain(error: unknown): unknown[] {
  const chain: unknown[] = [];
  let current = error;
  for (let index = 0; current && index < 5; index++) {
    chain.push(current);
    current =
      typeof current === "object" && current !== null && "cause" in current
        ? (current as { cause?: unknown }).cause
        : undefined;
  }
  return chain;
}

function errorField(error: unknown, field: "code" | "name" | "message") {
  if (typeof error !== "object" || error === null || !(field in error)) return "";
  const value = (error as Record<string, unknown>)[field];
  return typeof value === "string" ? value : "";
}

export function safeMongoErrorMessage(error: unknown): string {
  const chain = errorChain(error);
  const message = chain
    .map((item) => errorField(item, "message"))
    .filter(Boolean)
    .join(" <- ");
  return message
    .replace(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi, "<MongoDB URI>")
    .replace(/(password|passwd|pwd)=([^\s&]+)/gi, "$1=<redacted>")
    .slice(0, 600);
}

export function diagnoseMongoError(error: unknown): MongoErrorDiagnostic {
  const chain = errorChain(error);
  const codes = chain.map((item) => errorField(item, "code")).filter(Boolean);
  const names = chain.map((item) => errorField(item, "name")).filter(Boolean);
  const details = `${codes.join(" ")} ${names.join(" ")} ${safeMongoErrorMessage(error)}`.toLowerCase();
  let category: MongoErrorCategory = "connection";
  let action = "Check MongoDB connectivity and the configured target database.";

  if (/querysrv|querytxt|enotfound|eai_again|dns/.test(details)) {
    category = "DNS";
    action = "Check MONGODB_DNS_SERVERS, DNS egress, and the Atlas SRV record.";
  } else if (/authentication failed|bad auth|auth failed|code 18|authenticationerror/.test(details)) {
    category = "authentication";
    action = "Check the Atlas database user's credentials and database roles.";
  } else if (/tls|ssl|certificate|handshake/.test(details)) {
    category = "TLS";
    action = "Check system time, certificates, and outbound TLS access; do not disable TLS.";
  } else if (/econnrefused|etimedout|econnreset|enetunreach|server selection timed out/.test(details)) {
    category = "network";
    action = "Check Atlas IP access-list rules, firewall egress, and cluster availability.";
  } else if (/mongodb_dns_servers|invalid.*uri|missing required environment/.test(details)) {
    category = "configuration";
    action = "Check MONGODB_URI, MONGODB_DB_NAME, and DNS override configuration.";
  }

  return {
    category,
    code: codes[0] || names[0] || "unknown",
    message: safeMongoErrorMessage(error) || "MongoDB operation failed.",
    action,
  };
}

export class MongoConnectionError extends Error {
  readonly diagnostic: MongoErrorDiagnostic;

  constructor(error: unknown) {
    const diagnostic = diagnoseMongoError(error);
    super(`${diagnostic.category}: ${diagnostic.message}`, { cause: error });
    this.name = "MongoConnectionError";
    this.diagnostic = diagnostic;
  }
}
