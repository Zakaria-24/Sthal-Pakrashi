import "server-only";

import {
  fallbackAlumni,
  fallbackBanners,
  fallbackClasses,
  fallbackCommittee,
  fallbackDocuments,
  fallbackEvents,
  fallbackFounders,
  fallbackGallery,
  fallbackLinks,
  fallbackMessages,
  fallbackNotices,
  fallbackRecognitions,
  fallbackSettings,
  fallbackStaff,
  fallbackTeachers,
  fallbackUniform,
  fallbackVideos,
} from "@/lib/fallback-data";
import {
  MAX_QUERY_LENGTH,
  MIN_QUERY_LENGTH,
  type SearchContentResult,
  type SearchHit,
} from "@/lib/search";
import type {
  AcademicDocument,
  AdmissionInfo,
  Alumni,
  Banner,
  ClassInfo,
  CommitteeMember,
  Founder,
  GalleryItem,
  LeadershipMessage,
  Notice,
  Post,
  Program,
  Recognition,
  SchoolEvent,
  SiteSettings,
  Staff,
  Teacher,
  UniformItem,
  UsefulLink,
  VideoItem,
} from "@/lib/types";

/**
 * Every read the public site performs goes through here.
 *
 * The contract is: this module never throws and never returns an empty list
 * because of an infrastructure problem. If the Dashboard API is unreachable,
 * slow, or returns an error, the caller silently gets the bundled fallback
 * content instead — so the site always renders.
 *
 * No credentials live here; the API base URL comes from the environment.
 */

const configuredApiBaseUrl = process.env.API_BASE_URL?.trim();
let API_BASE_URL =
  configuredApiBaseUrl ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3003");
API_BASE_URL = API_BASE_URL.replace(/\/$/, "");

if (process.env.NODE_ENV === "production" && API_BASE_URL) {
  try {
    const hostname = new URL(API_BASE_URL).hostname.toLowerCase();
    if (["localhost", "127.0.0.1", "::1", "[::1]"].includes(hostname)) {
      console.error(
        "[api] Production API_BASE_URL must point to the deployed Dashboard API, not localhost.",
      );
      API_BASE_URL = "";
    }
  } catch {
    console.error("[api] Production API_BASE_URL must be a valid absolute URL.");
    API_BASE_URL = "";
  }
}

if (process.env.NODE_ENV === "production" && !API_BASE_URL) {
  console.error(
    "[api] API_BASE_URL is required in production; public API reads will use the visible fallback behavior.",
  );
}

/** How long to wait for the CMS before falling back. */
const TIMEOUT_MS = Number(process.env.API_TIMEOUT_MS ?? 5000);

type Envelope<T> =
  | { success: true; data: T }
  | { success: false; message: string };

/**
 * Next.js bails out of static rendering by *throwing* a special error when a
 * request-time API is used. That is control flow, not a failure — swallowing it
 * would break static/dynamic detection, so it has to be re-thrown.
 */
function isNextControlFlowError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" && digest.startsWith("DYNAMIC_SERVER_USAGE");
}

type ListPayload<T> = { items: T[]; total: number };

/** Result metadata lets pages show a subtle "showing sample content" hint. */
export type Fetched<T> = { data: T; isFallback: boolean };

async function fetchJSON<T>(path: string): Promise<T | null> {
  if (!API_BASE_URL) return null;
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      // Always read through to the CMS so edits appear immediately. For a
      // high-traffic deployment, swap this for `next: { revalidate: 60 }`.
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.warn(`[api] ${path} responded ${response.status}`);
      return null;
    }

    const payload = (await response.json()) as Envelope<T>;
    if (!payload.success) {
      console.warn(`[api] ${path} failed: ${payload.message}`);
      return null;
    }
    return payload.data;
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[api] ${path} unreachable (${reason}) — using fallback data`);
    return null;
  }
}

/**
 * Fetches a list, falling back when the request fails *or* when the CMS has
 * no content yet — an empty section would otherwise look like a broken page.
 */
async function fetchList<T>(
  path: string,
  fallback: T[],
): Promise<Fetched<T[]>> {
  const payload = await fetchJSON<ListPayload<T>>(path);
  if (!payload || payload.items.length === 0) {
    return { data: fallback, isFallback: true };
  }
  return { data: payload.items, isFallback: false };
}

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams({ activeOnly: "true" });
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  return `?${search}`;
}

/* ------------------------------------------------------------------ reads */

export function getBanners() {
  return fetchList<Banner>(`/api/banners${query({})}`, fallbackBanners);
}

export function getNotices(limit?: number) {
  return fetchList<Notice>(`/api/notices${query({ limit })}`, fallbackNotices);
}

/** Notices filed under the "admission" category (never bundled samples). */
export function getAdmissionNotices(limit = 4) {
  return fetchList<Notice>(
    `/api/notices${query({ category: "admission", limit })}`,
    [],
  );
}

/** Published blog & news posts, newest first. */
export function getPosts(limit?: number) {
  return fetchList<Post>(`/api/posts${query({ limit })}`, []);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const { data } = await getPosts(200);
  return data.find((post) => post.slug === slug);
}

/** Classes (secondary) and groups (higher-secondary) for Academic Programs. */
export function getPrograms() {
  return fetchList<Program>(`/api/programs${query({})}`, []);
}

const EMPTY_ADMISSION_INFO: AdmissionInfo = {
  academicSession: "",
  eligibility: [],
  process: [],
  requiredDocuments: [],
  fees: [],
  importantDates: [],
  instructions: "",
};

/** Admission information; every list is empty until the CMS publishes it. */
export async function getAdmissionInfo(): Promise<Fetched<AdmissionInfo>> {
  const remote = await fetchJSON<Partial<AdmissionInfo>>("/api/admission-info");
  if (!remote) return { data: EMPTY_ADMISSION_INFO, isFallback: true };
  return { data: { ...EMPTY_ADMISSION_INFO, ...remote }, isFallback: false };
}

export type ApplicationSubmitResult =
  | { ok: true; applicationId: string }
  | {
      ok: false;
      reason: "closed" | "invalid" | "too-many" | "file" | "unavailable";
      message?: string;
    };

/**
 * Sends one admission application (fields + documents) to the CMS. The CMS is
 * the only place that decides whether admissions are open; this just relays
 * the answer. Nothing is ever reported as submitted unless the CMS confirmed.
 */
export async function submitApplication(
  form: FormData,
  clientAddress?: string,
): Promise<ApplicationSubmitResult> {
  if (!API_BASE_URL) {
    return { ok: false, reason: "unavailable" };
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/apply`, {
      method: "POST",
      body: form,
      cache: "no-store",
      // Files can be large; allow far longer than a normal read.
      signal: AbortSignal.timeout(Math.max(TIMEOUT_MS, 60_000)),
      headers: {
        Accept: "application/json",
        ...(clientAddress ? { "X-Forwarded-For": clientAddress } : {}),
      },
    });

    const payload = (await response.json().catch(() => null)) as
      | { success: true; data: { applicationId: string } }
      | { success: false; message?: string }
      | null;

    if (payload?.success) {
      return { ok: true, applicationId: payload.data.applicationId };
    }
    const message = payload && !payload.success ? payload.message : undefined;
    switch (response.status) {
      case 403:
        return { ok: false, reason: "closed", message };
      case 400:
      case 422:
        return { ok: false, reason: "invalid", message };
      case 413:
      case 415:
        return { ok: false, reason: "file", message };
      case 429:
        return { ok: false, reason: "too-many", message };
      default:
        return { ok: false, reason: "unavailable", message };
    }
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;
    console.warn("[api] application submit failed:", error);
    return { ok: false, reason: "unavailable" };
  }
}

export function getEvents(limit?: number) {
  return fetchList<SchoolEvent>(`/api/events${query({ limit })}`, fallbackEvents);
}

export function getGallery(limit?: number) {
  return fetchList<GalleryItem>(
    `/api/gallery${query({ limit })}`,
    fallbackGallery,
  );
}

export function getTeachers() {
  return fetchList<Teacher>(`/api/teachers${query({})}`, fallbackTeachers);
}

export function getFounders() {
  return fetchList<Founder>(`/api/founders${query({})}`, fallbackFounders);
}

export function getCommittee() {
  return fetchList<CommitteeMember>(
    `/api/committee${query({})}`,
    fallbackCommittee,
  );
}

export function getAlumni() {
  return fetchList<Alumni>(`/api/alumni${query({})}`, fallbackAlumni);
}

export function getStaff() {
  return fetchList<Staff>(`/api/staff${query({})}`, fallbackStaff);
}

/* --- DSHE-mandated disclosures --- */

export function getRecognitions() {
  return fetchList<Recognition>(
    `/api/recognitions${query({})}`,
    fallbackRecognitions,
  );
}

export function getClasses() {
  return fetchList<ClassInfo>(`/api/classes${query({})}`, fallbackClasses);
}

export function getLeadershipMessages() {
  return fetchList<LeadershipMessage>(
    `/api/messages${query({})}`,
    fallbackMessages,
  );
}

export function getVideos(limit?: number) {
  return fetchList<VideoItem>(`/api/videos${query({ limit })}`, fallbackVideos);
}

export function getUsefulLinks() {
  return fetchList<UsefulLink>(`/api/links${query({})}`, fallbackLinks);
}

export function getUniform() {
  return fetchList<UniformItem>(`/api/uniform${query({})}`, fallbackUniform);
}

export function getAcademicDocuments() {
  return fetchList<AcademicDocument>(
    `/api/documents${query({ limit: 200 })}`,
    fallbackDocuments,
  );
}

/** Drops empty values so they don't overwrite a populated fallback. */
function stripBlanks(
  source: Record<string, string | undefined> | undefined,
): Record<string, string> {
  if (!source) return {};
  return Object.fromEntries(
    Object.entries(source).filter(
      ([, value]) => typeof value === "string" && value.trim() !== "",
    ),
  ) as Record<string, string>;
}

/** Settings merge field-by-field so a half-filled CMS still renders fully. */
export async function getSettings(): Promise<Fetched<SiteSettings>> {
  const remote = await fetchJSON<Partial<SiteSettings>>("/api/settings");
  if (!remote) return { data: fallbackSettings, isFallback: true };

  const merged = { ...fallbackSettings };
  for (const [key, value] of Object.entries(remote)) {
    if (value === "" || value === null || value === undefined) continue;
    if (key in merged) {
      (merged as Record<string, unknown>)[key] = value;
    }
  }

  /*
   * Nested groups merge key-by-key rather than wholesale. The CMS commonly has
   * only some of these filled in, and replacing the whole object would blank
   * out the fields it hasn't reached yet.
   */
  merged.socialLinks = {
    ...fallbackSettings.socialLinks,
    ...stripBlanks(remote.socialLinks),
  };
  merged.infoCentre = {
    ...fallbackSettings.infoCentre,
    ...stripBlanks(remote.infoCentre),
  };
  merged.grievanceOfficer = {
    ...fallbackSettings.grievanceOfficer,
    ...stripBlanks(remote.grievanceOfficer),
  };

  return { data: merged, isFallback: false };
}

/**
 * Global search. The Dashboard already supports `?search=` on every list
 * endpoint (matching each resource's own searchFields), so this fans out over
 * the resources worth surfacing and merges the answers — no new backend
 * endpoint. There is no bundled fallback here on purpose: sample records would
 * pollute results, so an unreachable CMS yields `unavailable` instead.
 */
const SEARCH_PER_RESOURCE = 4;

export async function searchContent(
  term: string,
): Promise<SearchContentResult> {
  const text = term.trim().slice(0, MAX_QUERY_LENGTH);
  if (text.length < MIN_QUERY_LENGTH) return { hits: [], unavailable: false };

  const path = (resource: string) =>
    `/api/${resource}${query({ search: text, limit: SEARCH_PER_RESOURCE })}`;

  const [notices, events, teachers, staff, alumni, gallery, videos, documents] =
    await Promise.all([
      fetchJSON<ListPayload<Notice>>(path("notices")),
      fetchJSON<ListPayload<SchoolEvent>>(path("events")),
      fetchJSON<ListPayload<Teacher>>(path("teachers")),
      fetchJSON<ListPayload<Staff>>(path("staff")),
      fetchJSON<ListPayload<Alumni>>(path("alumni")),
      fetchJSON<ListPayload<GalleryItem>>(path("gallery")),
      fetchJSON<ListPayload<VideoItem>>(path("videos")),
      fetchJSON<ListPayload<AcademicDocument>>(path("documents")),
    ]);

  const responses = [notices, events, teachers, staff, alumni, gallery, videos, documents];
  if (responses.every((response) => response === null)) {
    return { hits: [], unavailable: true };
  }

  const hits: SearchHit[] = [
    ...(notices?.items ?? []).map((n) => ({
      id: n._id, type: "notice" as const, title: n.title, detail: n.category,
    })),
    ...(events?.items ?? []).map((e) => ({
      id: e._id, type: "event" as const, title: e.title, detail: e.venue,
    })),
    ...(teachers?.items ?? []).map((t) => ({
      id: t._id, type: "teacher" as const, title: t.name, detail: t.designation,
    })),
    ...(staff?.items ?? []).map((s) => ({
      id: s._id, type: "staff" as const, title: s.name, detail: s.designation,
    })),
    ...(alumni?.items ?? []).map((a) => ({
      id: a._id, type: "alumni" as const, title: a.name, detail: a.occupation,
    })),
    ...(gallery?.items ?? []).map((g) => ({
      id: g._id, type: "gallery" as const, title: g.title, detail: g.category,
    })),
    ...(videos?.items ?? []).map((v) => ({
      id: v._id, type: "video" as const, title: v.title, detail: v.category,
    })),
    ...(documents?.items ?? []).map((d) => ({
      id: d._id, type: "document" as const, title: d.title, detail: d.classLabel,
    })),
  ];

  return { hits, unavailable: false };
}

/** Single item by id, resolved from the list so fallback ids work too. */
export async function getNoticeById(
  id: string,
): Promise<Notice | undefined> {
  const { data } = await getNotices(200);
  return data.find((notice) => notice._id === id);
}

export async function getEventById(
  id: string,
): Promise<SchoolEvent | undefined> {
  const { data } = await getEvents(200);
  return data.find((event) => event._id === id);
}
