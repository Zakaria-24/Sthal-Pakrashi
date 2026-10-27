/**
 * Creates the Super Admin, or resets its password, from the terminal.
 *
 *   npm run bootstrap:super-admin
 *   npm run bootstrap:super-admin -- --email admin@school.edu --name "Head Admin"
 *
 * Prompts for the email (defaults to SUPER_ADMIN_EMAIL), the display name and
 * a password (typed hidden, asked twice). Running it again when a Super Admin
 * already exists updates that account instead of adding a second one, so it
 * doubles as the "forgot password" path for the Super Admin.
 */
import { createInterface } from "node:readline";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import mongoose from "mongoose";

import { hashPassword } from "../src/lib/auth-security.mjs";
import {
  databaseConfig,
  dashboardRoot,
  initializeMongoDns,
  loadProjectTypeScript,
  safeErrorMessage,
} from "./lib/runtime.mjs";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const { values: args } = parseArgs({
  options: {
    email: { type: "string" },
    name: { type: "string" },
  },
});

const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: "" });

// Lines are queued rather than read with rl.question so piped input that
// arrives before a prompt is asked isn't lost.
const queued = [];
const waiting = [];
let inputClosed = false;
rl.on("line", (line) => (waiting.length ? waiting.shift()(line) : queued.push(line)));
rl.on("close", () => {
  inputClosed = true;
  while (waiting.length) waiting.shift()(null);
});

let muted = false;
// Readline echoes every keystroke through this hook; while `muted` only the
// prompt itself gets through, which keeps the password off the screen.
const writeToOutput = rl._writeToOutput.bind(rl);
rl._writeToOutput = (text) => {
  if (!muted) writeToOutput(text);
  else if (text.startsWith(rl.getPrompt())) writeToOutput(rl.getPrompt());
};

async function readLine(prompt, hidden = false) {
  if (inputClosed) {
    process.stdout.write(`${prompt}\n`);
  } else {
    rl.setPrompt(prompt);
    rl.prompt();
  }
  muted = hidden;
  const line = queued.length
    ? queued.shift()
    : inputClosed
      ? null
      : await new Promise((done) => waiting.push(done));
  muted = false;
  if (hidden && process.stdin.isTTY) process.stdout.write("\n");
  if (line === null) throw new Error("Input ended before all answers were given.");
  return line;
}

async function ask(question, fallback = "") {
  const hint = fallback ? ` (${fallback})` : "";
  return (await readLine(`${question}${hint}: `)).trim() || fallback;
}

function askHidden(question) {
  return readLine(`${question}: `, true);
}

async function askPassword() {
  if (!process.stdin.isTTY) {
    console.warn(
      "Note: this terminal can't hide input, so the password will be visible while you type.",
    );
  }
  for (;;) {
    const password = await askHidden("Password");
    if (password.length < MIN_PASSWORD_LENGTH) {
      console.log(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      continue;
    }
    const confirmation = await askHidden("Confirm password");
    if (password !== confirmation) {
      console.log("Passwords didn't match. Try again.");
      continue;
    }
    return password;
  }
}

let connected = false;
try {
  initializeMongoDns();
  const { uri, dbName } = databaseConfig();
  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 8000 });
  connected = true;

  const { User } = loadProjectTypeScript(
    resolve(dashboardRoot, "src/models/User.ts"),
  );
  // Build the unique email and one-super-admin indexes before checking so two
  // simultaneous runs cannot create duplicate privileged users.
  await User.init();

  const existing = await User.findOne({ role: "superAdmin" });
  const configuredEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase() ?? "";

  console.log(
    existing
      ? `A Super Admin already exists (${existing.email}). Its details and password will be updated.`
      : "No Super Admin found. Creating one now.",
  );

  let email = "";
  while (!EMAIL_PATTERN.test(email)) {
    email = (args.email ?? (await ask("Email", existing?.email || configuredEmail)))
      .trim()
      .toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      if (args.email) throw new Error("The --email value is not a valid address.");
      console.log("Enter a valid email address.");
    }
  }

  const name =
    args.name?.trim() ||
    (await ask(
      "Name",
      existing?.name || process.env.SUPER_ADMIN_NAME?.trim() || "Super Admin",
    ));

  const clash = await User.findOne({ email, role: { $ne: "superAdmin" } });
  if (clash) {
    throw new Error(
      `${email} already belongs to a ${clash.role} account. Remove that account or pick another email. Nothing was changed.`,
    );
  }

  const passwordHash = await hashPassword(await askPassword());

  if (existing) {
    existing.set({ email, name, passwordHash, isActive: true });
    existing.credentialVersion = (existing.credentialVersion ?? 0) + 1;
    await existing.save();
    console.log("Super Admin updated.");
  } else {
    await User.create({
      name,
      email,
      role: "superAdmin",
      isActive: true,
      passwordHash,
      createdByEmail: "terminal",
    });
    console.log("Super Admin created.");
  }
  console.log(`Sign in at /login with ${email} and the password you just set.`);

  if (email !== configuredEmail) {
    console.warn(
      `\nHeads up: SUPER_ADMIN_EMAIL in .env is "${configuredEmail || "(not set)"}".` +
        `\nSet it to "${email}" and restart the dev server so OTP sign-in works for this account too.`,
    );
  }
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code === 11000) {
    console.error(
      "Another account already uses that email, or a Super Admin was created at the same time. Nothing was changed.",
    );
  } else {
    console.error(`[super-admin] ${safeErrorMessage(error)}`);
  }
  process.exitCode = 1;
} finally {
  rl.close();
  if (connected) await mongoose.disconnect();
}
