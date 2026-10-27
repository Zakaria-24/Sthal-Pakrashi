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

Fill in `.env.local` — at minimum `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`
and `ADMIN_PASSWORD`. Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Then start it:

```bash
npm run dev
```

Open http://localhost:3000 and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

> **First login creates the admin account.** If the database has no admin yet,
> the first successful login with those credentials creates one. There is no
> seed script to run. Change `ADMIN_PASSWORD` before deploying anywhere real.

### No database handy?

`npm run dev:db` starts a real MongoDB on `127.0.0.1:27017`, storing its files
in `.mongo-data/` so your content survives restarts. Leave it running in its own
terminal and set `MONGODB_URI="mongodb://127.0.0.1:27017"`. Switching to Atlas
later is purely an `.env.local` change.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dashboard + API on port 3000 |
| `npm run dev:db` | Local MongoDB for development |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |

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

Reads are public so the website can fetch content without credentials. Writes
require the admin session cookie, enforced in `src/proxy.ts`.

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
