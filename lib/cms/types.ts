export interface I18nText { fa: string; en: string; }

export interface SocialAccount {
  id: string;
  platform: 'github'|'telegram'|'instagram'|'x'|'linkedin'|'youtube'|'email';
  url: string;
  label: I18nText;
  enabled: boolean;
}

export interface FeaturedProject {
  id: string;
  title: I18nText;
  description: I18nText;
  image?: string;
  githubUrl?: string;
  demoUrl?: string;
  tags: string[];
}

export interface Stat {
  id: string;
  label: I18nText;
  value: string;
  icon?: string;
}

export interface CustomProject {
  id: string;
  title: string;
  description: string;
  stars?: number;
  language?: string;
  url?: string;
  featured: boolean;
}

export interface CommentItem {
  id: string;
  author: string;
  email?: string;
  role?: string;
  text: string;
  avatar?: string;
  rating?: number;
  approved: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: I18nText;
  slug: string;
  excerpt: I18nText;
  content: I18nText;
  coverImage?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  scheduledAt?: string;
  seo: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: 'news' | 'poll' | 'image' | 'text';
  date: string;
  pinned?: boolean;
  archived?: boolean;
  expiresAt?: string;
  image?: string;
  pollOptions?: Array<{ id: string; text: string; votes: number }>;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses?: number;
  uses: number;
  expiresAt?: string;
  firstPurchaseOnly: boolean;
  enabled: boolean;
}

export interface Order {
  id: string;
  userId?: string;
  productId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  couponCode?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'expiry' | 'report' | 'streak' | 'comment' | 'product' | 'system';
  title: string;
  message?: string;
  read: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  title: I18nText;
  description: I18nText;
  price: number;
  currency: 'IRR'|'USD'|'EUR'|'TMN'|'USDT';
  image?: string;
  fileUrl?: string;
  category: string;
  enabled: boolean;
  featured?: boolean;
  discount?: number;
  stock?: number;
}

export interface ServiceItem {
  id: string;
  title: I18nText;
  description: I18nText;
  priceFrom?: number;
  icon?: string;
  enabled: boolean;
}

export interface ToolItem {
  id: string;
  title: I18nText;
  description: I18nText;
  url: string;
  category: string;
  isPro: boolean;
  enabled: boolean;
}

export interface Plan {
  id: string;
  name: I18nText;
  priceMonthly: number;
  priceYearly: number;
  features: I18nText[];
  highlighted?: boolean;
  cta: I18nText;
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
    brandName: string;
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
    projects: FeaturedProject[];
    stats: Stat[];
  };
  about: {
    statusTitle: I18nText;
    metrics: Array<{label:I18nText; value:string}>;
    quickLinks: Array<{label:I18nText; url:string; icon?:string}>;
    quote: I18nText;
    welcomeTitle: I18nText;
    welcomeBody: I18nText;
    miniProjects: Array<{title:string; desc:string}>;
    recentActivity: Array<{text:string; date:string}>;
  };
  projects: {
    customProjects: CustomProject[];
  };
  resume: {
    summary: I18nText;
    phone: string;
    website: string;
    experience: Array<{title:string; company:string; period:string; desc:string}>;
    skills: Array<{name:string; level:number}>;
    education: Array<{degree:string; school:string; year:string}>;
    languages: Array<{name:string; level:string}>;
  };
  gifts: {
    title: I18nText;
    subtitle: I18nText;
    donationLinks: Array<{label:string; url:string}>;
    downloadTitle: I18nText;
    downloads: Array<{title:string; url:string}>;
  };
  announcements: Announcement[];
  comments: CommentItem[];
  blog: {
    enabled: boolean;
    posts: BlogPost[];
  };
  coupons: Coupon[];
  orders: Order[];
  shop: {
    title: I18nText;
    enabled: boolean;
    categories: string[];
    products: Product[];
  };
  freelancing: {
    title: I18nText;
    enabled: boolean;
    services: ServiceItem[];
    portfolio: Array<{id:string; title:string; image?:string; url?:string}>;
    pricing: Array<{name:string; price:number}>;
    contactForm: { enabled: boolean };
  };
  tools: {
    title: I18nText;
    enabled: boolean;
    categories: string[];
    items: ToolItem[];
  };
  planner: {
    enabled: boolean;
    plans: Plan[];
  };
  messages: Array<{id:string; name:string; email:string; message:string; date:string; read:boolean}>;
  music: {
    enabled: boolean;
    autoplay: boolean;
    loop: boolean;
    volume: number;
    tracks: Array<{title:string; src:string; artist?:string}>;
  };
  heroObject: {
    kind: 'none'|'image'|'model3d'|'video';
    src: string;
    posterSrc: string;
    autoRotate: boolean;
    alt: string;
  };
  quotes: {
    enabled: boolean;
    kourosh: string[];
    mohammadReza: string[];
    rezaShah: string[];
    custom: Array<{author:string; text:string}>;
  };
  seo: { siteName: string; description: string; keywords: string; ogImage: string; };
  analytics: { enabled: boolean; plausibleDomain: string; googleId: string; };
  newsletter: { enabled: boolean; title: I18nText; subscribers: string[]; };
}

export type CmsSection = keyof CmsState;
