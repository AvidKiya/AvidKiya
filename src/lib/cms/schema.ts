// ═══════════════════════════════════════════════════════════════════════════
// AvidKiya OS — CMS Schema
// ═══════════════════════════════════════════════════════════════════════════

export interface I18nText {
  fa: string;
  en: string;
}

export interface SocialAccount {
  id: string;
  platform: 'github' | 'telegram' | 'instagram' | 'twitter' | 'linkedin' | 'email' | 'website';
  url: string;
  label: I18nText;
  enabled: boolean;
}

export interface Project {
  id: string;
  title: I18nText;
  description: I18nText;
  image?: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured: boolean;
}

export interface Stat {
  id: string;
  label: I18nText;
  value: string;
  icon: string;
}

export interface Metric {
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

export interface Experience {
  id: string;
  company: I18nText;
  position: I18nText;
  startDate: string;
  endDate: string;
  bullets: I18nText[];
}

export interface Skill {
  id: string;
  name: string;
  percent: number;
  category: string;
}

export interface Education {
  id: string;
  institution: I18nText;
  degree: I18nText;
  year: string;
}

export interface Language {
  id: string;
  name: I18nText;
  level: I18nText;
}

export interface DonationLink {
  id: string;
  platform: string;
  url: string;
  label: I18nText;
  icon: string;
  color: string;
}

export interface Download {
  id: string;
  title: I18nText;
  description: I18nText;
  url: string;
  icon: string;
  size?: string;
}

export interface Announcement {
  id: string;
  type: 'news' | 'poll' | 'map' | 'image' | 'text';
  title: I18nText;
  content: I18nText;
  image?: string;
  pollOptions?: PollOption[];
  mapLat?: number;
  mapLng?: number;
  mapZoom?: number;
  pinned: boolean;
  archived: boolean;
  hidden: boolean;
  expiresAt?: string;
  createdAt: string;
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
  position: string;
  rating: number;
  text: string;
  approved: boolean;
  pinned: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  title: I18nText;
  description: I18nText;
  image?: string;
  priceUSD?: number;
  priceEUR?: number;
  priceIRR?: number;
  priceTMN?: number;
  priceUSDT?: number;
  discount?: number;
  category: string;
  tags: string[];
  featured: boolean;
  soldOut: boolean;
  buyUrl?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  replyText?: string;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
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
    avatar?: string;
  };
  
  brand: {
    logoLetter: string;
    logoImage?: string;
    brandName: I18nText;
    primaryColor: string;
    accentColor: string;
  };
  
  settings: {
    defaultLanguage: 'fa' | 'en';
    defaultTheme: 'dark' | 'light';
    githubUsername: string;
    editMode: boolean;
    backgroundVideo?: {
      enabled: boolean;
      src?: string;
      poster?: string;
      autoplay?: boolean;
      loop?: boolean;
      muted?: boolean;
    };
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
    stats: Stat[];
  };
  
  about: {
    statusTitle: I18nText;
    metrics: Metric[];
    quickLinks: QuickLink[];
    quote: I18nText;
    welcomeTitle: I18nText;
    welcomeBody: I18nText;
    miniProjects: Project[];
    recentActivity: { id: string; text: I18nText; date: string; icon: string }[];
  };
  
  projects: {
    customProjects: Project[];
  };
  
  resume: {
    summary: I18nText;
    phone: string;
    website: string;
    experience: Experience[];
    skills: Skill[];
    education: Education[];
    languages: Language[];
  };
  
  gifts: {
    title: I18nText;
    subtitle: I18nText;
    donationLinks: DonationLink[];
    downloadTitle: I18nText;
    downloads: Download[];
  };
  
  announcements: Announcement[];
  
  comments: Comment[];
  
  shop: {
    title: I18nText;
    enabled: boolean;
    categories: string[];
    products: Product[];
  };
  
  messages: Message[];
  
  music: {
    enabled: boolean;
    autoplay: boolean;
    loop: boolean;
    volume: number;
    currentIndex?: number;
    tracks: {
      id: string;
      title?: I18nText | string;
      artist?: string;
      src: string;
      cover?: string;
      enabled?: boolean;
    }[];
  };
  
  heroObject: {
    kind: 'none' | 'image' | 'model3d';
    src?: string;
    posterSrc?: string;
    autoRotate: boolean;
    alt?: string;
  };
  
  seo: {
    siteName: I18nText;
    description: I18nText;
    keywords: string[];
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
    subscribers: Subscriber[];
  };
}

// Default CMS State - با نام صحیح Avid Kiya
export const defaultCmsState: CmsState = {
  version: 1,
  
  identity: {
    fullName: { fa: 'اَوید کیا', en: 'Avid Kiya' },
    title: { fa: 'معمار سیستم و مهندس بک‌اند', en: 'System Architect & Backend Engineer' },
    location: { fa: 'تهران، ایران', en: 'Tehran, Iran' },
    email: 'hello@avidkiya.dev',
    yearsExperience: 8,
    bio: {
      fa: 'علاقه‌مند به طراحی سیستم‌های مقیاس‌پذیر و معماری‌های توزیع‌شده',
      en: 'Passionate about scalable system design and distributed architectures'
    },
    handle: '@avidkiya'
  },
  
  brand: {
    logoLetter: 'A',
    brandName: { fa: 'اَوید کیا', en: 'Avid Kiya' },
    primaryColor: '#5d7ae6',
    accentColor: '#34d399'
  },
  
  settings: {
    defaultLanguage: 'fa',
    defaultTheme: 'dark',
    githubUsername: 'avidkiya',
    editMode: false
  },
  
  socials: [
    { id: '1', platform: 'github', url: 'https://github.com/avidkiya', label: { fa: 'گیت‌هاب', en: 'GitHub' }, enabled: true },
    { id: '2', platform: 'telegram', url: 'https://t.me/avidkiya', label: { fa: 'تلگرام', en: 'Telegram' }, enabled: true },
    { id: '3', platform: 'linkedin', url: 'https://linkedin.com/in/avidkiya', label: { fa: 'لینکدین', en: 'LinkedIn' }, enabled: true },
    { id: '4', platform: 'twitter', url: 'https://x.com/avidkiya', label: { fa: 'ایکس', en: 'X (Twitter)' }, enabled: true },
    { id: '5', platform: 'email', url: 'mailto:hello@avidkiya.dev', label: { fa: 'ایمیل', en: 'Email' }, enabled: true }
  ],
  
  dashboard: {
    heroTag: { fa: 'در دسترس برای پروژه‌های جدید', en: 'Available for new projects' },
    heroTitleA: { fa: 'سلام، من', en: "Hi, I'm" },
    heroTitleB: { fa: 'اَوید کیا', en: 'Avid Kiya' },
    heroDescription: {
      fa: 'معمار سیستم و مهندس بک‌اند با بیش از ۸ سال تجربه در طراحی و پیاده‌سازی سیستم‌های مقیاس‌پذیر',
      en: 'System Architect & Backend Engineer with 8+ years of experience in designing scalable systems'
    },
    ctaPrimary: { fa: 'مشاهده پروژه‌ها', en: 'View Work' },
    ctaSecondary: { fa: 'تماس با من', en: 'Contact Me' },
    projects: [
      {
        id: '1',
        title: { fa: 'سیستم مدیریت API', en: 'API Management System' },
        description: { fa: 'Gateway مقیاس‌پذیر برای مدیریت میلیون‌ها درخواست', en: 'Scalable gateway for managing millions of requests' },
        tags: ['Go', 'Redis', 'PostgreSQL'],
        featured: true
      },
      {
        id: '2',
        title: { fa: 'پلتفرم میکروسرویس', en: 'Microservices Platform' },
        description: { fa: 'زیرساخت کانتینری با Kubernetes', en: 'Container infrastructure with Kubernetes' },
        tags: ['Kubernetes', 'Docker', 'Terraform'],
        featured: true
      }
    ],
    stats: [
      { id: '1', label: { fa: 'پروژه تکمیل شده', en: 'Projects Completed' }, value: '50+', icon: 'folder' },
      { id: '2', label: { fa: 'سال تجربه', en: 'Years Experience' }, value: '8+', icon: 'calendar' },
      { id: '3', label: { fa: 'مشتری راضی', en: 'Happy Clients' }, value: '30+', icon: 'users' },
      { id: '4', label: { fa: 'ستاره گیت‌هاب', en: 'GitHub Stars' }, value: '1K+', icon: 'star' }
    ]
  },
  
  about: {
    statusTitle: { fa: 'وضعیت سیستم', en: 'System Status' },
    metrics: [
      { id: '1', label: { fa: 'پردازنده', en: 'CPU' }, percent: 42, color: '#34d399' },
      { id: '2', label: { fa: 'حافظه', en: 'Memory' }, percent: 67, color: '#5d7ae6' },
      { id: '3', label: { fa: 'پهنای باند', en: 'Bandwidth' }, percent: 23, color: '#fbbf24' }
    ],
    quickLinks: [
      { id: '1', label: { fa: 'گیت‌هاب', en: 'GitHub' }, url: 'https://github.com/avidkiya', icon: 'github' },
      { id: '2', label: { fa: 'رزومه', en: 'Resume' }, url: '/resume', icon: 'file-text' },
      { id: '3', label: { fa: 'تماس', en: 'Contact' }, url: '/about', icon: 'mail' }
    ],
    quote: {
      fa: '"کد خوب، کدی است که نیازی به توضیح ندارد"',
      en: '"Good code is its own documentation"'
    },
    welcomeTitle: { fa: 'به ترمینال من خوش آمدید', en: 'Welcome to my Terminal' },
    welcomeBody: {
      fa: 'من یک معمار سیستم هستم که عاشق حل مسائل پیچیده و ساخت سیستم‌های مقیاس‌پذیر است.',
      en: "I'm a system architect who loves solving complex problems and building scalable systems."
    },
    miniProjects: [],
    recentActivity: [
      { id: '1', text: { fa: 'کامیت جدید در پروژه API', en: 'New commit in API project' }, date: '2024-01-15', icon: 'git-commit' },
      { id: '2', text: { fa: 'انتشار نسخه ۲.۰', en: 'Released version 2.0' }, date: '2024-01-10', icon: 'tag' }
    ]
  },
  
  projects: {
    customProjects: []
  },
  
  resume: {
    summary: {
      fa: 'مهندس نرم‌افزار با تخصص در طراحی سیستم‌های توزیع‌شده و معماری میکروسرویس',
      en: 'Software engineer specializing in distributed systems design and microservice architecture'
    },
    phone: '+98 912 xxx xxxx',
    website: 'avidkiya.dev',
    experience: [
      {
        id: '1',
        company: { fa: 'شرکت فناوری', en: 'Tech Company' },
        position: { fa: 'معمار ارشد سیستم', en: 'Senior System Architect' },
        startDate: '2020',
        endDate: 'کنون',
        bullets: [
          { fa: 'طراحی معماری میکروسرویس برای ۱۰+ سرویس', en: 'Designed microservice architecture for 10+ services' },
          { fa: 'کاهش ۴۰٪ زمان پاسخ‌دهی API', en: 'Reduced API response time by 40%' }
        ]
      }
    ],
    skills: [
      { id: '1', name: 'Go', percent: 95, category: 'Languages' },
      { id: '2', name: 'TypeScript', percent: 90, category: 'Languages' },
      { id: '3', name: 'Python', percent: 85, category: 'Languages' },
      { id: '4', name: 'PostgreSQL', percent: 90, category: 'Databases' },
      { id: '5', name: 'Redis', percent: 88, category: 'Databases' },
      { id: '6', name: 'Kubernetes', percent: 85, category: 'DevOps' },
      { id: '7', name: 'Docker', percent: 92, category: 'DevOps' }
    ],
    education: [
      {
        id: '1',
        institution: { fa: 'دانشگاه تهران', en: 'University of Tehran' },
        degree: { fa: 'کارشناسی ارشد مهندسی نرم‌افزار', en: 'M.Sc. Software Engineering' },
        year: '2018'
      }
    ],
    languages: [
      { id: '1', name: { fa: 'فارسی', en: 'Persian' }, level: { fa: 'زبان مادری', en: 'Native' } },
      { id: '2', name: { fa: 'انگلیسی', en: 'English' }, level: { fa: 'حرفه‌ای', en: 'Professional' } }
    ]
  },
  
  gifts: {
    title: { fa: 'هدیه‌ها', en: 'Gifts' },
    subtitle: { fa: 'تبادل هدیه بین ما', en: 'Gift exchange between us' },
    donationLinks: [
      { id: '1', platform: 'zarinpal', url: '#', label: { fa: 'زرین‌پال', en: 'ZarinPal' }, icon: 'credit-card', color: '#FFD700' },
      { id: '2', platform: 'coffee', url: '#', label: { fa: 'یک قهوه مهمانم کن', en: 'Buy Me a Coffee' }, icon: 'coffee', color: '#FBBC04' }
    ],
    downloadTitle: { fa: 'هدیه من به شما', en: 'My gift to you' },
    downloads: [
      { id: '1', title: { fa: 'کانفیگ V2Ray', en: 'V2Ray Config' }, description: { fa: 'کانفیگ رایگان', en: 'Free config' }, url: '#', icon: 'download', size: '2KB' }
    ]
  },
  
  announcements: [],
  
  comments: [],
  
  shop: {
    title: { fa: 'فروشگاه', en: 'Shop' },
    enabled: true,
    categories: ['Templates', 'Courses', 'Tools'],
    products: []
  },
  
  messages: [],
  
  music: {
    enabled: false,
    autoplay: false,
    loop: true,
    volume: 0.5,
    currentIndex: 0,
    tracks: []
  },
  
  heroObject: {
    kind: 'none',
    autoRotate: true
  },
  
  seo: {
    siteName: { fa: 'اَوید کیا — پرتفولیو', en: 'Avid Kiya — Portfolio' },
    description: {
      fa: 'معمار سیستم و مهندس بک‌اند',
      en: 'System Architect & Backend Engineer'
    },
    keywords: ['developer', 'backend', 'system architect', 'portfolio']
  },
  
  analytics: {
    enabled: false
  },
  
  newsletter: {
    enabled: true,
    title: { fa: 'خبرنامه', en: 'Newsletter' },
    subtitle: { fa: 'از آخرین مطالب باخبر شوید', en: 'Stay updated with latest content' },
    subscribers: []
  }
};
