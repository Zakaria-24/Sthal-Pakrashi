import type { MessageKey } from "@/lib/i18n";

/**
 * Single source of truth for site navigation. The desktop menu, mobile drawer,
 * footer and page search all render from these structures — no menu markup is
 * repeated anywhere.
 *
 * Every entry points at a real page built from the finalized design. A few
 * destinations are sections of a shared page (`/about#profile`,
 * `/students#classes`, `/resources#routine` …); those anchors are defined by
 * the `id` props on the pages themselves.
 */
export type NavLeaf = {
  id: string;
  href: string;
  labelKey: MessageKey;
};

export type NavLink = { type: "link" } & NavLeaf;

export type NavGroup = {
  type: "group";
  id: string;
  labelKey: MessageKey;
  items: NavLeaf[];
};

export type NavEntry = NavLink | NavGroup;

/** Where the header "Apply Now" button goes. */
export const APPLY_HREF = "/apply";
export const ADMISSION_INFO_HREF = "/admission-info";

/**
 * The header / menu / hero call-to-action: "Apply Now" while the CMS says
 * admissions are open, otherwise a link to the Admission Info page.
 */
export function admissionCta(open: boolean) {
  return open
    ? ({ href: APPLY_HREF, labelKey: "cta.apply" } as const)
    : ({ href: ADMISSION_INFO_HREF, labelKey: "cta.admissionInfo" } as const);
}

export const NAV: NavEntry[] = [
  { type: "link", id: "home", href: "/", labelKey: "nav.home" },
  {
    type: "group",
    id: "about",
    labelKey: "nav.about",
    items: [
      { id: "about-institution", href: "/about", labelKey: "nav.about.institution" },
      { id: "about-mission", href: "/about#mission", labelKey: "nav.about.mission" },
      { id: "about-founder", href: "/founder", labelKey: "nav.about.founder" },
      { id: "about-committee", href: "/committee", labelKey: "nav.about.committee" },
    ],
  },
  {
    type: "group",
    id: "institution",
    labelKey: "nav.institution",
    items: [
      { id: "inst-profile", href: "/about#profile", labelKey: "nav.institution.profile" },
      { id: "inst-recognition", href: "/recognition", labelKey: "nav.institution.recognition" },
      { id: "inst-mpo", href: "/mpo", labelKey: "nav.institution.mpo" },
      { id: "inst-students", href: "/students", labelKey: "nav.institution.students" },
      { id: "inst-classes", href: "/students#classes", labelKey: "nav.institution.classes" },
    ],
  },
  {
    type: "group",
    id: "academics",
    labelKey: "nav.academics",
    items: [
      { id: "acad-info", href: "/academics", labelKey: "nav.academics.info" },
      { id: "acad-routine", href: "/resources#routine", labelKey: "nav.academics.routine" },
      { id: "acad-syllabus", href: "/resources#syllabus", labelKey: "nav.academics.syllabus" },
      { id: "acad-exam", href: "/resources#exam-routine", labelKey: "nav.academics.examRoutine" },
      { id: "acad-books", href: "/resources#book-list", labelKey: "nav.academics.bookList" },
      { id: "acad-admission", href: "/admission-info", labelKey: "nav.academics.admissionInfo" },
      { id: "acad-apply", href: APPLY_HREF, labelKey: "nav.academics.apply" },
    ],
  },
  {
    type: "group",
    id: "people",
    labelKey: "nav.people",
    items: [
      { id: "people-head", href: "/teachers#head", labelKey: "nav.people.principal" },
      { id: "people-teachers", href: "/teachers", labelKey: "nav.people.teachers" },
      { id: "people-staff", href: "/staff", labelKey: "nav.people.staff" },
      { id: "people-alumni", href: "/alumni", labelKey: "nav.people.alumni" },
    ],
  },
  {
    type: "group",
    id: "news",
    labelKey: "nav.noticeEvents",
    items: [
      { id: "news-notices", href: "/notices", labelKey: "nav.noticeEvents.notices" },
      { id: "news-events", href: "/events", labelKey: "nav.noticeEvents.events" },
    ],
  },
  {
    type: "group",
    id: "media",
    labelKey: "nav.media",
    items: [
      { id: "media-gallery", href: "/gallery", labelKey: "nav.media.gallery" },
      { id: "media-videos", href: "/videos", labelKey: "nav.media.videos" },
    ],
  },
  {
    type: "group",
    id: "life",
    labelKey: "nav.schoolLife",
    items: [
      { id: "life-uniform", href: "/uniform", labelKey: "nav.schoolLife.uniform" },
    ],
  },
  {
    type: "group",
    id: "contact",
    labelKey: "nav.contact",
    items: [
      { id: "contact-info", href: "/contact", labelKey: "nav.contact.info" },
      { id: "contact-centre", href: "/info-centre", labelKey: "nav.contact.infoCentre" },
      { id: "contact-grievance", href: "/grievance", labelKey: "nav.contact.grievance" },
    ],
  },
];

export type FooterColumn = {
  id: string;
  titleKey: MessageKey;
  links: NavLeaf[];
};

/** Footer link columns (the brand and contact columns are rendered directly). */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "academic",
    titleKey: "footer.academic",
    links: [
      { id: "f-programs", href: "/academics", labelKey: "footer.programs" },
      { id: "f-students", href: "/students", labelKey: "footer.studentsClasses" },
      { id: "f-resources", href: "/resources", labelKey: "footer.resources" },
      { id: "f-teachers", href: "/teachers", labelKey: "footer.teachers" },
    ],
  },
  {
    id: "institution",
    titleKey: "footer.institution",
    links: [
      { id: "f-about", href: "/about", labelKey: "footer.about" },
      { id: "f-staff", href: "/staff", labelKey: "footer.staff" },
      { id: "f-committee", href: "/committee", labelKey: "footer.committee" },
      { id: "f-blog", href: "/blog", labelKey: "footer.blog" },
    ],
  },
];

/** Path portion of an href (`/about#founder` → `/about`). */
export function pathOf(href: string): string {
  return href.split("#")[0] || "/";
}

/** True when `pathname` is the page this href points at. */
export function isCurrentPath(pathname: string, href: string): boolean {
  const path = pathOf(href);
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

/** Every navigable destination, flattened — the search modal's page index. */
export function flattenNav(): NavLeaf[] {
  const seen = new Set<string>();
  const leaves: NavLeaf[] = [];
  for (const entry of NAV) {
    const items = entry.type === "link" ? [entry] : entry.items;
    for (const item of items) {
      const key = `${item.href}|${item.labelKey}`;
      if (seen.has(key)) continue;
      seen.add(key);
      leaves.push(item);
    }
  }
  return leaves;
}
