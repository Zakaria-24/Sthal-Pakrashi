/** Fictional preview content. All records are marked isDemo by the importer. */
const campus = "/fallback/campus-academic-building.png";
const playground = "/fallback/campus-playground.png";
const eventsPhoto = "/fallback/event-annual-day.png";

export const demoContent = {
  banners: [
    { title: "শিখি, গড়ি, এগিয়ে যাই", subtitle: "Learning together, growing together · DEMO PREVIEW", imageUrl: "/fallback/SPISC-Banner.png", ctaLabel: "আমাদের সম্পর্কে", ctaLink: "/about", order: 10 },
    { title: "শ্রেণিকক্ষে কৌতূহল ও সৃজনশীলতা", subtitle: "A classroom learning concept · DEMO PREVIEW", imageUrl: "/fallback/hero-classroom.png", ctaLabel: "শিক্ষা কার্যক্রম", ctaLink: "/academics", order: 11 },
    { title: "সবুজ প্রাঙ্গণে সহশিক্ষা", subtitle: "A campus life concept · DEMO PREVIEW", imageUrl: playground, ctaLabel: "ক্যাম্পাস গ্যালারি", ctaLink: "/gallery", order: 12 },
  ],
  notices: [
    ["শ্রেণি কার্যক্রমের নমুনা বিজ্ঞপ্তি", "Sample class activity notice. This fictional preview is not an official school announcement.", "general", "2026-10-25"],
    ["পাঠ পরিকল্পনা হালনাগাদ — নমুনা", "A sample reminder to check class learning plans. DEMO ONLY; no official schedule is announced.", "exam", "2026-10-27"],
    ["অভিভাবক মতবিনিময় — নমুনা", "Illustrative parent and teacher discussion notice. Date and details are fictional.", "event", "2026-11-02"],
    ["পাঠাগার পাঠসপ্তাহ — নমুনা", "An example reading week announcement for preview purposes only.", "event", "2026-11-08"],
    ["সাংস্কৃতিক পরিবেশনা — নমুনা", "Sample student cultural activity announcement; not an actual scheduled event.", "event", "2026-11-14"],
    ["ক্রীড়া অনুশীলন — নমুনা", "Illustrative sports activity notice. Please do not treat as an official timetable.", "event", "2026-11-20"],
    ["শীতকালীন ছুটির তথ্য — নমুনা", "Sample holiday information card. The institution has not published these dates.", "holiday", "2026-11-25"],
    ["বিজ্ঞান প্রকল্প প্রদর্শনী — নমুনা", "Fictional project showcase notice for CMS preview only.", "general", "2026-12-02"],
  ].map(([title, description, category, publishedAt], order) => ({ title, description: `${description} DEMO`, category, publishedAt, isPinned: order === 0, order })),
  events: [
    ["বার্ষিক ক্রীড়া অনুশীলন (নমুনা)", "sports", "2026-11-20", "A fictional sports day concept for website preview. DEMO ONLY.", playground],
    ["বিজ্ঞান প্রকল্প প্রদর্শনী (নমুনা)", "academic", "2026-12-02", "An illustrative student project showcase, not an actual scheduled event. DEMO ONLY.", campus],
    ["সাংস্কৃতিক পরিবেশনা (নমুনা)", "cultural", "2026-12-10", "A fictional cultural programme concept for CMS preview. DEMO ONLY.", eventsPhoto],
    ["বিতর্ক অনুশীলন (নমুনা)", "academic", "2027-01-12", "Illustrative debate activity. This date and event are fictional. DEMO ONLY.", "/fallback/hero-classroom.png"],
    ["বৃক্ষরোপণ কার্যক্রম (নমুনা)", "other", "2027-02-05", "A sample campus activity concept; it does not describe an actual event. DEMO ONLY.", playground],
    ["পাঠসপ্তাহ (নমুনা)", "academic", "2027-02-18", "Fictional reading week preview card. DEMO ONLY.", campus],
  ].map(([title, category, startDate, description, imageUrl]) => ({ title, category, startDate, description, imageUrl, venue: "নমুনা স্থান · Demo venue", isFeatured: false })),
  gallery: [
    ["প্রধান ভবন · নমুনা ছবি", "campus", campus], ["শিক্ষাঙ্গনের দৃশ্য · নমুনা", "campus", "/fallback/SPISC-About.png"],
    ["খেলার মাঠ · নমুনা", "sports", playground], ["শ্রেণিকক্ষ · নমুনা", "classroom", "/fallback/hero-classroom.png"],
    ["বার্ষিক আয়োজনের ভিজ্যুয়াল · নমুনা", "events", eventsPhoto], ["ক্যাম্পাস প্রাঙ্গণ · নমুনা", "campus", "/fallback/campus-academic-building.png"],
    ["খেলাধুলার মুহূর্ত · নমুনা", "sports", "/fallback/event-sports-day.png"], ["শিক্ষা কার্যক্রম · নমুনা", "classroom", "/fallback/hero-classroom.png"],
    ["বিদ্যালয় আয়োজন · নমুনা", "events", "/fallback/event-school-fair.png"], ["বার্ষিক দিবস · নমুনা", "cultural", "/fallback/event-annual-day.png"],
    ["সবুজ প্রাঙ্গণ · নমুনা", "campus", playground], ["ক্রীড়া আয়োজন · নমুনা", "sports", "/fallback/event-sports-day-2.png"],
  ].map(([title, category, imageUrl], order) => ({ title, caption: `${title} · Demo preview image`, category, imageUrl, order, tags: ["demo", "preview"] })),
  teachers: ["আরিফুল ইসলাম", "নুসরাত জাহান", "সায়মা আক্তার", "তানভীর হাসান", "ফারজানা ইয়াসমিন", "মাহমুদুল হাসান"].map((name, order) => ({ name: `${name} (নমুনা)`, designation: "নমুনা শিক্ষক · Demo profile", subject: ["বাংলা", "গণিত", "বিজ্ঞান", "ইংরেজি", "সামাজিক বিজ্ঞান", "তথ্য ও যোগাযোগ প্রযুক্তি"][order], qualification: "কাল্পনিক প্রোফাইল · Demo only", order })),
  alumni: ["রাইসা রহমান", "সাদমান কবির", "তাসনিম আক্তার", "ইমরান হোসেন"].map((name, order) => ({ name: `${name} (নমুনা)`, passingYear: "", occupation: "কাল্পনিক প্রোফাইল · Demo only", testimonial: "এটি একটি সম্পূর্ণ কাল্পনিক নমুনা লেখা; কোনো প্রকৃত প্রাক্তন শিক্ষার্থীর বক্তব্য নয়। DEMO ONLY.", order })),
  programs: [
    { title: "ষষ্ঠ–দশম শ্রেণি (নমুনা)", level: "secondary", description: "শ্রেণি পরিচিতি প্রদর্শনের জন্য নমুনা; অনুমোদিত বিভাগ বা ভর্তি তথ্য নয়। DEMO ONLY.", order: 1 },
    { title: "উচ্চমাধ্যমিক — বিজ্ঞান (নমুনা)", level: "higher-secondary", description: "শিক্ষাক্রমের CMS প্রদর্শনী কনটেন্ট। DEMO ONLY.", order: 2 },
    { title: "উচ্চমাধ্যমিক — মানবিক (নমুনা)", level: "higher-secondary", description: "শিক্ষাক্রমের CMS প্রদর্শনী কনটেন্ট। DEMO ONLY.", order: 3 },
    { title: "উচ্চমাধ্যমিক — ব্যবসায় শিক্ষা (নমুনা)", level: "higher-secondary", description: "শিক্ষাক্রমের CMS প্রদর্শনী কনটেন্ট। DEMO ONLY.", order: 4 },
  ],

  /* ---- v2: collections that were still empty (2026-10-27) ---- */
  messages: [
    { name: "মোহাম্মদ আব্দুল করিম (নমুনা)", role: "chairman", designation: "সভাপতি, পরিচালনা পর্ষদ · Demo profile", message: "শিক্ষার্থীদের নৈতিকতা, দেশপ্রেম ও আধুনিক জ্ঞানে গড়ে তোলাই আমাদের অঙ্গীকার। এটি একটি কাল্পনিক নমুনা বাণী; কোনো প্রকৃত ব্যক্তির বক্তব্য নয়। DEMO ONLY.", order: 1 },
    { name: "শাহানা পারভীন (নমুনা)", role: "head-teacher", designation: "প্রধান শিক্ষক · Demo profile", message: "প্রতিটি শিক্ষার্থীর সম্ভাবনা বিকাশে আমরা শ্রেণিকক্ষ, সহশিক্ষা ও অভিভাবকের সঙ্গে নিয়মিত যোগাযোগকে সমান গুরুত্ব দিই। এটি একটি কাল্পনিক নমুনা বাণী। DEMO ONLY.", order: 2 },
    { name: "রফিকুল ইসলাম (নমুনা)", role: "assistant-head-teacher", designation: "সহকারী প্রধান শিক্ষক · Demo profile", message: "শৃঙ্খলা ও পারস্পরিক শ্রদ্ধার পরিবেশেই শেখা আনন্দময় হয়। এটি একটি কাল্পনিক নমুনা বাণী। DEMO ONLY.", order: 3 },
  ],
  founders: [
    { name: "প্রতিষ্ঠাতা — নাম প্রকাশিত হয়নি (নমুনা)", designation: "প্রতিষ্ঠাতা · Demo profile", education: "কাল্পনিক প্রোফাইল · Demo only", message: "এলাকার প্রতিটি শিশুর কাছে মানসম্মত শিক্ষা পৌঁছে দেওয়ার স্বপ্ন থেকেই এই প্রতিষ্ঠানের যাত্রা। এটি একটি কাল্পনিক নমুনা বাণী; প্রতিষ্ঠাতার প্রকৃত তথ্য প্রতিষ্ঠান প্রকাশ করলে এটি প্রতিস্থাপন করুন। DEMO ONLY.", order: 1 },
  ],
  committee: [
    ["মোহাম্মদ আব্দুল করিম", "সভাপতি"], ["নাসির উদ্দিন", "অভিভাবক সদস্য"], ["রোকেয়া বেগম", "সংরক্ষিত মহিলা অভিভাবক সদস্য"],
    ["কামরুল হাসান", "শিক্ষক প্রতিনিধি"], ["সেলিনা আক্তার", "শিক্ষক প্রতিনিধি"], ["শাহানা পারভীন", "সদস্য সচিব (প্রধান শিক্ষক)"],
  ].map(([name, designation], order) => ({ name: `${name} (নমুনা)`, designation, education: "কাল্পনিক প্রোফাইল · Demo only", order })),
  staff: [
    ["জাহিদুল ইসলাম", "অফিস সহকারী", "administrative", "প্রশাসন"], ["মরিয়ম খাতুন", "হিসাবরক্ষক", "administrative", "হিসাব শাখা"],
    ["আসাদুজ্জামান", "কম্পিউটার অপারেটর", "administrative", "তথ্য ও যোগাযোগ"], ["নাজমা বেগম", "গ্রন্থাগার সহকারী", "administrative", "গ্রন্থাগার"],
    ["আব্দুর রহিম", "অফিস সহায়ক", "support", "সহায়ক সেবা"], ["হাবিবুর রহমান", "নৈশপ্রহরী", "support", "নিরাপত্তা"],
    ["শাহিদা বেগম", "আয়া", "support", "সহায়ক সেবা"], ["মো. সোহেল", "পরিচ্ছন্নতাকর্মী", "support", "পরিচ্ছন্নতা"],
  ].map(([name, designation, staffType, department], order) => ({ name: `${name} (নমুনা)`, designation, staffType, department, order })),
  videos: [
    { title: "জাতীয় সংগীত — আমার সোনার বাংলা", videoUrl: "https://www.youtube.com/watch?v=HcWecW7-0t8", category: "cultural", description: "সমাবেশে গাওয়া জাতীয় সংগীতের লিরিক্যাল ভিডিও (বাহ্যিক চ্যানেল)। প্রতিষ্ঠানের নিজস্ব ভিডিও নয়। DEMO ONLY.", publishedAt: "2026-10-20", order: 1 },
    { title: "নতুন শিক্ষাক্রমের পাঠ্যপুস্তক ডাউনলোড নির্দেশিকা", videoUrl: "https://www.youtube.com/watch?v=SEtxZW6dWuc", category: "academic", description: "NCTB পাঠ্যপুস্তক কীভাবে ডাউনলোড করবেন — শিক্ষার্থী ও অভিভাবকদের জন্য বাহ্যিক নির্দেশিকা ভিডিও। DEMO ONLY.", publishedAt: "2026-10-18", order: 2 },
    { title: "তোতা কাহিনি — ৭ম শ্রেণি আনন্দপাঠ", videoUrl: "https://www.youtube.com/watch?v=XTok_aaFY7Y", category: "academic", description: "রবীন্দ্রনাথ ঠাকুরের গল্পের পাঠ-আলোচনা (বাহ্যিক চ্যানেল)। প্রতিষ্ঠানের নিজস্ব ভিডিও নয়। DEMO ONLY.", publishedAt: "2026-10-15", order: 3 },  ],
  uniform: [
    { title: "ছাত্রদের পোশাক (নমুনা)", audience: "boys", classLabel: "৬ষ্ঠ–১০ম শ্রেণি", description: "সাদা হাফ/ফুল শার্ট, নেভি ব্লু প্যান্ট, কালো জুতা ও সাদা মোজা। নমুনা বিবরণ — প্রতিষ্ঠানের অনুমোদিত নিয়ম নয়। DEMO ONLY.", order: 1 },
    { title: "ছাত্রীদের পোশাক (নমুনা)", audience: "girls", classLabel: "৬ষ্ঠ–১০ম শ্রেণি", description: "সাদা কামিজ, নেভি ব্লু সালোয়ার ও ওড়না, সাদা কেডস। নমুনা বিবরণ — প্রতিষ্ঠানের অনুমোদিত নিয়ম নয়। DEMO ONLY.", order: 2 },
    { title: "খেলাধুলার পোশাক (নমুনা)", audience: "sports", classLabel: "সকল শ্রেণি", description: "সবুজ টি-শার্ট, ট্র্যাকস্যুট প্যান্ট ও কেডস। নমুনা বিবরণ। DEMO ONLY.", imageUrl: playground, order: 3 },
    { title: "শীতকালীন পোশাক (নমুনা)", audience: "winter", classLabel: "সকল শ্রেণি", description: "নেভি ব্লু সোয়েটার বা ব্লেজার। নমুনা বিবরণ। DEMO ONLY.", order: 4 },
  ],
  recognitions: [
    { title: "নিম্নমাধ্যমিক পাঠদানের অনুমতি (নমুনা)", category: "permission", level: "নিম্নমাধ্যমিক", issuedBy: "মাধ্যমিক ও উচ্চ শিক্ষা অধিদপ্তর", order: 1 },
    { title: "মাধ্যমিক স্তরের স্বীকৃতি (নমুনা)", category: "recognition", level: "মাধ্যমিক", issuedBy: "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড", order: 2 },
    { title: "উচ্চমাধ্যমিক পাঠদানের অনুমতি (নমুনা)", category: "permission", level: "উচ্চমাধ্যমিক", issuedBy: "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড", order: 3 },
    { title: "বোর্ড অধিভুক্তি (নমুনা)", category: "affiliation", level: "মাধ্যমিক ও উচ্চমাধ্যমিক", issuedBy: "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড", order: 4 },
  ],
  classes: [
    ["৬ষ্ঠ শ্রেণি", 2, "none", 58, 52], ["৭ম শ্রেণি", 2, "none", 55, 54], ["৮ম শ্রেণি", 2, "none", 51, 49],
    ["৯ম শ্রেণি", 2, "none", 47, 50], ["১০ম শ্রেণি", 2, "none", 45, 46],
    ["একাদশ শ্রেণি", 1, "science", 32, 28], ["একাদশ শ্রেণি", 1, "humanities", 24, 30], ["একাদশ শ্রেণি", 1, "business", 22, 18],
  ].map(([className, approvedSections, group, boys, girls], order) => ({ className: `${className} (নমুনা)`, approvedSections, group, boys, girls, shift: "day", version: "bangla", order })),
  documents: [
    ["৬ষ্ঠ–১০ম শ্রেণির ক্লাস রুটিন (নমুনা)", "routine", "৬ষ্ঠ–১০ম"], ["একাদশ শ্রেণির ক্লাস রুটিন (নমুনা)", "routine", "একাদশ"],
    ["বার্ষিক পাঠ্যসূচি (নমুনা)", "syllabus", "৬ষ্ঠ–১০ম"], ["অর্ধবার্ষিক পরীক্ষার রুটিন (নমুনা)", "exam-routine", "সকল শ্রেণি"],
    ["পাঠ্যপুস্তক তালিকা (নমুনা)", "book-list", "৬ষ্ঠ–১০ম"], ["শিক্ষাবর্ষ পঞ্জিকা (নমুনা)", "other", "সকল শ্রেণি"],
  ].map(([title, category, classLabel], order) => ({ title, category, classLabel, academicYear: "২০২৭", shift: "day", publishedAt: "2026-10-20", order })),
  posts: [
    { slug: "demo-reading-week", title: "পাঠাগারে পাঠসপ্তাহ: বই পড়ার আনন্দ (নমুনা)", category: "student-activities", imageUrl: campus, excerpt: "শিক্ষার্থীদের পড়ার অভ্যাস গড়ে তুলতে পাঠসপ্তাহের একটি নমুনা প্রতিবেদন।", content: "পাঠসপ্তাহে শিক্ষার্থীরা নিজেদের পছন্দের বই পড়ে, পাঠ-প্রতিক্রিয়া লিখে এবং দলগত আলোচনায় অংশ নেয়।\n\nএটি একটি কাল্পনিক নমুনা লেখা; কোনো প্রকৃত আয়োজনের বিবরণ নয়। DEMO ONLY.", publishedAt: "2026-10-22" },
    { slug: "demo-science-fair", title: "বিজ্ঞান প্রকল্পে শিক্ষার্থীদের উদ্ভাবন (নমুনা)", category: "academic", imageUrl: "/fallback/hero-classroom.png", excerpt: "হাতে-কলমে বিজ্ঞান শেখার গুরুত্ব নিয়ে একটি নমুনা লেখা।", content: "প্রকল্পভিত্তিক শিখন শিক্ষার্থীদের প্রশ্ন করতে, পরীক্ষা করতে এবং ফলাফল ব্যাখ্যা করতে শেখায়।\n\nএটি একটি কাল্পনিক নমুনা লেখা। DEMO ONLY.", publishedAt: "2026-10-18" },
    { slug: "demo-sports-practice", title: "খেলাধুলা ও সুস্থ জীবন (নমুনা)", category: "campus-life", imageUrl: playground, excerpt: "নিয়মিত খেলাধুলা কীভাবে মনোযোগ ও দলগত মনোভাব বাড়ায়।", content: "খেলার মাঠে শেখা শৃঙ্খলা ও সহযোগিতা শ্রেণিকক্ষেও প্রতিফলিত হয়।\n\nএটি একটি কাল্পনিক নমুনা লেখা। DEMO ONLY.", publishedAt: "2026-10-12" },
    { slug: "demo-cultural-day", title: "সাংস্কৃতিক দিবসে শিক্ষার্থীদের পরিবেশনা (নমুনা)", category: "events", imageUrl: eventsPhoto, excerpt: "গান, আবৃত্তি ও নাটকে শিক্ষার্থীদের অংশগ্রহণের একটি নমুনা প্রতিবেদন।", content: "সাংস্কৃতিক চর্চা শিক্ষার্থীদের আত্মবিশ্বাস ও সৃজনশীলতা বাড়ায়।\n\nএটি একটি কাল্পনিক নমুনা লেখা। DEMO ONLY.", publishedAt: "2026-10-05" },
  ].map((post) => ({ ...post, author: "সম্পাদকীয় দল (নমুনা)", status: "published" })),
};

/** Singleton; applied only to fields that are still empty. Fees/dates stay "Not published". */
export const demoAdmissionInfo = {
  academicSession: "২০২৭ (নমুনা)",
  eligibility: [
    "৬ষ্ঠ শ্রেণি: পূর্ববর্তী শ্রেণি উত্তীর্ণ শিক্ষার্থী (নমুনা)",
    "একাদশ শ্রেণি: এসএসসি বা সমমান পরীক্ষায় উত্তীর্ণ (নমুনা)",
    "বোর্ড ও সরকারের সর্বশেষ ভর্তি নীতিমালা প্রযোজ্য (নমুনা)",
  ],
  process: [
    { title: "আবেদন ফরম পূরণ (নমুনা)", description: "অনলাইনে বা অফিস থেকে ফরম সংগ্রহ করে পূরণ করুন।" },
    { title: "কাগজপত্র জমা (নমুনা)", description: "প্রয়োজনীয় কাগজপত্রসহ নির্ধারিত সময়ে জমা দিন।" },
    { title: "যাচাই ও ফলাফল (নমুনা)", description: "যাচাই শেষে নোটিশ বোর্ড ও ওয়েবসাইটে ফলাফল প্রকাশ।" },
  ],
  requiredDocuments: [
    "জন্ম নিবন্ধন সনদের কপি (নমুনা)",
    "পূর্ববর্তী শ্রেণির প্রশংসাপত্র/ট্রান্সক্রিপ্ট (নমুনা)",
    "পাসপোর্ট সাইজের ২ কপি ছবি (নমুনা)",
    "অভিভাবকের জাতীয় পরিচয়পত্রের কপি (নমুনা)",
  ],
  instructions: "এই ভর্তি তথ্য একটি নমুনা (DEMO)। প্রতিষ্ঠানের প্রকৃত ভর্তি বিজ্ঞপ্তি প্রকাশিত হলে Dashboard → Admission info থেকে হালনাগাদ করুন।",
};
