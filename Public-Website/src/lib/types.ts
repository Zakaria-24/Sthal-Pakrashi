/**
 * Shapes returned by the Dashboard API. Kept as plain types (not imported from
 * the Dashboard project) so this site stays a standalone deployment.
 */

export type Banner = {
  isDemo?: boolean;
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaLink: string;
  isActive: boolean;
  order: number;
};

export type Notice = {
  isDemo?: boolean;
  _id: string;
  title: string;
  description: string;
  category: "general" | "exam" | "holiday" | "event" | "urgent" | "admission";
  attachmentUrl: string;
  publishedAt: string;
  expiresAt?: string | null;
  isPinned: boolean;
  isActive: boolean;
};

export type SchoolEvent = {
  isDemo?: boolean;
  _id: string;
  title: string;
  description: string;
  category: "academic" | "cultural" | "sports" | "national-day" | "other";
  startDate: string;
  endDate?: string | null;
  venue: string;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
};

export type GalleryItem = {
  isDemo?: boolean;
  _id: string;
  title: string;
  imageUrl: string;
  caption?: string;
  category: string;
  tags: string[];
  isActive: boolean;
  order: number;
};

export type Teacher = {
  isDemo?: boolean;
  _id: string;
  name: string;
  photoUrl: string;
  designation: string;
  subject: string;
  qualification: string;
  email: string;
  phone: string;
  isActive: boolean;
  order: number;
};

export type Founder = {
  isDemo?: boolean;
  _id: string;
  name: string;
  photoUrl: string;
  designation: string;
  education: string;
  message: string;
  isActive: boolean;
  order: number;
};

export type CommitteeMember = {
  isDemo?: boolean;
  _id: string;
  name: string;
  photoUrl: string;
  designation: string;
  education: string;
  contactNumber: string;
  isActive: boolean;
  order: number;
};

/** Photo and message from the chairman or head teacher. */
export type LeadershipMessage = {
  isDemo?: boolean;
  _id: string;
  name: string;
  role: "chairman" | "head-teacher" | "assistant-head-teacher" | "other";
  designation: string;
  photoUrl: string;
  message: string;
  isActive: boolean;
  order: number;
};

/** Embedded video for the video gallery. */
export type VideoItem = {
  isDemo?: boolean;
  _id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  category: string;
  publishedAt: string;
  isActive: boolean;
  order: number;
};

/** External link shown in the footer. */
export type UsefulLink = {
  isDemo?: boolean;
  _id: string;
  title: string;
  url: string;
  description: string;
  category: "government" | "education-board" | "service" | "other";
  isActive: boolean;
  order: number;
};

/** School dress requirement for a group of students. */
export type UniformItem = {
  isDemo?: boolean;
  _id: string;
  title: string;
  audience: "boys" | "girls" | "all" | "sports" | "winter";
  classLabel: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
};

/** Teaching permission / recognition record (DSHE disclosure). */
export type Recognition = {
  isDemo?: boolean;
  _id: string;
  title: string;
  category: "permission" | "recognition" | "affiliation" | "other";
  level: string;
  issuedBy: string;
  memoNumber: string;
  issueDate?: string | null;
  expiryDate?: string | null;
  documentUrl: string;
  isActive: boolean;
  order: number;
};

/** Approved sections and student numbers for one class (DSHE disclosure). */
export type ClassInfo = {
  isDemo?: boolean;
  _id: string;
  className: string;
  approvedSections: number;
  shift: "morning" | "day" | "evening" | "none";
  version: "bangla" | "english" | "both";
  /** Higher-secondary group; "none" (or absent) for ungrouped classes. */
  group?: "none" | "science" | "humanities" | "business";
  boys: number;
  girls: number;
  isActive: boolean;
  order: number;
};

/** Downloadable routine, syllabus or book list. */
export type AcademicDocument = {
  isDemo?: boolean;
  _id: string;
  title: string;
  category: "routine" | "syllabus" | "book-list" | "exam-routine" | "other";
  classLabel: string;
  academicYear: string;
  shift?: "none" | "morning" | "day" | "evening";
  fileUrl: string;
  publishedAt: string;
  isActive: boolean;
  order: number;
};

/** Non-teaching employee. */
export type Staff = {
  isDemo?: boolean;
  _id: string;
  name: string;
  photoUrl: string;
  designation: string;
  /** Which public list the person belongs to. Absent on older records. */
  staffType?: "administrative" | "support";
  department: string;
  phone: string;
  isActive: boolean;
  order: number;
};

export type Alumni = {
  isDemo?: boolean;
  _id: string;
  name: string;
  photoUrl: string;
  passingYear: string;
  occupation: string;
  testimonial: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
};

export type SiteSettings = {
  siteName: string;
  shortName: string;
  tagline: string;
  about: string;
  missionStatement: string;
  visionStatement: string;
  establishedYear: string;
  eiin: string;
  mpoCode: string;
  institutionType: string;
  institutionCode: string;
  /** Education board the institution is affiliated with (CMS-managed). */
  educationBoard: string;
  /** "" = not published. */
  mpoStatus: "" | "enlisted" | "pending" | "not-enlisted";
  /** Whether online applications are being accepted. */
  admissionOpen: boolean;
  teachingInfo: string;
  administrativeInfo: string;
  infoCentre: {
    address?: string;
    mobile?: string;
    phone?: string;
    email?: string;
  };
  grievanceOfficer: {
    name?: string;
    designation?: string;
    address?: string;
    mobile?: string;
    phone?: string;
    email?: string;
  };
  logoUrl: string;
  faviconUrl: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  officeHours: string;
  mapEmbedUrl: string;
  socialLinks: {
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    instagram?: string;
  };
  /** Key into THEME_PRESETS (src/lib/theme-presets.ts). Empty = default. */
  themeColor: string;
  primaryColor: string;
};

export type PostCategory =
  | "academic"
  | "campus-life"
  | "events"
  | "achievements"
  | "student-activities";

/** Blog & news post (only published posts are ever returned). */
export type Post = {
  isDemo?: boolean;
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: PostCategory;
  author: string;
  status: "draft" | "published";
  publishedAt: string;
};

/** A class tile (secondary) or group card (higher-secondary). */
export type Program = {
  isDemo?: boolean;
  _id: string;
  title: string;
  level: "secondary" | "higher-secondary";
  description: string;
  isActive: boolean;
  order: number;
};

/** The admission information page. Empty lists mean "not published". */
export type AdmissionInfo = {
  academicSession: string;
  eligibility: string[];
  process: { title: string; description: string }[];
  requiredDocuments: string[];
  fees: { label: string; amount: string }[];
  importantDates: { label: string; value: string }[];
  instructions: string;
};
