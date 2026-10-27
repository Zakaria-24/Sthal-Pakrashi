# Data gaps, decisions and leftovers (Phases 2 – 5)

Phases 2–4 were frontend-only, so every gap was handled with a clearly marked
stand-in. **Phase 5 built the CMS / API side** (see `Dashboard/API.md`) — the
table in section 0 lists what that closed; section 1 is what is genuinely left.

**Conventions used throughout**

- `isFallback` (from `src/lib/api.ts`) means the CMS returned nothing for that
  resource (or could not be reached). Sections then show the artifact's own
  placeholder content — or an empty state — never invented records. Phase 5
  removed the bundled sample records (they belonged to another school); the
  design's identity defaults (`fallbackSettings`) and public government links
  (`fallbackLinks`) remain.
- A field the CMS lacks renders the artifact's own empty state — "Not
  published", "Coming soon", "Announced via notice" — never an invented value.
- Static UI text is EN + BN in `src/lib/i18n`; Bengali strings the artifact did
  not supply are marked `// (NEW)` and need a native-speaker review.

---

## 0. Resolved in Phase 5 (built, tested end to end)

| # | Gap | Now |
|---|---|---|
| 3 | Education board | `educationBoard` setting; the design's Rajshahi wording only stands in while it is empty |
| 4 | Online applications | `POST /api/apply` (public, validated, rate-limited, only while admissions are open) → `applications` collection; Dashboard **Applications** page (search, status filter, detail, status + note, delete). The apply form uploads up to five documents (PDF/JPG/PNG/WEBP ≤ 5 MB) as **private** Cloudinary files under `sthal-pakrashi/applications/`; the applicant sees an Application ID only if the CMS returned one |
| 5 | Admission-open flag | `admissionOpen` setting (Dashboard → Settings or Admission info). Open → "Apply Now" (header, menu, mobile hero) and the form; closed → "Admission Info" and a closed message on `/apply`. The API enforces it too. Default is **closed**, also when the CMS cannot be reached |
| 6 | Admission Info content | `/api/admission-info` singleton: session, eligibility, process, required documents, fees, important dates, instructions. Empty lists keep the design's copy / "Not published" / "Announced via notice" |
| 7 | Notice "admission" category | Added to notices; "Relevant Notices" now lists that category |
| 8 | Blog / news | `posts` resource (draft/published, slug, excerpt, content, image, category, author) + `/blog/[slug]`. Drafts are never public |
| 9 | Staff type | `staffType` (administrative / support); the staff page groups by it |
| 10 | Document shift chip | `shift` on documents (a separate "version" was not needed by the design) |
| 11 | Section letters | Deliberately **not** changed: `approvedSections` stays a number. A `group` (science/humanities/business) was added to classes |
| 12 | Info-centre mobile; grievance-officer address + mobile | Added to settings and shown |
| 13 | Contact fields | `mobile` added; phone, email, hours and map were already settings — **values still need entering** |
| 15 | Programs / groups | `programs` resource (secondary tiles, higher-secondary groups); design copy shows for a level with none |
| 18 | MPO status | `mpoStatus` (enlisted / pending / not enlisted / unset); while unset, a published MPO code implies "Enlisted" |

Also: gallery `caption` (used as the photo's alt text), and public list/detail
reads now always return published items only, whatever the query string says.

---

## 1. Remaining gaps

| # | Required field / resource | Why it remains | What is needed |
|---|---|---|---|
| 1 | **Bilingual CMS content** (Bengali title/body on every field) | Every CMS field is a single string; text is shown as stored in both languages | Bengali counterparts (or `{en,bn}`) on every resource + Dashboard forms — a cross-cutting change |
| 2 | **Bengali site identity** (name, address, type, about) | `site-text.ts` supplies the artifact's Bengali only while the CMS value is still the bundled default | Bilingual `Settings` fields, then delete the overrides |
| 14 | **Real head-teacher, founder, committee, teachers, staff** | Needs official institutional data — none was invented | Enter the real records in the Dashboard |
| 16 | **Alumni category + social links** | Not built: outside the Phase 5 list | `category` and social URLs on alumni |
| 17 | **Testimonials** resource | Not built (`Alumni.testimonial` is used) | A `testimonials` resource, if wanted |
| 19 | **Uniform photos** | Needs official photos | Upload them (the resource and image field exist) |
| 20 | **Institution code** | Needs the official value | Fill in Settings → Institution code |
| 21 | **Students "passed out"** (74,500+) | No verified figure; not shown | A settings figure, only if the institution confirms it |
| 22 | **Counts** (students, teachers, classes) | Derived from CMS records; teacher count is capped by the API page size | Expose `total` if the list grows past 100 |
| 23 | **Logo, hero and gallery imagery** | Needs real assets | Upload them; the bundled sample photos were never used for real records |
| — | **Public PDF delivery on Cloudinary** | The Cloudinary account refuses to serve PDFs publicly (`401` on any `.pdf` URL) — an account security setting, not code. Images are fine, and applicants' private documents are unaffected (they use signed downloads) | In the Cloudinary console: Settings → Security → allow "PDF and ZIP files delivery" — or paste external PDF links into the document fields |
| — | **Shared external accounts** | The clone's `.env` uses the same Atlas cluster/user, the same Cloudinary account/keys and the same Gmail SMTP account as the main project. Data is separated (own database name, own folder) but the credentials are shared | Create a dedicated Atlas user limited to `sthal_pakrashi_cms`, a dedicated Cloudinary account (or sub-account) and a dedicated sender for login codes before going live |
| — | **Super-admin login email** | `SUPER_ADMIN_EMAIL` is still a placeholder | Set the real address in `Dashboard/.env` |

## 2. Search

Existing per-resource `?search=` fan-out (notices, events, teachers, staff,
alumni, gallery, videos, documents — 4 hits each) plus instant matches on the
navigation pages, through a server action. Phase 4 needs a real endpoint:
ranking, pagination/highlighting, Bengali-aware matching, static page copy,
fewer upstream requests. When the CMS is unreachable the modal says so and still
shows page matches.

## 3. Routes (all built from the artifact)

| Artifact page | Route | Data |
|---|---|---|
| home | `/` | settings, banners, notices, gallery, alumni, classes, teachers, videos, links |
| about | `/about` (`#mission`, `#profile`) | settings, gallery, leadership messages |
| programs | `/academics` | programs |
| notices | `/notices` (+ `/notices/[id]`) | notices |
| events | `/events` (+ `/events/[id]`) | events |
| teachers | `/teachers` | teachers, leadership messages |
| staff | `/staff` | staff |
| committee | `/committee` | committee |
| alumni | `/alumni` | alumni |
| students | `/students` (`#classes`) | classes |
| resources | `/resources` (`#routine` … `#other`) | academic documents |
| gallery | `/gallery` | gallery |
| blog | `/blog` (+ `/blog/[slug]`) | posts |
| recognition | `/recognition` | recognitions |
| mpo | `/mpo` | settings (`mpoStatus`, `mpoCode`, `eiin`) |
| founder | `/founder` | founders |
| videos | `/videos` | videos |
| uniform | `/uniform` | uniform |
| infoCentre | `/info-centre` | settings.infoCentre |
| grievance | `/grievance` | settings.grievanceOfficer |
| apply | `/apply` | settings.admissionOpen; submits to `POST /api/apply` |
| admissionInfo | `/admission-info` | admission-info, notices (`admission` category) |
| contact | `/contact` | settings |

`/institution-info` → `/about#profile` and `/administration` → `/committee`
(redirects): those two pre-redesign pages have no counterpart in the artifact.

## 4. Decisions you may want to reverse

1. **Containers are content-box like the artifact** (1240px of content plus the
   side gutters), so content is 48px wider than before at ≥1288px — this also
   nudged the Homepage to match the artifact exactly.
2. **Apply never fakes a submission** (gap 4).
3. **Mobile / tablet header** (<1024px) follows your reference image, not the
   artifact: the sticky bar is only the green brand row with the search and menu
   buttons (66px, 85px on phones where the school name wraps to two lines). The
   address / EIIN announcement bar, the Apply Now button and the EN / বাংলা toggle
   sit in the menu drawer below the navigation. Desktop (≥1024px) is unchanged.
4. **Design palette is fixed**; the Dashboard's theme presets only recolour the
   legacy `--brand*` styles.
5. **Home "Find your course" copy** kept as designed although the cards are alumni.
6. Notice/event cards open the artifact's dialogs; the `/notices/[id]` and
   `/events/[id]` pages remain as deep links (home cards and search use them).
7. **Breakpoints sit 1px above the artifact's max-width queries** (641 / 769 / 1025 /
   1281 in `@theme`), so a viewport of exactly 640 / 768 / 1024 / 1280 collapses the
   same way the artifact does. The header alone switches at `min-width:1024px`
   (the `desk:` variant), as in the artifact.
8. **Home "Watch Now" card stays visible on phones.** In the artifact the card is
   pushed under the FAQ section at ≤640px and cannot be seen; here it sits below
   the photo.

## 5. Leftovers

- `README.md` still describes "Uddom Public School" and port 3001 (dev is 3004).
- `public/fallback/*.png` (photos from the earlier site) are no longer referenced
  by any record. They can be deleted once the real photos are uploaded.
- The Dashboard's `/api/upload` still stores PDFs as Cloudinary "image" assets
  (unchanged), which is why the account's PDF-delivery setting matters (section 1).
- Next warns about a stray `D:\AetherZen\Edu-Institution\package-lock.json`
  above the repo (harmless).
- `CLAUDE.md` in this folder still contains the original exploration prompt, not
  conventions.

## 6. Home refinement pass (against the artifact, 1440 → 375)

Home section heights now match the artifact within ±3px at 1440/1280/1024/768 for
every section whose content is not data-driven. What still differs, and why:

- **Hero:** the right column shows five neutral avatar tiles (the artifact's are
  stock photos) and omits the "2,400+ Students Enrolled" line unless the CMS has
  class data (≈45px shorter when stacked). The stat strip shows "—" for unknown
  figures.
- **Header utility bar:** Facebook/YouTube icons are hidden (no URLs in the CMS), so
  at 480px the bar fits on one row (≈26px shorter than the artifact).
- **Alumni finder / notices / useful links:** card copy and title lengths come from
  the fallback data, so heights differ by the wrapped lines.
- **Hero / about / gallery photos:** the artifact's bundled stock images are not
  used; CMS or fallback imagery (or the tinted placeholder) is shown instead. Only
  the decorative FAQ cut-out (`public/design/faq-student.png`) was copied over.
- **Phone / tablet hero (≤1024px)** follows your reference image, not the artifact:
  full-bleed campus photo under a dark green overlay, "Shaping Bright Futures
  Together" headline (its own `home.heroM.*` strings, EN + BN), Apply Now / Learn
  More buttons and Students / Teachers / Years cards ("—" until the CMS has the
  figure). Desktop (≥1025px) hero is unchanged. With the bundled fallback photo the
  image is a framed picture with a light border, so a lighter strip shows at the top
  of the hero until a real banner is uploaded.
- **"Sample content" pills** (our convention) are not in the artifact.
- **Campus grid** keeps the artifact's half-empty third row (its own quirk).
- **Dev server note:** Turbopack occasionally stops emitting newly added Tailwind
  classes; restart `next dev` (and delete `.next`) if a new utility has no effect.
