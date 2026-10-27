import { z } from "zod";

/**
 * The single source of truth describing every content type the CMS manages.
 *
 * Both the API layer (`src/app/api/[resource]/...`) and the dashboard UI read
 * from here, so adding a new content type to any school is:
 *   1. add a Mongoose model,
 *   2. add an entry below,
 *   3. register the model in `src/lib/resource-models.ts`.
 *
 * This module must stay free of server-only imports (no mongoose) because
 * client components import it to render forms and tables.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "boolean"
  | "select"
  | "image"
  | "tags";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  /** Keep the list view readable — long text is edit-only. */
  hideInTable?: boolean;
};

export type ResourceConfig = {
  slug: string;
  label: string;
  singular: string;
  description: string;
  /** Sidebar grouping. */
  group: "Content" | "People" | "Institution";
  fields: readonly FieldDef[];
  createSchema: z.ZodTypeAny;
  updateSchema: z.ZodTypeAny;
  defaultSort: Record<string, 1 | -1>;
  searchFields: readonly string[];
  /** Public requests use this filter before applying visitor query parameters. */
  publicFilter?: Record<string, unknown>;
};

export const DEFAULT_PUBLIC_FILTER = { isActive: true } as const;

/** Optional free-text that should persist as "" rather than undefined. */
const text = () => z.string().trim().default("");
const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

/**
 * An empty date input arrives as "" or null. Left as-is, `z.coerce.date()`
 * would turn those into the Unix epoch (1 Jan 1970), so normalise them to
 * `undefined` first — that way optional dates stay unset and defaulted ones
 * fall back to their default.
 */
const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

const optionalDate = () =>
  z.preprocess(emptyToUndefined, z.coerce.date().optional());

const requiredDate = () => z.preprocess(emptyToUndefined, z.coerce.date());

const dateDefaultingToNow = () =>
  z.preprocess(
    emptyToUndefined,
    z.coerce.date().default(() => new Date()),
  );

const NOTICE_CATEGORIES = [
  "general",
  "exam",
  "holiday",
  "event",
  "urgent",
  "admission",
] as const;
const EVENT_CATEGORIES = [
  "academic",
  "cultural",
  "sports",
  "national-day",
  "other",
] as const;
const GALLERY_CATEGORIES = [
  "campus",
  "events",
  "sports",
  "classroom",
  "cultural",
  "other",
] as const;

/* Categories backing the DSHE-mandated disclosures. */
const RECOGNITION_CATEGORIES = [
  "permission",
  "recognition",
  "affiliation",
  "other",
] as const;
const DOCUMENT_CATEGORIES = [
  "routine",
  "syllabus",
  "book-list",
  "exam-routine",
  "other",
] as const;
const SHIFTS = ["morning", "day", "evening", "none"] as const;
const DOCUMENT_SHIFTS = ["none", "morning", "day", "evening"] as const;
const CLASS_GROUPS = ["none", "science", "humanities", "business"] as const;
const STAFF_TYPES = ["administrative", "support"] as const;
const VERSIONS = ["bangla", "english", "both"] as const;
const POST_CATEGORIES = ["academic", "campus-life", "events", "achievements", "student-activities"] as const;
const POST_STATUSES = ["draft", "published"] as const;
const PROGRAM_LEVELS = ["secondary", "higher-secondary"] as const;
const LEADERSHIP_ROLES = [
  "chairman",
  "head-teacher",
  "assistant-head-teacher",
  "other",
] as const;
const VIDEO_CATEGORIES = [
  "event",
  "campus",
  "academic",
  "cultural",
  "other",
] as const;
const LINK_CATEGORIES = [
  "government",
  "education-board",
  "service",
  "other",
] as const;
const UNIFORM_AUDIENCES = ["boys", "girls", "all", "sports", "winter"] as const;

/* -------------------------------------------------------------- schemas */

const bannerCreate = z.object({
  title: requiredText("Title"),
  subtitle: text(),
  imageUrl: text(),
  ctaLabel: text(),
  ctaLink: text(),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const noticeCreate = z.object({
  title: requiredText("Title"),
  description: text(),
  category: z.enum(NOTICE_CATEGORIES).default("general"),
  attachmentUrl: text(),
  publishedAt: dateDefaultingToNow(),
  expiresAt: optionalDate(),
  isPinned: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
});

const eventCreate = z.object({
  title: requiredText("Title"),
  description: text(),
  category: z.enum(EVENT_CATEGORIES).default("other"),
  startDate: requiredDate(),
  endDate: optionalDate(),
  venue: text(),
  imageUrl: text(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
});

const galleryCreate = z.object({
  title: requiredText("Title"),
  imageUrl: requiredText("Image"),
  caption: text(),
  category: z.enum(GALLERY_CATEGORIES).default("other"),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const alumniCreate = z.object({
  name: requiredText("Name"),
  photoUrl: text(),
  passingYear: text(),
  occupation: text(),
  testimonial: text(),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const founderCreate = z.object({
  name: requiredText("Name"),
  photoUrl: text(),
  designation: text(),
  education: text(),
  message: text(),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const committeeCreate = z.object({
  name: requiredText("Name"),
  photoUrl: text(),
  designation: text(),
  education: text(),
  contactNumber: text(),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const leadershipMessageCreate = z.object({
  name: requiredText("Name"),
  role: z.enum(LEADERSHIP_ROLES).default("head-teacher"),
  designation: text(),
  photoUrl: text(),
  message: text(),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const videoCreate = z.object({
  title: requiredText("Title"),
  videoUrl: requiredText("Video link"),
  thumbnailUrl: text(),
  description: text(),
  category: z.enum(VIDEO_CATEGORIES).default("other"),
  publishedAt: dateDefaultingToNow(),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const usefulLinkCreate = z.object({
  title: requiredText("Title"),
  url: requiredText("URL"),
  description: text(),
  category: z.enum(LINK_CATEGORIES).default("government"),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const uniformCreate = z.object({
  title: requiredText("Title"),
  audience: z.enum(UNIFORM_AUDIENCES).default("all"),
  classLabel: text(),
  description: text(),
  imageUrl: text(),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const recognitionCreate = z.object({
  title: requiredText("Title"),
  category: z.enum(RECOGNITION_CATEGORIES).default("recognition"),
  level: text(),
  issuedBy: text(),
  memoNumber: text(),
  issueDate: optionalDate(),
  expiryDate: optionalDate(),
  documentUrl: text(),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const classInfoCreate = z.object({
  className: requiredText("Class"),
  approvedSections: z.coerce.number().default(1),
  shift: z.enum(SHIFTS).default("day"),
  version: z.enum(VERSIONS).default("bangla"),
  group: z.enum(CLASS_GROUPS).default("none"),
  boys: z.coerce.number().default(0),
  girls: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const academicDocumentCreate = z.object({
  title: requiredText("Title"),
  category: z.enum(DOCUMENT_CATEGORIES).default("routine"),
  classLabel: text(),
  academicYear: text(),
  shift: z.enum(DOCUMENT_SHIFTS).default("none"),
  fileUrl: text(),
  publishedAt: dateDefaultingToNow(),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const staffCreate = z.object({
  name: requiredText("Name"),
  photoUrl: text(),
  designation: text(),
  staffType: z.enum(STAFF_TYPES).default("administrative"),
  department: text(),
  phone: text(),
  joiningDate: optionalDate(),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const teacherCreate = z.object({
  name: requiredText("Name"),
  photoUrl: text(),
  designation: text(),
  subject: text(),
  qualification: text(),
  email: text(),
  phone: text(),
  joiningDate: optionalDate(),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

const slug = () => z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens").optional(),
);

const postCreate = z.object({
  title: requiredText("Title"),
  slug: slug(),
  excerpt: text(),
  content: text(),
  imageUrl: text(),
  category: z.enum(POST_CATEGORIES).default("academic"),
  author: text(),
  status: z.enum(POST_STATUSES).default("draft"),
  isDemo: z.boolean().default(false),
  publishedAt: dateDefaultingToNow(),
});

const programCreate = z.object({
  title: requiredText("Title"),
  level: z.enum(PROGRAM_LEVELS).default("secondary"),
  description: text(),
  isActive: z.boolean().default(true),
  isDemo: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

/* ------------------------------------------------------------- registry */

export const RESOURCES = {
  banners: {
    slug: "banners",
    label: "Banners",
    singular: "Banner",
    description: "Homepage hero slides.",
    group: "Content",
    createSchema: bannerCreate,
    updateSchema: bannerCreate.partial(),
    defaultSort: { order: 1, createdAt: -1 },
    searchFields: ["title", "subtitle"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "imageUrl", label: "Image", type: "image" },
      { name: "ctaLabel", label: "Button label", type: "text", hideInTable: true },
      { name: "ctaLink", label: "Button link", type: "text", hideInTable: true },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  notices: {
    slug: "notices",
    label: "Notices",
    singular: "Notice",
    description: "Announcements shown on the public site.",
    group: "Content",
    createSchema: noticeCreate,
    updateSchema: noticeCreate.partial(),
    defaultSort: { isPinned: -1, publishedAt: -1 },
    searchFields: ["title", "description"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        hideInTable: true,
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: NOTICE_CATEGORIES,
      },
      {
        name: "attachmentUrl",
        label: "Attachment",
        type: "image",
        hideInTable: true,
        helpText: "PDF or image link shown as a download button.",
      },
      { name: "publishedAt", label: "Published", type: "date" },
      { name: "expiresAt", label: "Expires", type: "date", hideInTable: true },
      { name: "isPinned", label: "Pinned", type: "boolean" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  events: {
    slug: "events",
    label: "Events",
    singular: "Event",
    description: "Upcoming and past school events.",
    group: "Content",
    createSchema: eventCreate,
    updateSchema: eventCreate.partial(),
    defaultSort: { startDate: -1 },
    searchFields: ["title", "description", "venue"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        hideInTable: true,
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: EVENT_CATEGORIES,
      },
      { name: "startDate", label: "Start date", type: "date", required: true },
      { name: "endDate", label: "End date", type: "date", hideInTable: true },
      { name: "venue", label: "Venue", type: "text" },
      { name: "imageUrl", label: "Image", type: "image", hideInTable: true },
      { name: "isFeatured", label: "Featured", type: "boolean" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  gallery: {
    slug: "gallery",
    label: "Gallery",
    singular: "Photo",
    description: "Campus and event photographs.",
    group: "Content",
    createSchema: galleryCreate,
    updateSchema: galleryCreate.partial(),
    defaultSort: { order: 1, createdAt: -1 },
    searchFields: ["title", "tags"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "imageUrl", label: "Image", type: "image", required: true },
      { name: "caption", label: "Caption", type: "text", hideInTable: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: GALLERY_CATEGORIES,
      },
      { name: "tags", label: "Tags", type: "tags", hideInTable: true },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  videos: {
    slug: "videos",
    label: "Video Gallery",
    singular: "Video",
    description: "Embedded videos of events and campus life.",
    group: "Content",
    createSchema: videoCreate,
    updateSchema: videoCreate.partial(),
    defaultSort: { order: 1, publishedAt: -1 },
    searchFields: ["title", "description"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "videoUrl",
        label: "Video link",
        type: "text",
        required: true,
        helpText: "Paste a YouTube or Facebook video link.",
      },
      {
        name: "thumbnailUrl",
        label: "Thumbnail",
        type: "image",
        hideInTable: true,
        helpText: "Optional — YouTube thumbnails are found automatically.",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        hideInTable: true,
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: VIDEO_CATEGORIES,
      },
      { name: "publishedAt", label: "Published", type: "date" },
      { name: "order", label: "Order", type: "number", hideInTable: true },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  uniform: {
    slug: "uniform",
    label: "School Dress",
    singular: "Uniform",
    description: "What students wear, by group and season.",
    group: "Content",
    createSchema: uniformCreate,
    updateSchema: uniformCreate.partial(),
    defaultSort: { order: 1, createdAt: -1 },
    searchFields: ["title", "description", "classLabel"],
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        placeholder: "e.g. Boys — daily uniform",
      },
      {
        name: "audience",
        label: "For",
        type: "select",
        options: UNIFORM_AUDIENCES,
      },
      { name: "classLabel", label: "Classes", type: "text" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        hideInTable: true,
        helpText: "Colours, fabric and any rules on shoes, badge or tie.",
      },
      { name: "imageUrl", label: "Photo", type: "image" },
      { name: "order", label: "Order", type: "number", hideInTable: true },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  links: {
    slug: "links",
    label: "Useful Links",
    singular: "Link",
    description: "Ministry, board and service links shown in the footer.",
    group: "Institution",
    createSchema: usefulLinkCreate,
    updateSchema: usefulLinkCreate.partial(),
    defaultSort: { order: 1, title: 1 },
    searchFields: ["title", "url"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "url",
        label: "URL",
        type: "text",
        required: true,
        placeholder: "https://…",
      },
      {
        name: "description",
        label: "Description",
        type: "text",
        hideInTable: true,
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: LINK_CATEGORIES,
      },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  messages: {
    slug: "messages",
    label: "Chairman & Head Teacher",
    singular: "Message",
    description: "Photo and message from the chairman and head teacher.",
    group: "People",
    createSchema: leadershipMessageCreate,
    updateSchema: leadershipMessageCreate.partial(),
    defaultSort: { order: 1, createdAt: -1 },
    searchFields: ["name", "designation"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      {
        name: "role",
        label: "Role",
        type: "select",
        options: LEADERSHIP_ROLES,
      },
      { name: "designation", label: "Designation", type: "text" },
      { name: "photoUrl", label: "Photo", type: "image" },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        hideInTable: true,
        helpText: "Their address to students, parents and visitors.",
      },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  recognitions: {
    slug: "recognitions",
    label: "Permission & Recognition",
    singular: "Document",
    description:
      "Teaching permission, recognition and affiliation records required by DSHE.",
    group: "Institution",
    createSchema: recognitionCreate,
    updateSchema: recognitionCreate.partial(),
    defaultSort: { order: 1, issueDate: -1 },
    searchFields: ["title", "issuedBy", "memoNumber"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "category",
        label: "Type",
        type: "select",
        options: RECOGNITION_CATEGORIES,
      },
      {
        name: "level",
        label: "Level",
        type: "text",
        placeholder: "e.g. Secondary",
      },
      { name: "issuedBy", label: "Issued by", type: "text" },
      { name: "memoNumber", label: "Memo no.", type: "text" },
      { name: "issueDate", label: "Issue date", type: "date" },
      {
        name: "expiryDate",
        label: "Valid until",
        type: "date",
        hideInTable: true,
      },
      {
        name: "documentUrl",
        label: "Scanned document",
        type: "image",
        hideInTable: true,
        helpText: "Upload the certificate or memo so visitors can verify it.",
      },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  classes: {
    slug: "classes",
    label: "Classes & Students",
    singular: "Class",
    description:
      "Approved sections per class, and student numbers split by gender.",
    group: "Institution",
    createSchema: classInfoCreate,
    updateSchema: classInfoCreate.partial(),
    defaultSort: { order: 1, className: 1 },
    searchFields: ["className"],
    fields: [
      { name: "className", label: "Class", type: "text", required: true },
      {
        name: "approvedSections",
        label: "Approved sections",
        type: "number",
      },
      { name: "shift", label: "Shift", type: "select", options: SHIFTS },
      { name: "version", label: "Version", type: "select", options: VERSIONS },
      { name: "group", label: "Group", type: "select", options: CLASS_GROUPS },
      { name: "boys", label: "Boys", type: "number" },
      { name: "girls", label: "Girls", type: "number" },
      { name: "order", label: "Order", type: "number", hideInTable: true },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  documents: {
    slug: "documents",
    label: "Routine & Syllabus",
    singular: "Document",
    description: "Class routines, syllabuses and book lists for download.",
    group: "Institution",
    createSchema: academicDocumentCreate,
    updateSchema: academicDocumentCreate.partial(),
    defaultSort: { order: 1, publishedAt: -1 },
    searchFields: ["title", "classLabel", "academicYear"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "category",
        label: "Type",
        type: "select",
        options: DOCUMENT_CATEGORIES,
      },
      {
        name: "classLabel",
        label: "Class",
        type: "text",
        placeholder: "e.g. Class 6",
      },
      { name: "academicYear", label: "Year", type: "text" },
      {
        name: "fileUrl",
        label: "File",
        type: "image",
        hideInTable: true,
        helpText: "PDF or image. Visitors get a download button.",
      },
      { name: "publishedAt", label: "Published", type: "date" },
      { name: "order", label: "Order", type: "number", hideInTable: true },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  teachers: {
    slug: "teachers",
    label: "Teachers",
    singular: "Teacher",
    description: "Teaching staff directory.",
    group: "People",
    createSchema: teacherCreate,
    updateSchema: teacherCreate.partial(),
    defaultSort: { order: 1, name: 1 },
    searchFields: ["name", "designation", "subject"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "photoUrl", label: "Photo", type: "image" },
      { name: "designation", label: "Designation", type: "text" },
      { name: "subject", label: "Subject", type: "text" },
      {
        name: "qualification",
        label: "Qualification",
        type: "text",
        hideInTable: true,
      },
      { name: "email", label: "Email", type: "text", hideInTable: true },
      { name: "phone", label: "Phone", type: "text", hideInTable: true },
      {
        name: "joiningDate",
        label: "Joining date",
        type: "date",
        hideInTable: true,
      },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  staff: {
    slug: "staff",
    label: "Staff",
    singular: "Staff member",
    description: "Non-teaching employees — office, library, support.",
    group: "People",
    createSchema: staffCreate,
    updateSchema: staffCreate.partial(),
    defaultSort: { order: 1, name: 1 },
    searchFields: ["name", "designation", "department"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "photoUrl", label: "Photo", type: "image" },
      { name: "designation", label: "Designation", type: "text" },
      { name: "staffType", label: "Staff type", type: "select", options: STAFF_TYPES },
      { name: "department", label: "Department", type: "text" },
      { name: "phone", label: "Phone", type: "text", hideInTable: true },
      {
        name: "joiningDate",
        label: "Joining date",
        type: "date",
        hideInTable: true,
      },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  founders: {
    slug: "founders",
    label: "Founders",
    singular: "Founder",
    description: "Founder profiles and messages.",
    group: "People",
    createSchema: founderCreate,
    updateSchema: founderCreate.partial(),
    defaultSort: { order: 1, createdAt: -1 },
    searchFields: ["name", "designation"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "photoUrl", label: "Photo", type: "image" },
      { name: "designation", label: "Designation", type: "text" },
      {
        name: "education",
        label: "Education",
        type: "text",
        hideInTable: true,
      },
      { name: "message", label: "Message", type: "textarea", hideInTable: true },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  committee: {
    slug: "committee",
    label: "Managing Committee",
    singular: "Member",
    description: "Governing body members.",
    group: "People",
    createSchema: committeeCreate,
    updateSchema: committeeCreate.partial(),
    defaultSort: { order: 1, createdAt: -1 },
    searchFields: ["name", "designation"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "photoUrl", label: "Photo", type: "image" },
      { name: "designation", label: "Designation", type: "text" },
      {
        name: "education",
        label: "Education",
        type: "text",
        hideInTable: true,
      },
      { name: "contactNumber", label: "Contact", type: "text", hideInTable: true },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  alumni: {
    slug: "alumni",
    label: "Alumni",
    singular: "Alumnus",
    description: "Notable former students.",
    group: "People",
    createSchema: alumniCreate,
    updateSchema: alumniCreate.partial(),
    defaultSort: { order: 1, createdAt: -1 },
    searchFields: ["name", "occupation"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "photoUrl", label: "Photo", type: "image" },
      { name: "passingYear", label: "Passing year", type: "text" },
      { name: "occupation", label: "Occupation", type: "text" },
      {
        name: "testimonial",
        label: "Testimonial",
        type: "textarea",
        hideInTable: true,
      },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },

  posts: {
    slug: "posts",
    label: "Blog & News",
    singular: "Post",
    description: "News and stories. Only published posts appear on the website.",
    group: "Content",
    createSchema: postCreate,
    updateSchema: postCreate.partial(),
    defaultSort: { publishedAt: -1, createdAt: -1 },
    searchFields: ["title", "excerpt", "author"],
    publicFilter: { status: "published" },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea", hideInTable: true, helpText: "One or two sentences shown on the list page." },
      { name: "content", label: "Content", type: "textarea", hideInTable: true },
      { name: "imageUrl", label: "Featured image", type: "image" },
      { name: "category", label: "Category", type: "select", options: POST_CATEGORIES },
      { name: "author", label: "Author", type: "text", hideInTable: true },
      { name: "status", label: "Status", type: "select", options: POST_STATUSES, helpText: "Draft posts are never shown on the website." },
      { name: "publishedAt", label: "Published", type: "date" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },
  programs: {
    slug: "programs",
    label: "Academic Programs",
    singular: "Program",
    description: "The classes taught and the higher-secondary groups shown on the Academic Programs page.",
    group: "Institution",
    createSchema: programCreate,
    updateSchema: programCreate.partial(),
    defaultSort: { order: 1, createdAt: 1 },
    searchFields: ["title", "description"],
    fields: [
      { name: "title", label: "Name", type: "text", required: true, placeholder: "e.g. Class 6, or Science" },
      { name: "level", label: "Level", type: "select", options: PROGRAM_LEVELS, helpText: "Secondary shows as a class tile; higher-secondary as a group card." },
      { name: "description", label: "Description", type: "textarea", hideInTable: true },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "isDemo", label: "Demo content", type: "boolean" },
    ],
  },
} as const satisfies Record<string, ResourceConfig>;

export type ResourceSlug = keyof typeof RESOURCES;

/**
 * `as const` above keeps literal types (useful for `ResourceSlug`) but drops
 * optional properties like `required` from each field. Components should read
 * through this widened view instead.
 */
export const RESOURCE_MAP: Record<ResourceSlug, ResourceConfig> = RESOURCES;

export const RESOURCE_SLUGS = Object.keys(RESOURCES) as ResourceSlug[];

export function isResourceSlug(value: string): value is ResourceSlug {
  return Object.prototype.hasOwnProperty.call(RESOURCES, value);
}

export function getResourceConfig(slug: string): ResourceConfig | null {
  return isResourceSlug(slug) ? (RESOURCES[slug] as ResourceConfig) : null;
}

/** Settings is a singleton, so it lives outside the CRUD registry. */
export const settingsSchema = z.object({
  siteName: text(),
  shortName: text(),
  tagline: text(),
  about: text(),
  missionStatement: text(),
  visionStatement: text(),
  establishedYear: text(),
  eiin: text(),
  mpoCode: text(),
  institutionType: text(),
  institutionCode: text(),
  educationBoard: text(),
  mpoStatus: z.enum(["", "enlisted", "pending", "not-enlisted"]).default(""),
  admissionOpen: z.boolean().default(false),
  teachingInfo: text(),
  administrativeInfo: text(),
  infoCentre: z
    .object({ address: text(), mobile: text(), phone: text(), email: text() })
    .partial()
    .default({}),
  grievanceOfficer: z
    .object({
      name: text(),
      designation: text(),
      address: text(),
      mobile: text(),
      phone: text(),
      email: text(),
    })
    .partial()
    .default({}),
  logoUrl: text(),
  faviconUrl: text(),
  address: text(),
  phone: text(),
  mobile: text(),
  email: text(),
  officeHours: text(),
  mapEmbedUrl: text(),
  socialLinks: z
    .object({
      facebook: text(),
      youtube: text(),
      linkedin: text(),
      instagram: text(),
    })
    .partial()
    .default({}),
  themeColor: text(),
  primaryColor: text(),
});
