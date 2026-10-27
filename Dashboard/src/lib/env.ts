/**
 * Central place where every credential/config value enters the app.
 * Nothing else in the codebase should read `process.env` directly.
 *
 * This file is intentionally school-agnostic: copying this Dashboard to a new
 * institution means changing `.env.local`, never the source code.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  // --- Database ---
  get MONGODB_URI() {
    const uri = required("MONGODB_URI");
    if (process.env.NODE_ENV === "production") {
      try {
        const hostname = new URL(uri).hostname.toLowerCase();
        if (["localhost", "127.0.0.1", "::1", "[::1]"].includes(hostname)) {
          throw new Error(
            "Production MONGODB_URI must point to a remote database, not localhost.",
          );
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes("Production")) {
          throw error;
        }
        throw new Error("Production MONGODB_URI must be a valid remote MongoDB URI.");
      }
    }
    return uri;
  },
  get MONGODB_DB_NAME() {
    const name = process.env.MONGODB_DB_NAME?.trim();
    if (!name && process.env.NODE_ENV === "production") {
      throw new Error(
        'Missing required environment variable "MONGODB_DB_NAME" in production.',
      );
    }
    return name || "school_cms";
  },

  // --- Auth ---
  get JWT_SECRET() {
    return required("JWT_SECRET");
  },
  /**
   * The super admin's address. It receives one-time codes by email; the
   * account's password is set from the terminal (`npm run bootstrap:super-admin`).
   * It is the only account that can create other users.
   */
  get SUPER_ADMIN_EMAIL() {
    return required("SUPER_ADMIN_EMAIL").toLowerCase().trim();
  },
  get SUPER_ADMIN_NAME() {
    return optional("SUPER_ADMIN_NAME", "Super Admin");
  },
  get SESSION_MAX_AGE_DAYS() {
    return Number(optional("SESSION_MAX_AGE_DAYS", "7"));
  },

  // --- One-time login codes ---
  get OTP_EXPIRES_MINUTES() {
    return Number(optional("OTP_EXPIRES_MINUTES", "5"));
  },
  get OTP_MAX_ATTEMPTS() {
    return Number(optional("OTP_MAX_ATTEMPTS", "5"));
  },
  /** Minimum seconds between code requests for the same address. */
  get OTP_RESEND_SECONDS() {
    return Number(optional("OTP_RESEND_SECONDS", "60"));
  },

  // --- Email delivery (optional: codes print to the console when unset) ---
  get SMTP_HOST() {
    return optional("SMTP_HOST");
  },
  get SMTP_PORT() {
    return Number(optional("SMTP_PORT", "587"));
  },
  get SMTP_SECURE() {
    return optional("SMTP_SECURE", "false") === "true";
  },
  get SMTP_USER() {
    return optional("SMTP_USER");
  },
  get SMTP_PASS() {
    return optional("SMTP_PASS");
  },
  get SMTP_FROM() {
    return optional("SMTP_FROM");
  },
  /** Connect/greeting budget per send; the socket gets twice this. */
  get SMTP_TIMEOUT_MS() {
    return Number(optional("SMTP_TIMEOUT_MS", "20000"));
  },
  get hasSmtp() {
    return Boolean(
      process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
    );
  },

  // --- Media uploads (optional: without these, image URL fields still work) ---
  get CLOUDINARY_CLOUD_NAME() {
    return optional("CLOUDINARY_CLOUD_NAME");
  },
  get CLOUDINARY_API_KEY() {
    return optional("CLOUDINARY_API_KEY");
  },
  get CLOUDINARY_API_SECRET() {
    return optional("CLOUDINARY_API_SECRET");
  },
  get CLOUDINARY_FOLDER() {
    return optional("CLOUDINARY_FOLDER", "school-cms");
  },
  get hasCloudinary() {
    return Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET,
    );
  },

  // --- CORS: which public site(s) may read this API ---
  get ALLOWED_ORIGINS() {
    return optional("ALLOWED_ORIGINS", "http://localhost:3004")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
  },

  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
} as const;
