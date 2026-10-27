# Sthal Pakrashi Public Website

The public-facing website is a separate Next.js 16 application. It has no
database credentials. Server Components read published content from the
Dashboard API; database access and authenticated edits stay in `Dashboard/`.

## Local development

Configure the Dashboard and MongoDB first using `../Dashboard/README.md`.
Start the Dashboard on port 3003, then:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3004. `API_BASE_URL` defaults to
`http://localhost:3003`; set it to the Dashboard server URL when the API is
hosted elsewhere. `API_TIMEOUT_MS` controls how long a server-side read waits
before rendering a localized fallback state.

The website performs its API requests on the server with `cache: "no-store"`,
so saved Dashboard changes are visible on the next request. No browser CORS
configuration is needed for this server-to-server flow. Dashboard browser
requests are same-origin.

## Content

Institution settings and content records are stored in MongoDB and managed in
the Dashboard. Run the import preview and import from `Dashboard/`:

```bash
npm run db:import:dry-run
npm run db:import
```

The import reads this website's `src/lib/fallback-data.ts`, preserves existing
Dashboard edits, and does not delete records. The current fallback contains
institution identity/settings and five useful links; notice, event, staff,
gallery, and other content lists are intentionally empty. Page labels and
bilingual UI copy remain in the website's i18n files.

If the Dashboard is unavailable, the site uses its bundled identity defaults
and localized empty states for managed lists. It does not invent sample
institutional records.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Webpack development server on port 3004 |
| `npm run build` | Production build |
| `npm start` | Production server on port 3004 |
| `npm run lint` | ESLint |

For deployment, set `API_BASE_URL` to the absolute deployed Dashboard API URL;
production has no localhost default and reports missing or loopback URLs in
server logs while keeping the localized fallback UI. Public pages call it from
server code; add the public site's exact origin to Dashboard
`ALLOWED_ORIGINS` only if a future browser-side integration requires CORS.
