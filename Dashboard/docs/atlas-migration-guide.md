# Atlas migration guide (Bash / Git Bash)

This workflow keeps source and target connections explicit. Audit and dry-run
never write. The `apply` command only inserts missing documents and requires an
exact target acknowledgement. Demo records require a second publication
acknowledgement because they are fictional and may appear on the public site.

## 1. Install and configure

```bash
cd Dashboard
npm install
```

Put the target `MONGODB_URI` and `MONGODB_DB_NAME=Sthal-Pakrashi` in the ignored
`Dashboard/.env.local` (or existing ignored `.env`). Do not put credentials in
shell history or commit an environment file. `MIGRATION_SOURCE_URI` and
`MIGRATION_SOURCE_DB` default to `mongodb://127.0.0.1:27017` and
`sth_demo_preview`; set them in the current shell only when intentionally using
a different source. The target URI must be Atlas SRV and the database name is
checked before the tool connects.

For a shell-local resolver override on Windows/Git Bash, when required by the
network:

```bash
export MONGODB_DNS_SERVERS="1.1.1.1,8.8.8.8"
```

The DNS utility validates IP addresses and configures Node before any SRV
resolution. If Atlas access fails, the tool labels DNS, network, authentication,
and other connection errors separately. Atlas must also allow the caller's
current public IP in its Network Access list.

## 2. Start or reuse local MongoDB

Start the repository's managed local MongoDB only if it is not already
answering on port 27017. This probe uses the installed Mongoose dependency and
closes its connection before starting a server:

```bash
node --input-type=module -e 'import mongoose from "mongoose"; try { await mongoose.connect("mongodb://127.0.0.1:27017", { serverSelectionTimeoutMS: 1500 }); console.log("Reusing MongoDB on 127.0.0.1:27017"); await mongoose.disconnect(); } catch { process.exitCode = 1; }' \
  >/dev/null 2>&1 || npm run dev:db
```

Keep that terminal open. If port 27017 already answers, reuse the running
process instead of starting a second server against `.mongo-data`.

## 3. Read-only audit and dry-run

```bash
# Counts, collection mapping, settings field names, unmapped collections
npm run db:migrate:atlas -- --audit

# Preview the safe default (eligible static links; settings and demos gated)
npm run db:migrate:atlas:dry-run

# Preview all 43 explicitly marked demo records too; still zero writes
npm run db:migrate:atlas:dry-run -- --include-demo

# Preview the local Settings singleton only after reviewing its values
npm run db:migrate:atlas:dry-run -- --include-settings
```

Check the printed source/target database names, source/target counts, planned
IDs, conflicts, validation failures, unknown fields, and settings differences.
Do not proceed while any resource reports failures or unresolved conflicts.
The demo-including dry-run is informational only; it does not authorize a
publication or import.

## 4. Apply after review and approval

The migration must be reviewed again immediately before applying:

```bash
npm run db:migrate:atlas -- --dry-run
npm run db:migrate:atlas -- --apply --confirm-target=Sthal-Pakrashi
```

The command above excludes demo content and the Settings singleton. To migrate
the local Settings singleton, first verify its admission and institution
identity fields, then add `--include-settings --confirm-settings-migration` to
the apply command. Only if the institution separately approves making fictional
demo content public, use the extra acknowledgement:

```bash
npm run db:migrate:atlas -- --dry-run --include-demo
npm run db:migrate:atlas -- --apply --include-demo \
  --confirm-target=Sthal-Pakrashi --allow-demo-publication
```

The settings acknowledgement may be combined only after reviewing those fields:

```bash
npm run db:migrate:atlas -- --apply --include-settings \
  --confirm-target=Sthal-Pakrashi --confirm-settings-migration
```

Apply is insert-only: matching IDs/singletons are skipped; semantic conflicts
are reported and skipped; no updates, deletes, drops, or clears occur. An
interrupted run can be safely rerun after inspecting its per-resource results.

## 5. Verify counts and application reads

Run a fresh audit; compare the planned insert counts against target count deltas.
The read-only audit is also the supported final per-collection count check:

```bash
npm run db:migrate:atlas -- --audit
```

For a local Dashboard session against Atlas, start the Dashboard only after
setting its environment to the Atlas URI and exact database name:

```bash
npm run dev
curl --fail-with-body http://localhost:3003/api/health
curl --fail-with-body http://localhost:3003/api/banners
curl --fail-with-body http://localhost:3003/api/notices
```

Set `Public-Website/.env.local` to the Dashboard API URL for local use, then:

```bash
cd ../Public-Website
npm install
npm run dev
curl --fail-with-body http://localhost:3004/
```

For production, configure Dashboard `MONGODB_URI` and `MONGODB_DB_NAME` on its
host, and Public Website `API_BASE_URL` to the deployed Dashboard API URL. The
Public Website does not need MongoDB credentials. Production refuses missing
or loopback database/API configuration; API health and server logs should be
checked after deployment. Page fallback UI remains available during outages,
and the API layer logs failures so fallback content does not mask them in
server diagnostics.

## Troubleshooting

- **DNS / SRV**: test the resolver used by Node, then set a valid
  `MONGODB_DNS_SERVERS` list for the current shell. `ipv4first` alone does not
  fix a blocked SRV resolver. The migration output identifies DNS failures.
- **Authentication**: confirm the Atlas database user, password encoding, and
  roles through the secret manager/environment file; never paste the URI into
  terminal output or issue trackers.
- **Network / IP access list**: confirm Atlas Network Access includes the
  machine or deployment's current egress IP and outbound connectivity is open.
- **Wrong database**: the tool refuses target database names other than
  `Sthal-Pakrashi`; review `.env.local` without printing its contents.
- **Already-running local MongoDB**: reuse port 27017; do not run another
  `dev:db` process against the same `.mongo-data` directory.
