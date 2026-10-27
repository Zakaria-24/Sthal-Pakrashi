# School CMS Dashboard

A reusable content dashboard **and backend** for school websites, in a single
Next.js project. It owns the database, the API and the admin interface — the
public website is a separate project that only reads from this one.

Nothing in this codebase is specific to any one school. Everything
school-specific lives in `.env.local` and in the `Settings` record you edit from
the dashboard itself, which is what makes it copy-and-reuse.

## Requirements

- Node.js 20.9 or newer
- A MongoDB database (MongoDB Atlas, or the bundled local one below)

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` — at minimum `MONGODB_URI`, `JWT_SECRET`, and
`SUPER_ADMIN_EMAIL`. The Super Admin signs in with the password set by
`npm run bootstrap:super-admin`, or with a one-time code. Configure
SMTP to deliver codes by email; without SMTP, codes print in the Dashboard
server terminal for local development. Generate `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Initialize the first Super Admin once, then preview and import the current
public-site settings and links. The dry run reads the database without writes:

```bash
npm run bootstrap:super-admin
npm run db:import:dry-run
npm run db:import
```

Then start the Dashboard and API:

```bash
npm run dev
```

`bootstrap:super-admin` asks for the email, name and password (typed hidden,
entered twice). Run it again any time to reset the Super Admin's password — it
updates the existing account instead of adding a second one.

Open http://localhost:3003 and sign in with that email and password, or request
a one-time code.

### No database handy?

`npm run dev:db` starts a real MongoDB on `127.0.0.1:27017`, storing its files
in `.mongo-data/` so your content survives restarts. Leave it running in its own
terminal and set `MONGODB_URI="mongodb://127.0.0.1:27017"`. Switching to Atlas
later is purely an `.env.local` change.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dashboard + API on port 3003 (Webpack dev server) |
| `npm run dev:db` | Local MongoDB for development |
| `npm run db:import:dry-run` | Preview import counts without database writes |
| `npm run db:import` | Import current public fallback settings and content |
| `npm run db:sync-demo:dry-run` | Compare local `sth_demo_preview` with Atlas and plan inserts; no writes |
| `npm run db:sync-demo:atlas -- --apply --confirm-atlas-demo-import` | Explicitly confirm inserting demo records into the configured Atlas database |
| `npm run db:migrate:atlas -- --audit` | Audit local and Atlas collections, static sources, and migration conflicts (read-only) |
| `npm run db:migrate:atlas:dry-run -- --include-demo` | Preview public content including gated demo records (read-only) |
| `npm run bootstrap:super-admin` | Create initial OTP-authenticated Super Admin |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |

The demo sync reads only documents marked `isDemo: true` from the local
`sth_demo_preview` database. It inserts missing documents by their existing
`_id`, skips matching demo documents, and leaves ID collisions with non-demo
documents untouched. The target must be the configured MongoDB Atlas database
`Sthal-Pakrashi`. The dry run must succeed and the displayed target must be
verified before you run the explicit confirmation command above. Never use the
demo import command with a production database unless you intend to publish
fictional content.

See [the full Atlas audit](./docs/atlas-migration-audit.md) and
[Bash migration guide](./docs/atlas-migration-guide.md) for collection counts,
review requirements, DNS setup, and the explicitly confirmed apply workflow.

## How it is organised

```
src/
  app/
    api/
      [resource]/          Generic CRUD for every content type
        route.ts             GET list · POST create
        [id]/route.ts        GET one · PATCH · DELETE
      auth/                login · logout · me
      settings/route.ts    Singleton site settings
      upload/route.ts      Cloudinary image upload
      health/route.ts      Database reachability check
    dashboard/             Admin UI (one generic page per resource)
    login/
  components/
    resource-manager.tsx   The generic CRUD screen
    field-input.tsx        Renders a control per field type
    sidebar-nav.tsx        Navigation built from the registry
  lib/
    resource-config.ts     THE REGISTRY — content types, fields, validation
    resource-models.ts     Slug → Mongoose model (server only)
    db.ts                  Cached Mongoose connection
    auth.ts                JWT sessions (jose, Edge-compatible)
    env.ts                 The only place process.env is read
  models/                  Mongoose schemas
  proxy.ts                 Route protection (Next.js 16's middleware)
```

### The registry

`src/lib/resource-config.ts` describes every content type once — its fields,
their types, validation rules and how they appear in tables. The API routes, the
sidebar, the tables and the forms are all generated from it. There is no
per-resource route file or per-resource page.

**To add a content type** (say, "Downloads"):

1. Add a Mongoose schema in `src/models/content.ts`.
2. Add an entry to `RESOURCES` in `src/lib/resource-config.ts`.
3. Map the slug to the model in `src/lib/resource-models.ts`.

The API endpoint, sidebar link, table and form all appear automatically.

## API

The separate Public Website runs on port 3004. Its Server Components call this
API using server-only `API_BASE_URL` (default `http://localhost:3003`), so the
normal content flow does not depend on browser CORS. Dashboard browser calls
are same-origin. Any cross-origin browser access is limited to exact origins
in `ALLOWED_ORIGINS`. Reads expose published content; writes require a
role-checked session.

| Method | Route | Auth |
| --- | --- | --- |
| `GET` | `/api/<resource>` | public |
| `GET` | `/api/<resource>/:id` | public |
| `POST` | `/api/<resource>` | required |
| `PATCH` | `/api/<resource>/:id` | required |
| `DELETE` | `/api/<resource>/:id` | required |
| `GET`/`PATCH` | `/api/settings` | read public, write required |
| `POST` | `/api/upload` | required |
| `GET` | `/api/health` | public |

Resources: `banners`, `notices`, `events`, `gallery`, `teachers`, `founders`,
`committee`, `alumni`.

Useful query parameters: `activeOnly=true`, `limit`, `page`, `search`,
`category`, `featured=true`.

Every response uses the same envelope:

```json
{ "success": true,  "data": { "items": [], "total": 0, "page": 1, "limit": 100 } }
{ "success": false, "message": "Validation failed", "issues": [] }
```

## Theming

`src/app/globals.css` opens with a `BRAND` block of four custom properties.
Change those and the whole dashboard follows; nothing else hard-codes a colour.

## Reusing this for another school

1. Copy the whole `Dashboard/` folder into the new school's project directory.
2. `npm install`
3. Copy `.env.example` to `.env.local` and set:
   - `MONGODB_DB_NAME` — a **different** database name, so schools never share data
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — that school's administrator
   - `JWT_SECRET` — a fresh random value
   - `ALLOWED_ORIGINS` — that school's public site URL
4. Optionally change the four `BRAND` values in `globals.css`.
5. `npm run dev`, sign in, and fill in **Site settings** — name, logo, address,
   contact details and social links all come from there.

No source file needs editing. The same cluster can host many schools as long as
each has its own `MONGODB_DB_NAME`.

## Deploying

Works on any Node host (Vercel, Railway, a VPS). Set every variable from
`.env.example` in the host's environment settings, and make sure the production
public-site URL is listed in `ALLOWED_ORIGINS`. Never commit `.env.local`.


## API contract, admission and applications

The public website reads (and, for applications, writes) through this app's API — every
endpoint, its access level and its request/response shape is documented in [API.md](./API.md).

Admission is managed under **Admission info** (open/closed switch + page content) and
**Applications** (private; admins only) in the sidebar. Applicants' documents are private
Cloudinary files under `<CLOUDINARY_FOLDER>/applications/`.

## Explicit demo content preview

The repository includes fictional preview records in `scripts/demo-content.mjs`. The separate importer only targets a loopback MongoDB URI by default; it does not run during startup and does not change the existing public fallback importer. Every imported record has `isDemo: true`, and the Dashboard exposes that marker for editing. Public cards show a localized demo badge. Names and activities are fictional; local fallback photos are examples and are not asserted to depict the listed activity or staff member.

Start local MongoDB in one terminal with `npm run dev:db`. In another terminal, use this isolated database:

```powershell
$env:MONGODB_URI = "mongodb://127.0.0.1:27017"
$env:MONGODB_DB_NAME = "sth_demo_preview"
npm run db:import:demo:dry-run
npm run db:import:demo
npm run db:import:demo
```

The first command previews without writing; the next imports; the last confirms repeat safety (existing deterministic IDs are skipped). This targets isolated local `sth_demo_preview` and leaves the configured `.env` database untouched.

Run the Dashboard API against that same local database so the Public Website can read the preview records. Stop any existing Dashboard dev server first, then start it with the same environment overrides:

```powershell
$env:MONGODB_URI = "mongodb://127.0.0.1:27017"
$env:MONGODB_DB_NAME = "sth_demo_preview"
npm run dev
```

Keep the local database and Dashboard API running while using the Public Website. Open the Dashboard at `/dashboard` on port 3003 and inspect Banners, Notices, Events, Gallery, Teachers, Alumni, and Academic Programs. The Public Website at port 3004 reads these resources through server-to-server API requests.

Remote imports are blocked unless both `--allow-production-demo` and `DEMO_IMPORT_PRODUCTION_ACK=I_UNDERSTAND_DEMO_DATA_IS_PUBLIC` are explicitly provided. Review the target database and understand that active demo records are public before using that opt-in. No cleanup command is provided; remove individual records manually in the Dashboard after confirming their Demo content marker. Never bulk-delete records based only on title or date.

### Atlas SRV DNS override

If Node.js cannot resolve an Atlas SRV record with the system resolver, set
`MONGODB_DNS_SERVERS` in the PowerShell process before starting the Dashboard
or running a database script. The value must be comma-separated IPv4/IPv6
addresses; the app and scripts validate it and call `dns.setServers()` before
Mongoose connects. This does not alter `MONGODB_URI` or authentication:

```powershell
$env:MONGODB_DNS_SERVERS = "1.1.1.1,8.8.8.8"
npm run db:import:dry-run
```

The same environment variable is read by the Dashboard process. It is optional
when the system DNS resolver already resolves the Atlas SRV record.

This preview intentionally leaves founders, committee, leadership messages, recognitions, admissions, class approval/count disclosures, uniforms, academic documents, staff identities, examination results, useful links, and institution settings untouched. Those require verified school-specific information or existing authoritative documents. Demo teacher/alumni names are fictional, have no photos or contact details, and are labelled on public profile cards.
