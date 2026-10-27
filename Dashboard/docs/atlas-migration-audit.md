# Atlas migration audit

Audit performed: 25 October 2026. Commands were read-only; no Atlas migration
was applied. Counts below are live counts observed in `sth_demo_preview` and
Atlas database `Sthal-Pakrashi`, not historical estimates.

## Architecture and page-to-data-source matrix

The Public Website has no MongoDB driver or MongoDB credentials. Its server
library (`Public-Website/src/lib/api.ts`) reads the Dashboard API using
`API_BASE_URL`; the Dashboard owns Mongoose and its database. Calls use
`cache: "no-store"`. API errors and empty lists are logged/fall back to bundled
content or visible empty states; lists carry `isFallback` so sections can label
sample content or avoid displaying fabricated totals. `/api/health` separately
reports MongoDB reachability.

| Public route / section | Dynamic data source | Fallback/static content and notes |
| --- | --- | --- |
| `/` home | Settings, banners, notices, gallery, alumni, classes, teachers, videos, useful links | Translation dictionaries and layout copy stay in source. Figures are suppressed when class/teacher lists are fallback. |
| `/about` | Settings, one gallery image, leadership messages | Mission, vision, institution identity use settings with design defaults; labels and page copy use EN/BN dictionaries. |
| `/academics` | `programs` | Program labels/descriptions have translated presentation defaults when no managed records are present. |
| `/admission-info` | AdmissionInfo singleton and admission-category notices | Empty admission singleton is an explicit unpublished state; translated instructions remain UI copy. |
| `/apply` | Settings (`admissionOpen`), POST to `/api/apply` | Form labels and validation UX are static translations. Application submissions and private upload identifiers are not public content and are excluded from this migration. |
| `/alumni` | Alumni | Empty-state/sample badge; no bundled alumni list. |
| `/blog`, `/blog/[slug]` | Published Posts | Translation labels and page chrome static; drafts filtered by API. |
| `/committee` | CommitteeMember | Empty-state/sample UI; no bundled official roster. |
| `/contact` | Settings contact fields | Labels are localized; contact values remain blank unless entered. |
| `/events`, `/events/[id]` | Events | Empty-state UI; image fallback component handles unavailable media. |
| `/founder` | Founders | Empty-state UI; no founder identity invented. |
| `/gallery` | GalleryItem | Images come from record URLs or the local image fallback component. |
| `/grievance` | Settings grievance officer | The officer fields are deliberately empty until official data is entered. |
| `/info-centre` | Settings info-centre fields | Static labels; contact values are managed settings. |
| `/mpo` | Settings (`mpoCode`, `mpoStatus`) | Static explanatory copy; empty CMS values yield unpublished state. |
| `/notices`, `/notices/[id]` | Notices | Empty-state UI; active/published filtering is enforced by API. |
| `/recognition` | Recognitions and settings | No bundled recognition records; translations provide display labels only. |
| `/resources` | AcademicDocument | Empty-state UI; document links need a publicly reachable URL. |
| `/staff` | Staff | Empty-state/sample UI; no staff roster bundled. |
| `/students` | ClassInfo | Counts are calculated only from CMS data, not fallback values. |
| `/teachers` | Teachers and leadership messages | No official people data bundled. |
| `/uniform` | UniformItem | Empty-state/presentation placeholders; no official items bundled. |
| `/videos` | VideoItem | Video URLs are external media references managed as records. |

`/layout.tsx` derives title/description and institution title from i18n and
settings. SEO/page titles, EN/BN translation dictionaries, navigation, FAQs,
form instructions, and design-only copy remain source-controlled; they are not
CMS records. Search fans out over notices, events, teachers, staff, alumni,
gallery, videos and documents through the same Dashboard API.

## Public resource to physical collection mapping

Mapping was read from `src/lib/resource-models.ts` and confirmed using each
Mongoose model's `collection.name`. Source/target values are current document
counts. The demo counts are included in source totals and identified separately.

| API resource | Mongoose model | Collection | Local total | Local demo | Atlas total | Migration note |
| --- | --- | --- | ---: | ---: | ---: | --- |
| `banners` | Banner | `banners` | 3 | 3 | 0 | Demo-only source content |
| `notices` | Notice | `notices` | 8 | 8 | 0 | Demo-only source content |
| `events` | Event | `events` | 6 | 6 | 0 | Demo-only source content |
| `gallery` | GalleryItem | `galleryitems` | 12 | 12 | 0 | Demo-only source content |
| `videos` | VideoItem | `videoitems` | 0 | 0 | 0 | No records |
| `uniform` | UniformItem | `uniformitems` | 0 | 0 | 0 | No records |
| `links` | UsefulLink | `usefullinks` | 0 | 0 | 0 | Five static government links are candidates |
| `messages` | LeadershipMessage | `leadershipmessages` | 0 | 0 | 0 | No records |
| `recognitions` | Recognition | `recognitions` | 0 | 0 | 0 | No records |
| `classes` | ClassInfo | `classinfos` | 0 | 0 | 0 | No records |
| `documents` | AcademicDocument | `academicdocuments` | 0 | 0 | 0 | No records |
| `teachers` | Teacher | `teachers` | 6 | 6 | 0 | Fictional demo-only profiles |
| `staff` | Staff | `staffs` | 0 | 0 | 0 | No records |
| `founders` | Founder | `founders` | 0 | 0 | 0 | No records |
| `committee` | CommitteeMember | `committeemembers` | 0 | 0 | 0 | No records |
| `alumni` | Alumni | `alumnis` | 4 | 4 | 0 | Fictional demo-only profiles |
| `posts` | Post | `posts` | 0 | 0 | 0 | No records; unique sparse `slug` |
| `programs` | Program | `programs` | 4 | 4 | 0 | Demo-only source content |
| settings singleton | Settings | `settings` | 1 | 0 | 0 | Gated for manual review; local value has `admissionOpen: true` |
| admission-info singleton | AdmissionInfo | `admissioninfos` | 0 | 0 | 0 | No source record |

The source and target each exposed 23 and 20 collections respectively. The
three additional source collections, `users`, `otps`, and `applications`, each
had zero documents and are deliberately not migrated. These hold account,
one-time-code, and private application data, outside the public-content model
registry. All target collections mapped to the public model registry; they
were empty at audit time.

The seven demo collections total 43 records, matching the fixture module's 43
records. This is the same dataset represented in two places, so it was counted
once. All 43 source documents have `isDemo: true`. The historical expectation
is therefore confirmed as current for this audit.

## Static content, assets, and migration candidates

- `fallback-data.ts` has empty fallback arrays for banners, notices, events,
  gallery, teachers, founders, committee, leadership messages, videos,
  uniform, recognitions, classes, documents, staff, and alumni. These remain
  empty states and are not invented into records.
- Five government/service links remain in `fallbackLinks`. They have stable
  deterministic IDs and are proposed as inserts only when the local links
  collection is empty and target URL conflicts are absent.
- `fallbackSettings` contains institution identity/design defaults (27
  non-theme fields). It is not imported as a separate static source. The local
  database contains one Settings singleton. Its only non-empty value matches
  the bundled `admissionOpen: false` default; no configured value differs from
  bundled defaults. The record is still excluded from the default plan because
  it has no useful institution content, and Settings require an explicit review
  acknowledgement. The audit prints field names/status, not values.
- `AdmissionInfo` is empty. No admissions dates, eligibility, or fees are
  invented. `admissionOpen` remains closed by default.
- Demo media uses `/fallback/...` paths. The referenced fallback image files
  are present under `Public-Website/public/fallback/` for the current project.
  Those fictional image/data records are still demo-only; uploads or any
  production media not in the repository must use publicly reachable hosted
  URLs. The decorative `/design/faq-student.png` remains a static design asset.
- External government URLs in useful links remain ordinary URLs. UI icons,
  navigation, FAQ copy, translation strings, page metadata, and layout/color
  configuration are source code rather than database content.

## Schema, validation, and duplicate risks

Models use timestamps and defaults. Most content schemas have an `isDemo`
boolean; the Dashboard editor exposes it. Post has a unique sparse `slug`,
Settings has unique immutable `key: "site"`, and AdmissionInfo has unique
immutable `key: "admission"`. No bilingual field pairs exist today; CMS text is
stored as one string and displayed in both locales. Preserve EN/BN work in
translation files until bilingual schemas/forms are implemented.

The migration tool uses the exact Mongoose model schemas and explicit physical
collection names. It validates documents before writing, preserves source
`_id`, timestamps and publication fields, checks ID/singleton/URL/slug conflicts,
and only inserts missing records. Existing records are skipped; unrelated
same-ID or semantic-key records are not changed. Unknown top-level schema fields
are reported and block that document. It performs no collection drops or
deletes, and it does not import auth or application collections.

`Public-Website/DATA_GAPS.md` records the remaining items that need verified
institution input before content entry: official head-teacher/founder/committee
and staff/teacher records, contact and grievance details, institution code,
real logo/hero/gallery images, uniform photos, and any confirmed alumni or
student-count claims. Admission eligibility, dates, fees and instructions are
empty. These are missing source records, not migration failures; the tool does
not fabricate replacements. The existing single-string CMS fields also lack
Bengali counterparts and need a separate schema/editor change if bilingual
managed content is required.

## Environment and unresolved review items

- Dashboard reads `MONGODB_URI` and `MONGODB_DB_NAME`; local dev can use
  `mongodb://127.0.0.1:27017` with `sth_demo_preview`. Production now requires
  an explicit database name and rejects loopback MongoDB hosts.
- Public Website reads only server-side `API_BASE_URL`; its local default is
  `http://localhost:3003`, while production now requires a valid non-loopback
  Dashboard API URL. It has no MongoDB credentials.
- DNS initialization uses the shared `MONGODB_DNS_SERVERS` override before SRV
  resolution. The successful read-only audit required the confirmed resolver
  override in the current shell. Credentials and URIs are never printed.
- No production host/provider environment values are available in the repo, so
  deployed API URL, Atlas IP allowlist, and production health cannot be verified
  from source alone.
- Confirm the local Settings singleton values, whether any demo records may be
  public, and the five static government links before any write. Settings
  require `--include-settings --confirm-settings-migration`; demos require
  `--include-demo --allow-demo-publication`.
