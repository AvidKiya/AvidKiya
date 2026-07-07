import { CmsState } from './types';
import { QUOTES } from '../calendar';

export const defaultCmsState: CmsState = {
  version: 1,
  identity: {
    fullName: { fa: 'اَوید کیا', en: 'Avid Kiya' },
    title: { fa: 'معمار سیستم — توسعه‌دهنده فول‌استک', en: 'Systems Architect — Full-Stack Developer' },
    location: { fa: 'ایران', en: 'Iran' },
    email: 'hello@avidkiya.com',
    yearsExperience: 8,
    bio: { fa: 'معمار سیستم‌های مقیاس‌پذیر. عاشق AI و طراحی شیشه‌ای.', en: 'Architecting scalable systems. AI & Liquid Glass enthusiast.' },
    handle: 'avidkiya',
  },
  brand: {
    logoLetter: 'A',
    logoImage: '',
    brandName: 'اَوید کیا',
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
    { id:'gh', platform:'github', url:'https://github.com/avidkiya', label:{fa:'گیت‌هاب',en:'GitHub'}, enabled:true },
    { id:'tg', platform:'telegram', url:'https://t.me/avidkiya', label:{fa:'تلگرام',en:'Telegram'}, enabled:true },
    { id:'li', platform:'linkedin', url:'https://linkedin.com/in/avidkiya', label:{fa:'لینکدین',en:'LinkedIn'}, enabled:true },
    { id:'x', platform:'x', url:'https://x.com/avidkiya', label:{fa:'ایکس',en:'X'}, enabled:true },
    { id:'ig', platform:'instagram', url:'https://instagram.com/avidkiya', label:{fa:'اینستاگرام',en:'Instagram'}, enabled:true },
    { id:'em', platform:'email', url:'mailto:hello@avidkiya.com', label:{fa:'ایمیل',en:'Email'}, enabled:true },
  ],
  dashboard: {
    heroTag: { fa:'DEVHUB OS', en:'DEVHUB OS' },
    heroTitleA: { fa:'اَوید کیا', en:'Avid Kiya' },
    heroTitleB: { fa:'معمار سیستم — توسعه‌دهنده فول‌استک', en:'Systems Architect — Full-Stack Developer' },
    heroDescription: { fa:'معمار سیستم‌های مقیاس‌پذیر. عاشق AI و طراحی شیشه‌ای.', en:'Architecting scalable systems. AI & Liquid Glass enthusiast.' },
    ctaPrimary: { fa:'مشاهده پروژه‌ها', en:'View projects' },
    ctaSecondary: { fa:'شروع همکاری', en:'Hire me' },
    projects: [],
    stats: [
      { id:'1', label:{fa:'پروژه تکمیل‌شده', en:'Projects Done'}, value:'120+', icon:'rocket' },
      { id:'2', label:{fa:'مشتری راضی', en:'Happy Clients'}, value:'84', icon:'message' },
      { id:'3', label:{fa:'سال تجربه', en:'Years Exp'}, value:'8', icon:'zap' },
      { id:'4', label:{fa:'کامیت گیت‌هاب', en:'GitHub Commits'}, value:'4.2k', icon:'package' },
    ],
  },
  about: {
    statusTitle: { fa:'وضعیت فعلی', en:'Current Status' },
    metrics: [
      { label:{fa:'آپ‌تایم',en:'Uptime'}, value:'99.9%' },
      { label:{fa:'پاسخ‌دهی',en:'Response'}, value:'<120ms' },
    ],
    quickLinks: [
      { label:{fa:'گیت‌هاب',en:'GitHub'}, url:'https://github.com/avidkiya', icon:'github' },
      { label:{fa:'رزومه',en:'Resume'}, url:'/resume', icon:'resume' },
    ],
    quote: { fa:'سادگی، نهایت پیچیدگی است.', en:'Simplicity is the ultimate sophistication.' },
    welcomeTitle: { fa:'سلام، من اَوید هستم', en:'Hi, I am Avid' },
    welcomeBody: { fa:'توسعه‌دهنده فول‌استک با تمرکز بر معماری تمیز و AI.', en:'Full-stack dev focused on clean architecture & AI.' },
    miniProjects: [
      { title:'KIYA Planner', desc:'مغز دوم AI' },
      { title:'DevHub OS', desc:'سیستم‌عامل توسعه‌دهنده' },
    ],
    recentActivity: [
      { text:'آپدیت KIYA v2.1', date:'2025-12-20' },
      { text:'مقاله جدید در بلاگ', date:'2025-12-18' },
    ],
  },
  projects: {
    customProjects: [
      { id:'kiya', title:'KIYA Planner', description:'مغز دوم AI — مدیریت زندگی', language:'TypeScript', stars:128, url:'/planner', featured:true },
      { id:'devhub', title:'DevHub OS', description:'پلتفرم شخصی اَوید کیا', language:'Next.js', stars:96, url:'/', featured:true },
      { id:'shopkit', title:'Shop Kit', description:'فروشگاه دیجیتال headless', language:'TypeScript', stars:54, url:'/shop', featured:false },
    ]
  },
  resume: {
    summary: { fa:'معمار سیستم با ۸ سال تجربه در وب و AI', en:'Systems architect with 8 years in web & AI' },
    phone: '+98-900-000-0000',
    website: 'https://avidkiya.com',
    experience: [
      { title:'Founder / Lead Architect', company:'KIYA', period:'2022 — اکنون', desc:'ساخت پلتفرم مدیریت زندگی با AI' },
      { title:'Senior Full-Stack', company:'Freelance', period:'2018 — 2022', desc:'پروژه‌های Next.js / Cloudflare' },
    ],
    skills: [
      { name:'TypeScript / Next.js', level:95 },
      { name:'Cloudflare / Edge', level:90 },
      { name:'AI / Agents', level:88 },
      { name:'UI / Liquid Glass', level:92 },
    ],
    education: [
      { degree:'B.Sc. Computer Engineering', school:'—', year:'2018' }
    ],
    languages: [
      { name:'فارسی', level:'Native' },
      { name:'English', level:'Fluent' },
    ],
  },
  gifts: {
    title:{fa:'هدایای رایگان',en:'Free Gifts'},
    subtitle:{fa:'منابع رایگان برای بهبود زندگی و کار شما',en:'Free resources to improve your life and work'},
    donationLinks: [
      { label:'ZarinPal', url:'#' },
      { label:'Buy Me a Coffee', url:'#' },
      { label:'Bitcoin', url:'#' },
    ],
    downloadTitle:{fa:'دانلودهای رایگان',en:'Free Downloads'},
    downloads: [
      { title:'قالب برنامه‌ریزی هفتگی', url:'#' },
      { title:'چک‌لیست عادت‌سازی', url:'#' },
      { title:'راهنمای KIYA Planner', url:'#' },
    ],
  },
  announcements: [
    { id:'1', title:'راه‌اندازی KIYA v2', body:'نسخه جدید با AI agent داخلی منتشر شد.', type:'news', date:'2025-12-01', pinned:true }
  ],
  comments: [
    { id:'1', author:'سارا محمدی', role:'Product Manager', text:'KIYA واقعا زندگی‌ام را منظم کرد. عاشق تقویم هخامنشی‌اش شدم!', approved:true, createdAt:'2025-11-20', rating:5 },
    { id:'2', author:'علی رضایی', role:'Developer', text:'معماری تمیز و UI شیشه‌ای فوق‌العاده است.', approved:true, createdAt:'2025-11-18', rating:5 },
    { id:'3', author:'Maryam K.', role:'Designer', text:'تجربه کاربری Liquid Glass بی‌نظیر است.', approved:true, createdAt:'2025-11-10', rating:5 },
  ],
  blog: {
    enabled: true,
    posts: [
      {
        id: '1',
        title: { fa: 'چطور با روش PARA زندگی‌ات را منظم کنی', en: 'How to organize your life with the PARA method' },
        slug: 'para-method-life-organization',
        excerpt: { fa: 'روش PARA یکی از ساده‌ترین سیستم‌های سازمان‌دهی اطلاعات است. در این مقاله یاد می‌گیری چطور آن را در KIYA پیاده کنی.', en: 'PARA is one of the simplest information organization systems. Learn how to apply it in KIYA.' },
        content: { fa: 'روش PARA (Projects, Areas, Resources, Archives) توسط تیاگو فورته معرفی شد...\n\nدر KIYA Planner، بخش «دانش» دقیقاً بر پایه همین ساختار طراحی شده تا بتوانی یادداشت‌ها، پروژه‌ها و منابعت را دسته‌بندی کنی.', en: 'The PARA method (Projects, Areas, Resources, Archives) was introduced by Tiago Forte...\n\nIn KIYA Planner, the Knowledge section is built exactly on this structure.' },
        coverImage: '',
        category: 'productivity',
        tags: ['PARA', 'سازمان‌دهی', 'KIYA'],
        status: 'published',
        publishedAt: '2026-06-01',
        seo: { title: 'روش PARA برای سازمان‌دهی زندگی', description: 'راهنمای کامل روش PARA', keywords: 'PARA, مغز دوم, KIYA' },
      },
      {
        id: '2',
        title: { fa: 'KIYA در برابر Notion — کدام برای مغز دوم بهتر است؟', en: 'KIYA vs Notion — which is better for a second brain?' },
        slug: 'kiya-vs-notion',
        excerpt: { fa: 'مقایسه‌ای صادقانه بین KIYA Planner و Notion از نظر قابلیت‌ها، سرعت و هوش مصنوعی.', en: 'An honest comparison between KIYA Planner and Notion.' },
        content: { fa: 'Notion یک ابزار فوق‌العاده انعطاف‌پذیر است، اما همین انعطاف‌پذیری باعث می‌شود راه‌اندازی اولیه‌اش زمان‌بر باشد. KIYA برعکس، از روز اول برایت ساختار آماده دارد و AI Agent داخلی وظایف را خودش دسته‌بندی می‌کند.', en: 'Notion is extremely flexible, but that same flexibility makes onboarding slow. KIYA ships with structure from day one.' },
        coverImage: '',
        category: 'comparison',
        tags: ['KIYA', 'Notion', 'مقایسه'],
        status: 'published',
        publishedAt: '2026-06-15',
        seo: { title: 'KIYA vs Notion', description: 'مقایسه کامل KIYA و Notion', keywords: 'KIYA, Notion, مقایسه' },
      },
    ],
  },
  coupons: [
    { id: '1', code: 'WELCOME10', type: 'percentage', value: 10, maxUses: 100, uses: 0, firstPurchaseOnly: true, enabled: true },
  ],
  orders: [],
  shop: {
    title:{fa:'فروشگاه',en:'Shop'},
    enabled:true,
    categories:['قالب','ابزار','آموزش'],
    products:[
      { id:'1', title:{fa:'قالب DevHub',en:'DevHub Template'}, description:{fa:'قالب Next.js شیشه‌ای',en:'Liquid glass Next.js template'}, price:29, currency:'USD', category:'قالب', enabled:true, image:'' },
      { id:'2', title:{fa:'کیت KIYA',en:'KIYA Kit'}, description:{fa:'شروع سریع KIYA Planner',en:'KIYA Planner starter'}, price:49, currency:'USD', category:'ابزار', enabled:true, image:'' },
    ],
  },
  freelancing: {
    title:{fa:'خدمات فریلنسری',en:'Freelance Services'},
    enabled:true,
    services:[
      { id:'1', title:{fa:'توسعه Next.js',en:'Next.js Development'}, description:{fa:'وب‌اپ مقیاس‌پذیر',en:'Scalable web apps'}, priceFrom:1500, icon:'zap', enabled:true },
      { id:'2', title:{fa:'معماری Cloudflare',en:'Cloudflare Architecture'}, description:{fa:'Edge + D1 + Workers',en:'Edge + D1 + Workers'}, priceFrom:800, icon:'cloud', enabled:true },
      { id:'3', title:{fa:'AI Agent',en:'AI Agent'}, description:{fa:'ربات هوشمند اختصاصی',en:'Custom smart agent'}, priceFrom:1200, icon:'brain', enabled:true },
    ],
    portfolio:[ {id:'p1', title:'پلتفرم KIYA', url:'/planner'} ],
    pricing:[ {name:'Starter', price:800}, {name:'Pro', price:2500} ],
    contactForm:{ enabled:true },
  },
  tools: {
    title:{fa:'ابزارها',en:'Tools'},
    enabled:true,
    categories:['متن','تصویر','توسعه'],
    items:[
      { id:'1', title:{fa:'تبدیل تاریخ',en:'Date Converter'}, description:{fa:'شمسی ↔ میلادی ↔ شاهنشاهی',en:'Jalali ↔ Gregorian ↔ Imperial'}, url:'/tools/date-converter', category:'توسعه', isPro:false, enabled:true },
      { id:'2', title:{fa:'فشرده‌ساز تصویر',en:'Image Compressor'}, description:{fa:'کم‌حجم‌سازی client-side',en:'Client-side compression'}, url:'/tools/image-compress', category:'تصویر', isPro:false, enabled:true },
    ],
  },
  planner: {
    enabled:true,
    plans:[
      { id:'free', name:{fa:'رایگان',en:'Free'}, priceMonthly:0, priceYearly:0, features:[{fa:'۵۰ capture در ماه',en:'50 captures/mo'},{fa:'AI Chat ۱۰ پیام/روز',en:'10 AI msgs/day'}], cta:{fa:'شروع رایگان',en:'Start free'} },
      { id:'pro', name:{fa:'Pro',en:'Pro'}, priceMonthly:9, priceYearly:89, features:[{fa:'نامحدود',en:'Unlimited'},{fa:'Knowledge Graph',en:'Knowledge Graph'}], highlighted:true, cta:{fa:'ارتقا به Pro',en:'Upgrade Pro'} },
      { id:'pro-ai', name:{fa:'Pro+AI',en:'Pro+AI'}, priceMonthly:19, priceYearly:179, features:[{fa:'AI نامحدود',en:'Unlimited AI'},{fa:'Finance + Health',en:'Finance + Health'}], cta:{fa:'شروع Pro+AI',en:'Get Pro+AI'} },
    ],
    ai: {
      freeLayerProvider: 'workers-ai',
      paidLayerProvider: 'openai',
      freeChatLimitPerDay: 10,
      systemPersona: 'صادق، بی‌طرف، گاهی چالش‌برانگیز، هرگز فراموش نمی‌کند',
    },
    telegram: {
      botUsername: '@AvidKiyaBot',
      webhookEnabled: false,
      welcomeMessage: 'سلام! من دستیار شخصی KIYA هستم.',
    },
  },
  messages: [],
  music: {
    enabled:false,
    autoplay:false,
    loop:true,
    volume:0.4,
    tracks:[],
  },
  heroObject:{
    kind:'none',
    src:'',
    posterSrc:'',
    autoRotate:true,
    alt:'Avid Kiya',
  },
  quotes:{
    enabled:true,
    kourosh: QUOTES.kourosh,
    mohammadReza: QUOTES.mohammadReza,
    rezaShah: QUOTES.rezaShah,
    custom:[],
  },
  seo:{
    siteName:'اَوید کیا — Avid Kiya',
    description:'پلتفرم شخصی اَوید کیا — پرتفولیو، KIYA Planner، فروشگاه، خدمات فریلنسری',
    keywords:'اَوید کیا, Avid Kiya, KIYA Planner, مغز دوم, Next.js, Cloudflare',
    ogImage:'/og.jpg',
  },
  analytics:{ enabled:true, plausibleDomain:'avidkiya.com', googleId:'' },
  newsletter:{ enabled:true, title:{fa:'خبرنامه',en:'Newsletter'}, subscribers:[] },
  leadMagnet: {
    items: [
      { id:'lm1', title:'۱۰ عادت موفقیت', description:'PDF — ۱۲ صفحه', fileUrl:'', enabled:true, downloads:0 },
      { id:'lm2', title:'قالب برنامه‌ریزی هفتگی', description:'PDF — قابل چاپ', fileUrl:'', enabled:true, downloads:0 },
      { id:'lm3', title:'چک‌لیست سال نو', description:'PDF — ۸ صفحه', fileUrl:'', enabled:false, downloads:0 },
    ],
    exitPopupEnabled: true,
    stats: { downloads: 0, emailsCollected: 0 },
  },
  emailTemplates: {
    resendApiKeySet: false,
    items: [
      { id:'et1', name:'خوش‌آمد KIYA', trigger:'بعد از ثبت‌نام — فوری', status:'فعال', subject:'به KIYA خوش اومدی!', body:'سلام {{name}}،\nخوشحالیم که به KIYA پیوستی.' },
      { id:'et2', name:'Onboarding Day 2', trigger:'روز ۲', status:'فعال', subject:'چطور از KIYA بیشترین استفاده رو ببری', body:'چند نکته برای شروع بهتر...' },
      { id:'et3', name:'انقضا ۷ روز قبل', trigger:'قبل انقضا', status:'فعال', subject:'اشتراکت داره تموم میشه', body:'یادآوری تمدید اشتراک...' },
      { id:'et4', name:'Win-back 30 روز', trigger:'۳۰ روز غیرفعال', status:'پیش‌نویس', subject:'دلمون برات تنگ شده', body:'مدتیه ندیدیمت...' },
    ],
  },
};
