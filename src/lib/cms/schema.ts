/* ── CMS Schema & Types ── */

export interface I18nText {
  fa: string;
  en: string;
}

export interface SocialAccount {
  id: string;
  platform: string;
  url: string;
  label: I18nText;
  icon: string;
  visible: boolean;
}

export interface StatItem {
  id: string;
  label: I18nText;
  value: string;
  icon: string;
}

export interface ProjectItem {
  id: string;
  title: I18nText;
  description: I18nText;
  tech: string[];
  image: string;
  url: string;
  github: string;
  featured: boolean;
}

export interface ExperienceItem {
  id: string;
  title: I18nText;
  company: I18nText;
  period: I18nText;
  bullets: I18nText[];
}

export interface SkillItem {
  id: string;
  name: string;
  percent: number;
  category: string;
}

export interface EducationItem {
  id: string;
  degree: I18nText;
  school: I18nText;
  year: string;
}

export interface LanguageItem {
  id: string;
  name: I18nText;
  level: I18nText;
}

export interface GiftDownload {
  id: string;
  title: I18nText;
  description: I18nText;
  icon: string;
  url: string;
  filename: string;
}

export interface DonationLink {
  id: string;
  platform: string;
  url: string;
  label: I18nText;
  color: string;
  icon: string;
}

export interface Announcement {
  id: string;
  type: 'news' | 'poll' | 'map' | 'image' | 'text';
  title: I18nText;
  body: I18nText;
  image: string;
  pinned: boolean;
  archived: boolean;
  hidden: boolean;
  createdAt: string;
  expiresAt: string | null;
  pollOptions?: PollOption[];
  mapLat?: number;
  mapLng?: number;
  mapZoom?: number;
}

export interface PollOption {
  id: string;
  text: I18nText;
  votes: number;
}

export interface Comment {
  id: string;
  name: string;
  email: string;
  role: string;
  rating: number;
  body: string;
  approved: boolean;
  pinned: boolean;
  createdAt: string;
}

export interface ShopProduct {
  id: string;
  title: I18nText;
  description: I18nText;
  image: string;
  priceUSD: number;
  priceIRR: number;
  discount: number;
  category: string;
  tags: string[];
  featured: boolean;
  soldOut: boolean;
  buyUrl: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  read: boolean;
  replied: boolean;
  replyText: string;
  createdAt: string;
}

export interface MetricItem {
  id: string;
  label: I18nText;
  percent: number;
  color: string;
}

export interface QuickLink {
  id: string;
  label: I18nText;
  url: string;
  icon: string;
}

export interface MiniProject {
  id: string;
  title: I18nText;
  description: I18nText;
  tech: string;
}

export interface ActivityItem {
  id: string;
  text: I18nText;
  date: string;
  type: string;
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
    logoImage: string;
    brandName: I18nText;
    primaryColor: string;
    accentColor: string;
  };
  settings: {
    defaultLanguage: 'fa' | 'en';
    defaultTheme: 'dark' | 'light';
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
    metrics: MetricItem[];
    quickLinks: QuickLink[];
    quote: I18nText;
    welcomeTitle: I18nText;
    welcomeBody: I18nText;
    miniProjects: MiniProject[];
    recentActivity: ActivityItem[];
  };
  projects: {
    customProjects: ProjectItem[];
  };
  resume: {
    summary: I18nText;
    phone: string;
    website: string;
    experience: ExperienceItem[];
    skills: SkillItem[];
    education: EducationItem[];
    languages: LanguageItem[];
  };
  gifts: {
    title: I18nText;
    subtitle: I18nText;
    donationLinks: DonationLink[];
    downloadTitle: I18nText;
    downloads: GiftDownload[];
  };
  announcements: Announcement[];
  comments: Comment[];
  shop: {
    title: I18nText;
    enabled: boolean;
    categories: string[];
    products: ShopProduct[];
  };
  messages: ContactMessage[];
  music: {
    enabled: boolean;
    autoplay: boolean;
    loop: boolean;
    volume: number;
    src: string;
    title: string;
  };
  heroObject: {
    kind: 'none' | 'image' | 'model3d';
    src: string;
    posterSrc: string;
    autoRotate: boolean;
    alt: string;
  };
  seo: {
    siteName: I18nText;
    description: I18nText;
    keywords: string;
    ogImage: string;
    twitterHandle: string;
  };
  analytics: {
    enabled: boolean;
    plausibleDomain: string;
    googleId: string;
  };
  newsletter: {
    enabled: boolean;
    title: I18nText;
    subtitle: I18nText;
    subscribers: string[];
  };
}

export const defaultCmsState: CmsState = {
  version: 1,
  identity: {
    fullName: { fa: 'اوید کیا', en: 'Avid Kia' },
    title: { fa: 'معمار سیستم و مهندس بک‌اند', en: 'System Architect & Backend Engineer' },
    location: { fa: 'ایران', en: 'Iran' },
    email: 'hello@avidkiya.dev',
    yearsExperience: 5,
    bio: {
      fa: 'مهندس نرم‌افزار با تمرکز بر معماری سیستم‌های مقیاس‌پذیر، طراحی API و زیرساخت‌های ابری.',
      en: 'Software engineer focused on scalable system architecture, API design and cloud infrastructure.'
    },
    handle: 'avidkiya',
  },
  brand: {
    logoLetter: 'AK',
    logoImage: '',
    brandName: { fa: 'اوید کیا', en: 'AvidKiya' },
    primaryColor: '#5d7ae6',
    accentColor: '#34d399',
  },
  settings: {
    defaultLanguage: 'fa',
    defaultTheme: 'dark',
    githubUsername: 'avidkiya',
    editMode: false,
  },
  socials: [
    { id: '1', platform: 'github', url: 'https://github.com/avidkiya', label: { fa: 'گیت‌هاب', en: 'GitHub' }, icon: 'github', visible: true },
    { id: '2', platform: 'telegram', url: 'https://t.me/avidkiya', label: { fa: 'تلگرام', en: 'Telegram' }, icon: 'telegram', visible: true },
    { id: '3', platform: 'linkedin', url: 'https://linkedin.com/in/avidkiya', label: { fa: 'لینکدین', en: 'LinkedIn' }, icon: 'linkedin', visible: true },
  ],
  dashboard: {
    heroTag: { fa: '🟢 آماده همکاری', en: '🟢 Available for hire' },
    heroTitleA: { fa: 'معمار سیستم', en: 'System Architect' },
    heroTitleB: { fa: 'مهندس بک‌اند', en: 'Backend Engineer' },
    heroDescription: {
      fa: 'طراحی و ساخت سیستم‌های مقیاس‌پذیر، API‌های قدرتمند و زیرساخت‌های ابری با تکنولوژی‌های مدرن.',
      en: 'Designing and building scalable systems, powerful APIs and cloud infrastructure with modern technologies.'
    },
    ctaPrimary: { fa: 'مشاهده کارها', en: 'View Work' },
    ctaSecondary: { fa: 'ارتباط با من', en: 'Contact Me' },
    projects: [
      {
        id: 'p1',
        title: { fa: 'سیستم مدیریت API', en: 'API Management System' },
        description: { fa: 'پلتفرم مدیریت و مانیتورینگ API با قابلیت rate limiting و analytics', en: 'API management and monitoring platform with rate limiting and analytics' },
        tech: ['Go', 'PostgreSQL', 'Redis', 'Docker'],
        image: '',
        url: '#',
        github: '#',
        featured: true,
      },
      {
        id: 'p2',
        title: { fa: 'پلتفرم اتوماسیون', en: 'Automation Platform' },
        description: { fa: 'سیستم workflow automation برای خودکارسازی فرآیندهای تکراری', en: 'Workflow automation system for automating repetitive processes' },
        tech: ['TypeScript', 'Node.js', 'RabbitMQ'],
        image: '',
        url: '#',
        github: '#',
        featured: true,
      },
    ],
    stats: [
      { id: 's1', label: { fa: 'پروژه', en: 'Projects' }, value: '20+', icon: 'folder' },
      { id: 's2', label: { fa: 'سال تجربه', en: 'Years Exp' }, value: '5+', icon: 'clock' },
      { id: 's3', label: { fa: 'مشارکت', en: 'Contributions' }, value: '500+', icon: 'git-commit-horizontal' },
      { id: 's4', label: { fa: 'ستاره', en: 'Stars' }, value: '100+', icon: 'star' },
    ],
  },
  about: {
    statusTitle: { fa: 'وضعیت سیستم', en: 'System Status' },
    metrics: [
      { id: 'm1', label: { fa: 'بهره‌وری CPU', en: 'CPU Usage' }, percent: 72, color: '#5d7ae6' },
      { id: 'm2', label: { fa: 'حافظه', en: 'Memory' }, percent: 58, color: '#34d399' },
      { id: 'm3', label: { fa: 'پهنای باند', en: 'Bandwidth' }, percent: 45, color: '#fbbf24' },
    ],
    quickLinks: [
      { id: 'q1', label: { fa: 'گیت‌هاب', en: 'GitHub' }, url: 'https://github.com/avidkiya', icon: 'github' },
      { id: 'q2', label: { fa: 'رزومه', en: 'Resume' }, url: '/resume', icon: 'file-text' },
      { id: 'q3', label: { fa: 'تماس', en: 'Contact' }, url: '#contact', icon: 'mail' },
    ],
    quote: {
      fa: '«بهترین کد، کدی است که نیازی به توضیح نداشته باشد.»',
      en: '"The best code is code that needs no explanation."'
    },
    welcomeTitle: { fa: 'خوش آمدید به ترمینال من', en: 'Welcome to my terminal' },
    welcomeBody: {
      fa: 'من اوید کیا هستم، مهندس نرم‌افزار با تمرکز بر بک‌اند و معماری سیستم. اینجا می‌تونید بیشتر درباره من بدونید.',
      en: 'I am Avid Kia, a software engineer focused on backend and system architecture. Here you can learn more about me.'
    },
    miniProjects: [
      { id: 'mp1', title: { fa: 'میکروسرویس Auth', en: 'Auth Microservice' }, description: { fa: 'سیستم احراز هویت JWT/OAuth2', en: 'JWT/OAuth2 authentication system' }, tech: 'Go' },
      { id: 'mp2', title: { fa: 'کش توزیع‌شده', en: 'Distributed Cache' }, description: { fa: 'لایه کش Redis Cluster', en: 'Redis Cluster caching layer' }, tech: 'Redis' },
    ],
    recentActivity: [
      { id: 'a1', text: { fa: 'پوش به ریپو API Gateway', en: 'Pushed to API Gateway repo' }, date: '2024-01-15', type: 'commit' },
      { id: 'a2', text: { fa: 'ریلیز نسخه ۲.۰', en: 'Released v2.0' }, date: '2024-01-10', type: 'release' },
    ],
  },
  projects: {
    customProjects: [],
  },
  resume: {
    summary: {
      fa: 'مهندس نرم‌افزار با بیش از ۵ سال تجربه در طراحی و توسعه سیستم‌های مقیاس‌پذیر.',
      en: 'Software engineer with 5+ years of experience designing and developing scalable systems.'
    },
    phone: '+98 912 000 0000',
    website: 'avidkiya.dev',
    experience: [
      {
        id: 'e1',
        title: { fa: 'مهندس ارشد بک‌اند', en: 'Senior Backend Engineer' },
        company: { fa: 'شرکت فناوری', en: 'Tech Company' },
        period: { fa: '۱۴۰۰ - اکنون', en: '2021 - Present' },
        bullets: [
          { fa: 'طراحی معماری میکروسرویس برای سیستم‌های با ترافیک بالا', en: 'Designed microservice architecture for high-traffic systems' },
          { fa: 'پیاده‌سازی CI/CD pipeline با Docker و Kubernetes', en: 'Implemented CI/CD pipeline with Docker and Kubernetes' },
        ],
      },
    ],
    skills: [
      { id: 'sk1', name: 'Go', percent: 90, category: 'backend' },
      { id: 'sk2', name: 'TypeScript', percent: 85, category: 'backend' },
      { id: 'sk3', name: 'Python', percent: 80, category: 'backend' },
      { id: 'sk4', name: 'PostgreSQL', percent: 88, category: 'database' },
      { id: 'sk5', name: 'Redis', percent: 82, category: 'database' },
      { id: 'sk6', name: 'Docker', percent: 85, category: 'devops' },
      { id: 'sk7', name: 'Kubernetes', percent: 75, category: 'devops' },
      { id: 'sk8', name: 'React/Next.js', percent: 70, category: 'frontend' },
    ],
    education: [
      { id: 'ed1', degree: { fa: 'کارشناسی مهندسی نرم‌افزار', en: 'B.Sc. Software Engineering' }, school: { fa: 'دانشگاه تهران', en: 'University of Tehran' }, year: '2019' },
    ],
    languages: [
      { id: 'l1', name: { fa: 'فارسی', en: 'Persian' }, level: { fa: 'بومی', en: 'Native' } },
      { id: 'l2', name: { fa: 'انگلیسی', en: 'English' }, level: { fa: 'حرفه‌ای', en: 'Professional' } },
    ],
  },
  gifts: {
    title: { fa: 'هدیه‌ها', en: 'Gifts' },
    subtitle: { fa: 'تبادل هدیه بین من و شما', en: 'Gift exchange between us' },
    donationLinks: [
      { id: 'd1', platform: 'Buy Me a Coffee', url: 'https://buymeacoffee.com/avidkiya', label: { fa: 'قهوه مهمان کن', en: 'Buy Me a Coffee' }, color: '#FFDD00', icon: 'coffee' },
    ],
    downloadTitle: { fa: 'هدیه من به شما', en: 'My gift to you' },
    downloads: [],
  },
  announcements: [
    {
      id: 'ann1',
      type: 'news',
      title: { fa: 'خوش آمدید!', en: 'Welcome!' },
      body: { fa: 'به وبسایت جدید من خوش آمدید. این سایت با عشق ساخته شده.', en: 'Welcome to my new website. Built with love.' },
      image: '',
      pinned: true,
      archived: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      expiresAt: null,
    },
  ],
  comments: [],
  shop: {
    title: { fa: 'فروشگاه', en: 'Shop' },
    enabled: true,
    categories: ['template', 'course', 'tool'],
    products: [],
  },
  messages: [],
  music: { enabled: false, autoplay: false, loop: true, volume: 0.5, src: '', title: '' },
  heroObject: { kind: 'none', src: '', posterSrc: '', autoRotate: true, alt: '' },
  seo: {
    siteName: { fa: 'اوید کیا', en: 'Avid Kia' },
    description: { fa: 'پرتفولیو شخصی اوید کیا - معمار سیستم و مهندس بک‌اند', en: 'Avid Kia - System Architect & Backend Engineer Portfolio' },
    keywords: 'developer,backend,system architect,portfolio',
    ogImage: '',
    twitterHandle: '@avidkiya',
  },
  analytics: { enabled: false, plausibleDomain: '', googleId: '' },
  newsletter: {
    enabled: false,
    title: { fa: 'خبرنامه', en: 'Newsletter' },
    subtitle: { fa: 'در جریان آخرین اخبار باشید', en: 'Stay updated with latest news' },
    subscribers: [],
  },
};
