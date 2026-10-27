import type { MessageKey } from "./en";
import type { enPages } from "./pages.en";
import { bnPages } from "./pages.bn";

/**
 * Bengali static UI text. Typed against the English key set, so a missing key
 * is a compile error. Strings copied from the finalized design keep the
 * design's wording; strings the design did not cover are marked (NEW) and
 * should get a native-speaker review before launch.
 */
const bnCore: Record<Exclude<MessageKey, keyof typeof enPages>, string> = {
  /* ---- brand ---- */
  "brand.name": "স্থল পাকড়াশী ইন্সটিটিউশন",
  "brand.sub": "স্কুল ও কলেজ · প্রতিষ্ঠিত {year}",
  "brand.logoAlt": "স্থল পাকড়াশী ইন্সটিটিউশন স্কুল ও কলেজের লোগো", // (NEW)
  "brand.footerName": "স্থল পাকড়াশী ইন্সটিটিউশন",

  /* ---- top utility bar ---- */
  "top.eiin": "EIIN: {eiin}",
  "top.facebook": "ফেসবুক", // (NEW)
  "top.youtube": "ইউটিউব", // (NEW)
  "lang.label": "ভাষা", // (NEW)
  "lang.en": "EN",
  "lang.bn": "বাং",
  "lang.bnFull": "বাংলা",
  "lang.switchToEn": "ভাষা ইংরেজিতে পরিবর্তন করুন", // (NEW)
  "lang.switchToBn": "ভাষা বাংলায় পরিবর্তন করুন", // (NEW)

  /* ---- accessibility ---- */
  "a11y.skip": "মূল বিষয়বস্তুতে যান", // (NEW)
  "a11y.primaryNav": "প্রধান মেনু", // (NEW)
  "a11y.mobileNav": "মোবাইল মেনু", // (NEW)

  /* ---- navigation ---- */
  "nav.home": "হোম",
  "nav.about": "পরিচিতি",
  "nav.about.institution": "প্রতিষ্ঠান", // (NEW)
  "nav.about.mission": "মিশন ও ভিশন", // (NEW)
  "nav.about.founder": "প্রতিষ্ঠাতা",
  "nav.about.committee": "পরিচালনা কমিটি",
  "nav.institution": "প্রতিষ্ঠান",
  "nav.institution.profile": "প্রতিষ্ঠানের পরিচিতি", // (NEW)
  "nav.institution.recognition": "স্বীকৃতি ও অনুমোদন",
  "nav.institution.mpo": "এমপিও তথ্য",
  "nav.institution.students": "শিক্ষার্থী",
  "nav.institution.classes": "শ্রেণি ও শাখা", // (NEW)
  "nav.academics": "শিক্ষা কার্যক্রম",
  "nav.academics.info": "একাডেমিক তথ্য", // (NEW)
  "nav.academics.routine": "রুটিন", // (NEW)
  "nav.academics.syllabus": "সিলেবাস", // (NEW)
  "nav.academics.examRoutine": "পরীক্ষার রুটিন", // (NEW)
  "nav.academics.bookList": "বইয়ের তালিকা", // (NEW)
  "nav.academics.admissionInfo": "ভর্তি তথ্য",
  "nav.academics.apply": "আবেদন করুন",
  "nav.people": "সদস্যবৃন্দ",
  "nav.people.principal": "অধ্যক্ষ / প্রধান শিক্ষক", // (NEW)
  "nav.people.teachers": "শিক্ষকবৃন্দ",
  "nav.people.staff": "কর্মচারী",
  "nav.people.alumni": "প্রাক্তন শিক্ষার্থী",
  "nav.noticeEvents": "নোটিশ ও ইভেন্ট",
  "nav.noticeEvents.notices": "নোটিশ",
  "nav.noticeEvents.events": "ইভেন্ট",
  "nav.media": "মিডিয়া",
  "nav.media.gallery": "গ্যালারি",
  "nav.media.videos": "ভিডিও গ্যালারি",
  "nav.schoolLife": "স্কুল জীবন",
  "nav.schoolLife.uniform": "ইউনিফর্ম",
  "nav.contact": "যোগাযোগ",
  "nav.contact.info": "যোগাযোগের তথ্য",
  "nav.contact.infoCentre": "তথ্য সেবা কেন্দ্র",
  "nav.contact.grievance": "অভিযোগ কর্মকর্তা",

  /* ---- header controls ---- */
  "cta.apply": "আবেদন করুন",
  "cta.learnMore": "আরও জানুন",
  "cta.admissionInfo": "ভর্তি তথ্য",
  "menu.open": "মেনু খুলুন", // (NEW)
  "menu.close": "মেনু বন্ধ করুন", // (NEW)
  "menu.title": "মেনু", // (NEW)

  /* ---- search ---- */
  "search.open": "অনুসন্ধান", // (NEW)
  "search.title": "ওয়েবসাইটে অনুসন্ধান", // (NEW)
  "search.placeholder": "পাতা খুঁজুন — নোটিশ, শিক্ষক, প্রাক্তন শিক্ষার্থী, রিসোর্স…", // (NEW)
  "search.close": "অনুসন্ধান বন্ধ করুন", // (NEW)
  "search.hint": "পাতা, নোটিশ, ইভেন্ট ও সদস্য খুঁজতে অন্তত ২টি অক্ষর লিখুন।", // (NEW)
  "search.suggestions": "চেষ্টা করুন", // (NEW)
  "search.loading": "খোঁজা হচ্ছে…", // (NEW)
  "search.empty": "কোনো ফলাফল পাওয়া যায়নি। “নোটিশ”, “প্রাক্তন” বা “ইউনিফর্ম” লিখে দেখুন।", // (NEW)
  "search.unavailable": "এই মুহূর্তে কনটেন্ট অনুসন্ধান পাওয়া যাচ্ছে না। পাতার ফলাফল দেখানো হচ্ছে।", // (NEW)
  "search.results": "{count}টি ফলাফল", // (NEW)
  "search.type.page": "পাতা", // (NEW)
  "search.type.notice": "নোটিশ",
  "search.type.event": "ইভেন্ট",
  "search.type.teacher": "শিক্ষক",
  "search.type.staff": "কর্মচারী",
  "search.type.alumni": "প্রাক্তন শিক্ষার্থী",
  "search.type.gallery": "গ্যালারি",
  "search.type.video": "ভিডিও",
  "search.type.document": "নথি", // (NEW)
  "search.keys": "↑↓ নির্বাচন · Enter খুলুন · Esc বন্ধ", // (NEW)

  /* ---- shared ---- */
  "common.readMore": "বিস্তারিত দেখুন",
  "common.viewAll": "সব দেখুন",
  "common.viewDetails": "বিস্তারিত দেখুন",
  "common.findNow": "বিস্তারিত দেখুন",
  "common.applyNow": "আবেদন করুন",
  "common.pinned": "পিন করা",
  "common.close": "বন্ধ করুন", // (NEW)
  "common.home": "হোম",
  "common.breadcrumb": "ব্রেডক্রাম্ব", // (NEW)
  "common.loading": "লোড হচ্ছে…", // (NEW)
  "common.errorTitle": "কিছু একটা সমস্যা হয়েছে", // (NEW)
  "common.errorBody": "এই কনটেন্ট লোড করা যায়নি। একটু পরে আবার চেষ্টা করুন।", // (NEW)
  "common.retry": "আবার চেষ্টা করুন", // (NEW)
  "common.emptyTitle": "এখনো দেখানোর মতো কিছু নেই", // (NEW)
  "common.sampleContent": "নমুনা কনটেন্ট", // (NEW)
  "common.demoContent": "ডেমো · কাল্পনিক নমুনা",
  "common.studentsEnrolled": "শিক্ষার্থী ভর্তি",
  "common.students": "শিক্ষার্থী",
  "common.teachers": "শিক্ষক",
  "common.classes": "শ্রেণি",
  "common.yearsLegacy": "বছরের ঐতিহ্য",
  "common.established": "প্রতিষ্ঠাকাল",
  "common.since": "প্রতিষ্ঠিত",

  /* ---- notice categories ---- */
  "notice.category.general": "সাধারণ", // (NEW)
  "notice.category.exam": "পরীক্ষা", // (NEW)
  "notice.category.holiday": "ছুটি", // (NEW)
  "notice.category.event": "ইভেন্ট",
  "notice.category.urgent": "জরুরি", // (NEW)
  "notice.category.admission": "ভর্তি", // (NEW)

  /* ---- footer ---- */
  "footer.tagline": "{year} সাল থেকে {place} এলাকায় সেবাদানকারী স্কুল ও কলেজ।",
  "footer.academic": "শিক্ষা",
  "footer.programs": "শিক্ষা কার্যক্রম",
  "footer.studentsClasses": "শিক্ষার্থী ও শ্রেণি",
  "footer.resources": "শিক্ষা রিসোর্স",
  "footer.teachers": "শিক্ষকবৃন্দ",
  "footer.institution": "প্রতিষ্ঠান",
  "footer.about": "পরিচিতি",
  "footer.staff": "কর্মচারী",
  "footer.committee": "পরিচালনা কমিটি",
  "footer.blog": "ব্লগ ও সংবাদ",
  "footer.contact": "যোগাযোগ",
  "footer.copyright": "© {year} {name}। সর্বস্বত্ব সংরক্ষিত।",
  "footer.board": "প্রতিষ্ঠিত {year} · {board}",

  /* ---- home: hero ---- */
  "home.hero.tag": "প্রতিষ্ঠিত {year} · {place}",
  "home.hero.title1": "জ্ঞান গঠন,",
  "home.hero.title2": "আগামী নির্মাণ",
  "home.hero.statDesc": "আমরা শিক্ষার্থীদের ভবিষ্যতের জন্য প্রস্তুত করতে গুণগত শিক্ষা প্রদানে প্রতিশ্রুতিবদ্ধ।",
  "home.hero.imageAlt": "প্রতিষ্ঠানের ক্যাম্পাস", // (NEW)
  "home.hero.avatarAlt": "শিক্ষার্থী", // (NEW)
  "home.heroM.tag": "প্রতিষ্ঠিত {year}",
  "home.heroM.title1": "গড়ে তুলি",
  "home.heroM.title2": "উজ্জ্বল ভবিষ্যৎ",
  "home.heroM.title3": "একসাথে",
  "home.heroM.desc":
    "আমরা একাডেমিক শ্রেষ্ঠত্ব ও চরিত্র গঠনের মাধ্যমে আগামীর উজ্জ্বল ভবিষ্যৎ গড়তে প্রতিশ্রুতিবদ্ধ।",
  "home.heroM.years": "বছর",

  /* ---- home: quick facts ---- */
  "home.facts.eiin": "EIIN",
  "home.facts.mpo": "MPO",
  "home.facts.board": "বোর্ড", // (NEW)
  "home.facts.type": "ধরন",
  "home.facts.established": "প্রতিষ্ঠাকাল",

  /* ---- home: about ---- */
  "home.about.tag": "প্রতিষ্ঠান পরিচিতি",
  "home.about.title": "{year} সাল থেকে শিক্ষার ধারাবাহিকতা",
  "home.about.p2": "EIIN {eiin} এবং MPO {mpo} এর অধীনে নিবন্ধিত এই প্রতিষ্ঠানটি দীর্ঘ ঐতিহ্যের সাথে শিক্ষার উৎকর্ষতার প্রতি অবিচল প্রতিশ্রুতি বজায় রেখেছে।",
  "home.about.readMore": "সম্পূর্ণ ইতিহাস পড়ুন",
  "home.about.imageAlt": "প্রতিষ্ঠানের ভবন", // (NEW)
  "home.about.secondaryAlt": "শ্রেণিকক্ষ", // (NEW)

  /* ---- home: alumni finder ---- */
  "home.finder.tag": "আপনার কোর্স খুঁজুন",
  "home.finder.title": "বিশ্বজুড়ে ভবিষ্যৎ নেতৃত্ব তৈরি করা",
  "home.finder.allYears": "সব ব্যাচ", // (NEW)
  "home.finder.filterLabel": "পাসের বছর অনুযায়ী ফিল্টার", // (NEW)
  "home.finder.searchLabel": "প্রাক্তন শিক্ষার্থী খুঁজুন", // (NEW)
  "home.finder.placeholder": "এখানে লিখুন..",
  "home.finder.search": "খুঁজুন",
  "home.finder.empty": "কোনো মিল পাওয়া যায়নি। অন্য নাম, পেশা বা সাল লিখে দেখুন।", // (NEW)
  "home.finder.batch": "{year} ব্যাচ", // (NEW)
  "home.finder.viewAll": "সব প্রাক্তন শিক্ষার্থী দেখুন", // (NEW)
  "home.finder.close": "বিস্তারিত বন্ধ করুন", // (NEW)

  /* ---- home: curriculum ---- */
  "home.curriculum.tag": "পাঠ্যক্রম",
  "home.curriculum.title": "আমাদের শিক্ষা কার্যক্রম",
  "home.curriculum.classesOffered": "{count}টি শ্রেণি চালু আছে",
  "home.curriculum.viewAll": "সকল প্রোগ্রাম দেখুন",
  "home.curriculum.imageAlt": "শিক্ষক ও শিক্ষার্থী", // (NEW)
  "home.curriculum.p1": "মাধ্যমিক — ৬ষ্ঠ থেকে ১০ম শ্রেণি",
  "home.curriculum.p2": "উচ্চ মাধ্যমিক — বিজ্ঞান",
  "home.curriculum.p3": "উচ্চ মাধ্যমিক — মানবিক",
  "home.curriculum.p4": "উচ্চ মাধ্যমিক — ব্যবসায় শিক্ষা",

  /* ---- home: watch now ---- */
  "home.watch.cta": "ভিডিও দেখুন",
  "home.watch.desc": "ক্যাম্পাস জীবন শুধু ক্লাস আর বই নয়। শিক্ষার্থীরা এখানে আরও অনেক কিছু উপভোগ করে।",
  "home.watch.imageAlt": "ক্যাম্পাস", // (NEW)
  "home.watch.modalTitle": "ক্যাম্পাস জীবনের ভিডিও", // (NEW)
  "home.watch.close": "ভিডিও বন্ধ করুন", // (NEW)

  /* ---- home: FAQ + admission aid ---- */
  "home.faq.tag": "সাধারণ জিজ্ঞাসা",
  "home.faq.title": "সচরাচর জিজ্ঞাসিত প্রশ্ন",
  "home.faq.q1": "প্রতিষ্ঠানে কোন কোন শ্রেণি পড়ানো হয়?",
  "home.faq.a1": "{board}ের অধীনে মাধ্যমিক স্তর (৬ষ্ঠ শ্রেণি) থেকে উচ্চ মাধ্যমিক স্তর পর্যন্ত শিক্ষা প্রদান করা হয়।",
  "home.faq.q2": "প্রতিষ্ঠানটি কোন শিক্ষা বোর্ডের অধীনে?",
  "home.faq.a2": "{name} {board}ের অধিভুক্ত।",
  "home.faq.q3": "প্রতিষ্ঠানটি সরকার নিবন্ধিত কি?",
  "home.faq.a3": "হ্যাঁ, প্রতিষ্ঠানটি EIIN {eiin} এবং MPO {mpo} এর অধীনে নিবন্ধিত।",
  "home.faq.q4": "ভর্তি সংক্রান্ত যোগাযোগ কীভাবে করব?",
  "home.faq.a4": "প্রতিষ্ঠানের ঠিকানা ও অফিস তথ্যের জন্য যোগাযোগ পাতা দেখুন।",
  "home.faq.q5": "প্রতিষ্ঠানে হোস্টেল বা পরিবহন সুবিধা আছে কি?",
  "home.faq.a5": "হোস্টেল ও পরিবহন সংক্রান্ত সর্বশেষ তথ্যের জন্য সরাসরি প্রতিষ্ঠানের অফিসে যোগাযোগ করুন।",
  "home.aid.tag": "ভর্তি ও সহায়তা",
  "home.aid.title": "আমাদের বিশ্বমানের শিক্ষা কার্যক্রম দেখুন",
  "home.aid.fees": "ফি ও আর্থিক সহায়তা",
  "home.aid.feesDesc": "শিক্ষার্থীদের জন্য স্বচ্ছ ও নমনীয় ফি কাঠামো।",
  "home.aid.process": "প্রক্রিয়ার সংক্ষিপ্ত বিবরণ",
  "home.aid.processDesc": "অভিজ্ঞ শিক্ষক, আধুনিক সুবিধা ও সহায়ক পরিবেশ।",
  "home.aid.apply": "কীভাবে আবেদন করবেন",
  "home.aid.applyDesc": "প্রয়োজনীয় কাগজপত্র — একাডেমিক ট্রান্সক্রিপ্ট ও পাসপোর্ট সাইজ ছবি জমা দিন।",

  /* ---- home: campus life ---- */
  "home.campus.tag": "ক্যাম্পাস জীবন",
  "home.campus.title": "ক্যাম্পাস জীবন দেখুন",
  "home.campus.explore": "ক্যাম্পাস জীবন দেখুন",
  "home.campus.viewGallery": "গ্যালারি দেখুন",

  /* ---- home: admission ---- */
  "home.admission.tag": "ভর্তি",
  "home.admission.title": "কীভাবে ভর্তি হবেন",
  "home.admission.step1.title": "ভর্তি ফর্ম সংগ্রহ করুন",
  "home.admission.step1.desc": "ভর্তি ফর্ম সংগ্রহের জন্য প্রতিষ্ঠানের অফিসে যান।",
  "home.admission.step2.title": "কাগজপত্র জমা দিন",
  "home.admission.step2.desc": "পূরণ করা ফর্মের সাথে প্রয়োজনীয় কাগজপত্র জমা দিন।",
  "home.admission.step3.title": "ভর্তি নিশ্চিত করুন",
  "home.admission.step3.desc": "শিক্ষার্থীর ভর্তি নিশ্চিত করতে আনুষ্ঠানিকতা সম্পন্ন করুন।",
  "home.admission.stepLabel": "ধাপ {n}", // (NEW)

  /* ---- home: notices ---- */
  "home.notices.tag": "নোটিশ সেন্টার",
  "home.notices.title": "সাম্প্রতিক নোটিশ ও ইভেন্ট",
  "home.notices.empty": "এখনো কোনো নোটিশ প্রকাশ করা হয়নি।", // (NEW)

  /* ---- home: testimonials ---- */
  "home.testimonials.tag": "মতামত",
  "home.testimonials.title": "আগামীর উজ্জ্বল মনন গড়ে তুলছি",
  "home.testimonials.placeholderQuote": "অভিভাবক ও শিক্ষার্থীদের কাছ থেকে সংগ্রহের পর মতামত এখানে যুক্ত হবে।",
  "home.testimonials.parent": "অভিভাবক",
  "home.testimonials.parentName": "অভিভাবকের নাম",
  "home.testimonials.student": "শিক্ষার্থী",
  "home.testimonials.studentName": "শিক্ষার্থীর নাম",
  "home.testimonials.alumnus": "প্রাক্তন শিক্ষার্থী",
  "home.testimonials.alumnusName": "প্রাক্তন শিক্ষার্থী",
  "home.testimonials.rating": "৫-এর মধ্যে ৫ রেটিং", // (NEW)
  "home.testimonials.show": "{n} নম্বর মতামত দেখুন",

  /* ---- home: CTA + useful links ---- */
  "home.cta.title": "আমাদের সাথে যুক্ত হতে চান?",
  "home.cta.desc": "ভর্তি ও শিক্ষা কার্যক্রম সম্পর্কে জানতে যোগাযোগ করুন।",
  "home.cta.button": "প্রতিষ্ঠানে যোগাযোগ করুন",
  "home.links.title": "দরকারি লিংক", // (NEW)
  "home.links.desc": "ভর্তি, ফলাফল ও বোর্ড সেবার জন্য অফিসিয়াল শিক্ষা পোর্টাল।", // (NEW)
};

export const bn: Record<MessageKey, string> = { ...bnCore, ...bnPages };
