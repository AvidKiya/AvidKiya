export interface I18nText {
  fa: string;
  en: string;
}

export interface SocialAccount {
  id: string;
  platform: "github" | "telegram" | "instagram" | "twitter" | "linkedin" | "youtube" | "custom";
  url: string;
  label?: I18nText;
}

export interface Project {
  id: string;
  title: I18nText;
  description: I18nText;
  image?: string;
  url?: string;
  tags: string[];
  featured?: boolean;
  github?: string;
}

export interface StatItem {
  id: string;
  label: I18nText;
  value: string;
  icon?: string;
}

export interface Metric {
  id: string;
  label: I18nText;
  value: string;
  percent: number;
  color?: string;
}

export interface QuickLink {
  id: string;
  label: I18nText;
  url: string;
  icon?: string;
}

export interface MiniProject {
  id: string;
  title: I18nText;
  description: I18nText;
  url?: string;
  tags?: string[];
}

export interface ActivityItem {
  id: string;
  title: I18nText;
  description: I18nText;
  date: string;
  type: "commit" | "pr" | "issue" | "release" | "other";
}

export interface ResumeExperience {
  id: string;
  company: I18nText;
  role: I18nText;
  period: string;
  location?: I18nText;
  bullets: I18nText[];
}

export interface ResumeSkill {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface ResumeEducation {
  id: string;
  school: I18nText;
  degree: I18nText;
  period: string;
  field?: I18nText;
}

export interface ResumeLanguage {
  id: string;
  name: string;
  level: "native" | "fluent" | "intermediate" | "basic";
}

export interface DonationLink {
  id: string;
  platform: "zarinpal" | "buymeacoffee" | "bitcoin" | "ethereum" | "usdt" | "custom";
  url: string;
  label: I18nText;
  icon?: string;
}

export interface DownloadItem {
  id: string;
  title: I18nText;
  description: I18nText;
  url: string;
  icon?: string;
  size?: string;
}

export interface Announcement {
  id: string;
  type: "news" | "poll" | "map" | "image" | "text";
  title: I18nText;
  content: I18nText;
  image?: string;
  pinned?: boolean;
  archived?: boolean;
  hidden?: boolean;
  expiresAt?: string;
  createdAt: string;
  pollOptions?: { id: string; label: I18nText; votes: number }[];
  mapCenter?: { lat: number; lng: number; zoom: number };
}

export interface Comment {
  id: string;
  name: string;
  email: string;
  position?: string;
  rating: number;
  text: string;
  approved: boolean;
  pinned?: boolean;
  createdAt: string;
}

export interface ShopProduct {
  id: string;
  title: I18nText;
  description: I18nText;
  image?: string;
  price: {
    usd?: number;
    eur?: number;
    irr?: number;
    tmn?: number;
    usdt?: number;
  };
  discount?: number;
  category?: string;
  tags?: string[];
  featured?: boolean;
  soldOut?: boolean;
  buyUrl?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  text: string;
  replied?: boolean;
  reply?: string;
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
    phone?: string;
  };
  brand: {
    logoLetter: string;
    logoImage?: string;
    brandName: string;
    primaryColor: string;
    accentColor: string;
  };
  settings: {
    defaultLanguage: "fa" | "en";
    defaultTheme: "dark" | "light";
    githubUsername: string;
    editMode: boolean;
    adminPassword: string;
  };
  socials: SocialAccount[];
  dashboard: {
    heroTag: I18nText;
    heroTitleA: I18nText;
    heroTitleB: I18nText;
    heroDescription: I18nText;
    ctaPrimary: I18nText;
    ctaSecondary: I18nText;
    projects: Project[];
    stats: StatItem[];
    newsletterEnabled: boolean;
  };
  about: {
    statusTitle: I18nText;
    metrics: Metric[];
    quickLinks: QuickLink[];
    quote: I18nText;
    welcomeTitle: I18nText;
    welcomeBody: I18nText;
    miniProjects: MiniProject[];
    recentActivity: ActivityItem[];
  };
  projects: {
    customProjects: Project[];
  };
  resume: {
    summary: I18nText;
    phone: string;
    website: string;
    experience: ResumeExperience[];
    skills: ResumeSkill[];
    education: ResumeEducation[];
    languages: ResumeLanguage[];
  };
  gifts: {
    title: I18nText;
    subtitle: I18nText;
    donationLinks: DonationLink[];
    downloadTitle: I18nText;
    downloads: DownloadItem[];
  };
  announcements: Announcement[];
  comments: Comment[];
  shop: {
    title: I18nText;
    enabled: boolean;
    categories: string[];
    products: ShopProduct[];
  };
  messages: Message[];
  music: {
    enabled: boolean;
    autoplay: boolean;
    loop: boolean;
    volume: number;
    src?: string;
    title: I18nText;
  };
  heroObject: {
    kind: "none" | "image" | "model3d";
    src?: string;
    posterSrc?: string;
    autoRotate: boolean;
    alt: I18nText;
  };
  seo: {
    siteName: string;
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
    subscribers: string[];
  };
}

export const DEFAULT_CMS_STATE: CmsState = {
  version: 1,
  identity: {
    fullName: { fa: "اوید کیا", en: "Avid Kiya" },
    title: { fa: "معمار سیستم • مهندس بک‌اند", en: "System Architect • Backend Engineer" },
    location: { fa: "ایران", en: "Iran" },
    email: "hello@avidkiya.dev",
    yearsExperience: 7,
    bio: {
      fa: "معمار سیستم‌های مقیاس‌پذیر و مهندس بک‌اند با تمرکز بر زیرساخت‌های ابری، APIهای توزیع‌شده و بهینه‌سازی عملکرد.",
      en: "Architect of scalable systems and backend engineer focused on cloud infrastructure, distributed APIs, and performance optimization.",
    },
    handle: "avidkiya",
    phone: "",
  },
  brand: {
    logoLetter: "AK",
    logoImage: "",
    brandName: "AvidKiya",
    primaryColor: "#5d7ae6",
    accentColor: "#6f93ec",
  },
  settings: {
    defaultLanguage: "fa",
    defaultTheme: "dark",
    githubUsername: "avidkiya",
    editMode: false,
    adminPassword: "admin",
  },
  socials: [
    { id: "gh", platform: "github", url: "https://github.com/avidkiya", label: { fa: "گیت‌هاب", en: "GitHub" } },
    { id: "tg", platform: "telegram", url: "https://t.me/avidkiya", label: { fa: "تلگرام", en: "Telegram" } },
    { id: "ig", platform: "instagram", url: "https://instagram.com/avidkiya", label: { fa: "اینستاگرام", en: "Instagram" } },
    { id: "tw", platform: "twitter", url: "https://x.com/avidkiya", label: { fa: "ایکس", en: "X" } },
    { id: "li", platform: "linkedin", url: "https://linkedin.com/in/avidkiya", label: { fa: "لینکدین", en: "LinkedIn" } },
  ],
  dashboard: {
    heroTag: { fa: "معمار سیستم • مهندس بک‌اند", en: "System Architect • Backend Engineer" },
    heroTitleA: { fa: "اوید کیا", en: "Avid Kiya" },
    heroTitleB: { fa: "Avid Kiya", en: "اوید کیا" },
    heroDescription: {
      fa: "معمار سیستم‌های مقیاس‌پذیر و مهندس بک‌اند با تمرکز بر زیرساخت‌های ابری، APIهای توزیع‌شده و بهینه‌سازی عملکرد.",
      en: "Architect of scalable systems and backend engineer focused on cloud infrastructure, distributed APIs, and performance optimization.",
    },
    ctaPrimary: { fa: "مشاهده کارها", en: "View Work" },
    ctaSecondary: { fa: "تماس با من", en: "Contact Me" },
    projects: [
      {
        id: "p1",
        title: { fa: "AvidKiya OS", en: "AvidKiya OS" },
        description: {
          fa: "پرتفولیو و پلتفرم شخصی با CMS داخلی",
          en: "Personal portfolio and platform with built-in CMS",
        },
        tags: ["Next.js", "Cloudflare", "TypeScript"],
        featured: true,
        github: "avidkiya/portfolio",
      },
      {
        id: "p2",
        title: { fa: "Cloud Deployer", en: "Cloud Deployer" },
        description: {
          fa: "ابزار استقرار خودکار روی Cloudflare",
          en: "Auto-deployment tool for Cloudflare",
        },
        tags: ["Workers", "KV", "API"],
        featured: true,
        github: "avidkiya/deployer",
      },
    ],
    stats: [
      { id: "s1", label: { fa: "پروژه", en: "Projects" }, value: "12+" },
      { id: "s2", label: { fa: "سال تجربه", en: "Years Exp." }, value: "7" },
      { id: "s3", label: { fa: "مشتری", en: "Clients" }, value: "25+" },
      { id: "s4", label: { fa: "کامیت", en: "Commits" }, value: "2,400+" },
    ],
    newsletterEnabled: true,
  },
  about: {
    statusTitle: { fa: "وضعیت سیستم", en: "System Status" },
    metrics: [
      { id: "m1", label: { fa: "CPU", en: "CPU" }, value: "42%", percent: 42, color: "#5d7ae6" },
      { id: "m2", label: { fa: "حافظه", en: "Memory" }, value: "6.2/16 GB", percent: 39, color: "#34d399" },
      { id: "m3", label: { fa: "پهنای باند", en: "Bandwidth" }, value: "12.4 TB", percent: 62, color: "#fbbf24" },
    ],
    quickLinks: [
      { id: "ql1", label: { fa: "گیت‌هاب", en: "GitHub" }, url: "https://github.com/avidkiya" },
      { id: "ql2", label: { fa: "دانلود رزومه", en: "Download CV" }, url: "/resume" },
      { id: "ql3", label: { fa: "تماس", en: "Contact" }, url: "/about" },
    ],
    quote: {
      fa: "«هر خط کد باید هدف داشته باشد، هر سیستم باید مقیاس‌پذیر باشد.»",
      en: "\"Every line of code must have purpose, every system must be scalable.\"",
    },
    welcomeTitle: { fa: "سلام، من اوید هستم", en: "Hi, I'm Avid" },
    welcomeBody: {
      fa: "معمار سیستم و مهندس بک‌اند با تمرکز بر زیرساخت ابری و APIهای توزیع‌شده.",
      en: "System architect and backend engineer focused on cloud infrastructure and distributed APIs.",
    },
    miniProjects: [
      {
        id: "mp1",
        title: { fa: "پروژه ۱", en: "Project 1" },
        description: { fa: "توضیح پروژه", en: "Project description" },
        tags: ["TS", "Node"],
      },
      {
        id: "mp2",
        title: { fa: "پروژه ۲", en: "Project 2" },
        description: { fa: "توضیح پروژه", en: "Project description" },
        tags: ["Rust", "WASM"],
      },
    ],
    recentActivity: [
      {
        id: "a1",
        title: { fa: "کامیت جدید", en: "New commit" },
        description: { fa: "به‌روزرسانی CMS", en: "CMS updated" },
        date: "2026-07-04",
        type: "commit",
      },
    ],
  },
  projects: {
    customProjects: [
      {
        id: "cp1",
        title: { fa: "پروژه نمونه", en: "Sample Project" },
        description: { fa: "یک پروژه نمونه", en: "A sample project" },
        tags: ["TypeScript", "React"],
        featured: true,
      },
    ],
  },
  resume: {
    summary: {
      fa: "معمار سیستم با ۷ سال تجربه در طراحی و پیاده‌سازی سیستم‌های مقیاس‌پذیر، APIهای توزیع‌شده و زیرساخت ابری.",
      en: "System architect with 7 years of experience designing and implementing scalable systems, distributed APIs, and cloud infrastructure.",
    },
    phone: "+98 912 345 6789",
    website: "https://avidkiya.dev",
    experience: [
      {
        id: "e1",
        company: { fa: "شرکت فناوری", en: "Tech Corp" },
        role: { fa: "معمار ارشد سیستم", en: "Senior System Architect" },
        period: "2022 - اکنون",
        location: { fa: "تهران", en: "Tehran" },
        bullets: [
          { fa: "طراحی معماری میکروسرویس برای سیستم‌های با ترافیک بالا", en: "Designed microservice architecture for high-traffic systems" },
          { fa: "بهینه‌سازی عملکرد API تا ۳۰۰٪", en: "Optimized API performance by 300%" },
        ],
      },
      {
        id: "e2",
        company: { fa: "استارتاپ ابری", en: "Cloud Startup" },
        role: { fa: "مهندس ارشد بک‌اند", en: "Senior Backend Engineer" },
        period: "2019 - 2022",
        location: { fa: "ریموت", en: "Remote" },
        bullets: [
          { fa: "پیاده‌سازی سیستم پردازش رویداد با Kafka", en: "Implemented event processing system with Kafka" },
          { fa: "طراحی دیتابیس توزیع‌شده", en: "Designed distributed database" },
        ],
      },
    ],
    skills: [
      { id: "sk1", name: "TypeScript", level: 95, category: "Language" },
      { id: "sk2", name: "Node.js", level: 92, category: "Backend" },
      { id: "sk3", name: "Go", level: 85, category: "Language" },
      { id: "sk4", name: "Rust", level: 78, category: "Language" },
      { id: "sk5", name: "PostgreSQL", level: 90, category: "Database" },
      { id: "sk6", name: "Redis", level: 88, category: "Database" },
      { id: "sk7", name: "Kubernetes", level: 82, category: "DevOps" },
      { id: "sk8", name: "Cloudflare Workers", level: 90, category: "Cloud" },
      { id: "sk9", name: "AWS", level: 80, category: "Cloud" },
      { id: "sk10", name: "Docker", level: 88, category: "DevOps" },
    ],
    education: [
      {
        id: "ed1",
        school: { fa: "دانشگاه صنعتی شریف", en: "Sharif University" },
        degree: { fa: "کارشناسی ارشد مهندسی کامپیوتر", en: "MSc Computer Engineering" },
        period: "2015 - 2017",
        field: { fa: "نرم‌افزار", en: "Software" },
      },
      {
        id: "ed2",
        school: { fa: "دانشگاه تهران", en: "University of Tehran" },
        degree: { fa: "کارشناسی مهندسی کامپیوتر", en: "BSc Computer Engineering" },
        period: "2011 - 2015",
        field: { fa: "نرم‌افزار", en: "Software" },
      },
    ],
    languages: [
      { id: "l1", name: "فارسی", level: "native" },
      { id: "l2", name: "English", level: "fluent" },
      { id: "l3", name: "العربية", level: "intermediate" },
    ],
  },
  gifts: {
    title: { fa: "هدایا", en: "Gifts" },
    subtitle: {
      fa: "ابزارها و منابع رایگان برای توسعه‌دهندگان",
      en: "Free tools and resources for developers",
    },
    donationLinks: [
      {
        id: "d1",
        platform: "buymeacoffee",
        url: "https://buymeacoffee.com/avidkiya",
        label: { fa: "Buy Me a Coffee", en: "Buy Me a Coffee" },
      },
      {
        id: "d2",
        platform: "bitcoin",
        url: "bc1qavidkiya...",
        label: { fa: "بیت‌کوین", en: "Bitcoin" },
      },
    ],
    downloadTitle: { fa: "هدیه من به شما", en: "My Gift to You" },
    downloads: [
      {
        id: "dl1",
        title: { fa: "کانفیگ V2Ray", en: "V2Ray Config" },
        description: { fa: "کانفیگ بهینه V2Ray", en: "Optimized V2Ray config" },
        url: "#",
        size: "2 KB",
      },
      {
        id: "dl2",
        title: { fa: "راهنمای Cloudflare", en: "Cloudflare Guide" },
        description: { fa: "PDF آموزشی کامل", en: "Complete tutorial PDF" },
        url: "#",
        size: "4.2 MB",
      },
    ],
  },
  announcements: [],
  comments: [],
  shop: {
    title: { fa: "فروشگاه", en: "Shop" },
    enabled: true,
    categories: ["template", "boilerplate", "guide"],
    products: [
      {
        id: "sp1",
        title: { fa: "تمپلیت Next.js", en: "Next.js Template" },
        description: { fa: "تمپلیت حرفه‌ای Next.js", en: "Professional Next.js template" },
        price: { usd: 29, usdt: 29, tmn: 990000 },
        category: "template",
        tags: ["Next.js", "Tailwind"],
        featured: true,
        buyUrl: "mailto:hello@avidkiya.dev",
      },
    ],
  },
  messages: [],
  music: {
    enabled: false,
    autoplay: false,
    loop: true,
    volume: 0.3,
    src: "",
    title: { fa: "موسیقی پس‌زمینه", en: "Background Music" },
  },
  heroObject: {
    kind: "none",
    autoRotate: true,
    alt: { fa: "هیرو", en: "Hero" },
  },
  seo: {
    siteName: "AvidKiya OS",
    description: {
      fa: "پرتفولیو اوید کیا — معمار سیستم و مهندس بک‌اند",
      en: "Avid Kiya Portfolio — System Architect & Backend Engineer",
    },
    keywords: "avidkiya, portfolio, backend, architect, cloudflare, nextjs",
    ogImage: "",
    twitterHandle: "@avidkiya",
  },
  analytics: {
    enabled: false,
  },
  newsletter: {
    enabled: true,
    title: { fa: "خبرنامه", en: "Newsletter" },
    subtitle: { fa: "آخرین اخبار و مقالات", en: "Latest news and articles" },
    subscribers: [],
  },
};
