export type Lang = 'fa' | 'en';
export type Theme = 'dark' | 'light';
export interface I18nText { fa: string; en: string }
export interface SocialAccount { id: string; platform: string; label: string; url: string; icon: string }
export interface Project { id: string; title: I18nText; description: I18nText; tags: string[]; url?: string; repo?: string; featured?: boolean }
export interface Stat { id: string; label: I18nText; value: string; accent?: string }
export interface Metric { id: string; label: I18nText; percent: number; color?: string }
export interface LinkItem { id: string; label: I18nText; url: string; icon?: string }
export interface Experience { id: string; role: I18nText; company: I18nText; period: I18nText; bullets: I18nText[] }
export interface Skill { id: string; name: string; percent: number; category?: string }
export interface Education { id: string; title: I18nText; place: I18nText; period: I18nText }
export interface GiftDownload { id: string; title: I18nText; description: I18nText; url: string; type: string }
export interface DonationLink { id: string; label: I18nText; url: string; kind: string }
export type AnnouncementType = 'news'|'poll'|'map'|'image'|'text';
export interface Announcement { id: string; type: AnnouncementType; title: I18nText; body: I18nText; image?: string; pinned?: boolean; archived?: boolean; hidden?: boolean; expiresAt?: string; poll?: { question: I18nText; options: { id:string; label:I18nText; votes:number }[] }; mapUrl?: string; createdAt: string }
export interface Comment { id: string; name: string; email?: string; role?: string; rating: number; text: string; approved: boolean; pinned?: boolean; createdAt: string }
export interface Product { id: string; title: I18nText; description: I18nText; price: string; category: string; tags: string[]; image?: string; featured?: boolean; soldOut?: boolean; discount?: number; buyUrl?: string }
export interface Message { id: string; name: string; email: string; subject?: string; text: string; reply?: string; createdAt: string; read?: boolean }

export interface CmsState {
  version: number;
  identity: { fullName: I18nText; title: I18nText; location: I18nText; email: string; yearsExperience: string; bio: I18nText; handle: string; phone: string; website: string };
  brand: { logoLetter: string; logoImage: string; brandName: I18nText; primaryColor: string; accentColor: string };
  settings: { defaultLanguage: Lang; defaultTheme: Theme; githubUsername: string; editMode: boolean };
  socials: SocialAccount[];
  dashboard: { heroTag: I18nText; heroTitleA: I18nText; heroTitleB: I18nText; heroDescription: I18nText; ctaPrimary: I18nText; ctaSecondary: I18nText; projects: Project[]; stats: Stat[] };
  about: { statusTitle: I18nText; metrics: Metric[]; quickLinks: LinkItem[]; quote: I18nText; welcomeTitle: I18nText; welcomeBody: I18nText; miniProjects: Project[]; recentActivity: { id:string; title:I18nText; time:I18nText }[] };
  projects: { customProjects: Project[] };
  resume: { summary: I18nText; phone: string; website: string; experience: Experience[]; skills: Skill[]; education: Education[]; languages: Skill[]; profiles: LinkItem[] };
  gifts: { title: I18nText; subtitle: I18nText; donationLinks: DonationLink[]; downloadTitle: I18nText; downloads: GiftDownload[] };
  announcements: Announcement[];
  comments: Comment[];
  shop: { title: I18nText; enabled: boolean; categories: string[]; products: Product[] };
  messages: Message[];
  music: { enabled: boolean; autoplay: boolean; loop: boolean; volume: number; src: string; title: string };
  heroObject: { kind: 'none'|'image'|'model3d'; src: string; posterSrc: string; autoRotate: boolean; alt: I18nText };
  seo: { siteName: string; description: string; keywords: string; ogImage: string; twitterHandle: string };
  analytics: { enabled: boolean; plausibleDomain: string; googleId: string };
  newsletter: { enabled: boolean; title: I18nText; subtitle: I18nText; subscribers: string[] };
}

const t = (fa: string, en: string): I18nText => ({ fa, en });

export const defaultCmsState: CmsState = {
  version: 1,
  identity: {
    fullName: t('اوید کیا', 'Avid Kiya'),
    title: t('معمار سیستم و مهندس بک‌اند', 'Systems Architect & Backend Engineer'),
    location: t('پاریس، فرانسه', 'Paris, France'),
    email: 'hello@avidkiya.dev',
    yearsExperience: '+7',
    phone: '+33 0 00 00 00 00',
    website: 'avidkiya.dev',
    handle: '@avidkiya',
    bio: t('من سیستم‌های مقیاس‌پذیر، ابزارهای اتوماسیون و تجربه‌های وب سریع می‌سازم؛ جایی بین معماری بک‌اند، امنیت و محصول.', 'I build scalable systems, automation tools and fast web experiences at the intersection of backend architecture, security and product.'),
  },
  brand: { logoLetter: 'AK', logoImage: '', brandName: t('AvidKiya OS', 'AvidKiya OS'), primaryColor: '#5d7ae6', accentColor: '#34d399' },
  settings: { defaultLanguage: 'fa', defaultTheme: 'dark', githubUsername: 'IR-NETLIFY', editMode: false },
  socials: [
    { id:'github', platform:'GitHub', label:'GitHub', url:'https://github.com/IR-NETLIFY', icon:'github' },
    { id:'telegram', platform:'Telegram', label:'Telegram', url:'https://t.me/avidkiya', icon:'telegram' },
    { id:'linkedin', platform:'LinkedIn', label:'LinkedIn', url:'https://linkedin.com', icon:'linkedin' },
    { id:'x', platform:'X', label:'X', url:'https://x.com', icon:'x' },
  ],
  dashboard: {
    heroTag: t('سیستم آنلاین است', 'System online'),
    heroTitleA: t('اوید کیا', 'Avid Kiya'),
    heroTitleB: t('DevHub OS', 'DevHub OS'),
    heroDescription: t('پرتفولیو هدلس، داشبورد شخصی و مرکز فرماندهی پروژه‌ها؛ طراحی‌شده برای نمایش مهارت، اعتماد و سرعت.', 'A headless portfolio, personal dashboard and project command center designed to communicate skill, trust and speed.'),
    ctaPrimary: t('مشاهده پروژه‌ها', 'View Work'),
    ctaSecondary: t('تماس', 'Contact'),
    projects: [
      { id:'p1', title:t('اتوماسیون استقرار Cloudflare', 'Cloudflare Deployment Automation'), description:t('Worker نصب‌کننده با KV، Pages و secrets.', 'Installer Worker with KV, Pages and secrets.'), tags:['Cloudflare','Workers','KV'], featured:true },
      { id:'p2', title:t('API Gateway مقیاس‌پذیر', 'Scalable API Gateway'), description:t('احراز هویت، rate limit و observability برای سرویس‌ها.', 'Auth, rate limiting and observability for services.'), tags:['Node.js','Redis','Postgres'], featured:true },
      { id:'p3', title:t('پایپ‌لاین داده و مانیتورینگ', 'Data & Monitoring Pipeline'), description:t('جمع‌آوری، پاک‌سازی و داشبورد زمان‌واقعی.', 'Realtime ingestion, cleanup and dashboards.'), tags:['Python','ETL','Grafana'] },
      { id:'p4', title:t('CMS بدون سرور', 'Serverless CMS'), description:t('مدیریت محتوا روی KV با ویرایش inline.', 'KV-backed CMS with inline editing.'), tags:['Next.js','KV','TypeScript'] },
    ],
    stats: [
      { id:'s1', label:t('سال تجربه', 'Years experience'), value:'+7', accent:'emerald' },
      { id:'s2', label:t('پروژه تحویل‌شده', 'Delivered projects'), value:'42+', accent:'cyan' },
      { id:'s3', label:t('آپتایم هدف', 'Target uptime'), value:'99.9%', accent:'amber' },
      { id:'s4', label:t('استک اصلی', 'Core stack'), value:'Py/Node', accent:'violet' },
    ],
  },
  about: {
    statusTitle: t('وضعیت سیستم', 'System Status'),
    metrics: [ {id:'cpu', label:t('پردازنده', 'CPU'), percent:42, color:'#6f93ec'}, {id:'mem', label:t('حافظه', 'Memory'), percent:68, color:'#34d399'}, {id:'bw', label:t('پهنای‌باند', 'Bandwidth'), percent:55, color:'#fbbf24'} ],
    quickLinks: [ {id:'cv', label:t('رزومه چاپی', 'Printable CV'), url:'/resume', icon:'fileText'}, {id:'gh', label:t('گیت‌هاب', 'GitHub'), url:'https://github.com/IR-NETLIFY', icon:'github'} ],
    quote: t('سیستم خوب، قبل از دیده‌شدن، قابل اعتماد است.', 'A good system is reliable before it is visible.'),
    welcomeTitle: t('به مرکز فرماندهی خوش آمدید', 'Welcome to Command Center'),
    welcomeBody: t('اینجا نمای عملیاتی مهارت‌ها، پروژه‌ها، ارتباطات و مسیر حرفه‌ای من است.', 'This is the operational view of my skills, projects, communication and professional path.'),
    miniProjects: [],
    recentActivity: [ {id:'a1', title:t('بهبود CMS و پنل ادمین', 'Improved CMS and admin panel'), time:t('امروز', 'Today')}, {id:'a2', title:t('افزودن API نظرات', 'Added comments API'), time:t('۲ روز پیش', '2 days ago')} ],
  },
  projects: { customProjects: [] },
  resume: {
    summary: t('مهندس بک‌اند با تمرکز بر معماری سیستم، اتوماسیون ابری و ساخت محصولات قابل نگهداری.', 'Backend engineer focused on systems architecture, cloud automation and maintainable products.'),
    phone: '+33 0 00 00 00 00', website: 'avidkiya.dev',
    experience: [ { id:'e1', role:t('Systems Architect', 'Systems Architect'), company:t('Freelance / Remote', 'Freelance / Remote'), period:t('۲۰۲۱ — اکنون', '2021 — Present'), bullets:[t('طراحی سرویس‌های مقیاس‌پذیر و APIهای امن.', 'Designed scalable services and secure APIs.'), t('اتوماسیون CI/CD و استقرارهای serverless.', 'Automated CI/CD and serverless deployments.')] }, { id:'e2', role:t('Backend Engineer', 'Backend Engineer'), company:t('محصولات SaaS', 'SaaS Products'), period:t('۲۰۱۸ — ۲۰۲۱', '2018 — 2021'), bullets:[t('ساخت API، صف، کش و مانیتورینگ.', 'Built APIs, queues, caching and monitoring.'), t('بهینه‌سازی کارایی و کاهش هزینه زیرساخت.', 'Optimized performance and reduced infrastructure cost.')] } ],
    skills: [ {id:'sk1', name:'Python', percent:92, category:'backend'}, {id:'sk2', name:'Node.js', percent:88, category:'backend'}, {id:'sk3', name:'TypeScript', percent:86, category:'frontend'}, {id:'sk4', name:'Cloudflare', percent:84, category:'cloud'}, {id:'sk5', name:'PostgreSQL', percent:80, category:'data'} ],
    education: [ {id:'ed1', title:t('مهندسی نرم‌افزار', 'Software Engineering'), place:t('مطالعه تخصصی و پروژه‌محور', 'Project-based specialization'), period:t('پیوسته', 'Ongoing')} ],
    languages: [ {id:'l1', name:'فارسی / Persian', percent:100}, {id:'l2', name:'English', percent:86}, {id:'l3', name:'Français', percent:55} ],
    profiles: [ {id:'pr1', label:t('گیت‌هاب', 'GitHub'), url:'https://github.com/IR-NETLIFY', icon:'github'}, {id:'pr2', label:t('لینکدین', 'LinkedIn'), url:'https://linkedin.com', icon:'linkedin'} ],
  },
  gifts: {
    title:t('هدیه‌ها و حمایت', 'Gifts & Support'), subtitle:t('چیزهایی که رایگان می‌دهم و راه‌هایی که می‌توانید حمایت کنید.', 'Free resources I share and ways you can support.'), downloadTitle:t('هدیه من به شما', 'My gift to you'),
    downloads:[ {id:'d1', title:t('PDF راهنمای شروع بک‌اند', 'Backend starter PDF'), description:t('چک‌لیست ابزار و معماری.', 'Tools and architecture checklist.'), url:'#', type:'PDF'}, {id:'d2', title:t('کانفیگ نمونه V2Ray', 'Sample V2Ray config'), description:t('برای آموزش و آزمایش.', 'For learning and testing.'), url:'#', type:'CONFIG'} ],
    donationLinks:[ {id:'zarin', label:t('زرین‌پال', 'ZarinPal'), url:'#', kind:'zarinpal'}, {id:'coffee', label:t('Buy Me a Coffee', 'Buy Me a Coffee'), url:'#', kind:'coffee'}, {id:'btc', label:t('Bitcoin', 'Bitcoin'), url:'#', kind:'bitcoin'} ],
  },
  announcements: [
    { id:'an1', type:'news', title:t('نسخه جدید AvidKiya OS', 'New AvidKiya OS release'), body:t('پنل ادمین، CMS و دیپلوی خودکار اضافه شد.', 'Admin panel, CMS and auto deployer were added.'), pinned:true, createdAt:new Date().toISOString() },
    { id:'an2', type:'poll', title:t('نظرسنجی', 'Poll'), body:t('کدام محتوا برای شما جذاب‌تر است؟', 'Which content is more useful?'), createdAt:new Date().toISOString(), poll:{ question:t('موضوع بعدی؟', 'Next topic?'), options:[{id:'o1', label:t('Cloudflare', 'Cloudflare'), votes:12},{id:'o2', label:t('Backend', 'Backend'), votes:9},{id:'o3', label:t('Security', 'Security'), votes:5}] } },
    { id:'an3', type:'map', title:t('موقعیت کاری', 'Work location'), body:t('فعال در پاریس و ریموت.', 'Based in Paris and remote.'), mapUrl:'https://www.openstreetmap.org/export/embed.html?bbox=2.224%2C48.815%2C2.469%2C48.902&layer=mapnik', createdAt:new Date().toISOString() }
  ],
  comments: [ {id:'c1', name:'Nima', role:'Founder', rating:5, text:'بسیار دقیق، سریع و قابل اعتماد.', approved:true, pinned:true, createdAt:new Date().toISOString()}, {id:'c2', name:'Sarah', role:'PM', rating:5, text:'Great architecture and communication.', approved:true, createdAt:new Date().toISOString()} ],
  shop: { title:t('فروشگاه محصولات دیجیتال', 'Digital Products Shop'), enabled:true, categories:['all','templates','ebooks','automation'], products:[ {id:'prod1', title:t('قالب API Gateway', 'API Gateway Template'), description:t('استارتر امن Node.js + TypeScript.', 'Secure Node.js + TypeScript starter.'), price:'49 USDT', category:'templates', tags:['Node','Auth'], featured:true, discount:20, buyUrl:'mailto:hello@avidkiya.dev?subject=Buy API Gateway'}, {id:'prod2', title:t('چک‌لیست معماری سیستم', 'System Architecture Checklist'), description:t('PDF فشرده برای طراحی سرویس.', 'Compact PDF for service design.'), price:'15 EUR', category:'ebooks', tags:['PDF','Architecture'], buyUrl:'mailto:hello@avidkiya.dev?subject=Buy Checklist'} ] },
  messages: [],
  music: { enabled:false, autoplay:false, loop:true, volume:.25, src:'', title:'' },
  heroObject: { kind:'none', src:'', posterSrc:'', autoRotate:true, alt:t('شیء قهرمان', 'Hero object') },
  seo: { siteName:'AvidKiya OS', description:'Avid Kiya — Systems Architect & Backend Engineer', keywords:'Avid Kiya, backend, systems architect, Cloudflare, portfolio', ogImage:'', twitterHandle:'@avidkiya' },
  analytics: { enabled:false, plausibleDomain:'', googleId:'' },
  newsletter: { enabled:true, title:t('عضویت در خبرنامه DevHub', 'Join the DevHub newsletter'), subtitle:t('یادداشت‌های کوتاه درباره بک‌اند، امنیت و کلاد.', 'Short notes about backend, security and cloud.'), subscribers:[] },
};

export function migrateCms(input: unknown): CmsState {
  const merge = (base: any, value: any): any => {
    if (Array.isArray(base)) return Array.isArray(value) ? value : base;
    if (base && typeof base === 'object') {
      const out: any = { ...base };
      if (value && typeof value === 'object') for (const k of Object.keys(value)) out[k] = merge(base[k], value[k]);
      return out;
    }
    return value ?? base;
  };
  const migrated = merge(defaultCmsState, input || {});
  migrated.version = defaultCmsState.version;
  return migrated;
}
