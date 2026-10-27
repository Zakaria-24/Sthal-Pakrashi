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
    return required("MONGODB_URI");
  },
  get MONGODB_DB_NAME() {
    return optional("MONGODB_DB_NAME", "school_cms");
  },

  // --- Auth ---
  get JWT_SECRET() {
    return required("JWT_SECRET");
  },
  /**
   * The one account that always exists. There is no password anywhere in this
   * system — this address receives a one-time code by email, and it is the
   * only account that can create other users.
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
    return optional("ALLOWED_ORIGINS", "http://localhost:3001")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
  },

  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
} as const;
