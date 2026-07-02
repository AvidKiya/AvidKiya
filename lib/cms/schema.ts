/**
 * CMS Schema — single source of truth for editable content.
 *
 * Every visible text / list / style value on the site lives here.
 * The admin panel (and the inline pencil-edit overlay) mutate this object,
 * which is then persisted to localStorage and (later) to Cloudflare KV via
 * `functions/api/cms.ts`.
 *
 * The shape is intentionally serialisable JSON so a Cloudflare Worker can
 * `env.AVIDKIYA_KV.put("cms", JSON.stringify(state))` without transformation.
 */

export interface I18nText {
  fa: string;
  en: string;
}

/** Per-element style overrides — used by the pencil editor. */
export interface StyleOverride {
  fontSize?: string;      // e.g. "18px" / "1.25rem"
  color?: string;         // "var(--primary)" | "#fff"
  textAlign?: "start" | "center" | "end";
  fontWeight?: string;    // "400" | "700"
  letterSpacing?: string;
  marginTop?: string;
  marginBottom?: string;
  paddingBlock?: string;
  paddingInline?: string;
  hidden?: boolean;
}

export interface EditableText {
  value: I18nText;
  style?: StyleOverride;
}

export interface QuickLink {
  id: string;
  label: I18nText;
  href: string;
  icon: string;   // Material Symbols name
}

export interface SystemMetric {
  id: string;
  label: I18nText;
  percent: number;      // 0–100
  valueFa: string;      // e.g. "۴۲٪"
  valueEn: string;      // e.g. "42%"
}

export interface MiniProject {
  id: string;
  name: I18nText;
  desc: I18nText;
  status: "ACTIVE" | "STABLE" | "BETA" | "ARCHIVED";
  cta: I18nText;
  href: string;
}

export interface ActivityLog {
  id: string;
  when: I18nText;
  what: I18nText;
  active?: boolean;
}

export interface SocialAccount {
  id: string;
  platform: string;       // "Telegram" | "Instagram" | ...
  handle: string;         // "@avidkiya"
  href: string;
  gradient: string;       // CSS gradient
  subtitle: I18nText;
  icon: "telegram" | "instagram" | "x" | "github" | "linkedin" | "email";
  enabled: boolean;
}

export interface DashboardStat {
  id: string;
  value: string;         // "10k+"
  label: I18nText;
  highlight?: boolean;
}

export interface DashboardProject {
  id: string;
  title: I18nText;
  description: I18nText;
  tags: string[];
  icon: string;          // material symbol
  category: I18nText;    // "Core Engine" / "Featured Work"
}

export interface CustomRepoProject {
  id: string;
  name: string;
  description: string;
  descriptionFa?: string;
  url: string;
  language?: string;
  topics?: string[];
  status: "STABLE" | "BETA" | "ALPHA" | "ARCHIVED";
  createdAt: string;
}

/** ─── Top-level state shape ────────────────────────────────── */
export interface CmsState {
  version: number;

  identity: {
    handle: string;
    fullName: I18nText;
    title: I18nText;
    location: I18nText;
    email: string;
    yearsExperience: number;
    bio: I18nText;
  };

  brand: {
    logoLetter: string;      // "A"
    brandName: I18nText;
    primaryColor: string;    // hex
    accentColor: string;
  };

  settings: {
    defaultLanguage: "fa" | "en";
    defaultTheme: "dark" | "light";
    githubUsername: string;
    /** Master switch for the pencil edit overlay. */
    editMode: boolean;
  };

  socials: SocialAccount[];

  // Landing page
  dashboard: {
    heroTag: EditableText;
    heroTitleA: EditableText;
    heroTitleB: EditableText;
    heroDescription: EditableText;
    ctaPrimary: EditableText;
    ctaSecondary: EditableText;
    projects: DashboardProject[];
    stats: DashboardStat[];
  };

  // About / Command center page
  about: {
    version: EditableText;               // "COMMAND_CENTER.v3"
    locationLabel: EditableText;
    locationValue: EditableText;
    statusTitle: EditableText;
    metrics: SystemMetric[];
    quickLinksTitle: EditableText;
    quickLinks: QuickLink[];
    quote: EditableText;
    terminalHeader: EditableText;        // "ROOT@ARCHITECT_NODE:~"
    uptimeLabel: EditableText;
    initSession: EditableText;
    initLines: EditableText[];
    welcomeTitle: EditableText;
    welcomeBody: EditableText;
    miniProjects: MiniProject[];
    promptText: EditableText;
    ghActivityTitle: EditableText;
    ghActivitySub: EditableText;
    recentActivityTitle: EditableText;
    recentActivity: ActivityLog[];
    ctaStartProject: EditableText;
  };

  projects: {
    ideTitle: EditableText;
    customProjects: CustomRepoProject[];
  };

  // Messages submitted through the contact form
  messages: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    at: string;
    read?: boolean;
  }[];
}

/* ─── Default seed content ─────────────────────────────────── */

const t = (fa: string, en: string): I18nText => ({ fa, en });
const et = (fa: string, en: string): EditableText => ({ value: { fa, en } });

export const defaultCmsState: CmsState = {
  version: 1,

  identity: {
    handle: "avidkiya",
    fullName: t("اوید کیا", "Avid Kiya"),
    title: t(
      "معمار سیستم و توسعه‌دهنده ارشد بک‌اند",
      "Systems Architect & Backend Lead"
    ),
    location: t("ایران / دورکار", "Iran / Remote"),
    email: "avidkiya@gmail.com",
    yearsExperience: 8,
    bio: t(
      "متخصص طراحی و پیاده‌سازی زیرساخت‌های مقیاس‌پذیر",
      "Building scalable infrastructure and distributed systems."
    ),
  },

  brand: {
    logoLetter: "A",
    brandName: t("اوید کیا", "AVID KIYA"),
    primaryColor: "#21f1a8",
    accentColor: "#48ffb6",
  },

  settings: {
    defaultLanguage: "fa",
    defaultTheme: "dark",
    githubUsername: "avidkiya",
    editMode: false,
  },

  socials: [
    {
      id: "github",
      platform: "GitHub",
      handle: "@avidkiya",
      href: "https://github.com/avidkiya",
      gradient: "linear-gradient(135deg,#171515 0%,#2d2d2d 100%)",
      subtitle: t("مخازن کد", "Code repositories"),
      icon: "github",
      enabled: true,
    },
    {
      id: "telegram",
      platform: "Telegram",
      handle: "@avidkiya",
      href: "https://t.me/avidkiya",
      gradient: "linear-gradient(135deg,#0088cc 0%,#005c8f 100%)",
      subtitle: t("کانال شخصی", "Personal channel"),
      icon: "telegram",
      enabled: true,
    },
    {
      id: "instagram",
      platform: "Instagram",
      handle: "@avidkiya",
      href: "https://instagram.com/avidkiya",
      gradient:
        "linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
      subtitle: t("پیج شخصی", "Personal profile"),
      icon: "instagram",
      enabled: true,
    },
    {
      id: "x",
      platform: "X / Twitter",
      handle: "@avidkiya",
      href: "https://x.com/avidkiya",
      gradient: "linear-gradient(135deg,#000 0%,#1a1a1a 100%)",
      subtitle: t("افکار و اخبار", "Thoughts & news"),
      icon: "x",
      enabled: true,
    },
  ],

  dashboard: {
    heroTag: et("معمار سیستم‌ها", "Systems Architect"),
    heroTitleA: et("طراحی سیستم‌های", "Building resilient"),
    heroTitleB: et("توزیع‌شدهٔ مقاوم.", "Distributed Systems."),
    heroDescription: et(
      "طراحی زیرساخت‌های در دسترس بالا با تمرکز بر ارکستراسیون کم‌تأخیر و معماری‌های ابری خودترمیم.",
      "Engineering high-availability infrastructures with a focus on low-latency orchestration and self-healing cloud architectures."
    ),
    ctaPrimary: et("کاوش پروژه‌ها", "Explore Projects"),
    ctaSecondary: et("تماس بگیرید", "Get in Touch"),

    projects: [
      {
        id: "p1",
        title: t("موتور نکسوس", "Nexus Engine"),
        description: t(
          "یک لایهٔ ارکستراسیون با عملکرد بالا برای معماری‌های میکروسرویس مقاوم. با Rust و gRPC.",
          "A high-performance orchestration layer designed for resilient microservices architectures. Built with Rust and gRPC."
        ),
        tags: ["RUST", "K8S"],
        icon: "dataset",
        category: t("موتور اصلی", "Core Engine"),
      },
      {
        id: "p2",
        title: t("معماری سیستم‌های توزیع شده", "Distributed Systems Architecture"),
        description: t(
          "طراحی و پیاده‌سازی زیرساخت‌های مقیاس‌پذیر با تمرکز بر پایداری بالا و پاسخ‌دهی در زمان واقعی برای پلتفرم‌های ابری.",
          "Design and implementation of scalable infrastructures focused on high stability and real-time responsiveness for cloud platforms."
        ),
        tags: ["INFRA", "DESIGN"],
        icon: "architecture",
        category: t("کار برجسته", "Featured Work"),
      },
    ],

    stats: [
      { id: "s1", value: "10k+", label: t("درخواست/ثانیه", "Requests / Sec"), highlight: true },
      { id: "s2", value: "99.9%", label: t("پایداری", "Uptime Metric") },
      { id: "s3", value: "08+", label: t("نودهای جهانی", "Global Nodes") },
      { id: "s4", value: "05+", label: t("سال تجربه", "Years Experience") },
    ],
  },

  about: {
    version: et("COMMAND_CENTER.v3", "COMMAND_CENTER.v3"),
    locationLabel: et("موقعیت فعلی", "Current Location"),
    locationValue: et("ایران / تهران", "IRAN / TEHRAN_NODE"),
    statusTitle: et("وضعیت سیستم", "System Status"),

    metrics: [
      { id: "cpu", label: t("پردازش مرکزی", "CPU Usage"), percent: 42, valueFa: "۴۲٪", valueEn: "42%" },
      { id: "mem", label: t("حافظه سیستم", "Memory"), percent: 65, valueFa: "۱۲.۴ گیگ", valueEn: "12.4 GB" },
      { id: "net", label: t("پهنای باند", "Bandwidth"), percent: 15, valueFa: "۸۹۰ مگ/ث", valueEn: "890 Mbps" },
    ],

    quickLinksTitle: et("لینک‌های دسترسی سریع", "Quick Links"),
    quickLinks: [
      { id: "gh", label: t("پروفایل گیت‌هاب", "GitHub Profile"), href: "https://github.com/avidkiya", icon: "link" },
      { id: "cv", label: t("رزومه کامل (PDF)", "Full Resume (PDF)"), href: "#", icon: "file_download" },
      { id: "mail", label: t("ارتباط مستقیم", "Direct Contact"), href: "mailto:avidkiya@gmail.com", icon: "alternate_email" },
    ],

    quote: et(
      "«سیستم‌های توزیع شده نه تنها کد، بلکه هنر تعادل بین آشفتگی و نظم هستند.»",
      "\"Distributed systems are the art of balancing chaos and order.\""
    ),

    terminalHeader: et("ROOT@ARCHITECT_NODE:~", "ROOT@ARCHITECT_NODE:~"),
    uptimeLabel: et("Uptime", "Uptime"),

    initSession: et("initialize_session.sh --verbose", "initialize_session.sh --verbose"),
    initLines: [
      et("بارگذاری هسته مرکزی... [تکمیل]", "loading kernel... [OK]"),
      et("اتصال به شبکه عصبی... [تکمیل]", "connecting neural net... [OK]"),
      et("تایید هویت کاربر: اوید کیا (معمار ارشد سیستم)", "user verified: Avid Kiya (Senior Systems Architect)"),
    ],
    welcomeTitle: et("به مرکز فرماندهی خوش آمدید", "Welcome to Command Center"),
    welcomeBody: et(
      "من متخصص طراحی و پیاده‌سازی زیرساخت‌های مقیاس‌پذیر و سیستم‌های توزیع شده با تمرکز بر کارایی بالا و دسترسی همیشگی هستم. در اینجا می‌توانید آخرین پروژه‌ها و وضعیت فعالیت‌های من را مشاهده کنید.",
      "I specialize in designing and implementing scalable infrastructures and distributed systems with a focus on high performance and constant availability. Here you can explore my latest projects and activity."
    ),
    miniProjects: [
      {
        id: "m1",
        name: t("پروژه: Nexus Engine", "Project: Nexus Engine"),
        desc: t(
          "بهینه‌سازی لایه ارکستراسیون میکروسرویس‌ها با نرخ پردازش ۱۰ هزار درخواست در ثانیه.",
          "Optimized microservice orchestration layer with 10K req/sec throughput."
        ),
        status: "ACTIVE",
        cta: t("[ اجرای اسکریپت دمو ]", "[ RUN DEMO ]"),
        href: "#",
      },
      {
        id: "m2",
        name: t("پروژه: SecureGate v2", "Project: SecureGate v2"),
        desc: t(
          "دروازه امنیتی مبتنی بر هوش مصنوعی برای شناسایی تهدیدات در لحظه.",
          "AI-driven security gateway for real-time threat detection."
        ),
        status: "STABLE",
        cta: t("[ بررسی لاگ‌ها ]", "[ INSPECT LOGS ]"),
        href: "#",
      },
    ],
    promptText: et("آماده برای دریافت دستورات جدید...", "Ready for new commands..."),

    ghActivityTitle: et("فعالیت گیت‌هاب", "GitHub Activity"),
    ghActivitySub: et("(۳۰ روز اخیر)", "(last 30 days)"),

    recentActivityTitle: et("سیاهه فعالیت‌های اخیر", "Recent Activity Log"),
    recentActivity: [
      { id: "a1", when: t("امروز - ۱۴:۲۰", "Today · 14:20"), what: t("استقرار نسخه ۱.۲.۰ موتور نکسوس", "Deployed Nexus Engine v1.2.0"), active: true },
      { id: "a2", when: t("دیروز - ۰۹:۱۵", "Yesterday · 09:15"), what: t("بهینه‌سازی دیتابیس توزیع شده", "Optimized distributed database") },
      { id: "a3", when: t("۳ روز قبل", "3 days ago"), what: t("بروزرسانی پروتکل‌های امنیتی SSL", "Updated SSL security protocols") },
    ],
    ctaStartProject: et("شروع پروژه جدید", "Start a New Project"),
  },

  projects: {
    ideTitle: et("AVIDKIYA_IDE_V1.0", "AVIDKIYA_IDE_V1.0"),
    customProjects: [],
  },

  messages: [],
};
