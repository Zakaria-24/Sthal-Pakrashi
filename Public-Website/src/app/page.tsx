import {
  getAlumni,
  getBanners,
  getClasses,
  getGallery,
  getNotices,
  getSettings,
  getTeachers,
  getUsefulLinks,
  getVideos,
} from "@/lib/api";
import { AboutTeaser } from "@/components/home/about-teaser";
import { AdmissionSection } from "@/components/home/admission-section";
import { AlumniFinder } from "@/components/home/alumni-finder";
import { CampusLife } from "@/components/home/campus-life";
import { CtaBanner } from "@/components/home/cta-banner";
import { Curriculum, type CurriculumRow } from "@/components/home/curriculum";
import { FaqSection } from "@/components/home/faq-section";
import { Hero } from "@/components/home/hero";
import { NoticeCenter } from "@/components/home/notice-center";
import { QuickFacts, type QuickFact } from "@/components/home/quick-facts";
import { Testimonials, type Testimonial } from "@/components/home/testimonials";
import { UsefulLinks } from "@/components/home/useful-links";
import { WatchNow } from "@/components/home/watch-now";
import {
  BookIcon,
  BulbIcon,
  ClipboardCheckIcon,
  DocumentIcon,
  GraduationCapIcon,
  MedalIcon,
  RocketIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { formatDateLocalized, localizeDigits } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { formatCount, isRealValue } from "@/lib/format";
import { admissionCta } from "@/lib/navigation";
import { getSiteText } from "@/lib/site-text";
import { toEmbedUrl } from "@/lib/video";

/**
 * Homepage. Every section reads through the shared API layer and keeps its own
 * fallback behaviour: when a resource is bundled sample data (`isFallback`),
 * the section says so with a "Sample content" mark and never reports figures
 * it cannot back with CMS data.
 */
export default async function HomePage() {
  const [
    { locale, t },
    { data: settings },
    { data: banners, isFallback: bannersFallback },
    { data: notices },
    { data: gallery },
    { data: alumni, isFallback: alumniFallback },
    { data: classes, isFallback: classesFallback },
    { data: teachers, isFallback: teachersFallback },
    { data: videos },
    { data: usefulLinks },
  ] = await Promise.all([
    getI18n(),
    getSettings(),
    getBanners(),
    getNotices(6),
    getGallery(8),
    getAlumni(),
    getClasses(),
    getTeachers(),
    getVideos(6),
    getUsefulLinks(),
  ]);

  const site = getSiteText(settings, locale);
  const sample = t("common.sampleContent");
  /** Shown where the artifact has a figure but the CMS has no real value. */
  const NO_FIGURE = "—";
  /** Hero tag place: the locality (first two address parts), as in the artifact. */
  const heroPlace = site.address.split(/[,，]/).slice(0, 2).join(",").replace(/,(?=\S)/, ", ").trim();

  /* ---- figures: from CMS records, never from bundled samples. Real records
     win; demo-flagged CMS records count only while no real ones exist. ---- */
  const preferReal = <T extends { isDemo?: boolean }>(items: T[]) => {
    const real = items.filter((item) => !item.isDemo);
    return real.length > 0 ? real : items;
  };
  const countedClasses = classesFallback ? [] : preferReal(classes);
  const studentTotal = countedClasses.reduce(
    (sum, c) => sum + (Number(c.boys) || 0) + (Number(c.girls) || 0),
    0,
  );
  const classCount = countedClasses.length;
  const teacherCount = teachersFallback ? 0 : preferReal(teachers).length;
  const studentsText = studentTotal > 0 ? formatCount(studentTotal, locale) : null;
  const teachersText = teacherCount > 0 ? formatCount(teacherCount, locale) : null;
  const classesText = classCount > 0 ? formatCount(classCount, locale) : null;

  /* ---- hero ---- */
  const bannerImage = bannersFallback ? undefined : banners[0]?.imageUrl;
  const heroStats = [
    {
      value: isRealValue(settings.establishedYear) ? site.year : NO_FIGURE,
      label: t("common.established"),
    },
    { value: studentsText ?? NO_FIGURE, label: t("common.students") },
    { value: teachersText ?? NO_FIGURE, label: t("common.teachers") },
  ];

  /** Hero avatar stack: the newest alumni profiles with a photo (up to 7). */
  const HERO_AVATAR_MAX = 7;
  const avatars = alumniFallback
    ? []
    : alumni
        .filter((a) => a.photoUrl)
        .sort(
          (a, b) =>
            (Date.parse(b.createdAt ?? "") || 0) -
            (Date.parse(a.createdAt ?? "") || 0),
        )
        .slice(0, HERO_AVATAR_MAX)
        .map((a) => ({ src: a.photoUrl, name: a.name }));

  /* ---- quick facts ---- */
  const facts = [
    isRealValue(settings.eiin) && { label: t("home.facts.eiin"), value: site.eiin },
    isRealValue(settings.mpoCode) && { label: t("home.facts.mpo"), value: site.mpo },
    { label: site.board, value: site.boardShort },
    isRealValue(settings.institutionType) && { label: t("home.facts.type"), value: site.type },
    isRealValue(settings.establishedYear) && {
      label: t("home.facts.established"),
      value: site.year,
    },
  ].filter(Boolean) as QuickFact[];

  /* ---- about ---- */
  const aboutParagraphs = [
    site.about,
    isRealValue(settings.eiin) && isRealValue(settings.mpoCode)
      ? t("home.about.p2", { eiin: site.eiin, mpo: site.mpo })
      : "",
  ].filter(Boolean);

  const aboutFigures = [
    {
      value: studentsText ?? NO_FIGURE,
      label: t("common.students"),
      icon: <GraduationCapIcon />,
    },
    {
      value: site.legacyYears ?? NO_FIGURE,
      label: t("common.yearsLegacy"),
      icon: <MedalIcon />,
    },
  ];

  /* ---- curriculum: real class list when the CMS has one, else design rows ---- */
  const curriculumRows: CurriculumRow[] = classesFallback
    ? (["p1", "p2", "p3", "p4"] as const).map((key, index) => ({
        num: localizeDigits(`0${index + 1}`, locale),
        name: t(`home.curriculum.${key}`),
      }))
    : classes.slice(0, 6).map((c, index) => ({
        num: localizeDigits(String(index + 1).padStart(2, "0"), locale),
        name: c.className,
      }));

  /* ---- watch now ---- */
  const playable = videos.find((video) => toEmbedUrl(video.videoUrl));
  const embedUrl = playable ? toEmbedUrl(playable.videoUrl) : null;
  const watchImage =
    playable?.thumbnailUrl || gallery[2]?.imageUrl || gallery[0]?.imageUrl;

  /* ---- FAQ ---- */
  const faqParams = {
    board: site.board,
    name: site.name,
    eiin: site.eiin,
    mpo: site.mpo,
  };
  const faqs = [1, 2, 3, 4, 5].map((n) => ({
    id: `faq-${n}`,
    question: t(`home.faq.q${n}` as "home.faq.q1", faqParams),
    answer: t(`home.faq.a${n}` as "home.faq.a1", faqParams),
  }));

  /* ---- notices: pinned first, then as the API ordered them ---- */
  const noticeCards = [...notices]
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
    .slice(0, 6)
    .map((notice) => ({
      id: notice._id,
      meta: [
        formatDateLocalized(notice.publishedAt, locale),
        t(`notice.category.${notice.category}`),
      ]
        .filter(Boolean)
        .join(" · "),
      title: notice.title,
      description: notice.description,
      pinned: notice.isPinned,
      isDemo: notice.isDemo,
    }));

  /* ---- testimonials: real alumni quotes, else the design's placeholders ---- */
  /** Carousel length cap; three are on screen, the rest rotate in. */
  const MAX_TESTIMONIALS = 9;
  const realTestimonials: Testimonial[] = alumniFallback
    ? []
    : alumni
        .filter((a) => a.testimonial)
        .slice(0, MAX_TESTIMONIALS)
        .map((a) => ({
          quote: a.testimonial,
          name: a.name,
          role: [
            a.occupation,
            a.passingYear
              ? t("home.finder.batch", { year: a.passingYear })
              : "",
          ]
            .filter(Boolean)
            .join(" · "),
          photoUrl: a.photoUrl,
          isDemo: a.isDemo,
        }));
  const usingPlaceholderTestimonials = realTestimonials.length < 3;
  const testimonials: Testimonial[] = usingPlaceholderTestimonials
    ? (["parent", "student", "alumnus"] as const).map((who) => ({
        quote: t("home.testimonials.placeholderQuote"),
        name: t(`home.testimonials.${who}Name`),
        role: t(`home.testimonials.${who}`),
        placeholder: true,
      }))
    : realTestimonials;

  return (
    <>
      <Hero
        tag={t("home.hero.tag", { year: site.year, place: heroPlace })}
        titleLines={[t("home.hero.title1"), t("home.hero.title2")]}
        imageSrc={bannerImage || gallery[0]?.imageUrl}
        imageAlt={t("home.hero.imageAlt")}
        demoLabel={banners[0]?.isDemo ? t("common.demoContent") : undefined}
        avatars={avatars}
        studentsLabel={
          studentsText
            ? `${studentsText} ${t("common.studentsEnrolled")}`
            : undefined
        }
        description={t("home.hero.statDesc")}
        stats={heroStats}
        compact={{
          tag: t("home.heroM.tag", { year: site.year }),
          titleLines: [
            t("home.heroM.title1"),
            t("home.heroM.title2"),
            t("home.heroM.title3"),
          ],
          description: t("home.heroM.desc"),
          applyHref: admissionCta(settings.admissionOpen).href,
          applyLabel: t(admissionCta(settings.admissionOpen).labelKey),
          learnHref: "/about",
          learnLabel: t("cta.learnMore"),
          stats: [
            {
              value: studentsText ?? NO_FIGURE,
              label: t("common.students"),
              icon: <UsersIcon />,
            },
            {
              value: teachersText ?? NO_FIGURE,
              label: t("common.teachers"),
              icon: <GraduationCapIcon />,
            },
            {
              value: site.legacyYears ?? NO_FIGURE,
              label: t("home.heroM.years"),
              icon: <TrophyIcon />,
            },
          ],
        }}
      />

      <QuickFacts facts={facts} />

      <AboutTeaser
        eyebrow={t("home.about.tag")}
        title={t("home.about.title", { year: site.year })}
        paragraphs={aboutParagraphs}
        primaryImage={{
          src: gallery[0]?.imageUrl,
          alt: gallery[0]?.title ?? t("home.about.imageAlt"),
        }}
        secondaryImage={{
          src: gallery[1]?.imageUrl,
          alt: gallery[1]?.title ?? t("home.about.secondaryAlt"),
        }}
        figures={aboutFigures}
        readMore={t("common.readMore")}
      />

      <AlumniFinder
        sampleLabel={alumni.some((person) => person.isDemo) ? t("common.demoContent") : undefined}
        alumni={alumni.map((a) => ({
          id: a._id,
          name: a.name,
          photoUrl: a.photoUrl,
          passingYear: a.passingYear,
          occupation: a.occupation,
          testimonial: a.testimonial,
          isDemo: a.isDemo,
        }))}
      />

      <Curriculum
        eyebrow={t("home.curriculum.tag")}
        title={t("home.curriculum.title")}
        image={{
          src: gallery[1]?.imageUrl,
          alt: t("home.curriculum.imageAlt"),
        }}
        badge={
          classCount > 0
            ? t("home.curriculum.classesOffered", { count: classCount })
            : undefined
        }
        rows={curriculumRows}
        ctaLabel={t("home.curriculum.viewAll")}
        sampleLabel={classesFallback ? sample : undefined}
      />

      <WatchNow
        imageSrc={watchImage}
        imageAlt={t("home.watch.imageAlt")}
        embedUrl={embedUrl}
        videoTitle={playable?.title ?? ""}
      />

      <FaqSection
        eyebrow={t("home.faq.tag")}
        title={t("home.faq.title")}
        faqs={faqs}
        aidEyebrow={t("home.aid.tag")}
        aidTitle={t("home.aid.title")}
        aid={[
          {
            title: t("home.aid.fees"),
            description: t("home.aid.feesDesc"),
            href: "/contact",
            linkLabel: t("common.readMore"),
            tone: "green",
          },
          {
            title: t("home.aid.process"),
            description: t("home.aid.processDesc"),
            href: "/resources",
            linkLabel: t("common.readMore"),
            tone: "gold",
          },
          {
            title: t("home.aid.apply"),
            description: t("home.aid.applyDesc"),
            href: "/contact",
            linkLabel: t("common.readMore"),
            tone: "green",
          },
        ]}
      />

      <CampusLife
        eyebrow={t("home.campus.tag")}
        title={t("home.campus.title")}
        images={gallery.slice(0, 5).map((item) => ({
          src: item.imageUrl,
          alt: item.title,
        }))}
        ctaTitle={t("home.campus.explore")}
        ctaLabel={t("home.campus.viewGallery")}
      />

      <AdmissionSection
        eyebrow={t("home.admission.tag")}
        title={t("home.admission.title")}
        steps={[
          {
            title: t("home.admission.step1.title"),
            description: t("home.admission.step1.desc"),
            icon: <DocumentIcon className="size-5.5" />,
          },
          {
            title: t("home.admission.step2.title"),
            description: t("home.admission.step2.desc"),
            icon: <ClipboardCheckIcon className="size-5.5" />,
          },
          {
            title: t("home.admission.step3.title"),
            description: t("home.admission.step3.desc"),
            icon: <RocketIcon className="size-5.5" />,
          },
        ]}
        stats={[
          {
            value: studentsText ?? NO_FIGURE,
            label: t("common.students"),
            icon: <GraduationCapIcon className="size-8" />,
          },
          {
            value: teachersText ?? NO_FIGURE,
            label: t("common.teachers"),
            icon: <BulbIcon className="size-8 text-gold-dark" />,
          },
          {
            value: site.legacyYears ?? NO_FIGURE,
            label: t("common.yearsLegacy"),
            icon: <MedalIcon className="size-8" />,
          },
          {
            value: classesText ?? NO_FIGURE,
            label: t("common.classes"),
            icon: <BookIcon className="size-8" />,
          },
        ]}
        applyHref="/contact"
        applyLabel={t("common.applyNow")}
      />

      <NoticeCenter
        eyebrow={t("home.notices.tag")}
        title={t("home.notices.title")}
        notices={noticeCards}
        viewAll={t("common.viewAll")}
        viewDetails={t("common.viewDetails")}
        pinnedLabel={t("common.pinned")}
        emptyMessage={t("home.notices.empty")}
        demoLabel={t("common.demoContent")}
      />

      <Testimonials
        eyebrow={t("home.testimonials.tag")}
        title={t("home.testimonials.title")}
        ratingLabel={t("home.testimonials.rating")}
        dotLabels={testimonials.map((_, index) =>
          t("home.testimonials.show", {
            n: localizeDigits(String(index + 1), locale),
          }),
        )}
        items={testimonials}
        sampleLabel={
          usingPlaceholderTestimonials
            ? sample
            : realTestimonials.some((item) => item.isDemo)
              ? t("common.demoContent")
              : undefined
        }
      />

      <CtaBanner
        title={t("home.cta.title")}
        description={t("home.cta.desc")}
        buttonLabel={t("home.cta.button")}
        href="/contact"
      />

      <UsefulLinks
        title={t("home.links.title")}
        description={t("home.links.desc")}
        links={usefulLinks.map((link) => ({
          id: link._id,
          title: link.title,
          url: link.url,
        }))}
      />
    </>
  );
}
