export interface I18nText { fa: string; en: string; }

export type Lang = 'fa' | 'en';
export type Theme = 'dark' | 'light';

export interface SocialAccount {
  id: string;
  platform: 'github' | 'telegram' | 'instagram' | 'x' | 'linkedin' | 'email' | 'website';
  label: I18nText;
  url: string;
  handle?: string;
  enabled: boolean;
  order: number;
}

export interface ProjectItem {
  id: string;
  title: I18nText;
  description: I18nText;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  featured: boolean;
  stars?: number;
}

export interface StatItem {
  id: string;
  label: I18nText;
  value: string;
  suffix?: string;
}

export interface Announcement {
  id: string;
  type: 'news' | 'poll' | 'map' | 'image' | 'text';
  title: I18nText;
  body: I18nText;
  image?: string;
  pinned: boolean;
  archived: boolean;
  hidden: boolean;
  createdAt: string;
  expiresAt?: string;
  pollOptions?: { id: string; label: I18nText; votes: number }[];
  mapLat?: number;
  mapLng?: number;
}

export interface CommentItem {
  id: string;
  name: string;
  email: string;
  role?: string;
  rating: number;
  text: string;
  approved: boolean;
  pinned: boolean;
  createdAt: string;
}

export interface ShopProduct {
  id: string;
  title: I18nText;
  description: I18nText;
  priceUSD?: number;
  priceEUR?: number;
  priceIRR?: number;
  priceTMN?: number;
  priceUSDT?: number;
  discountPercent?: number;
  category: string;
  tags: string[];
  image?: string;
  featured: boolean;
  soldOut: boolean;
  buyUrl?: string;
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject?: string;
  text: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

export interface CmsState {
  version: number;
  identity: {
    fullName: I18nText;
    title: I18nText;
    location: I18nText;
    email: string;
    yearsExperience: number;
    bio: I18nText;
    handle: string;
  };
  brand: {
    logoLetter: string;
    logoImage?: string;
    brandName: I18nText;
    primaryColor: string;
    accentColor: string;
  };
  settings: {
    defaultLanguage: Lang;
    defaultTheme: Theme;
    githubUsername: string;
    editMode: boolean;
  };
  socials: SocialAccount[];
  dashboard: {
    heroTag: I18nText;
    heroTitleA: I18nText;
    heroTitleB: I18nText;
    heroDescription: I18nText;
    ctaPrimary: I18nText;
    ctaSecondary: I18nText;
    projects: ProjectItem[];
    stats: StatItem[];
  };
  about: {
    statusTitle: I18nText;
    metrics: { id: string; label: I18nText; percent: number; color: string }[];
    quickLinks: { id: string; label: I18nText; url: string }[];
    quote: I18nText;
    welcomeTitle: I18nText;
    welcomeBody: I18nText;
    miniProjects: { id: string; title: I18nText; desc: I18nText }[];
    recentActivity: { id: string; text: I18nText; time: string }[];
  };
  projects: {
    customProjects: ProjectItem[];
  };
  resume: {
    summary: I18nText;
    phone: string;
    website: string;
    experience: { id: string; role: I18nText; company: I18nText; period: I18nText; bullets: I18nText[] }[];
    skills: { id: string; name: string; percent: number }[];
    education: { id: string; degree: I18nText; school: I18nText; period: I18nText }[];
    languages: { id: string; name: I18nText; level: I18nText }[];
  };
  gifts: {
    title: I18nText;
    subtitle: I18nText;
    donationLinks: { id: string; platform: string; label: I18nText; url: string }[];
    downloadTitle: I18nText;
    downloads: { id: string; title: I18nText; desc: I18nText; url: string; icon: string }[];
  };
  announcements: Announcement[];
  comments: CommentItem[];
  shop: {
    title: I18nText;
    enabled: boolean;
    categories: string[];
    products: ShopProduct[];
  };
  messages: MessageItem[];
  music: {
    enabled: boolean;
    autoplay: boolean;
    loop: boolean;
    volume: number;
    src?: string;
    title?: string;
  };
  heroObject: {
    kind: "none" | "image" | "model3d";
    src?: string;
    posterSrc?: string;
    autoRotate: boolean;
    alt?: string;
  };
  seo: {
    siteName: I18nText;
    description: I18nText;
    keywords: string;
    ogImage?: string;
    twitterHandle?: string;
  };
  analytics: {
    enabled: boolean;
    plausibleDomain?: string;
    googleId?: string;
  };
  newsletter: {
    enabled: boolean;
    title: I18nText;
    subtitle: I18nText;
    subscribers: { email: string; date: string }[];
  };
}

export const defaultCms: CmsState = {
  version: 5,
  identity: {
    fullName: { fa: "اوید کیّا", en: "Avid Kiya" },
    title: { fa: "معمار سیستم • مهندس بک‌اند", en: "System Architect • Backend Engineer" },
    location: { fa: "تهران، ایران", en: "Tehran, Iran" },
    email: "avid@kiya.dev",
    yearsExperience: 8,
    bio: { fa: "طراحی سیستم‌های توزیع‌شده مقیاس‌پذیر با Go، Rust و Cloudflare.", en: "Designing scalable distributed systems with Go, Rust & Cloudflare." },
    handle: "avidkiya"
  },
  brand: {
    logoLetter: "A",
    logoImage: "",
    brandName: { fa: "اوید کیّا", en: "Avid Kiya" },
    primaryColor: "#5d7ae6",
    accentColor: "#34d399"
  },
  settings: {
    defaultLanguage: "fa",
    defaultTheme: "dark",
    githubUsername: "IR-NETLIFY",
    editMode: false
  },
  socials: [
    { id: "gh", platform: "github", label: { fa: "گیت‌هاب", en: "GitHub" }, url: "https://github.com/IR-NETLIFY", handle: "IR-NETLIFY", enabled: true, order: 1 },
    { id: "tg", platform: "telegram", label: { fa: "تلگرام", en: "Telegram" }, url: "https://t.me/avidkiya", handle: "@avidkiya", enabled: true, order: 2 },
    { id: "x", platform: "x", label: { fa: "ایکس", en: "X" }, url: "https://x.com/avidkiya", handle: "@avidkiya", enabled: true, order: 3 },
    { id: "li", platform: "linkedin", label: { fa: "لینکدین", en: "LinkedIn" }, url: "https://linkedin.com", handle: "avidkiya", enabled: true, order: 4 },
    { id: "ig", platform: "instagram", label: { fa: "اینستاگرام", en: "Instagram" }, url: "https://instagram.com", handle: "@avidkiya", enabled: true, order: 5 },
  ],
  dashboard: {
    heroTag: { fa: "AVID DEVHUB OS", en: "AVID DEVHUB OS" },
    heroTitleA: { fa: "معمار سیستم،", en: "System Architect," },
    heroTitleB: { fa: "سازنده آینده", en: "Future Builder" },
    heroDescription: { fa: "سیستم‌های توزیع‌شده، APIهای پرترافیک و زیرساخت ابری؛ با تمرکز روی عملکرد، امنیت و DX.", en: "Distributed systems, high-traffic APIs and cloud infra — obsessed with performance, security & DX." },
    ctaPrimary: { fa: "مشاهده کارها", en: "View Work" },
    ctaSecondary: { fa: "تماس", en: "Contact" },
    projects: [
      { id: "p1", title: { fa: "Zeus Panel", en: "Zeus Panel" }, description: { fa: "پنل مدیریت ابری مقیاس‌پذیر", en: "Scalable cloud admin panel" }, tags: ["Go","React","CF Workers"], featured: true, githubUrl: "https://github.com/IR-NETLIFY", stars: 312 },
      { id: "p2", title: { fa: "Kiya KV", en: "Kiya KV" }, description: { fa: "KV headless CMS روی Cloudflare", en: "Headless CMS on Cloudflare KV" }, tags: ["TypeScript","KV"], featured: true, githubUrl: "https://github.com/IR-NETLIFY", stars: 188 },
      { id: "p3", title: { fa: "Netlify IR", en: "Netlify IR" }, description: { fa: "ابزار دیپلوی خودکار", en: "Auto deploy toolkit" }, tags: ["Next.js","Cloudflare"], featured: false, githubUrl: "https://github.com/IR-NETLIFY", stars: 94 },
      { id: "p4", title: { fa: "Persian Calendar SDK", en: "Persian Calendar SDK" }, description: { fa: "تقویم شمسی + هخامنشی", en: "Jalali + Achaemenid calendar" }, tags: ["TypeScript"], featured: false, githubUrl: "https://github.com/IR-NETLIFY", stars: 56 },
    ],
    stats: [
      { id: "s1", label: { fa: "پروژه تحویل شده", en: "Projects Delivered" }, value: "47", suffix: "+" },
      { id: "s2", label: { fa: "آپ‌تایم", en: "Uptime" }, value: "99.98", suffix: "%" },
      { id: "s3", label: { fa: "میلیون درخواست/ماه", en: "Million req/mo" }, value: "12", suffix: "M+" },
      { id: "s4", label: { fa: "سال تجربه", en: "Years Exp" }, value: "8", suffix: "+" },
    ]
  },
  about: {
    statusTitle: { fa: "وضعیت سیستم", en: "System Status" },
    metrics: [
      { id: "cpu", label: { fa: "CPU", en: "CPU" }, percent: 42, color: "#34d399" },
      { id: "mem", label: { fa: "Memory", en: "Memory" }, percent: 68, color: "#5d7ae6" },
      { id: "bw", label: { fa: "Bandwidth", en: "Bandwidth" }, percent: 31, color: "#fbbf24" },
    ],
    quickLinks: [
      { id: "q1", label: { fa: "گیت‌هاب", en: "GitHub" }, url: "https://github.com/IR-NETLIFY" },
      { id: "q2", label: { fa: "رزومه PDF", en: "Resume PDF" }, url: "/resume" },
      { id: "q3", label: { fa: "تماس", en: "Contact" }, url: "/about#contact" },
    ],
    quote: { fa: "«سادگی نهایت پیچیدگی است.»", en: "“Simplicity is the ultimate sophistication.”" },
    welcomeTitle: { fa: "سلام، من اویدم.", en: "Hi, I'm Avid." },
    welcomeBody: { fa: "معمار سیستم با تمرکز روی Go، Rust، Cloudflare Workers و دیتابیس‌های توزیع‌شده. عاشق ساختن ابزارهای DevOps هستم.", en: "System architect focused on Go, Rust, Cloudflare Workers and distributed DBs. I love building DevOps tools." },
    miniProjects: [
      { id: "m1", title: { fa: "Edge Cache", en: "Edge Cache" }, desc: { fa: "کش هوشمند لبه", en: "Smart edge caching" } },
      { id: "m2", title: { fa: "KV Sync", en: "KV Sync" }, desc: { fa: "همگام‌سازی KV", en: "KV synchronization" } },
    ],
    recentActivity: [
      { id: "a1", text: { fa: "Release v2.4 منتشر شد", en: "Released v2.4" }, time: "2h ago" },
      { id: "a2", text: { fa: "کامیت: perf: edge routing", en: "commit: perf: edge routing" }, time: "1d ago" },
      { id: "a3", text: { fa: "Issue #41 بسته شد", en: "Closed issue #41" }, time: "3d ago" },
    ],
  },
  projects: {
    customProjects: []
  },
  resume: {
    summary: { fa: "مهندس بک‌اند و معمار سیستم با ۸ سال تجربه در ساخت سرویس‌های توزیع‌شده پرترافیک.", en: "Backend engineer & system architect with 8 years building high-traffic distributed services." },
    phone: "+98 912 000 0000",
    website: "https://avidkiya.dev",
    experience: [
      { id: "e1", role: { fa: "معمار ارشد سیستم", en: "Lead System Architect" }, company: { fa: "Kiya Labs", en: "Kiya Labs" }, period: { fa: "۱۴۰۱ – اکنون", en: "2022 – Present" }, bullets: [
        { fa: "طراحی Edge API با ۱۰M req/day", en: "Designed Edge API 10M req/day" },
        { fa: "کاهش latency تا ۶۲٪", en: "Reduced latency by 62%" },
      ]},
      { id: "e2", role: { fa: "مهندس بک‌اند ارشد", en: "Senior Backend Engineer" }, company: { fa: "آروان", en: "ArvanCloud" }, period: { fa: "۱۳۹۸ – ۱۴۰۱", en: "2019 – 2022" }, bullets: [
        { fa: "توسعه CDN control plane", en: "Built CDN control plane" },
        { fa: "Go / Kubernetes / ClickHouse", en: "Go / Kubernetes / ClickHouse" },
      ]},
    ],
    skills: [
      { id: "sk1", name: "Go", percent: 95 },
      { id: "sk2", name: "TypeScript", percent: 90 },
      { id: "sk3", name: "Rust", percent: 78 },
      { id: "sk4", name: "Cloudflare", percent: 92 },
      { id: "sk5", name: "Postgres", percent: 85 },
      { id: "sk6", name: "Kubernetes", percent: 80 },
    ],
    education: [
      { id: "ed1", degree: { fa: "کارشناسی مهندسی نرم‌افزار", en: "B.Sc. Software Engineering" }, school: { fa: "دانشگاه تهران", en: "University of Tehran" }, period: { fa: "۱۳۹۳–۱۳۹۷", en: "2014–2018" } }
    ],
    languages: [
      { id: "l1", name: { fa: "فارسی", en: "Persian" }, level: { fa: "بومی", en: "Native" } },
      { id: "l2", name: { fa: "انگلیسی", en: "English" }, level: { fa: "پیشرفته", en: "Advanced" } },
    ]
  },
  gifts: {
    title: { fa: "هدیه‌ها", en: "Gifts" },
    subtitle: { fa: "هدیه من به شما / هدیه شما به من", en: "My gift to you / Your gift to me" },
    donationLinks: [
      { id: "d1", platform: "zarinpal", label: { fa: "زرین‌پال", en: "ZarinPal" }, url: "https://zarinpal.com" },
      { id: "d2", platform: "bmc", label: { fa: "Buy Me a Coffee", en: "Buy Me a Coffee" }, url: "https://buymeacoffee.com" },
      { id: "d3", platform: "bitcoin", label: { fa: "بیت‌کوین", en: "Bitcoin" }, url: "#" },
    ],
    downloadTitle: { fa: "هدیه من به شما", en: "My gift to you" },
    downloads: [
      { id: "dl1", title: { fa: "کانفیگ V2Ray", en: "V2Ray Config" }, desc: { fa: "کانفیگ امن و سریع", en: "Fast secure config" }, url: "#", icon: "download" },
      { id: "dl2", title: { fa: "PDF آموزشی Go", en: "Go Training PDF" }, desc: { fa: "۵۰ صفحه نکته کاربردی", en: "50 pages practical tips" }, url: "#", icon: "book" },
    ]
  },
  announcements: [
    { id: "an1", type: "news", title: { fa: "نسخه ۳.۰ منتشر شد!", en: "v3.0 released!" }, body: { fa: "پرتفولیو جدید با پنل CMS کامل.", en: "New portfolio with full CMS panel." }, pinned: true, archived: false, hidden: false, createdAt: new Date().toISOString() },
    { id: "an2", type: "poll", title: { fa: "زبان بعدی؟", en: "Next language?" }, body: { fa: "کدام زبان را آموزش بدم؟", en: "Which language should I teach?" }, pinned: false, archived: false, hidden: false, createdAt: new Date().toISOString(), pollOptions: [
      { id: "o1", label: { fa: "Rust", en: "Rust" }, votes: 23 },
      { id: "o2", label: { fa: "Go", en: "Go" }, votes: 41 },
      { id: "o3", label: { fa: "Zig", en: "Zig" }, votes: 12 },
    ]},
    { id: "an3", type: "map", title: { fa: "میتاپ تهران", en: "Tehran Meetup" }, body: { fa: "پنج‌شنبه، کافه تک.", en: "Thursday, Tech Cafe." }, pinned: false, archived: false, hidden: false, createdAt: new Date().toISOString(), mapLat: 35.6892, mapLng: 51.3890 },
  ],
  comments: [
    { id: "c1", name: "سارا احمدی", email: "sara@example.com", role: "CTO", rating: 5, text: "همکاری فوق‌العاده حرفه‌ای. شدیداً توصیه می‌کنم.", approved: true, pinned: true, createdAt: new Date().toISOString() },
    { id: "c2", name: "John D.", email: "john@example.com", role: "Founder", rating: 5, text: "Brilliant architecture work. Super fast delivery.", approved: true, pinned: false, createdAt: new Date().toISOString() },
  ],
  shop: {
    title: { fa: "فروشگاه", en: "Shop" },
    enabled: true,
    categories: ["ebook","tool","template","service"],
    products: [
      { id: "sh1", title: { fa: "قالب DevHub OS", en: "DevHub OS Template" }, description: { fa: "قالب Next.js کامل", en: "Full Next.js template" }, priceUSD: 49, discountPercent: 20, category: "template", tags: ["nextjs"], image: "", featured: true, soldOut: false, buyUrl: "mailto:avid@kiya.dev" },
      { id: "sh2", title: { fa: "کتاب Go پیشرفته", en: "Advanced Go Book" }, description: { fa: "۲۲۰ صفحه PDF", en: "220 page PDF" }, priceUSD: 19, category: "ebook", tags: ["go"], image: "", featured: false, soldOut: false, buyUrl: "mailto:avid@kiya.dev" },
    ]
  },
  messages: [],
  music: { enabled: false, autoplay: false, loop: true, volume: 0.35, src: "", title: "Lo-Fi Dev" },
  heroObject: { kind: "none", autoRotate: true, alt: "Avid Kiya" },
  seo: {
    siteName: { fa: "اوید کیّا — معمار سیستم", en: "Avid Kiya — System Architect" },
    description: { fa: "پرتفولیو رسمی اوید کیّا، معمار سیستم و مهندس بک‌اند.", en: "Official portfolio of Avid Kiya, System Architect & Backend Engineer." },
    keywords: "Avid Kiya, backend, Go, Rust, Cloudflare, system architect",
    ogImage: "/brand/og.png",
    twitterHandle: "@avidkiya"
  },
  analytics: { enabled: false, plausibleDomain: "", googleId: "" },
  newsletter: { enabled: true, title: { fa: "خبرنامه DevHub", en: "DevHub Newsletter" }, subtitle: { fa: "ماهانه: نکات Go، Rust و Edge.", en: "Monthly: Go, Rust & Edge tips." }, subscribers: [] }
};

export function migrateCms(input: any): CmsState {
  if (!input || typeof input !== 'object') return defaultCms;
  // shallow merge
  return { ...defaultCms, ...input, version: defaultCms.version };
}
