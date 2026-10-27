import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * All public-facing content types live here. They share a deliberately similar
 * shape (`isActive`, `order`, timestamps) so the generic CRUD route factory in
 * `src/lib/crud.ts` and the generic dashboard table can handle every one of
 * them without special cases.
 */

function buildModel<S extends Schema>(name: string, schema: S) {
  type Doc = InferSchemaType<S>;
  return ((models[name] as Model<Doc>) ?? model<Doc>(name, schema)) as Model<Doc>;
}

/* ------------------------------------------------------------------ Banner */
const BannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaLink: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type BannerDoc = InferSchemaType<typeof BannerSchema>;
export const Banner = buildModel("Banner", BannerSchema);

/* ------------------------------------------------------------------ Notice */
const NoticeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["general", "exam", "holiday", "event", "urgent", "admission"],
      default: "general",
    },
    attachmentUrl: { type: String, default: "" },
    publishedAt: { type: Date, default: () => new Date() },
    expiresAt: { type: Date },
    isPinned: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export type NoticeDoc = InferSchemaType<typeof NoticeSchema>;
export const Notice = buildModel("Notice", NoticeSchema);

/* ------------------------------------------------------------------- Event */
const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["academic", "cultural", "sports", "national-day", "other"],
      default: "other",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    venue: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export type EventDoc = InferSchemaType<typeof EventSchema>;
export const Event = buildModel("Event", EventSchema);

/* ------------------------------------------------------------- GalleryItem */
const GalleryItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    category: {
      type: String,
      enum: ["campus", "events", "sports", "classroom", "cultural", "other"],
      default: "other",
    },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type GalleryItemDoc = InferSchemaType<typeof GalleryItemSchema>;
export const GalleryItem = buildModel("GalleryItem", GalleryItemSchema);

/* ------------------------------------------------------------------ Alumni */
const AlumniSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: "" },
    passingYear: { type: String, default: "" },
    occupation: { type: String, default: "" },
    testimonial: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type AlumniDoc = InferSchemaType<typeof AlumniSchema>;
export const Alumni = buildModel("Alumni", AlumniSchema);

/* ----------------------------------------------------------------- Founder */
const FounderSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: "" },
    designation: { type: String, default: "Founder" },
    education: { type: String, default: "" },
    message: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type FounderDoc = InferSchemaType<typeof FounderSchema>;
export const Founder = buildModel("Founder", FounderSchema);

/* -------------------------------------------------------- CommitteeMember */
const CommitteeMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: "" },
    designation: { type: String, default: "" },
    education: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type CommitteeMemberDoc = InferSchemaType<typeof CommitteeMemberSchema>;
export const CommitteeMember = buildModel(
  "CommitteeMember",
  CommitteeMemberSchema,
);

/* ------------------------------------------------------- LeadershipMessage */
/** সভাপতি ও প্রধান শিক্ষকের ছবি ও বাণী — photo and message from leadership. */
const LeadershipMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["chairman", "head-teacher", "assistant-head-teacher", "other"],
      default: "head-teacher",
    },
    designation: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    message: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type LeadershipMessageDoc = InferSchemaType<typeof LeadershipMessageSchema>;
export const LeadershipMessage = buildModel(
  "LeadershipMessage",
  LeadershipMessageSchema,
);

/* --------------------------------------------------------------- VideoItem */
/** ভিডিও গ্যালারি — embedded videos, kept separate from the photo gallery. */
const VideoItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["event", "campus", "academic", "cultural", "other"],
      default: "other",
    },
    publishedAt: { type: Date, default: () => new Date() },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type VideoItemDoc = InferSchemaType<typeof VideoItemSchema>;
export const VideoItem = buildModel("VideoItem", VideoItemSchema);

/* -------------------------------------------------------------- UsefulLink */
/** প্রয়োজনীয় সাইটের লিংকসমূহ — links to ministry, board and other services. */
const UsefulLinkSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["government", "education-board", "service", "other"],
      default: "government",
    },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type UsefulLinkDoc = InferSchemaType<typeof UsefulLinkSchema>;
export const UsefulLink = buildModel("UsefulLink", UsefulLinkSchema);

/* ------------------------------------------------------------- UniformItem */
/** School dress — what students wear, per group. */
const UniformItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    audience: {
      type: String,
      enum: ["boys", "girls", "all", "sports", "winter"],
      default: "all",
    },
    classLabel: { type: String, default: "" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type UniformItemDoc = InferSchemaType<typeof UniformItemSchema>;
export const UniformItem = buildModel("UniformItem", UniformItemSchema);

/* ------------------------------------------------------------- Recognition */
/** DSHE requires published proof of teaching permission and recognition. */
const RecognitionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["permission", "recognition", "affiliation", "other"],
      default: "recognition",
    },
    level: { type: String, default: "" },
    issuedBy: { type: String, default: "" },
    memoNumber: { type: String, default: "" },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    documentUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type RecognitionDoc = InferSchemaType<typeof RecognitionSchema>;
export const Recognition = buildModel("Recognition", RecognitionSchema);

/* --------------------------------------------------------------- ClassInfo */
/**
 * Covers two DSHE requirements at once, because they are reported per class:
 * approved sections, and student counts split by gender.
 */
const ClassInfoSchema = new Schema(
  {
    className: { type: String, required: true, trim: true },
    approvedSections: { type: Number, default: 1 },
    shift: {
      type: String,
      enum: ["morning", "day", "evening", "none"],
      default: "day",
    },
    version: {
      type: String,
      enum: ["bangla", "english", "both"],
      default: "bangla",
    },
    /** Higher-secondary classes can be separated by academic group. */
    group: {
      type: String,
      enum: ["none", "science", "humanities", "business"],
      default: "none",
    },
    boys: { type: Number, default: 0 },
    girls: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type ClassInfoDoc = InferSchemaType<typeof ClassInfoSchema>;
export const ClassInfo = buildModel("ClassInfo", ClassInfoSchema);

/* -------------------------------------------------------- AcademicDocument */
/** Class routines, syllabuses and book lists published for download. */
const AcademicDocumentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["routine", "syllabus", "book-list", "exam-routine", "other"],
      default: "routine",
    },
    classLabel: { type: String, default: "" },
    academicYear: { type: String, default: "" },
    shift: {
      type: String,
      enum: ["none", "morning", "day", "evening"],
      default: "none",
    },
    fileUrl: { type: String, default: "" },
    publishedAt: { type: Date, default: () => new Date() },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type AcademicDocumentDoc = InferSchemaType<typeof AcademicDocumentSchema>;
export const AcademicDocument = buildModel(
  "AcademicDocument",
  AcademicDocumentSchema,
);

/* ------------------------------------------------------------------- Staff */
/** Non-teaching employees; DSHE asks for teachers *and* staff. */
const StaffSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: "" },
    designation: { type: String, default: "" },
    /** Which public staff list contains the record. */
    staffType: {
      type: String,
      enum: ["administrative", "support"],
      default: "administrative",
    },
    department: { type: String, default: "" },
    phone: { type: String, default: "" },
    joiningDate: { type: Date },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type StaffDoc = InferSchemaType<typeof StaffSchema>;
export const Staff = buildModel("Staff", StaffSchema);

/* ----------------------------------------------------------------- Teacher */
const TeacherSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: "" },
    designation: { type: String, default: "" },
    subject: { type: String, default: "" },
    qualification: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    joiningDate: { type: Date },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type TeacherDoc = InferSchemaType<typeof TeacherSchema>;
export const Teacher = buildModel("Teacher", TeacherSchema);

/* -------------------------------------------------------------------- Post */
/** Blog and news posts. Only published posts are returned publicly. */
export const POST_CATEGORIES = [
  "academic",
  "campus-life",
  "events",
  "achievements",
  "student-activities",
] as const;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const PostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    category: { type: String, enum: POST_CATEGORIES, default: "academic" },
    author: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    isDemo: { type: Boolean, default: false },
    publishedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

/** Assign a URL-safe stable slug; non-Latin titles get a short fallback. */
PostSchema.pre("validate", async function () {
  if (this.slug) return;
  const base = slugify(this.title) || "post";
  const PostModel = this.constructor as Model<unknown>;
  let candidate = base === "post" ? `post-${Math.random().toString(36).slice(2, 8)}` : base;
  while (await PostModel.exists({ slug: candidate })) {
    candidate = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }
  this.slug = candidate;
});

export type PostDoc = InferSchemaType<typeof PostSchema>;
export const Post = buildModel("Post", PostSchema);

/* ------------------------------------------------------------------ Program */
/** Classes and higher-secondary groups displayed on the academic page. */
const ProgramSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    level: { type: String, enum: ["secondary", "higher-secondary"], default: "secondary" },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type ProgramDoc = InferSchemaType<typeof ProgramSchema>;
export const Program = buildModel("Program", ProgramSchema);
