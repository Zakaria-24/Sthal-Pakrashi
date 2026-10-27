import type { enPages } from "./pages.en";

/**
 * Bengali static text for the inner pages. Strings taken from the finalized
 * design keep its wording; strings the design did not cover are marked
 * `// (NEW)` and need a native-speaker review before launch.
 */
export const bnPages: Record<keyof typeof enPages, string> = {
  /* ---- shared ---- */
  "page.notPublished": "প্রকাশিত হয়নি",
  "page.viaNotice": "নোটিশের মাধ্যমে জানানো হবে", // (NEW)
  "page.noAttachment": "এই নোটিশের সাথে কোনো সংযুক্তি প্রকাশ করা হয়নি", // (NEW)
  "page.downloadAttachment": "সংযুক্তি ডাউনলোড করুন", // (NEW)
  "page.download": "ডাউনলোড", // (NEW)
  "page.viewDocument": "দলিল দেখুন", // (NEW)
  "page.filesCount": "{count}টি ফাইল", // (NEW)
  "page.close": "বন্ধ করুন", // (NEW)
  "page.all": "সব", // (NEW)
  "page.previous": "পূর্ববর্তী",
  "page.featured": "বিশেষ", // (NEW)
  "page.passingYear": "পাসের বছর: {year}", // (NEW)
  "page.backToNotices": "← সব নোটিশ", // (NEW)
  "page.backToEvents": "← সব ইভেন্ট", // (NEW)

  /* ---- about ---- */
  "page.about.crumb": "পরিচিতি", // (NEW)
  "page.about.title": "প্রতিষ্ঠান পরিচিতি", // (NEW)
  "page.about.desc": "{year} সাল থেকে {place} এলাকায় শিক্ষার ইতিহাস।", // (NEW)
  "page.about.historyTag": "আমাদের ইতিহাস", // (NEW)
  "page.about.historyTitle": "{year} সালে প্রতিষ্ঠিত", // (NEW)
  "page.about.p1": "{name} {year} সালে {place} এলাকায় প্রতিষ্ঠিত হয়েছে এবং তখন থেকে অঞ্চলের প্রজন্মের পর প্রজন্ম শিক্ষার্থীর সেবা করে আসছে।", // (NEW)
  "page.about.p2": "বর্তমানে প্রতিষ্ঠানটি {board}ের অধীনে EIIN {eiin} ও MPO {mpo} নিয়ে মাধ্যমিক থেকে উচ্চ মাধ্যমিক পর্যায় পর্যন্ত শিক্ষা প্রদান করছে।", // (NEW)
  "page.about.mission": "মিশন", // (NEW)
  "page.about.vision": "ভিশন", // (NEW)
  "page.about.recognition": "স্বীকৃতি", // (NEW)
  "page.about.recognitionText": "{board}ের অধীনে EIIN {eiin} ও MPO {mpo} সহ নিবন্ধিত প্রতিষ্ঠান।", // (NEW)
  "page.about.profileTitle": "প্রতিষ্ঠানের পরিচিতি", // (NEW)
  "page.about.profileDesc": "{board}ে নথিভুক্ত প্রতিষ্ঠানের মূল নিবন্ধন তথ্য।", // (NEW)
  "page.about.profileSummary": "{name} {board}ের অধীনে মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা প্রদান করে, EIIN {eiin} এর অধীনে নিবন্ধিত এবং MPO {mpo} এ তালিকাভুক্ত।", // (NEW)
  "page.about.institutionName": "প্রতিষ্ঠানের নাম", // (NEW)
  "page.about.institutionType": "প্রতিষ্ঠানের ধরন", // (NEW)
  "page.about.institutionCode": "প্রতিষ্ঠান কোড", // (NEW)
  "page.about.establishedYear": "প্রতিষ্ঠার বছর", // (NEW)
  "page.about.address": "ঠিকানা",
  "page.about.mpoCode": "এমপিও কোড",
  "page.about.board": "শিক্ষা বোর্ড", // (NEW)
  "page.about.leadershipTag": "নেতৃত্বের বাণী", // (NEW)
  "page.about.leaderPlaceholderQuote": "{year} সালে শুরু হওয়া ঐতিহ্য এগিয়ে নিয়ে আমরা প্রতিটি শিক্ষার্থীর সম্ভাবনা বিকশিত করতে এবং চরিত্র ও জ্ঞান একসাথে গড়ে তুলতে চাই।", // (NEW)
  "page.about.leaderPlaceholderName": "অধ্যক্ষের নাম", // (NEW)
  "page.about.leaderPlaceholderRole": "অধ্যক্ষ, {name}", // (NEW)

  /* ---- programs ---- */
  "page.programs.crumb": "শিক্ষা কার্যক্রম",
  "page.programs.title": "শিক্ষা কার্যক্রম",
  "page.programs.desc": "{board}ের অধীনে মাধ্যমিক ও উচ্চ মাধ্যমিক পর্যায়ের কার্যক্রম।", // (NEW)
  "page.programs.secondaryTag": "মাধ্যমিক স্তর", // (NEW)
  "page.programs.secondaryTitle": "৬ষ্ঠ – ১০ম শ্রেণি", // (NEW)
  "page.programs.hsTag": "উচ্চ মাধ্যমিক", // (NEW)
  "page.programs.hsTitle": "চালু বিভাগসমূহ", // (NEW)
  "page.programs.class": "{n} শ্রেণি", // (NEW)
  "page.programs.science": "বিজ্ঞান",
  "page.programs.scienceDesc": "উচ্চ মাধ্যমিক বিজ্ঞান বিভাগ, একাদশ–দ্বাদশ শ্রেণি।", // (NEW)
  "page.programs.humanities": "মানবিক",
  "page.programs.humanitiesDesc": "উচ্চ মাধ্যমিক মানবিক বিভাগ, একাদশ–দ্বাদশ শ্রেণি।", // (NEW)
  "page.programs.business": "ব্যবসায় শিক্ষা",
  "page.programs.businessDesc": "উচ্চ মাধ্যমিক ব্যবসায় শিক্ষা বিভাগ, একাদশ–দ্বাদশ শ্রেণি।", // (NEW)
  "page.programs.ctaTitle": "ভর্তি হতে আগ্রহী?", // (NEW)
  "page.programs.ctaDesc": "ভর্তি তথ্য ও যোগ্যতার বিস্তারিত জানতে প্রতিষ্ঠানের অফিসে যোগাযোগ করুন।", // (NEW)
  "page.programs.ctaButton": "ভর্তির জন্য যোগাযোগ", // (NEW)

  /* ---- notices ---- */
  "page.notices.crumb": "নোটিশ",
  "page.notices.title": "নোটিশ সেন্টার",
  "page.notices.desc": "প্রতিষ্ঠান কর্তৃক প্রকাশিত অফিসিয়াল নোটিশ।", // (NEW)
  "page.notices.empty": "এখনো কোনো নোটিশ প্রকাশ করা হয়নি।",

  /* ---- events ---- */
  "page.events.crumb": "ইভেন্ট",
  "page.events.title": "স্কুল জীবন ও ইভেন্ট", // (NEW)
  "page.events.desc": "প্রতিষ্ঠানের ইভেন্ট ও কার্যক্রম।", // (NEW)
  "page.events.empty": "এখনো কোনো ইভেন্ট প্রকাশ করা হয়নি।", // (NEW)
  "event.category.academic": "শিক্ষা",
  "event.category.cultural": "সাংস্কৃতিক", // (NEW)
  "event.category.sports": "খেলাধুলা", // (NEW)
  "event.category.national-day": "জাতীয় দিবস", // (NEW)
  "event.category.other": "স্কুল জীবন",

  /* ---- teachers ---- */
  "page.teachers.crumb": "শিক্ষকবৃন্দ",
  "page.teachers.title": "আমাদের শিক্ষকবৃন্দ", // (NEW)
  "page.teachers.desc": "{name}-এর শিক্ষার্থীদের পথ দেখানো শিক্ষকগণ।", // (NEW)
  "page.teachers.headTag": "প্রধান শিক্ষক", // (NEW)
  "page.teachers.faculty": "শিক্ষক পরিষদ", // (NEW)
  "page.teachers.empty": "এখনো কোনো শিক্ষক প্রকাশ করা হয়নি।", // (NEW)

  /* ---- staff ---- */
  "page.staff.crumb": "কর্মচারী",
  "page.staff.title": "প্রতিষ্ঠানের কর্মচারী", // (NEW)
  "page.staff.desc": "প্রতিষ্ঠানের প্রশাসনিক ও সহায়ক কর্মচারীবৃন্দ।", // (NEW)
  "page.staff.general": "কর্মচারী",
  "page.staff.empty": "এখনো কোনো কর্মচারী প্রকাশ করা হয়নি।", // (NEW)

  /* ---- committee ---- */
  "page.committee.crumb": "পরিচালনা কমিটি",
  "page.committee.title": "পরিচালনা কমিটি",
  "page.committee.desc": "{name}-এর পরিচালনা পর্ষদ।", // (NEW)
  "page.committee.empty": "এখনো কোনো কমিটি সদস্য প্রকাশ করা হয়নি।", // (NEW)

  /* ---- alumni ---- */
  "page.alumni.crumb": "প্রাক্তন শিক্ষার্থী",
  "page.alumni.title": "প্রাক্তন শিক্ষার্থী",
  "page.alumni.desc": "{name}-এর প্রাক্তন শিক্ষার্থীরা এখন কোথায়।", // (NEW)
  "page.alumni.empty": "এখনো কোনো প্রাক্তন শিক্ষার্থী প্রকাশ করা হয়নি।", // (NEW)

  /* ---- students ---- */
  "page.students.crumb": "শিক্ষার্থী ও শ্রেণি",
  "page.students.title": "শিক্ষার্থী ও শ্রেণি",
  "page.students.desc": "প্রতিষ্ঠানের শ্রেণি ও শাখার কাঠামো।", // (NEW)
  "page.students.summary": "শিক্ষার্থী সারসংক্ষেপ", // (NEW)
  "page.students.boys": "ছাত্র", // (NEW)
  "page.students.girls": "ছাত্রী", // (NEW)
  "page.students.total": "মোট", // (NEW)
  "page.students.boysPct": "ছাত্র {pct}%", // (NEW)
  "page.students.girlsPct": "ছাত্রী {pct}%", // (NEW)
  "page.students.structure": "শ্রেণিভিত্তিক কাঠামো", // (NEW)
  "page.students.colClass": "শ্রেণি", // (NEW)
  "page.students.colShift": "শিফট", // (NEW)
  "page.students.colVersion": "ভার্সন", // (NEW)
  "page.students.colSections": "অনুমোদিত শাখা", // (NEW)
  "page.students.note": "এই টেবিল শ্রেণি ও অনুমোদিত শাখার তথ্যও দেয় — ছোট পর্দায় পাশে স্ক্রল করুন।", // (NEW)
  "page.students.empty": "শ্রেণি ও শিক্ষার্থীর তথ্য এখনো প্রকাশ করা হয়নি।", // (NEW)
  "shift.morning": "সকাল", // (NEW)
  "shift.day": "দিন", // (NEW)
  "shift.evening": "সন্ধ্যা", // (NEW)
  "shift.none": "—",
  "version.bangla": "বাংলা", // (NEW)
  "version.english": "ইংরেজি", // (NEW)
  "version.both": "বাংলা ও ইংরেজি", // (NEW)

  /* ---- resources ---- */
  "page.resources.crumb": "শিক্ষা রিসোর্স",
  "page.resources.title": "শিক্ষা রিসোর্স",
  "page.resources.desc": "রুটিন, সিলেবাস ও একাডেমিক নথি।", // (NEW)
  "page.resources.routine": "ক্লাস রুটিন", // (NEW)
  "page.resources.syllabus": "সিলেবাস", // (NEW)
  "page.resources.examRoutine": "পরীক্ষার রুটিন", // (NEW)
  "page.resources.bookList": "বইয়ের তালিকা", // (NEW)
  "page.resources.other": "একাডেমিক নথি", // (NEW)
  "page.resources.comingSoon": "শীঘ্রই আসছে", // (NEW)
  "page.resources.noticesTitle": "একাডেমিক নোটিশ", // (NEW)
  "page.resources.noticesDesc": "রুটিন ও সিলেবাসের হালনাগাদ নোটিশ সেন্টারের মাধ্যমে জানানো হয়।", // (NEW)
  "page.resources.noticesButton": "নোটিশ দেখুন", // (NEW)

  /* ---- gallery ---- */
  "page.gallery.crumb": "গ্যালারি",
  "page.gallery.title": "ক্যাম্পাস জীবনের গ্যালারি", // (NEW)
  "page.gallery.desc": "প্রতিষ্ঠানের জীবন ও কার্যক্রমের মুহূর্ত।", // (NEW)
  "page.gallery.empty": "এই বিভাগে এখনো কোনো ছবি নেই।", // (NEW)
  "page.gallery.filter": "ছবির বিভাগ", // (NEW)
  "gallery.category.campus": "ক্যাম্পাস",
  "gallery.category.events": "ইভেন্ট",
  "gallery.category.classroom": "শ্রেণিকক্ষ", // (NEW)
  "gallery.category.sports": "খেলাধুলা", // (NEW)
  "gallery.category.cultural": "সাংস্কৃতিক", // (NEW)
  "gallery.category.other": "অন্যান্য", // (NEW)

  /* ---- blog ---- */
  "page.blog.crumb": "ব্লগ ও সংবাদ",
  "page.blog.title": "ব্লগ ও সংবাদ",
  "page.blog.desc": "প্রতিষ্ঠানের হালনাগাদ ও গল্প।", // (NEW)
  "page.blog.empty": "এই বিভাগে এখনো কোনো লেখা নেই।", // (NEW)
  "page.blog.filter": "লেখার বিভাগ", // (NEW)
  "page.blog.readMore": "আরও পড়ুন →", // (NEW)
  "page.blog.back": "← সব লেখা", // (NEW)
  "page.blog.by": "লেখক: {author}", // (NEW)
  "page.blog.placeholderTitle": "প্রকাশিতব্য লেখার শিরোনাম", // (NEW)
  "page.blog.placeholderExcerpt": "প্রতিষ্ঠান কর্তৃক প্রকাশের পর লেখার সারসংক্ষেপ এখানে দেখা যাবে।", // (NEW)
  "blog.category.academic": "শিক্ষা",
  "blog.category.campusLife": "ক্যাম্পাস জীবন",
  "blog.category.events": "ইভেন্ট",
  "blog.category.achievements": "অর্জন", // (NEW)
  "blog.category.studentActivities": "শিক্ষার্থী কার্যক্রম", // (NEW)

  /* ---- recognition ---- */
  "page.recognition.crumb": "স্বীকৃতি ও অনুমোদন",
  "page.recognition.title": "স্বীকৃতি ও অনুমোদন",
  "page.recognition.desc": "{board}ের অধীনে প্রতিষ্ঠানের শিক্ষাদানের অনুমতি ও স্বীকৃতির তথ্য।",
  "page.recognition.authority": "প্রদানকারী কর্তৃপক্ষ",
  "page.recognition.memo": "স্মারক নং",
  "page.recognition.issueDate": "প্রদানের তারিখ",
  "page.recognition.expiryDate": "মেয়াদ শেষের তারিখ",
  "page.recognition.docNotPublished": "দলিল এখনো প্রকাশিত হয়নি",
  "page.recognition.empty": "এখনো কোনো স্বীকৃতির তথ্য প্রকাশ করা হয়নি।", // (NEW)
  "recognition.category.permission": "অনুমতি",
  "recognition.category.recognition": "স্বীকৃতি",
  "recognition.category.affiliation": "অধিভুক্তি", // (NEW)
  "recognition.category.other": "অন্যান্য", // (NEW)

  /* ---- mpo ---- */
  "page.mpo.crumb": "এমপিও তথ্য",
  "page.mpo.title": "এমপিও তথ্য",
  "page.mpo.desc": "প্রতিষ্ঠানের মান্থলি পে অর্ডার (এমপিও) তালিকাভুক্তির অবস্থা।",
  "page.mpo.enlisted": "তালিকাভুক্ত",
  "page.mpo.pending": "আবেদন প্রক্রিয়াধীন", // (NEW)
  "page.mpo.notEnlisted": "তালিকাভুক্ত নয়", // (NEW)
  "page.mpo.status": "এমপিও অবস্থা",
  "page.mpo.code": "এমপিও কোড",
  "page.mpo.eiin": "EIIN",
  "page.mpo.more": "প্রতিষ্ঠানের রেকর্ড থেকে প্রাপ্ত হলে এমপিও সংক্রান্ত অতিরিক্ত তথ্য এখানে প্রকাশিত হবে।",

  /* ---- founder ---- */
  "page.founder.crumb": "প্রতিষ্ঠাতা",
  "page.founder.title": "প্রতিষ্ঠাতা",
  "page.founder.desc": "{name}-এর প্রতিষ্ঠাতা।",
  "page.founder.label": "প্রতিষ্ঠাতা",
  "page.founder.education": "শিক্ষাগত যোগ্যতা",
  "page.founder.message": "প্রতিষ্ঠাতার বাণী",
  "page.founder.placeholderName": "প্রতিষ্ঠাতার নাম", // (NEW)
  "page.founder.placeholderMessage": "{place} এলাকার মানুষের কাছে মানসম্মত শিক্ষা পৌঁছে দেওয়ার লক্ষ্যে প্রতিষ্ঠানটি প্রতিষ্ঠিত হয়েছিল — এই লক্ষ্য আজও স্কুল ও কলেজকে পথ দেখায়।", // (NEW)

  /* ---- videos ---- */
  "page.videos.crumb": "ভিডিও গ্যালারি",
  "page.videos.title": "ভিডিও গ্যালারি",
  "page.videos.desc": "ক্যাম্পাস জীবন, ইভেন্ট ও শিক্ষা সংক্রান্ত প্রতিষ্ঠানের ভিডিও।",
  "page.videos.empty": "এই বিভাগে এখনো কোনো ভিডিও নেই।", // (NEW)
  "page.videos.filter": "ভিডিওর বিভাগ", // (NEW)
  "page.videos.play": "ভিডিও চালান", // (NEW)
  "page.videos.close": "ভিডিও বন্ধ করুন", // (NEW)
  "video.category.event": "ইভেন্ট",
  "video.category.campus": "ক্যাম্পাস",
  "video.category.academic": "শিক্ষা",
  "video.category.cultural": "সাংস্কৃতিক", // (NEW)
  "video.category.other": "অন্যান্য", // (NEW)

  /* ---- uniform ---- */
  "page.uniform.crumb": "স্কুল ইউনিফর্ম",
  "page.uniform.title": "স্কুল ইউনিফর্ম",
  "page.uniform.desc": "ছাত্র, ছাত্রী, খেলাধুলা ও শীতকালীন অনুমোদিত পোশাক।",
  "page.uniform.empty": "ইউনিফর্মের তথ্য এখনো প্রকাশ করা হয়নি।", // (NEW)
  "uniform.audience.boys": "ছাত্র", // (NEW)
  "uniform.audience.girls": "ছাত্রী", // (NEW)
  "uniform.audience.all": "সব শ্রেণি", // (NEW)
  "uniform.audience.sports": "খেলাধুলা", // (NEW)
  "uniform.audience.winter": "শীতকালীন", // (NEW)

  /* ---- info centre / grievance ---- */
  "page.infoCentre.crumb": "তথ্য সেবা কেন্দ্র",
  "page.infoCentre.title": "তথ্য সেবা কেন্দ্র",
  "page.infoCentre.desc": "সরকারি তথ্য অনুরোধের জন্য প্রতিষ্ঠানের নির্ধারিত যোগাযোগ কেন্দ্র।",
  "page.grievance.crumb": "অভিযোগ প্রতিকার কর্মকর্তা",
  "page.grievance.title": "অভিযোগ প্রতিকার কর্মকর্তা",
  "page.grievance.desc": "প্রতিষ্ঠানে অভিযোগ গ্রহণ ও সমাধানের জন্য নির্ধারিত কর্মকর্তা।",
  "page.field.address": "ঠিকানা",
  "page.field.mobile": "মোবাইল",
  "page.field.phone": "ফোন",
  "page.field.email": "ইমেইল",
  "page.field.name": "নাম",
  "page.field.designation": "পদবি",
  "page.field.officeAddress": "অফিসের ঠিকানা",
  "page.field.phoneMobile": "ফোন / মোবাইল",

  /* ---- apply ---- */
  "page.apply.crumb": "আবেদন করুন",
  "page.apply.title": "আবেদন করুন",
  "page.apply.desc": "{name}-এ আবেদনের জন্য নিচের ফর্মটি সম্পূর্ণ করুন।",
  "page.apply.stepStudent": "শিক্ষার্থী", // (NEW)
  "page.apply.stepGuardian": "অভিভাবক", // (NEW)
  "page.apply.stepAcademic": "শিক্ষাগত", // (NEW)
  "page.apply.stepDocuments": "কাগজপত্র", // (NEW)
  "page.apply.stepReview": "পর্যালোচনা", // (NEW)
  "page.apply.studentInfo": "শিক্ষার্থীর তথ্য",
  "page.apply.studentFullName": "শিক্ষার্থীর পূর্ণ নাম",
  "page.apply.dob": "জন্ম তারিখ",
  "page.apply.classApplying": "যে শ্রেণিতে আবেদন করছেন (যেমন: ৬ষ্ঠ শ্রেণি)",
  "page.apply.guardianInfo": "অভিভাবকের তথ্য",
  "page.apply.guardianFullName": "অভিভাবকের পূর্ণ নাম",
  "page.apply.mobileNumber": "মোবাইল নম্বর",
  "page.apply.emailAddress": "ইমেইল ঠিকানা",
  "page.apply.academicInfo": "শিক্ষাগত তথ্য",
  "page.apply.prevSchool": "পূর্ববর্তী স্কুল/প্রতিষ্ঠান",
  "page.apply.lastClass": "সর্বশেষ সমাপ্ত শ্রেণি",
  "page.apply.resultGpa": "ফলাফল / জিপিএ",
  "page.apply.documentUpload": "কাগজপত্র আপলোড",
  "page.apply.chooseFile": "ফাইল বাছাই করুন",
  "page.apply.fileChosen": "নির্বাচিত: {file}", // (NEW)
  "page.apply.review": "আবেদন পর্যালোচনা",
  "page.apply.studentName": "শিক্ষার্থীর নাম",
  "page.apply.dateOfBirth": "জন্ম তারিখ",
  "page.apply.classApplyingFor": "যে শ্রেণিতে আবেদন",
  "page.apply.guardianName": "অভিভাবকের নাম",
  "page.apply.guardianPhone": "অভিভাবকের ফোন",
  "page.apply.guardianEmail": "অভিভাবকের ইমেইল",
  "page.apply.previousSchool": "পূর্ববর্তী স্কুল",
  "page.apply.previousClass": "পূর্ববর্তী শ্রেণি",
  "page.apply.previousResult": "পূর্ববর্তী ফলাফল",
  "page.apply.back": "পূর্ববর্তী",
  "page.apply.next": "পরবর্তী",
  "page.apply.submit": "আবেদন জমা দিন",
  "page.apply.submittedTitle": "আবেদন জমা হয়েছে",
  "page.apply.submittedDesc": "আপনার আবেদন গ্রহণ করা হয়েছে। ট্র্যাকিং ও প্রতিষ্ঠান অফিসে রেফারেন্সের জন্য আবেদন আইডি সংরক্ষণ করুন।",
  "page.apply.applicationId": "আবেদন আইডি",
  "page.apply.startNew": "নতুন আবেদন শুরু করুন",
  "page.apply.notOpenTitle": "অনলাইনে আবেদন এখনো চালু হয়নি", // (NEW)
  "page.apply.notOpenDesc": "আপনার দেওয়া তথ্য কোথাও পাঠানো হয়নি। আবেদনের জন্য প্রতিষ্ঠানের অফিসে যান বা যোগাযোগ পাতা ব্যবহার করুন।", // (NEW)
  "page.apply.step": "ধাপ {n} / {total}", // (NEW)
  "page.apply.closedTitle": "ভর্তি এখন বন্ধ", // (NEW)
  "page.apply.closedDesc": "প্রতিষ্ঠান এখন অনলাইনে আবেদন গ্রহণ করছে না। বিস্তারিত ও ঘোষণার জন্য ভর্তি তথ্য পাতা দেখুন।", // (NEW)
  "page.apply.closedButton": "ভর্তি তথ্য দেখুন", // (NEW)
  "page.apply.errRequiredTitle": "কিছু তথ্য অনুপস্থিত", // (NEW)
  "page.apply.errRequiredDesc": "অনুগ্রহ করে শিক্ষার্থীর নাম, জন্ম তারিখ ও শ্রেণি এবং অভিভাবকের নাম ও মোবাইল নম্বর পূরণ করুন।", // (NEW)
  "page.apply.errInvalidTitle": "তথ্য যাচাই করুন", // (NEW)
  "page.apply.errInvalidDesc": "কিছু তথ্য সঠিক নয় (যেমন জন্ম তারিখ বা মোবাইল নম্বর)। কিছুই জমা হয়নি।", // (NEW)
  "page.apply.errFileTitle": "একটি নথি গ্রহণ করা যায়নি", // (NEW)
  "page.apply.errFileDesc": "নথি অবশ্যই পিডিএফ, জেপিজি, পিএনজি বা ওয়েবপি ফাইল হতে হবে এবং প্রতিটি ৫ এমবির মধ্যে।", // (NEW)
  "page.apply.errBusyTitle": "অনেকবার চেষ্টা করা হয়েছে", // (NEW)
  "page.apply.errBusyDesc": "কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন।", // (NEW)
  "page.apply.errUnavailableTitle": "এখন জমা দেওয়া যাচ্ছে না", // (NEW)
  "page.apply.errUnavailableDesc": "আবেদন সেবা এখন পাওয়া যাচ্ছে না। আপনার তথ্য পাঠানো হয়নি — পরে আবার চেষ্টা করুন বা যোগাযোগ পাতা ব্যবহার করুন।", // (NEW)
  "page.apply.fileTooBig": "ফাইল ৫ এমবির বেশি", // (NEW)
  "page.apply.fileBadType": "শুধু পিডিএফ বা ছবি", // (NEW)

  /* ---- admission info ---- */
  "page.admission.crumb": "ভর্তি তথ্য",
  "page.admission.title": "ভর্তি তথ্য",
  "page.admission.desc": "পরবর্তী ভর্তি চক্রের আগে ভবিষ্যৎ শিক্ষার্থী ও অভিভাবকদের জানা প্রয়োজনীয় সবকিছু।",
  "page.admission.eligibility": "যোগ্যতা",
  "page.admission.process": "ভর্তি প্রক্রিয়া",
  "page.admission.docs": "প্রয়োজনীয় কাগজপত্র",
  "page.admission.fees": "ফি",
  "page.admission.dates": "গুরুত্বপূর্ণ তারিখ",
  "page.admission.previous": "পূর্ববর্তী ভর্তির তথ্য",
  "page.admission.previousDesc": "সর্বশেষ ভর্তি চক্রে এখানে দেখানো একই যোগ্যতা ও কাগজপত্রের শর্ত অনুসরণ করা হয়েছিল। শ্রেণিভিত্তিক আসন বিতরণ শিক্ষার্থী ও পরিসংখ্যান বিভাগে প্রকাশিত।",
  "page.admission.viewStats": "শিক্ষার্থী ও পরিসংখ্যান দেখুন →",
  "page.admission.relevant": "সংশ্লিষ্ট নোটিশ",
  "page.admission.instructions": "নির্দেশনা", // (NEW)
  "page.admission.allNotices": "সব নোটিশ দেখুন →", // (NEW)
  "page.admission.el1": "আবেদনকৃত শ্রেণির জন্য {board} নির্ধারিত বয়স ও শিক্ষাগত যোগ্যতা প্রযোজ্য।",
  "page.admission.el2": "পূর্ববর্তী শ্রেণি বা পরীক্ষায় উত্তীর্ণ নম্বর/জিপিএ, যেখানে প্রযোজ্য।",
  "page.admission.el3": "ঘোষিত ভর্তি সময়সীমার মধ্যে পূর্ণাঙ্গ আবেদন ফর্ম জমা দিতে হবে।",
  "page.admission.doc1": "জন্ম নিবন্ধন সনদ",
  "page.admission.doc1Desc": "মূল কপি ও একটি ফটোকপি",
  "page.admission.doc2": "পূর্ববর্তী মার্কশিট / ট্রান্সক্রিপ্ট",
  "page.admission.doc2Desc": "সর্বশেষ শিক্ষাগত ট্রান্সক্রিপ্ট",
  "page.admission.doc3": "ছাড়পত্র (ট্রান্সফার সার্টিফিকেট)",
  "page.admission.doc3Desc": "অন্য প্রতিষ্ঠান থেকে স্থানান্তরের ক্ষেত্রে",
  "page.admission.doc4": "পাসপোর্ট সাইজ ছবি",
  "page.admission.doc4Desc": "সাম্প্রতিক ছবির ২ কপি",
  "page.admission.doc5": "অভিভাবকের এনআইডি ফটোকপি",
  "page.admission.doc5Desc": "পিতা-মাতা/অভিভাবকের জাতীয় পরিচয়পত্র",
  "page.admission.feeForm": "ভর্তি ফর্ম",
  "page.admission.feeAdmission": "ভর্তি ফি",
  "page.admission.feeTuition": "মাসিক বেতন",
  "page.admission.dateForm": "ফর্ম সংগ্রহ",
  "page.admission.dateDeadline": "জমা দেওয়ার শেষ সময়",
  "page.admission.dateResult": "ফলাফল প্রকাশ",

  /* ---- contact ---- */
  "page.contact.crumb": "যোগাযোগ",
  "page.contact.title": "যোগাযোগ করুন",
  "page.contact.desc": "তথ্য ও জিজ্ঞাসার জন্য প্রতিষ্ঠানের অফিসে যোগাযোগ করুন।", // (NEW)
  "page.contact.name": "প্রতিষ্ঠানের নাম", // (NEW)
  "page.contact.address": "ঠিকানা",
  "page.contact.eiin": "EIIN",
  "page.contact.mpo": "MPO",
  "page.contact.board": "বোর্ড", // (NEW)
  "page.contact.office": "অফিসের তথ্য", // (NEW)
  "page.contact.officePending": "প্রতিষ্ঠানের অফিস থেকে পাওয়া গেলে ফোন ও ইমেইল এখানে প্রকাশ করা হবে।", // (NEW)
  "page.contact.officeHours": "অফিস সময়", // (NEW)
  "page.contact.phone": "ফোন",
  "page.contact.email": "ইমেইল",
  "page.contact.mapTitle": "প্রতিষ্ঠানের মানচিত্র", // (NEW)
  "page.contact.mapPlaceholder": "মানচিত্র — {place}", // (NEW)

  /* ---- design placeholder content ---- */
  "level.secondary": "মাধ্যমিক",
  "level.higherSecondary": "উচ্চ মাধ্যমিক",
  "page.recognition.p1": "শিক্ষাদানের অনুমতি — মাধ্যমিক স্তর",
  "page.recognition.p2": "স্বীকৃতি — মাধ্যমিক স্তর",
  "page.recognition.p3": "শিক্ষাদানের অনুমতি — উচ্চ মাধ্যমিক স্তর",
  "page.recognition.p4": "স্বীকৃতি — উচ্চ মাধ্যমিক স্তর",
  "page.uniform.u1.audience": "ছাত্র · ৬ষ্ঠ–১০ম শ্রেণি",
  "page.uniform.u1.title": "ছাত্রদের নিয়মিত ইউনিফর্ম",
  "page.uniform.u1.desc": "প্রতিষ্ঠানের মনোগ্রামসহ সাদা শার্ট, নেভি ট্রাউজার, কালো বেল্ট ও কালো জুতা।",
  "page.uniform.u2.audience": "ছাত্রী · ৬ষ্ঠ–১০ম শ্রেণি",
  "page.uniform.u2.title": "ছাত্রীদের নিয়মিত ইউনিফর্ম",
  "page.uniform.u2.desc": "প্রতিষ্ঠানের মনোগ্রামসহ সাদা কামিজ, নেভি সালোয়ার ও ওড়না, কালো জুতা।",
  "page.uniform.u3.audience": "সকল শ্রেণি",
  "page.uniform.u3.title": "খেলাধুলার পোশাক",
  "page.uniform.u3.desc": "হাউস রঙের জার্সি, সাদা ট্রাউজার ও স্পোর্টস শু, ক্রীড়া দিবসে পরিধেয়।",
  "page.uniform.u4.audience": "সকল শ্রেণি",
  "page.uniform.u4.title": "শীতকালীন পোশাক",
  "page.uniform.u4.desc": "প্রতিষ্ঠানের মনোগ্রামসহ নেভি সোয়েটার বা ব্লেজার, নিয়মিত ইউনিফর্মের উপরে পরিধেয়।",

  /* ---- design placeholder people ---- */
  "page.placeholder.teacherName": "শিক্ষকের নাম", // (NEW)
  "page.placeholder.teacherRole": "সহকারী শিক্ষক", // (NEW)
  "page.placeholder.subject": "বিষয়", // (NEW)
  "page.placeholder.qualification": "এম.এ., বি.এড.", // (NEW)
  "page.placeholder.staffName": "কর্মচারীর নাম", // (NEW)
  "page.placeholder.adminRole": "প্রশাসনিক কর্মকর্তা", // (NEW)
  "page.placeholder.adminDept": "অফিস", // (NEW)
  "page.placeholder.supportRole": "সহায়ক কর্মচারী", // (NEW)
  "page.placeholder.supportDept": "সুবিধা ব্যবস্থাপনা", // (NEW)
  "page.placeholder.memberName": "সদস্যের নাম", // (NEW)
  "page.placeholder.memberRole": "কমিটি সদস্য", // (NEW)
  "page.placeholder.memberDetail": "পদবি", // (NEW)
  "page.staff.admin": "প্রশাসনিক কর্মচারী", // (NEW)
  "page.staff.support": "সহায়ক কর্মচারী", // (NEW)
};
