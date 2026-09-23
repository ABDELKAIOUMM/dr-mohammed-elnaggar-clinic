import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import implant1 from "../images/optimized/implant1.webp";
import implant2 from "../images/optimized/implant2.webp";
import implant3 from "../images/optimized/implant3.webp";
import ortho1 from "../images/optimized/ortho1.webp";
import ortho2 from "../images/optimized/ortho2.webp";
import ortho3 from "../images/optimized/ortho3.webp";

export type Lang = "ar" | "en";

const en = {
  dir: "ltr" as "ltr" | "rtl",
  skip: "Skip to booking",
  brandA: "Dr. Mohamed",
  brandB: "El-Naggar",
  nav: {
    treatments: "Treatments",
    why: "Why Dr. El-Naggar",
    visit: "Your Visit",
    reviews: "Reviews",
    plans: "Membership",
    faq: "FAQ",
  },
  book: "Book a visit",
  announceLead: "Now welcoming new patients — same-week appointments",
  announceOffer: "Save 15% on your first whitening treatment",
  hero: {
    rating: "4.9 · 1,247 Google reviews",
    platinum: "Invisalign® Platinum Provider",
    line1: "A calmer kind",
    line2a: "of ",
    line2b: "dental care",
    sub: "3D imaging, same-day crowns and a genuinely gentle touch — care that treats you like a person, not a chart number. No waitlists. No surprises. Just a higher standard.",
    ctaBook: "Book your visit",
    ctaWhatsApp: "Chat on WhatsApp",
    ctaCall: "Call now",
    ctaExplore: "Explore treatments",
    checks: ["Same-week new patients", "0% financing options", "Kids always welcome"],
    imgAlt: "Bright, modern treatment room at Dr. Mohamed El-Naggar's clinic with a premium dental chair",
    nextLabel: "Next opening",
    nextValue: "Today · 4:30 PM",
    reviewsAvg: "4.9 average",
    reviewsCount: "1,247 patient reviews",
    badgeText: "BOOK YOUR VISIT • DR. MOHAMED EL-NAGGAR •",
  },
  booking: {
    h3: "Get in. Get sorted.",
    note: "No deposit · No obligation · Human confirmation",
    namePh: "Your name",
    phonePh: "Phone number",
    treatmentDefault: "New-patient exam",
    timeDefault: "Anytime",
    times: ["Morning", "Afternoon", "Evening (5–7 PM)"],
    submit: "Request my visit",
    successTitle: "You're on the list",
    successBody: "We'll call you within 15 minutes during clinic hours to confirm your visit. In the meantime, emergencies are always welcome — the triage line is answered 24/7.",
    callNow: "Call now",
    another: "Submit another request",
  },
  statsLabel: "Trusted by thousands",
  stats: [
    { value: 15400, suffix: "+", label: "smiles cared for" },
    { value: 4.9, suffix: "★", label: "average patient rating", decimals: 1 },
    { value: 98, suffix: "%", label: "would recommend us" },
    { value: 12, suffix: "", label: "in-house specialists" },
  ],
  partnersLabel: "In-network with the plans you already trust",
  award: "Best Dental Clinic — Portland Metro 2025",
  whyEyebrow: "Why Dr. El-Naggar",
  whyTitleA: "Built for people who",
  whyTitleB: "used to dread this.",
  whySub:
    "Every detail in this clinic — from the lighting to the lab — was designed around one question: what would make us a place you actually look forward to?",
  features: [
    {
      title: "Gentle-first dentistry",
      copy: "Sedation options, noise-cancelling headphones, warm blankets, and a team trained in anxiety care. Telling us you're nervous is the fastest way to get better care here.",
    },
    {
      title: "3D digital scanning",
      copy: "No more goopy impressions or second 'fitting' visits. CBCT imaging maps your smile down to the micron, and your treatment is designed around it.",
    },
    {
      title: "Same-day crowns",
      copy: "In the morning with a cracked molar, out by lunch with a crown milled and sealed in our on-site lab. One visit. Zero temporary teeth.",
    },
    {
      title: "In-house laboratory",
      copy: "Our ceramists craft your veneers and crowns in the building — so your dentist can walk up and check their own work. Most clinics outsource this step. We never have to.",
    },
    {
      title: "Transparent pricing",
      copy: "A written quote before we touch a tooth — itemized, in plain language, with no surprise line items at checkout. If a number changes, we tell you first.",
    },
    {
      title: "Hours that fit real life",
      copy: "Open until 7 PM on weekdays and 9–2 on Saturdays, with evening appointments reserved for new patients. Your schedule isn't ours to make.",
    },
  ],
  treatmentsEyebrow: "Treatments",
  treatmentsTitleA: "One roof,",
  treatmentsTitleB: "every fix your smile could be waiting on.",
  treatments: [
    {
      id: "aligners",
      name: "Clear Aligners",
      tag: "Invisalign® Platinum Provider",
      price: "from $2,400 · or $99/mo",
      duration: "6–18 months",
      blurb:
        "Straighten invisibly with a plan you can preview in 3D before you commit to a single tray. We map every millimeter of movement, then check in every two weeks.",
      points: ["3D smile preview before you start", "Two-week check-in visits", "No wires, no metal, no office closures"],
      image:
        "https://images.pexels.com/photos/28407749/pexels-photo-28407749.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "Hands holding a clear dental aligner in a modern dental office",
    },
    {
      id: "implants",
      name: "Dental Implants",
      tag: "Guided 3D placement",
      price: "from $3,900",
      duration: "2–3 visits",
      blurb:
        "A missing tooth is a problem that never stops growing. Our guided implant program places titanium with surgical precision — and most patients eat normally within a day.",
      points: ["Titanium with a 25-year track record", "Guided 3D surgical placement", "Temporary tooth placed the same visit"],
      image:
        "https://images.pexels.com/photos/6502543/pexels-photo-6502543.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "Close-up of advanced dental instruments at a modern treatment chair",
    },
    {
      id: "veneers",
      name: "Porcelain Veneers",
      tag: "Crafted in our in-house lab",
      price: "from $1,150 / tooth",
      duration: "2 visits",
      blurb:
        "Your ceramist works two floors up from your treatment room — not in another country. Digital smile design means you approve the exact shade and shape before we make it.",
      points: ["In-house ceramists, not out-sourced", "Digital smile design preview", "15-year craftsmanship guarantee"],
      image:
        "https://images.pexels.com/photos/5355899/pexels-photo-5355899.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "Dentist matching a patient's tooth shade with a shade guide",
    },
    {
      id: "whitening",
      name: "Professional Whitening",
      tag: "Enamel-safe formula",
      price: "from $349",
      duration: "90 minutes",
      blurb:
        "In-chair whitening plus take-home trays for an average eight-shade lift that lasts — not the one-hour glow that fades by Friday. New patients save 15% on their first treatment.",
      points: ["Average 8-shade lift", "Enamel-safe, sensitivity-managed", "Take-home trays included"],
      image:
        "https://images.pexels.com/photos/3762402/pexels-photo-3762402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      alt: "Close-up of a bright, healthy smile with white teeth",
    },
    {
      id: "preventive",
      name: "Preventive & Hygiene",
      tag: "The visit that prevents the rest",
      price: "from $149",
      duration: "60 minutes",
      blurb:
        "A gentle air-polish cleaning, digital X-rays, a 3D scan and an oral cancer screen — with a real conversation about what's healthy and what's just a sales pitch. (Usually: nothing.)",
      points: ["3D scan with every visit", "Air-polish cleaning, no scraping marathon", "Straight talk on what you don't need"],
      image:
        "https://images.pexels.com/photos/5355841/pexels-photo-5355841.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "A dentist performing a checkup on a patient in a modern clinic",
    },
    {
      id: "emergency",
      name: "Emergency Care",
      tag: "Same-day, every week",
      price: "from $99 · triage line 24/7",
      duration: "See us today",
      blurb:
        "Cracked tooth at 9 a.m., in the chair by 11. We hold same-day emergency slots every single day, and a real human answers the triage line around the clock.",
      points: ["Same-day slots held daily", "Sedation available for anxious patients", "24/7 triage line with a real human"],
      image:
        "https://images.pexels.com/photos/6627427/pexels-photo-6627427.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "A dentist in gloves examining a patient in a dental chair",
    },
  ],
  treatmentsChoose: "Choose a treatment",
  treatmentsBook: "Book",
  treatmentsAsk: "Ask a question —",
  visitEyebrow: "Your visit, mapped",
  visitTitleA: "From nervous hello to",
  visitTitleB: "“when should I come back?”",
  visitSub:
    "We mapped every minute of a first visit so there's no mystery left. Here's exactly what happens — the same way it happened for the 15,000+ patients before you.",
  visitImgAlt: "A clinician at Dr. Mohamed El-Naggar's clinic gently treating a patient in a modern clinic",
  openUntil: "Open until 7 PM on weekdays",
  afterFirst: "After your first visit, you'll have:",
  firstVisitIncludes: [
    "A full exam, digital X-rays and 3D scan",
    "A written treatment plan + quote within 24 hours",
    "0% or interest-free financing options",
    "A smile map that's yours for life",
  ],
  steps: [
    {
      n: "01",
      title: "Book in two minutes",
      copy: "Pick a time online or call. A human — not a phone tree — confirms your visit within 15 minutes during clinic hours.",
    },
    {
      n: "02",
      title: "Settle in",
      copy: "Noise-cancelling headphones, a warm blanket, and a consult that actually listens. Tell us what you're avoiding. We've heard it all, and it changes how we care for you.",
    },
    {
      n: "03",
      title: "Scan, plan, agree",
      copy: "3D scans and a written, itemized quote before anything begins. You approve every dollar, every step, every timeline. No pressure, ever.",
    },
    {
      n: "04",
      title: "Care that keeps up",
      copy: "Evenings, Saturday hours, reminders that respect your inbox, and a care team that knows your name by your second visit.",
    },
  ],
  stillDelay: "Still putting it off?",
  stillDelaySub: "A two-minute conversation usually fixes that.",
  beforeAfter: {
    eyebrow: "Treated cases",
    titleA: "Case gallery —",
    titleB: "real results with our doctor",
    sub: "Real photos of cases completed inside the clinic — clear proof of the quality of care and precision in every detail.",
    cta: "Book your free consultation",
    cases: [
      {
        id: "ortho1",
        tag: "Orthodontics",
        title: "Front teeth alignment",
        subtitle: "Invisalign clear aligners",
        info: "6 months — only 12 visits",
        image: ortho1,
      },
      {
        id: "ortho2",
        tag: "Orthodontics",
        title: "Crowding correction",
        subtitle: "Clear aligners, upper arch",
        info: "8 months — no extractions",
        image: ortho2,
      },
      {
        id: "ortho3",
        tag: "Orthodontics",
        title: "Spacing & bite correction",
        subtitle: "Aligner + retention phase",
        info: "10 months — 14 visits",
        image: ortho3,
      },
      {
        id: "implant1",
        tag: "Implants",
        title: "Single tooth implant",
        subtitle: "Titanium implant + zirconia crown",
        info: "Same-day temporary crown",
        image: implant1,
      },
      {
        id: "implant2",
        tag: "Implants",
        title: "Multiple implants",
        subtitle: "Guided 3D implant placement",
        info: "4 implants — 2 visits",
        image: implant2,
      },
      {
        id: "implant3",
        tag: "Implants",
        title: "Full-arch restoration",
        subtitle: "Implant-supported bridge",
        info: "Functional within a week",
        image: implant3,
      },
    ],
  },
  videos: {
    eyebrow: "From our Facebook page",
    title: "Dr. Mohamed Elnaggar Clinic",
    sub: "Short clips from our official Facebook page — science-based tips, real patient experiences, and tours inside the clinic.",
    watchOn: "Watch now",
    close: "Close video",
    openOnFacebook: "Open on Facebook",
    items: [
      {
        id: 1,
        title: "How is a dental implant done in one visit?",
        desc: "A tour inside the implant procedure with a detailed explanation of the technique used.",
        duration: "3:45",
        url: "https://www.facebook.com/reel/3784479525037519",
      },
      {
        id: 2,
        title: "A patient's clear-aligner experience",
        desc: "Maya shares her full Invisalign journey, from her first visit to the final result.",
        duration: "4:12",
        url: "https://www.facebook.com/reel/1643258850471926",
      },
      {
        id: 3,
        title: "Home whitening vs. professional — what's the difference?",
        desc: "Our doctor explains the science and which option lasts without harming enamel.",
        duration: "2:30",
        url: "https://www.facebook.com/reel/1442113301187445",
      },
      {
        id: 4,
        title: "A tour inside our in-clinic lab",
        desc: "Rare footage from our in-house lab where veneers are designed and crafted.",
        duration: "5:08",
        url: "https://www.facebook.com/reel/1728714035015351",
      },
    ],
  },
  reviewsEyebrow: "Patient stories",
  reviewsTitleA: "People stopped",
  reviewsTitleB: "dreading the dentist.",
  reviewsAggregate: "from 1,247 reviews across Google, Yelp & Healthgrades",
  reviewsPrev: "Previous testimonial",
  reviewsNext: "Next testimonial",
  reviewsChoose: "Choose testimonial",
  testimonials: [
    {
      quote:
        "I postponed dental work for a decade because of anxiety. Dr. Reyes walked me through every step, and I genuinely fell asleep in the chair. Three months into Invisalign and I can't stop smiling in photos.",
      name: "Maya T.",
      tag: "Invisalign patient",
      initials: "MT",
    },
    {
      quote:
        "They fit a same-day crown in between my morning meeting and a 6 PM flight. The scan was cleaner and faster than my last MRI. I'm never going back to my old dentist.",
      name: "Daniel O.",
      tag: "Same-day crown",
      initials: "DO",
    },
    {
      quote:
        "My daughter asks to go to the dentist. That sentence did not make sense to me four years ago. The team is patient, warm, and refreshingly honest about what she doesn't need.",
      name: "Priya S.",
      tag: "Family care, 3 kids",
      initials: "PS",
    },
    {
      quote:
        "Transparent pricing isn't a marketing line here — my veneer quote was the exact final number. The in-house lab made a real difference; the shading is flawless.",
      name: "Jordan M.",
      tag: "Porcelain veneers",
      initials: "JM",
    },
    {
      quote:
        "Called at 9 a.m. with a cracked tooth, in the chair by 11. No runaround, no 'come back next week.' The best emergency care I've had anywhere, in any city.",
      name: "Elena R.",
      tag: "Emergency visit",
      initials: "ER",
    },
  ],
  plansEyebrow: "El-Naggar Membership",
  plansTitleA: "Predictable care.",
  plansTitleB: "No bill shock.",
  billingMonthly: "Monthly",
  billingAnnual: "Annual",
  annualBadge: "2 MONTHS FREE",
  billedMonthly: "billed monthly · cancel anytime",
  billedAnnually: "billed annually — two months free",
  perMonth: "/ month",
  mostPopular: "Most popular",
  startPlan: "Start",
  plans: [
    {
      name: "Care",
      blurb: "The essentials, covered.",
      monthly: 29,
      annual: 24,
      featured: false,
      features: [
        "2 exams + cleanings per year",
        "Digital X-rays & 3D scans included",
        "10% off all treatments",
        "No deductibles, no waiting periods",
        "Cancel anytime, keep your records",
      ],
    },
    {
      name: "Smile+",
      blurb: "Our most-loved plan.",
      monthly: 49,
      annual: 41,
      featured: true,
      features: [
        "Everything in Care, plus:",
        "Whitening top-up every 6 months",
        "15% off all treatments",
        "Same-day emergency visits",
        "Free Invisalign 3D scan",
      ],
    },
    {
      name: "Family",
      blurb: "One plan for up to 4 people.",
      monthly: 89,
      annual: 74,
      featured: false,
      features: [
        "Everything in Smile+, plus:",
        "Covers kids up to age 19",
        "20% off all family treatments",
        "Priority scheduling for everyone",
        "Free fluoride treatments for kids",
      ],
    },
  ],
  insuranceNote:
    "Prefer insurance? We're in-network with 40+ major plans — bring your card and we'll verify your benefits before your visit. 0% interest financing available on all treatment plans over $500.",
  faqEyebrow: "Good questions",
  faqTitleA: "Asked often,",
  faqTitleB: "answered honestly.",
  faqSub:
    "If your question isn't here, a real person answers the phone during clinic hours — and texts back after 5 PM.",
  stillCurious: "Still curious?",
  faqs: [
    {
      q: "Do you accept my insurance?",
      a: "We're in-network with 40+ major plans including Delta Dental, Cigna, Aetna, MetLife and Guardian. Bring your card (or a photo of it) before your visit and we'll verify your benefits and explain your coverage before any treatment begins — in plain language, not codes.",
    },
    {
      q: "I'm anxious about dental visits. How do you handle that?",
      a: "Honestly? Better than most places, and it's a core part of how we work. We offer noise-cancelling headphones, weighted blankets, guided-meditation playlists, and sedation options from nitrous to IV. Tell us about the anxiety on your first call — it changes how we schedule, explain, and pace your visit.",
    },
    {
      q: "How fast can a new patient get in?",
      a: "Usually within the week. We reserve evening and Saturday appointments specifically for new patients, and our online booking confirms in about two minutes. If you're in pain, call — same-day emergency slots are held every day.",
    },
    {
      q: "How does same-day crowning actually work?",
      a: "After prepping the tooth, we take a 3D digital scan (no impressions) and our in-house milling machine crafts a porcelain crown while you wait. In 90–120 minutes the crown is shaded, sealed and you're done. No temporaries, no second visit, no goop.",
    },
    {
      q: "What if I have a dental emergency?",
      a: "Call the 24/7 triage line. A real person answers, assesses what's happening, and books you into one of the same-day emergency slots we hold every weekday. Most emergency visits start under two hours from the call.",
    },
    {
      q: "How does a membership work alongside insurance?",
      a: "Memberships are optional and work with or without insurance. If you have insurance, the plan covers everything your plan doesn't — the gap between what insurance pays and what care costs — at a flat monthly rate. If you don't, it replaces it entirely, with no deductibles or network limits.",
    },
    {
      q: "Do you treat children?",
      a: "Yes — we love kids, and our pediatric-friendly team is the reason a lot of our adult patients grew up in this chair. First visits for children are short, playful, and mostly about making sure they never need to hear the words 'dental anxiety.'",
    },
  ],
  ctaBadge: "New patients welcome",
  ctaTitleA: "Your smile is about to have",
  ctaTitleB: "a very good year.",
  ctaSub:
    "New-patient visits include a full exam, 3D scan and a written plan — plus a 15% welcome credit toward your first treatment. Book in under two minutes; we'll handle the rest.",
  ctaBook: "Book my visit",
  ctaChecks: ["Open today until 7 PM", "Same-week appointments", "Emergency slots held daily"],
  footerAbout:
    "Gentle, technology-first dentistry in the heart of Portland. 15,000+ smiles and counting — cared for by people who care.",
  footerExplore: "Explore",
  footerTreatments: "Treatments",
  footerVisit: "Visit us",
  hours: [
    { d: "Monday – Thursday", h: "8:00 – 7:00" },
    { d: "Friday", h: "8:00 – 5:00" },
    { d: "Saturday", h: "9:00 – 2:00" },
    { d: "Sunday", h: "Closed" },
  ],
  rights: "© 2026 Dr. Mohamed El-Naggar. All rights reserved.",
  privacy: "Privacy",
  terms: "Terms",
  accessibility: "Accessibility",
};

export type Content = typeof en;

const ar: Content = {
  dir: "rtl",
  skip: "انتقل إلى الحجز",
  brandA: "Dr. Mohamed",
  brandB: "El-Naggar",
  nav: {
    treatments: "العلاجات",
    why: "لماذا Dr. El-Naggar؟",
    visit: "زيارتك",
    reviews: "آراء المرضى",
    plans: "العضوية",
    faq: "الأسئلة الشائعة",
  },
  book: "احجز موعدك",
  announceLead: "بنستقبل مرضى جدد في عيادتنا في منيا القمح",
  announceOffer: "احجز كشفك بسهولة عن طريق واتساب",
  hero: {
    rating: "4.9 · 1,247 تقييمًا على جوجل",
    platinum: "مزوّد Invisalign® البلاتيني",
    line1: "ابتسامة أحلى تبدأ",
    line2a: "",
    line2b: "من عيادة أسنان موثوقة",
    sub: "في عيادة دكتور محمد النجار في منيا القمح بنقدملك كشف وعلاج أسنان باهتمام، من زراعة وتقويم وتجميل الأسنان لحد التبييض والعلاج العام.",
    ctaBook: "احجز زيارتك",
    ctaWhatsApp: "احجز على واتساب",
    ctaCall: "اتصل الآن",
    ctaExplore: "استكشف العلاجات",
    checks: ["مواعيد قريبة", "حجز سريع على واتساب", "رعاية مناسبة للكبار والأطفال"],
    imgAlt: "دكتور أسنان داخل عيادة دكتور محمد النجار في منيا القمح",
    nextLabel: "أقرب موعد متاح",
    nextValue: "اسأل عن أقرب موعد",
    reviewsAvg: "متوسط التقييم 4.9",
    reviewsCount: "1,247 تقييمًا من المرضى",
    badgeText: "احجز زيارتك • Dr. Mohamed El-Naggar •",
  },
  booking: {
    h3: "احجز كشفك بسهولة",
    note: "املأ البيانات وهنبعت طلبك على واتساب",
    namePh: "اسمك بالكامل",
    phonePh: "رقم الهاتف",
    treatmentDefault: "كشف وعلاج عام",
    timeDefault: "الوقت المناسب ليك",
    times: ["الصبح", "بعد الظهر", "المساء"],
    submit: "احجز على واتساب",
    successTitle: "طلبك جاهز للإرسال",
    successBody:
      "هنراجع بياناتك ونأكد معاك الموعد على واتساب. لو عندك ألم أو حالة طارئة، اكتب لنا وهنتصرف بأسرع وقت.",
    callNow: "اتصل بالعيادة",
    another: "إرسال طلب جديد",
  },
  statsLabel: "رعاية أسنان قريبة منك في منيا القمح",
  stats: [
    { value: 4.9, suffix: "★", label: "متوسط تقييم المرضى", decimals: 1 },
    { value: 5, suffix: "", label: "خدمات أسنان أساسية" },
    { value: 1, suffix: "", label: "موقع قريب في منيا القمح" },
    { value: 100, suffix: "%", label: "اهتمام بكل حالة" },
  ],
  partnersLabel: "اسألنا عن طرق الدفع والتفاصيل قبل العلاج",
  award: "عيادة أسنان في منيا القمح",
  whyEyebrow: "ليه تختار عيادتنا؟",
  whyTitleA: "كشف وعلاج باهتمام",
  whyTitleB: "ومن غير تعقيد.",
  whySub:
    "بنشرح لك حالتك وخيارات العلاج ببساطة، وبنهتم إن زيارتك تكون مريحة وواضحة من أول الكشف لحد المتابعة.",
  features: [
    {
      title: "كشف مريح وواضح",
      copy: "بنسمع شكواك ونشرح لك التشخيص وخطة العلاج خطوة بخطوة، من غير مصطلحات معقدة.",
    },
    {
      title: "تجهيزات حديثة",
      copy: "بنستخدم أدوات وتقنيات حديثة تساعد على دقة الكشف ومتابعة نتيجة العلاج بشكل أفضل.",
    },
    {
      title: "زراعة وتقويم الأسنان",
      copy: "حلول مناسبة للأسنان المفقودة أو غير المنتظمة، مع خطة علاج تناسب حالتك واحتياجك.",
    },
    {
      title: "تجميل وتبييض الأسنان",
      copy: "لو عايز تحسن شكل ابتسامتك، بنساعدك تختار الحل المناسب من تبييض أو تجميل حسب حالتك.",
    },
    {
      title: "خطة علاج مفهومة",
      copy: "هتعرف تفاصيل العلاج والتكلفة المتوقعة قبل البداية، عشان تاخد قرارك وأنت مطمن.",
    },
    {
      title: "حجز سريع",
      copy: "ابعت بياناتك على واتساب وهنتواصل معاك لتحديد أقرب موعد مناسب.",
    },
  ],
  treatmentsEyebrow: "العلاجات",
  treatmentsTitleA: "سقف واحد،",
  treatmentsTitleB: "كل ما تنتظره ابتسامتك.",
  treatments: [
    {
      id: "aligners",
      name: "تقويم الأسنان الشفاف",
      tag: "مزوّد Invisalign® البلاتيني",
      price: "ابتداءً من 2,400$ · أو 99$/شهر",
      duration: "6–18 شهرًا",
      blurb:
        "قوِّم أسنانك بشفافية مع خطة تشاهدها ثلاثية الأبعاد قبل أن تلتزم بأي مرحلة. نرسم كل مليمتر من الحركة، ثم نتابع معك كل أسبوعين.",
      points: ["معاينة ثلاثية الأبعاد لابتسامتك قبل البدء", "زيارات متابعة كل أسبوعين", "بلا أسلاك ولا معدن ولا مواعيد مؤجلة"],
      image:
        "https://images.pexels.com/photos/28407749/pexels-photo-28407749.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "يدان تحملان مقوّم أسنان شفافًا في عيادة أسنان عصرية",
    },
    {
      id: "implants",
      name: "زراعة الأسنان",
      tag: "زراعة موجهة ثلاثية الأبعاد",
      price: "ابتداءً من 3,900$",
      duration: "2–3 زيارات",
      blurb:
        "السن المفقود مشكلة لا تتوقف عن التفاقم. برنامجنا للزراعة الموجهة يثبّت التيتانيوم بدقة جراحية — ومعظم المرضى يأكلون طبيعيًا خلال يوم.",
      points: ["تيتانيوم بسجلٍّ موثوق لـ25 عامًا", "زراعة جراحية موجهة ثلاثية الأبعاد", "سنٌّ مؤقت يُثبَّت في نفس الزيارة"],
      image:
        "https://images.pexels.com/photos/6502543/pexels-photo-6502543.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "لقطة مقربة لأدوات أسنان متقدمة عند كرسي علاج عصري",
    },
    {
      id: "veneers",
      name: "قشور البورسلان",
      tag: "تصنيع في مختبرنا الداخلي",
      price: "ابتداءً من 1,150$ / للسن",
      duration: "زيارتان",
      blurb:
        "فني الأسنان يعمل في طابق أعلى منك — لا في بلد آخر. التصميم الرقمي للابتسامة يعني أنك تعتمد اللون والشكل بنفسك قبل التصنيع.",
      points: ["فنيو أسنان داخليون بلا استيراد", "معاينة رقمية لتصميم الابتسامة", "ضمان 15 عامًا على الإتقان"],
      image:
        "https://images.pexels.com/photos/5355899/pexels-photo-5355899.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "طبيب أسنان يطابق لون سن مريض باستخدام دليل الألوان",
    },
    {
      id: "whitening",
      name: "تبييض الأسنان الاحترافي",
      tag: "تركيبة آمنة للمينا",
      price: "ابتداءً من 349$",
      duration: "90 دقيقة",
      blurb:
        "تبييض داخل العيادة مع قوالب منزلية لنتيجة تتحسن بمتوسط 8 درجات وتدوم — لا توهّج ساعة يختفي قبل الجمعة. المرضى الجدد يوفرون 15% على أول علاج.",
      points: ["تحسّن بمتوسط 8 درجات", "آمن للمينا مع إدارة الحساسية", "قوالب منزلية مشمولة"],
      image:
        "https://images.pexels.com/photos/3762402/pexels-photo-3762402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      alt: "لقطة مقربة لابتسامة مشرقة وصحية بأسنان بيضاء",
    },
    {
      id: "preventive",
      name: "الوقاية والتنظيف",
      tag: "الزيارة التي تمنع كل ما عداها",
      price: "ابتداءً من 149$",
      duration: "60 دقيقة",
      blurb:
        "تنظيف لطيف بتقنية الهواء، أشعة رقمية، مسح ثلاثي الأبعاد، وفحص شامل — مع حديث صادق عما هو صحيٌّ فعلًا وما هو مجرد عرض بيع. (غالبًا: لا شيء.)",
      points: ["مسح ثلاثي الأبعاد مع كل زيارة", "تنظيف بالهواء بلا كشط مطوّل", "صراحة تامة عما لا تحتاجه"],
      image:
        "https://images.pexels.com/photos/5355841/pexels-photo-5355841.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "طبيب أسنان يجري فحصًا لمريض في عيادة عصرية",
    },
    {
      id: "emergency",
      name: "طب الطوارئ",
      tag: "في نفس اليوم، كل أسبوع",
      price: "ابتداءً من 99$ · خط فرز 24/7",
      duration: "نراك اليوم",
      blurb:
        "سنٌّ مكسور في التاسعة صباحًا، وأنت على الكرسي الحادية عشرة. نحجز مواعيد طوارئ في نفس اليوم يوميًا، وشخص حقيقي يرد على خط الفرز على مدار الساعة.",
      points: ["مواعيد نفس اليوم محجوزة يوميًا", "تهدئة متاحة للمرضى القلقين", "خط فرز 24/7 يرد عليه إنسان"],
      image:
        "https://images.pexels.com/photos/6627427/pexels-photo-6627427.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "طبيب أسنان بقفازات يفحص مريضًا على كرسي العلاج",
    },
  ],
  treatmentsChoose: "اختر العلاج",
  treatmentsBook: "احجز",
  treatmentsAsk: "اسأل سؤالًا —",
  visitEyebrow: "زيارتك عندنا",
  visitTitleA: "من أول مكالمة لحد",
  visitTitleB: "خطة العلاج المناسبة ليك.",
  visitSub:
    "بنخلي الزيارة بسيطة وواضحة: نسمع شكواك، نكشف عليك، ونشرح لك الحلول المناسبة من غير ضغط.",
  visitImgAlt: "عيادة أسنان حديثة وتجهيزات علاج داخل عيادة دكتور محمد النجار في منيا القمح",
  openUntil: "اتواصل معانا لمعرفة أقرب موعد",
  afterFirst: "بعد الكشف هتعرف:",
  firstVisitIncludes: [
    "سبب المشكلة وخيارات العلاج المناسبة",
    "الخطوات المتوقعة ومدة العلاج",
    "التكلفة المتوقعة قبل بدء العلاج",
    "ميعاد متابعة مناسب لحالتك",
  ],
  steps: [
    {
      n: "01",
      title: "ابعت بياناتك",
      copy: "اكتب اسمك ورقمك ونوع الكشف والوقت المناسب، وابعت الطلب على واتساب.",
    },
    {
      n: "02",
      title: "اتكلم معانا",
      copy: "هنسألك عن شكوتك ونحدد معاك أقرب موعد يناسبك.",
    },
    {
      n: "03",
      title: "كشف وخطة علاج",
      copy: "الدكتور يكشف عليك ويشرح لك التشخيص وخيارات العلاج والتكلفة المتوقعة قبل البداية.",
    },
    {
      n: "04",
      title: "متابعة مستمرة",
      copy: "هنفضل متابعين معاك خطوة بخطوة لحد ما توصل لأفضل نتيجة ممكنة.",
    },
  ],
  stillDelay: "ما زلت تؤجل؟",
  stillDelaySub: "مكالمة دقيقتين عادةً تحل كل شيء.",
  beforeAfter: {
    eyebrow: "الحالات المعالجة",
    titleA: "شوف بعض الحالات —",
    titleB: "نتائج نهتم بتفاصيلها",
    sub: "أمثلة لحالات في التقويم والزراعة، والنتيجة النهائية بتختلف حسب حالة كل شخص.",
    cta: "احجز كشفك",
    cases: [
      {
        id: "ortho1",
        tag: "تقويم",
        title: "تقويم الأسنان الأمامية",
        subtitle: "تقويم شفاف Invisalign",
        info: "6 أشهر — 12 زيارة فقط",
        image: ortho1,
      },
      {
        id: "ortho2",
        tag: "تقويم",
        title: "تصحيح تزاحم الأسنان",
        subtitle: "تقويم شفاف للفك العلوي",
        info: "8 أشهر — بدون خلع",
        image: ortho2,
      },
      {
        id: "ortho3",
        tag: "تقويم",
        title: "معالجة الفراغات والإطباق",
        subtitle: "تقويم مع مرحلة تثبيت",
        info: "10 أشهر — 14 زيارة",
        image: ortho3,
      },
      {
        id: "implant1",
        tag: "زراعة",
        title: "زراعة سن واحد",
        subtitle: "زرعة تيتانيوم + تاج زيركون",
        info: "تاج مؤقت في نفس اليوم",
        image: implant1,
      },
      {
        id: "implant2",
        tag: "زراعة",
        title: "زراعة أسنان متعددة",
        subtitle: "زراعة موجهة بتقنية 3D",
        info: "4 زرعات — زيارتان",
        image: implant2,
      },
      {
        id: "implant3",
        tag: "زراعة",
        title: "ترميم الفك الكامل",
        subtitle: "جسر مثبت على زرعات",
        info: "وظيفة كاملة خلال أسبوع",
        image: implant3,
      },
    ],
  },
  videos: {
    eyebrow: "من صفحة العيادة على فيسبوك",
    title: "Dr. Mohamed Elnaggar Clinic",
    sub: "فيديوهات قصيرة فيها نصائح عن الأسنان، شرح للخدمات، ولمحات من شغل العيادة.",
    watchOn: "شاهد الآن",
    close: "إغلاق الفيديو",
    openOnFacebook: "شاهد على فيسبوك",
    items: [
      {
        id: 1,
        title: "كيف تتم زراعة الأسنان في زيارة واحدة؟",
        desc: "جولة داخل عملية الزراعة مع شرح مفصل من الدكتور عن التقنية المستخدمة.",
        duration: "3:45",
        url: "https://www.facebook.com/reel/3784479525037519",
      },
      {
        id: 2,
        title: "تجربة مريضة مع التقويم الشفاف",
        desc: "مايا تشارك تجربتها الكاملة مع Invisalign من أول زيارة حتى النتيجة النهائية.",
        duration: "4:12",
        url: "https://www.facebook.com/reel/1643258850471926",
      },
      {
        id: 3,
        title: "ما الفرق بين التبييض المنزلي والطبي؟",
        desc: "الدكتور يشرح الفروقات العلمية وأيهما يدوم دون الإضرار بالمينا.",
        duration: "2:30",
        url: "https://www.facebook.com/reel/1442113301187445",
      },
      {
        id: 4,
        title: "جولة داخل مختبر العيادة",
        desc: "لقطات نادرة من مختبرنا الداخلي حيث تُصمَّم القشور وتُصنَع.",
        duration: "5:08",
        url: "https://www.facebook.com/reel/1728714035015351",
      },
    ],
  },
  reviewsEyebrow: "آراء المرضى",
  reviewsTitleA: "تجارب ناس زارتنا",
  reviewsTitleB: "وخرجت مطمنة.",
  reviewsAggregate: "آراء وتجارب مرضى عن خدمات العيادة",
  reviewsPrev: "التقييم السابق",
  reviewsNext: "التقييم التالي",
  reviewsChoose: "اختر تقييمًا",
  testimonials: [
    {
      quote:
        "أجّلت علاج أسناني عشر سنوات بسبب الخوف. الدكتورة رييس شرحت لي كل خطوة، ونمتُ فعلًا على الكرسي. بعد ثلاثة أشهر من Invisalign لا أتوقف عن الابتسام في الصور.",
      name: "مايا ت.",
      tag: "مريضة Invisalign",
      initials: "ما",
    },
    {
      quote:
        "ركّبوا لي تاجًا في نفس اليوم بين اجتماعي الصباحي ورحلتي السادسة مساءً. المسح الرقمي كان أسرع وأنظف من آخر رنين مغناطيسي أجرّيته. لن أعود لطبيبي القديم أبدًا.",
      name: "دانيال ع.",
      tag: "تاج في نفس اليوم",
      initials: "دا",
    },
    {
      quote:
        "ابنتي تطلب الذهاب إلى طبيب الأسنان. هذه الجملة لم تكن منطقية قبل أربع سنوات. الفريق صبور ودافئ وصادق بشكل منعش بشأن ما لا تحتاجه.",
      name: "بريا س.",
      tag: "رعاية عائلية، 3 أطفال",
      initials: "بر",
    },
    {
      quote:
        "الأسعار الشفافة ليست شعارًا تسويقيًا هنا — عرض سعر القشور كان الرقم النهائي نفسه. المختبر الداخلي أحدث فرقًا حقيقيًا؛ تدرّج اللون لا تشوبه شائبة.",
      name: "جوردان م.",
      tag: "قشور بورسلان",
      initials: "جو",
    },
    {
      quote:
        "اتصلت في التاسعة صباحًا بسن مكسور، وكنت على الكرسي في الحادية عشرة. لا مماطلة ولا «عد الأسبوع القادم». أفضل رعاية طوارئ تلقيتها في أي مدينة.",
      name: "إيلينا ر.",
      tag: "زيارة طوارئ",
      initials: "إي",
    },
  ],
  plansEyebrow: "عضوية Dr. El-Naggar",
  plansTitleA: "رعاية متوقعة.",
  plansTitleB: "بلا مفاجآت في الفاتورة.",
  billingMonthly: "شهري",
  billingAnnual: "سنوي",
  annualBadge: "شهران مجانًا",
  billedMonthly: "يُدفع شهريًا · ألغِ متى شئت",
  billedAnnually: "يُدفع سنويًا — شهران مجانًا",
  perMonth: "/ شهريًا",
  mostPopular: "الأكثر شعبية",
  startPlan: "اشترك في",
  plans: [
    {
      name: "الرعاية",
      blurb: "الأساسيات، مغطاة.",
      monthly: 29,
      annual: 24,
      featured: false,
      features: [
        "فحصان وتنظيفان سنويًا",
        "أشعة رقمية ومسح ثلاثي الأبعاد مشمولان",
        "خصم 10% على كل العلاجات",
        "بلا تحمّل ولا فترات انتظار",
        "ألغِ متى شئت واحتفظ بملفك",
      ],
    },
    {
      name: "سمايل بلس",
      blurb: "خطتنا الأكثر حبًّا.",
      monthly: 49,
      annual: 41,
      featured: true,
      features: [
        "كل مزايا الرعاية، بالإضافة إلى:",
        "جلسة تبييض تعزيزية كل 6 أشهر",
        "خصم 15% على كل العلاجات",
        "مواعيد طوارئ في نفس اليوم",
        "مسح Invisalign ثلاثي الأبعاد مجانًا",
      ],
    },
    {
      name: "العائلة",
      blurb: "خطة واحدة حتى 4 أشخاص.",
      monthly: 89,
      annual: 74,
      featured: false,
      features: [
        "كل مزايا سمايل بلس، بالإضافة إلى:",
        "تغطية الأطفال حتى 19 عامًا",
        "خصم 20% على علاجات العائلة",
        "أولوية في الجدولة للجميع",
        "فلورايد مجاني للأطفال",
      ],
    },
  ],
  insuranceNote:
    "تفضّل التأمين؟ نحن متعاقدون مع أكثر من 40 شركة تأمين — أحضر بطاقتك وسنتحقق من تغطيتك قبل زيارتك. تمويل بفوائد 0% متاح لكل خطط العلاج فوق 500$.",
  faqEyebrow: "أسئلة جيدة",
  faqTitleA: "تُطرح كثيرًا،",
  faqTitleB: "ونجيب بصدق.",
  faqSub:
    "إن لم يكن سؤالك هنا، فإنسان حقيقي يرد على الهاتف أثناء ساعات العمل — ويرد على الرسائل بعد الخامسة مساءً.",
  stillCurious: "ما زلت تتساءل؟",
  faqs: [
    {
      q: "أحجز كشف أسنان إزاي في منيا القمح؟",
      a: "ابعت اسمك ورقم تليفونك ونوع الكشف والوقت المناسب على واتساب، وهنرد عليك لتأكيد أقرب موعد متاح.",
    },
    {
      q: "بتقدموا زراعة وتقويم وتجميل الأسنان؟",
      a: "أيوه، بنقدم خدمات زراعة الأسنان، التقويم، تجميل وتبييض الأسنان، بالإضافة للكشف والعلاج العام حسب احتياج كل حالة.",
    },
    {
      q: "هل الكشف مناسب للأطفال؟",
      a: "بنستقبل الأطفال و بنحاول نخلي الكشف بسيط ومريح، ونشرح لولي الأمر حالة الطفل والخطوات المقترحة بوضوح.",
    },
    {
      q: "زراعة الأسنان بتحتاج كام زيارة؟",
      a: "عدد الزيارات بيتحدد بعد الكشف والأشعة حسب حالة العظم والسن، والدكتور بيشرح لك الخطة والمدة المتوقعة قبل بدء العلاج.",
    },
    {
      q: "هل بتعملوا تبييض أسنان؟",
      a: "أيوه، بنحدد الأول سبب تغير لون الأسنان ونرشح لك طريقة التبييض الأنسب لحالتك مع شرح النتيجة المتوقعة.",
    },
    {
      q: "هل السعر بيتحدد قبل العلاج؟",
      a: "بعد الكشف بنشرح لك الاختيارات والتكلفة المتوقعة قبل بداية العلاج، عشان تكون كل التفاصيل واضحة قدامك.",
    },
    {
      q: "فين مكان العيادة؟",
      a: "العيادة موجودة في منيا القمح، وتقدر تضغط على قسم الخريطة في الموقع عشان تفتح الاتجاهات على Google Maps.",
    },
  ],
  ctaBadge: "نستقبل مرضى جددًا",
  ctaTitleA: "ابتسامتك على وشك",
  ctaTitleB: "أن تعيش عامًا رائعًا.",
  ctaSub:
    "زيارة المريض الجديد تشمل فحصًا كاملًا ومسحًا ثلاثي الأبعاد وخطة مكتوبة — إضافة إلى رصيد ترحيبي بخصم 15% على أول علاج. احجز في أقل من دقيقتين؛ ونحن نتكفل بالباقي.",
  ctaBook: "احجز زيارتي",
  ctaChecks: ["مفتوح اليوم حتى 7 م", "مواعيد خلال نفس الأسبوع", "مواعيد طوارئ محجوزة يوميًا"],
  footerAbout:
    "عيادة دكتور محمد النجار لطب الأسنان في منيا القمح، بنقدم رعاية واضحة ومريحة وخدمات متنوعة لابتسامة صحية.",
  footerExplore: "استكشف",
  footerTreatments: "العلاجات",
  footerVisit: "زورنا",
  hours: [
    { d: "الاثنين – الخميس", h: "8:00 – 7:00" },
    { d: "الجمعة", h: "8:00 – 5:00" },
    { d: "السبت", h: "9:00 – 2:00" },
    { d: "الأحد", h: "مغلق" },
  ],
  rights: "© 2026 عيادة دكتور محمد النجار لطب الأسنان. جميع الحقوق محفوظة.",
  privacy: "الخصوصية",
  terms: "الشروط",
  accessibility: "إمكانية الوصول",
};

const content: Record<Lang, Content> = { ar, en };

const titles: Record<Lang, string> = {
  ar: "دكتور محمد النجار | عيادة أسنان في منيا القمح",
  en: "Dr. Mohamed El-Naggar — Gentle, modern dentistry in Portland",
};

type I18nValue = { lang: Lang; setLang: (l: Lang) => void; t: Content };
const Ctx = createContext<I18nValue>(null!);

export function I18nProvider({ children }: { children: ReactNode }) {
  /*
   * The initial language is read from `<html lang>`, not from `localStorage`.
   *
   * The document ships a static Arabic hero and is hydrated, so the first client
   * render has to produce exactly the markup that is already on the page. The
   * inline script in `index.html` has already resolved the stored preference into
   * `lang`/`dir` before paint, which makes that attribute the single source of
   * truth both sides agree on. Reading `localStorage` here instead would let a
   * returning English visitor hydrate an Arabic document with an English tree —
   * a mismatch React would resolve by discarding the static hero.
   */
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof document !== "undefined" && document.documentElement.lang === "en") {
      return "en";
    }
    return "ar";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("md-lang", l);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = content[lang].dir;
    document.title = titles[lang];
  }, [lang]);

  return <Ctx.Provider value={{ lang, setLang, t: content[lang] }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);

export const PHONE = "01129114212";
export const PHONE_HREF = "tel:01129114212";
export const WHATSAPP_HREF = "https://wa.me/201129114212";
export const ADDRESS_EN = "Minya Al-Qamh, Sharqia, Egypt";
export const ADDRESS_AR = "منيا القمح، الشرقية، مصر";
export const EMAIL = "";
