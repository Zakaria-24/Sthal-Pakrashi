# Sthal Pakrashi CMS — API contract

The Dashboard app is also the API the public website reads. Everything here is
served by this project (port 3003) and stores data in its own database
(`MONGODB_DB_NAME`, default `sthal_pakrashi_cms`).

**Envelope** — every response is JSON:

```jsonc
{ "success": true,  "data": <payload> }
{ "success": false, "message": "…", "issues": [ /* zod issues, 422 only */ ] }
```

**Status codes** — `400` bad request · `401` not signed in · `403` not allowed
· `404` not found · `413` file too large · `415` unsupported file · `422`
validation failed · `429` rate limited · `501` uploads not configured · `503`
database unavailable (the public site then uses its bundled fallbacks).

**Access levels**

| Level | Meaning |
|---|---|
| Public | No credentials. Only ever returns published/public fields. |
| Session | Signed-in dashboard user (cookie `school_cms_session`, HTTP-only JWT). Enforced in `src/proxy.ts`. |
| Admin | Session whose role is `admin` or `superAdmin`. Re-checked against the database on private endpoints (`src/lib/require-admin.ts`). |
| Super admin | `superAdmin` only (user management). |

**CORS** — only exact origins in `ALLOWED_ORIGINS` (local public site:
`http://localhost:3004`) receive `Access-Control-Allow-Origin`; wildcard origins
are never reflected with credentials. Public content is normally fetched from
the website's server components, so this flow does not depend on browser CORS.
Dashboard browser requests are same-origin.

---

## Content resources (generic CRUD)

`GET|POST /api/<resource>` and `GET|PATCH|DELETE /api/<resource>/<id>`

`<resource>`: `banners`, `notices`, `events`, `gallery`, `videos`, `uniform`,
`links`, `messages`, `recognitions`, `classes`, `documents`, `teachers`,
`staff`, `founders`, `committee`, `alumni`, **`posts`**, **`programs`**.
Field lists and validation live in `src/lib/resource-config.ts`.

| Method | Access | Notes |
|---|---|---|
| `GET /api/<resource>` | Public | Query: `activeOnly`, `category`, `featured`, `search`, `page` (≥1), `limit` (≤200, default 100). Response `data: { items, total, page, limit }`. **Without a session the result is always limited to published items** (`isActive: true`; `status: "published"` for `posts`) — leaving `activeOnly` out does not reveal drafts. With a session the dashboard sees everything. |
| `GET /api/<resource>/<id>` | Public | Same rule: an unpublished item is `404` for signed-out callers. |
| `POST`, `PATCH`, `DELETE` | Session | Body validated by the resource's zod schema. |

### Fields added in this phase

| Resource | Change |
|---|---|
| `notices` | `category` gains **`admission`** (`general`, `exam`, `holiday`, `event`, `urgent`, `admission`). Existing ids/URLs unchanged. |
| `posts` (new) | `title`, `slug` (auto-generated, unique), `excerpt`, `content`, `imageUrl`, `category` (`academic`, `campus-life`, `events`, `achievements`, `student-activities`), `author`, `status` (`draft` \| `published`), `publishedAt`. Public sees `published` only. |
| `programs` (new) | `title`, `level` (`secondary` \| `higher-secondary`), `description`, `isActive`, `order`. |
| `staff` | `staffType`: `administrative` \| `support`. |
| `documents` | `shift`: `none`, `morning`, `day`, `evening` (existing: `category` routine/syllabus/book-list/exam-routine/other, `classLabel`, `academicYear`, `fileUrl`, `publishedAt`, `isActive`). |
| `gallery` | `caption` (existing: `title`, `imageUrl`, `category`, `tags`, `order`, `isActive`). |
| `classes` | `group`: `none`, `science`, `humanities`, `business`. `approvedSections` stays a **number**. |

---

## Site settings

`GET /api/settings` — **Public.** Returns the settings document (created empty on first call).
`PATCH /api/settings` — **Admin** (`canEditSettings`). Body: any subset; only the keys sent are changed.

New fields: `admissionOpen` (boolean, default `false`), `educationBoard`, `mpoStatus`
(`""` \| `enlisted` \| `pending` \| `not-enlisted`), `mobile`, `infoCentre.mobile`,
`grievanceOfficer.address`, `grievanceOfficer.mobile`. Nested groups (`infoCentre`,
`grievanceOfficer`, `socialLinks`) are replaced as a whole — send the complete object.

## Admission information

`GET /api/admission-info` — **Public.** `data`:

```jsonc
{
  "academicSession": "2027",
  "eligibility": ["…"],
  "process": [{ "title": "…", "description": "…" }],
  "requiredDocuments": ["…"],
  "fees": [{ "label": "…", "amount": "…" }],
  "importantDates": [{ "label": "…", "value": "…" }],
  "instructions": "…"
}
```

`PATCH /api/admission-info` — **Admin.** Same shape, any subset. Empty lists mean "not published"
and the public site keeps its "Not published / Announced via notice" wording.

## Online applications

### `POST /api/apply` — **Public** (the only public write)

`multipart/form-data`

| Field | Required | Notes |
|---|---|---|
| `data` | yes | JSON string: `studentName`, `studentDob` (ISO date, not in the future), `classApplying`, `guardianName`, `guardianPhone` (required); `guardianEmail`, `prevSchool`, `prevClass`, `prevResult` (optional). Also accepted, optional: `gender` (`male`/`female`/`other`), `birthRegistrationNo`, `guardianRelationship`, `fatherName`, `motherName`. |
| `document_1` … `document_5` | no | PDF, JPEG, PNG or WEBP, ≤ 5 MB each. Checked by file *content*, not the declared type. |
| `label_1` … `label_5` | no | Text label for the matching document. |

* Only accepted while `admissionOpen` is `true`; otherwise `403`.
* Rate limited: 5 per hour per client (`X-Forwarded-For`), 300 per hour overall → `429` + `Retry-After`.
* Success `201`: `data: { "applicationId": "APP-2027-7K3QF9", "status": "submitted" }` — nothing else is ever returned.
* Documents are stored as **private** Cloudinary assets under `<CLOUDINARY_FOLDER>/applications/<applicationId>/` (`sthal-pakrashi/applications/…`). No public URL exists.

### Applications (admin only — reads included)

| Method & route | Access | Purpose |
|---|---|---|
| `GET /api/applications?status=&search=&class=&page=&limit=` | Admin | `data: { items, total, page, limit, counts }`. Rows have `documentCount`, never document links. `search` matches ID, student, guardian, phone. `counts` = applications per status. |
| `GET /api/applications/<id>` | Admin | Full record; `documents[]` each with a **signed download link that expires after 10 minutes**. |
| `PATCH /api/applications/<id>` | Admin | `{ status?: "submitted"\|"under-review"\|"accepted"\|"rejected", adminNote? }`. Status changes are appended to `statusHistory` with the acting user. |
| `DELETE /api/applications/<id>` | Admin | Removes the record and its stored documents. |

Moderators get `403`; signed-out callers `401`. Application data is not part of the generic
resource registry, so it cannot be reached through `/api/<resource>`.

## Uploads

`POST /api/upload` — **Session.** `multipart/form-data` with `file` (image or PDF, ≤ 5 MB).
Stores a public asset under `<CLOUDINARY_FOLDER>/` and returns `{ url, publicId }`.
(Applicants' documents do **not** use this endpoint.)

## Authentication (unchanged)

`POST /api/auth/login` (staff: email + password), `POST /api/auth/send-otp` and
`POST /api/auth/verify-otp` (super admin: emailed one-time code), `POST /api/auth/logout`,
`GET /api/auth/me`. `GET|POST|PATCH|DELETE /api/users…` — super admin only.
`GET /api/health` — liveness.

## What the public website calls

Server-side only (no credentials, never from the browser):
`GET /api/settings`, `/api/admission-info`, `/api/banners`, `/api/notices` (+ `?category=admission`),
`/api/events`, `/api/gallery`, `/api/teachers`, `/api/staff`, `/api/committee`, `/api/founders`,
`/api/messages`, `/api/alumni`, `/api/classes`, `/api/documents`, `/api/videos`, `/api/links`,
`/api/uniform`, `/api/recognitions`, `/api/posts`, `/api/programs`, and `POST /api/apply`.
All list reads pass `activeOnly=true`, and the server enforces it anyway.
