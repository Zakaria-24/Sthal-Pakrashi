import type {
  AcademicDocument,
  Alumni,
  Banner,
  ClassInfo,
  CommitteeMember,
  Founder,
  GalleryItem,
  LeadershipMessage,
  Notice,
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
 * What the site shows when the Dashboard API cannot be reached, or has nothing
 * for a resource yet.
 *
 * The CMS is now the source of every record, so the bundled sample records
 * (which belonged to another school) are gone: each list below is empty and
 * `fetchList` reports `isFallback`, which is the signal for pages to show the
 * design's own placeholders / "Not published" states. What remains here are the
 * design's identity defaults (`fallbackSettings`) and the public government
 * links from the design (`fallbackLinks`).
 */

export const fallbackSettings: SiteSettings = {
  /*
   * Identity fields below come from the finalized design artifact (Phase 2),
   * NOT from the CMS: they are what the site shows until the Dashboard's
   * settings are filled in, and each is overridden field-by-field by the CMS
   * value as soon as one exists. Fields not covered by the design (phone,
   * email, hours, teaching/administrative info, info centre, grievance
   * officer) still hold the clone's original placeholder text — see
   * DATA_GAPS.md.
   */
  siteName: "Sthal Pakrashi Institution School & College",
  shortName: "Sthal Pakrashi",
  tagline: "Shaping Knowledge, Building Tomorrow",
  about:
    "Sthal Pakrashi Institution School & College has served the community of Rupshi, Shahjadpur since 1864, offering education through the higher secondary level under the Rajshahi Education Board.",
  missionStatement:
    "Provide accessible, quality education that builds strong academic and moral foundations for every student.",
  visionStatement:
    "Be a trusted institution shaping capable, responsible citizens equipped for the future.",
  establishedYear: "1864",
  eiin: "128299",
  mpoCode: "8206121301",
  institutionType: "School & College",
  institutionCode: "—",
  educationBoard: "",
  mpoStatus: "",
  // Closed until the Dashboard says otherwise: an unreachable CMS must never
  // promise an application form that could not receive anything.
  admissionOpen: false,
  // Contact details are blank on purpose: the clone's original values belonged
  // to another school. Pages show the design's "Not published" state until the
  // CMS holds real values (see DATA_GAPS.md).
  teachingInfo: "",
  administrativeInfo: "",
  infoCentre: {},
  grievanceOfficer: {},
  // Empty on purpose: no real logo yet, so the header shows the design's mark.
  logoUrl: "",
  faviconUrl: "",
  address: "Rupshi, Shahjadpur, Sirajganj",
  phone: "",
  mobile: "",
  email: "",
  officeHours: "",
  mapEmbedUrl: "",
  socialLinks: {},
  // Left empty on purpose: with no server value, the page should use the
  // hardcoded fallback colour baked into globals.css, not a second copy of
  // the "indigo" preset re-declared here.
  themeColor: "",
  primaryColor: "",
};

export const fallbackBanners: Banner[] = [];

export const fallbackNotices: Notice[] = [];

export const fallbackEvents: SchoolEvent[] = [];

export const fallbackGallery: GalleryItem[] = [];

export const fallbackTeachers: Teacher[] = [];

export const fallbackFounders: Founder[] = [];

export const fallbackCommittee: CommitteeMember[] = [];

export const fallbackMessages: LeadershipMessage[] = [];

export const fallbackVideos: VideoItem[] = [];

export const fallbackLinks: UsefulLink[] = [
  {
    _id: "fallback-link-1",
    title: "Ministry of Education",
    url: "https://moedu.gov.bd",
    description: "",
    category: "government",
    isActive: true,
    order: 0,
  },
  {
    _id: "fallback-link-2",
    title: "Directorate of Secondary and Higher Education (DSHE)",
    url: "https://dshe.gov.bd",
    description: "",
    category: "government",
    isActive: true,
    order: 1,
  },
  {
    _id: "fallback-link-3",
    title: "Education Board Results",
    url: "https://eboardresults.com",
    description: "",
    category: "education-board",
    isActive: true,
    order: 2,
  },
  {
    _id: "fallback-link-4",
    title: "National Curriculum and Textbook Board (NCTB)",
    url: "https://nctb.gov.bd",
    description: "",
    category: "education-board",
    isActive: true,
    order: 3,
  },
  {
    _id: "fallback-link-5",
    title: "Bangladesh National Portal",
    url: "https://bangladesh.gov.bd",
    description: "",
    category: "service",
    isActive: true,
    order: 4,
  },
];

export const fallbackUniform: UniformItem[] = [];

export const fallbackRecognitions: Recognition[] = [];

export const fallbackClasses: ClassInfo[] = [];

export const fallbackDocuments: AcademicDocument[] = [];

export const fallbackStaff: Staff[] = [];

export const fallbackAlumni: Alumni[] = [];
