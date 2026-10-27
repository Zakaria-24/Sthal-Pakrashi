/**
 * English static UI text. This file is the source of truth for the key set:
 * `bn.ts` is typed against it, so a key added here without a Bengali value
 * fails type-checking.
 *
 * Placeholders use `{name}` and are filled by `translate()`.
 */
import { enPages } from "./pages.en";

const enCore = {
  /* ---- brand ---- */
  "brand.name": "STHAL PAKRASHI INSTITUTION",
  "brand.sub": "SCHOOL & COLLEGE · EST. {year}",
  "brand.logoAlt": "Sthal Pakrashi Institution School & College logo",
  "brand.footerName": "STHAL PAKRASHI INSTITUTION",

  /* ---- top utility bar ---- */
  "top.eiin": "EIIN: {eiin}",
  "top.facebook": "Facebook",
  "top.youtube": "YouTube",
  "lang.label": "Language",
  "lang.en": "EN",
  "lang.bn": "বাং",
  "lang.bnFull": "বাংলা",
  "lang.switchToEn": "Switch language to English",
  "lang.switchToBn": "Switch language to Bengali",

  /* ---- accessibility ---- */
  "a11y.skip": "Skip to main content",
  "a11y.primaryNav": "Primary",
  "a11y.mobileNav": "Mobile navigation",

  /* ---- navigation ---- */
  "nav.home": "Home",
  "nav.about": "About",
  "nav.about.institution": "Institution",
  "nav.about.mission": "Mission & Vision",
  "nav.about.founder": "Founder",
  "nav.about.committee": "Management Committee",
  "nav.institution": "Institution",
  "nav.institution.profile": "Institution Profile",
  "nav.institution.recognition": "Recognition & Approval",
  "nav.institution.mpo": "MPO",
  "nav.institution.students": "Students",
  "nav.institution.classes": "Classes & Sections",
  "nav.academics": "Academics",
  "nav.academics.info": "Academic Information",
  "nav.academics.routine": "Routine",
  "nav.academics.syllabus": "Syllabus",
  "nav.academics.examRoutine": "Exam Routine",
  "nav.academics.bookList": "Book List",
  "nav.academics.admissionInfo": "Admission Information",
  "nav.academics.apply": "Apply Now",
  "nav.people": "People",
  "nav.people.principal": "Principal / Head",
  "nav.people.teachers": "Teachers",
  "nav.people.staff": "Staff",
  "nav.people.alumni": "Alumni",
  "nav.noticeEvents": "Notice & Events",
  "nav.noticeEvents.notices": "Notices",
  "nav.noticeEvents.events": "Events",
  "nav.media": "Media",
  "nav.media.gallery": "Gallery",
  "nav.media.videos": "Videos",
  "nav.schoolLife": "School Life",
  "nav.schoolLife.uniform": "Uniform",
  "nav.contact": "Contact",
  "nav.contact.info": "Contact",
  "nav.contact.infoCentre": "Information Service Centre",
  "nav.contact.grievance": "Grievance Officer",

  /* ---- header controls ---- */
  "cta.apply": "Apply Now",
  "cta.learnMore": "Learn More",
  "cta.admissionInfo": "Admission Info",
  "menu.open": "Open menu",
  "menu.close": "Close menu",
  "menu.title": "Menu",

  /* ---- search ---- */
  "search.open": "Search",
  "search.title": "Search the website",
  "search.placeholder": "Search pages — notices, teachers, alumni, resources…",
  "search.close": "Close search",
  "search.hint": "Type at least 2 characters to search pages, notices, events and people.",
  "search.suggestions": "Try",
  "search.loading": "Searching…",
  "search.empty": "No matches found. Try “notices”, “alumni” or “uniform”.",
  "search.unavailable": "Live content search is unavailable right now. Page results are still shown.",
  "search.results": "{count} results",
  "search.type.page": "Page",
  "search.type.notice": "Notice",
  "search.type.event": "Event",
  "search.type.teacher": "Teacher",
  "search.type.staff": "Staff",
  "search.type.alumni": "Alumni",
  "search.type.gallery": "Gallery",
  "search.type.video": "Video",
  "search.type.document": "Document",
  "search.keys": "↑↓ to navigate · Enter to open · Esc to close",

  /* ---- shared ---- */
  "common.readMore": "Read More",
  "common.viewAll": "View All",
  "common.viewDetails": "View Details",
  "common.findNow": "Find Now",
  "common.applyNow": "Apply Now",
  "common.pinned": "Pinned",
  "common.close": "Close",
  "common.home": "Home",
  "common.breadcrumb": "Breadcrumb",
  "common.loading": "Loading…",
  "common.errorTitle": "Something went wrong",
  "common.errorBody": "We couldn't load this content. Please try again in a moment.",
  "common.retry": "Try again",
  "common.emptyTitle": "Nothing to show yet",
  "common.sampleContent": "Sample content",
  "common.demoContent": "DEMO · Fictional preview",
  "common.studentsEnrolled": "Students Enrolled",
  "common.students": "Students",
  "common.teachers": "Teachers",
  "common.classes": "Classes",
  "common.yearsLegacy": "Years Legacy",
  "common.established": "Established",
  "common.since": "SINCE",

  /* ---- notice categories (Notice.category) ---- */
  "notice.category.general": "General",
  "notice.category.exam": "Examination",
  "notice.category.holiday": "Holiday",
  "notice.category.event": "Event",
  "notice.category.urgent": "Urgent",
  "notice.category.admission": "Admission",

  /* ---- footer ---- */
  "footer.tagline": "School & College serving {place} since {year}.",
  "footer.academic": "Academic",
  "footer.programs": "Academic Programs",
  "footer.studentsClasses": "Students & Classes",
  "footer.resources": "Academic Resources",
  "footer.teachers": "Teachers",
  "footer.institution": "Institution",
  "footer.about": "About",
  "footer.staff": "Staff",
  "footer.committee": "Management Committee",
  "footer.blog": "Blog & News",
  "footer.contact": "Contact",
  "footer.copyright": "© {year} {name}. All rights reserved.",
  "footer.board": "Est. {year} · {board}",

  /* ---- home: hero ---- */
  "home.hero.tag": "ESTABLISHED {year} · {place}",
  "home.hero.title1": "Shaping Knowledge,",
  "home.hero.title2": "Building Tomorrow",
  "home.hero.statDesc":
    "We are committed to providing quality education that prepares students for the future.",
  "home.hero.imageAlt": "Institution campus",
  "home.hero.avatarAlt": "Student",
  "home.heroM.tag": "ESTABLISHED {year}",
  "home.heroM.title1": "Shaping",
  "home.heroM.title2": "Bright Futures",
  "home.heroM.title3": "Together",
  "home.heroM.desc":
    "We are committed to academic excellence and character building for a better tomorrow.",
  "home.heroM.years": "Years",

  /* ---- home: quick facts ---- */
  "home.facts.eiin": "EIIN",
  "home.facts.mpo": "MPO",
  "home.facts.board": "Board",
  "home.facts.type": "Type",
  "home.facts.established": "Established",

  /* ---- home: about ---- */
  "home.about.tag": "ABOUT THE INSTITUTION",
  "home.about.title": "A legacy of education since {year}",
  "home.about.p2": "Registered under EIIN {eiin} and MPO {mpo}, the institution combines long-standing tradition with a continued commitment to academic excellence.",
  "home.about.readMore": "Read Our Full Story",
  "home.about.imageAlt": "Institution building",
  "home.about.secondaryAlt": "Classroom",

  /* ---- home: alumni finder ---- */
  "home.finder.tag": "FIND YOUR COURSE",
  "home.finder.title": "Empowering Future Leaders Around the World",
  "home.finder.allYears": "All batches",
  "home.finder.filterLabel": "Filter by passing year",
  "home.finder.searchLabel": "Search alumni",
  "home.finder.placeholder": "Type here..",
  "home.finder.search": "Search Now",
  "home.finder.empty": "No matching alumni. Try a different name, occupation or year.",
  "home.finder.batch": "Batch {year}",
  "home.finder.viewAll": "View all alumni",
  "home.finder.close": "Close alumni details",

  /* ---- home: curriculum ---- */
  "home.curriculum.tag": "CURRICULUM",
  "home.curriculum.title": "Our Academic Programs",
  "home.curriculum.classesOffered": "{count} Classes Offered",
  "home.curriculum.viewAll": "View All Programs",
  "home.curriculum.imageAlt": "Teacher and student",
  "home.curriculum.p1": "Secondary — Class 6 to Class 10",
  "home.curriculum.p2": "Higher Secondary — Science",
  "home.curriculum.p3": "Higher Secondary — Humanities",
  "home.curriculum.p4": "Higher Secondary — Business Studies",

  /* ---- home: watch now ---- */
  "home.watch.cta": "Watch Now",
  "home.watch.desc": "University life is more than just lectures and textbooks. Campus life offers students many more experiences.",
  "home.watch.imageAlt": "Campus",
  "home.watch.modalTitle": "Campus life video",
  "home.watch.close": "Close video",

  /* ---- home: FAQ + admission aid ---- */
  "home.faq.tag": "FAQ",
  "home.faq.title": "Frequently Asked Questions",
  "home.faq.q1": "What classes does the institution offer?",
  "home.faq.a1": "Education is provided from secondary level (Class 6) through higher secondary level, under the {board}.",
  "home.faq.q2": "Which education board is the institution affiliated with?",
  "home.faq.a2": "{name} is affiliated with the {board}.",
  "home.faq.q3": "Is the institution government-registered?",
  "home.faq.a3": "Yes, the institution is registered with EIIN {eiin} and MPO {mpo}.",
  "home.faq.q4": "How can I get in touch regarding admissions?",
  "home.faq.a4": "Please visit the Contact page for institution address and office information.",
  "home.faq.q5": "Does the institution provide hostel or transport facilities?",
  "home.faq.a5": "Please contact the institution office directly for current information on hostel and transport arrangements.",
  "home.aid.tag": "ADMISSION & AID",
  "home.aid.title": "Explore Our World-Class Academic Programs",
  "home.aid.fees": "Fees & Financial",
  "home.aid.feesDesc": "We offer a transparent and flexible fee structure to support students.",
  "home.aid.process": "Process Overview",
  "home.aid.processDesc": "Experienced faculty, modern facilities, and a supportive learning environment.",
  "home.aid.apply": "How to Apply",
  "home.aid.applyDesc": "Submit required documents — academic transcripts and passport-size photos.",

  /* ---- home: campus life ---- */
  "home.campus.tag": "CAMPUS LIFE",
  "home.campus.title": "Discover Campus Life",
  "home.campus.explore": "Explore Campus Life",
  "home.campus.viewGallery": "View Gallery",

  /* ---- home: admission ---- */
  "home.admission.tag": "ADMISSION",
  "home.admission.title": "How to Get Admitted",
  "home.admission.step1.title": "Collect Admission Form",
  "home.admission.step1.desc": "Visit the institution office to collect the admission form.",
  "home.admission.step2.title": "Submit Documents",
  "home.admission.step2.desc": "Submit required documents along with the completed form.",
  "home.admission.step3.title": "Confirm Enrollment",
  "home.admission.step3.desc": "Complete formalities to confirm the student's enrollment.",
  "home.admission.stepLabel": "Step {n}",

  /* ---- home: notices ---- */
  "home.notices.tag": "NOTICE CENTER",
  "home.notices.title": "Latest Notices & Events",
  "home.notices.empty": "No notices have been published yet.",

  /* ---- home: testimonials ---- */
  "home.testimonials.tag": "TESTIMONIALS",
  "home.testimonials.title": "Building Bright Minds for Tomorrow",
  "home.testimonials.placeholderQuote": "Testimonial quote will be added here once collected from parents and students.",
  "home.testimonials.parent": "Parent",
  "home.testimonials.parentName": "Parent Name",
  "home.testimonials.student": "Student",
  "home.testimonials.studentName": "Student Name",
  "home.testimonials.alumnus": "Alumnus",
  "home.testimonials.alumnusName": "Alumnus Name",
  "home.testimonials.rating": "Rated 5 out of 5",
  "home.testimonials.show": "Show testimonial {n}",

  /* ---- home: CTA + useful links ---- */
  "home.cta.title": "Interested in Joining Us?",
  "home.cta.desc": "Reach out to learn more about admissions and academic programs.",
  "home.cta.button": "Contact the Institution",
  "home.links.title": "Useful Links",
  "home.links.desc": "Official education portals for admissions, results and board services.",
} as const;

export const en = { ...enCore, ...enPages } as const;

export type MessageKey = keyof typeof en;
