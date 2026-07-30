import { CmsState } from './types';
import { QUOTES } from '../calendar';

export const defaultCmsState: CmsState = {
  version: 2,
  identity: {
    fullName: { fa: 'اَوید کیا', en: 'Avid Kiya' },
    title: { fa: 'معمار سیستم و توسعه‌دهنده فول‌استک', en: 'Systems Architect & Full-Stack Developer' },
    location: { fa: 'ایران', en: 'Iran' },
    email: 'hello@avidkiya.com',
    yearsExperience: 8,
    bio: {
      fa: 'محصول‌های وب سریع، زیبا و قابل توسعه می‌سازم؛ با تمرکز روی Next.js، Cloudflare، AI و تجربه کاربری حرفه‌ای.',
      en: 'I build fast, elegant and scalable web products with a focus on Next.js, Cloudflare, AI and polished user experience.'
    },
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
    heroTag: { fa:'AVIDKIYA PORTFOLIO', en:'AVIDKIYA PORTFOLIO' },
    heroTitleA: { fa:'اَوید کیا', en:'Avid Kiya' },
    heroTitleB: { fa:'معمار سیستم', en:'Systems Architect' },
    heroDescription: {
      fa:'از ایده تا دیپلوی: طراحی محصول، توسعه فول‌استک، اتوماسیون AI و زیرساخت Edge.',
      en:'From idea to deploy: product design, full-stack development, AI automation and Edge infrastructure.'
    },
    ctaPrimary: { fa:'نمونه‌کارها', en:'Projects' },
    ctaSecondary: { fa:'تماس', en:'Contact' },
    projects: [],
    stats: [
      { id:'1', label:{fa:'سال تجربه', en:'Years Experience'}, value:'8+', icon:'zap' },
      { id:'2', label:{fa:'استک تخصصی', en:'Core Stack'}, value:'Next.js', icon:'▲' },
      { id:'3', label:{fa:'تمرکز محصول', en:'Product Focus'}, value:'SaaS', icon:'layers' },
      { id:'4', label:{fa:'زیرساخت محبوب', en:'Favorite Infra'}, value:'Edge', icon:'cloud' },
    ],
  },
  about: {
    statusTitle: { fa:'وضعیت فعلی', en:'Current Status' },
    metrics: [
      { label:{fa:'تمرکز',en:'Focus'}, value:'Web + AI' },
      { label:{fa:'تحویل',en:'Delivery'}, value:'Clean & Fast' },
    ],
    quickLinks: [
      { label:{fa:'گیت‌هاب',en:'GitHub'}, url:'https://github.com/avidkiya', icon:'github' },
      { label:{fa:'رزومه',en:'Resume'}, url:'/resume', icon:'resume' },
    ],
    quote: { fa:'سادگی، نهایت پیچیدگی است.', en:'Simplicity is the ultimate sophistication.' },
    welcomeTitle: { fa:'سلام، من اَوید هستم', en:'Hi, I am Avid' },
    welcomeBody: {
      fa:'توسعه‌دهنده فول‌استک با تمرکز بر معماری تمیز، UI حرفه‌ای، AI و زیرساخت Cloudflare/Edge.',
      en:'Full-stack developer focused on clean architecture, polished UI, AI and Cloudflare/Edge infrastructure.'
    },
    miniProjects: [
      { title:'DevHub OS', desc:'پرتفولیوی حرفه‌ای و سیستم محتوای شخصی' },
      { title:'Automation Studio', desc:'اتوماسیون‌های AI برای کسب‌وکار و محتوا' },
    ],
    recentActivity: [
      { text:'مرتب‌سازی پرتفولیو و جداسازی پروژه‌های مستقل', date:'2026-07-24' },
      { text:'بهینه‌سازی ابزارها و فروشگاه دیجیتال', date:'2026-07-24' },
    ],
  },
  projects: {
    customProjects: [
      { id:'devhub-os', title:'DevHub OS', description:'پرتفولیوی شخصی حرفه‌ای با CMS محلی، طراحی Liquid Glass، جستجوی سریع و دیپلوی Edge.', language:'Next.js', stars:96, url:'/projects/devhub-os', featured:true },
      { id:'automation-studio', title:'AI Automation Studio', description:'طراحی agent، جریان‌های کاری هوشمند، تولید محتوا و اتصال API برای تیم‌های کوچک.', language:'TypeScript', stars:72, url:'/projects/automation-studio', featured:true },
      { id:'shop-tools-suite', title:'Shop & Tools Suite', description:'فروشگاه دیجیتال و مجموعه ابزارهای آنلاین داخل سایت با UX سریع و حریم‌محور.', language:'React', stars:64, url:'/projects/shop-tools-suite', featured:true },
      { id:'edge-architecture', title:'Cloudflare Edge Architecture', description:'طراحی معماری کم‌هزینه و مقیاس‌پذیر با Workers، Pages، D1، KV و R2.', language:'Cloudflare', stars:58, url:'/projects/edge-architecture', featured:true },
      { id:'kiya-planner-standalone', title:'KIYA Planner — Standalone Project', description:'پلنر/مغز دوم AI به‌عنوان پروژه مستقل از پرتفولیو جدا شده و آماده توسعه جداگانه است.', language:'Next.js', stars:128, url:'/projects/kiya-planner-standalone', featured:true },
      { id:'kianet-standalone', title:'KIANET — Standalone Project', description:'کافی‌نت آنلاین به‌عنوان پروژه مستقل از سایت شخصی جدا شد تا مسیر محصولی جدا داشته باشد.', language:'Next.js', stars:86, url:'/projects/kianet-standalone', featured:true },
    ]
  },
  resume: {
    summary: {
      fa:'معمار سیستم و توسعه‌دهنده فول‌استک با ۸ سال تجربه در ساخت محصول وب، معماری Edge و اتوماسیون AI.',
      en:'Systems architect and full-stack developer with 8 years of experience building web products, Edge architecture and AI automation.'
    },
    phone: '+98-900-000-0000',
    website: 'https://avidkiya.com',
    experience: [
      { title:'Founder / Systems Architect', company:'AvidKiya Studio', period:'2022 — اکنون', desc:'طراحی و توسعه محصولات وب، داشبوردهای SaaS، سیستم‌های محتوایی و اتوماسیون‌های AI.' },
      { title:'Senior Full-Stack Developer', company:'Freelance', period:'2018 — 2022', desc:'تحویل پروژه‌های Next.js، React، Node و Cloudflare برای مشتریان بین‌المللی و داخلی.' },
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
    title:{fa:'هدیه‌ها',en:'Gifts'},
    subtitle:{fa:'دانلودهای رایگان برای شروع سریع‌تر',en:'Free downloads to start faster'},
    donationLinks: [
      { label:'حمایت ریالی', url:'#' },
      { label:'Buy Me a Coffee', url:'#' },
    ],
    downloadTitle:{fa:'دانلودهای رایگان',en:'Free Downloads'},
    downloads: [
      { title:'چک‌لیست لانچ پرتفولیو', url:'#' },
      { title:'قالب برنامه‌ریزی پروژه وب', url:'#' },
    ],
  },
  announcements: [
    { id:'1', title:'بازطراحی پرتفولیو', body:'ساختار سایت شخصی حرفه‌ای‌تر شد و پروژه‌های مستقل از ناوبری اصلی جدا شدند.', date:'2026-07-24', pinned:true }
  ],
  comments: [
    { id:'1', author:'سارا محمدی', role:'Product Manager', text:'تحویل منظم، UI تمیز و مستندات قابل فهم باعث شد پروژه بدون دردسر جلو برود.', approved:true, createdAt:'2026-07-10', rating:5 },
    { id:'2', author:'علی رضایی', role:'Developer', text:'معماری پروژه تمیز و قابل توسعه بود؛ دقیقاً چیزی که برای رشد محصول لازم داشتیم.', approved:true, createdAt:'2026-07-08', rating:5 },
    { id:'3', author:'Maryam K.', role:'Designer', text:'تجربه کاربری Liquid Glass و توجه به جزئیات واقعاً حرفه‌ای بود.', approved:true, createdAt:'2026-07-01', rating:5 },
  ],
  shop: {
    title:{fa:'فروشگاه',en:'Shop'},
    enabled:true,
    categories:['قالب','ابزار','آموزش','چک‌لیست'],
    products:[
      { id:'portfolio-kit', title:{fa:'کیت لانچ پرتفولیو',en:'Portfolio Launch Kit'}, description:{fa:'چک‌لیست، ساختار صفحات، متن آماده و الگوی معرفی حرفه‌ای.',en:'Checklist, page structure, copy blocks and professional positioning templates.'}, price:19, currency:'USD', category:'قالب', enabled:true, image:'' },
      { id:'devhub-template', title:{fa:'قالب DevHub',en:'DevHub Template'}, description:{fa:'قالب Next.js با طراحی شیشه‌ای، RTL، دارک‌مود و صفحات آماده.',en:'Liquid glass Next.js template with RTL, dark mode and ready pages.'}, price:39, currency:'USD', category:'قالب', enabled:true, image:'' },
      { id:'edge-starter', title:{fa:'Cloudflare Starter',en:'Cloudflare Starter'}, description:{fa:'استارتر معماری Pages/Workers با ساختار دیپلوی و مستندات.',en:'Pages/Workers architecture starter with deploy structure and docs.'}, price:49, currency:'USD', category:'ابزار', enabled:true, image:'' },
      { id:'ai-prompts', title:{fa:'پک پرامپت اتوماسیون AI',en:'AI Automation Prompt Pack'}, description:{fa:'پرامپت‌های آماده برای تحلیل، تولید محتوا، فروش و مدیریت پروژه.',en:'Ready prompts for analysis, content, sales and project management.'}, price:15, currency:'USD', category:'آموزش', enabled:true, image:'' },
      { id:'seo-checklist', title:{fa:'چک‌لیست SEO و لانچ',en:'SEO & Launch Checklist'}, description:{fa:'چک‌لیست ۷۲ موردی قبل از انتشار سایت و محصول دیجیتال.',en:'72-point checklist before publishing a website or digital product.'}, price:9, currency:'USD', category:'چک‌لیست', enabled:true, image:'' },
      { id:'contract-template', title:{fa:'قالب قرارداد پروژه وب',en:'Web Project Contract Template'}, description:{fa:'نمونه ساختار قرارداد، محدوده کار، پرداخت مرحله‌ای و تحویل.',en:'Contract structure, scope, milestones, payment and delivery clauses.'}, price:12, currency:'USD', category:'چک‌لیست', enabled:true, image:'' },
    ],
  },
  freelancing: {
    title:{fa:'خدمات حرفه‌ای',en:'Professional Services'},
    enabled:true,
    services:[
      { id:'1', title:{fa:'طراحی و توسعه Next.js',en:'Next.js Product Development'}, description:{fa:'وب‌اپ سریع، SEO-ready، ریسپانسیو و قابل توسعه.',en:'Fast, SEO-ready, responsive and scalable web apps.'}, priceFrom:1500, icon:'zap', enabled:true },
      { id:'2', title:{fa:'معماری Cloudflare / Edge',en:'Cloudflare / Edge Architecture'}, description:{fa:'Pages، Workers، D1، KV، R2 و کاهش هزینه زیرساخت.',en:'Pages, Workers, D1, KV, R2 and infrastructure cost reduction.'}, priceFrom:800, icon:'cloud', enabled:true },
      { id:'3', title:{fa:'اتوماسیون و AI Agent',en:'Automation & AI Agents'}, description:{fa:'جریان‌های کاری هوشمند، اتصال API، RAG و دستیار اختصاصی.',en:'Smart workflows, API integrations, RAG and custom assistants.'}, priceFrom:1200, icon:'brain', enabled:true },
      { id:'4', title:{fa:'بازطراحی UI/UX و پرتفولیو',en:'UI/UX & Portfolio Redesign'}, description:{fa:'هویت بصری، صفحات فروش، رزومه و تجربه کاربری حرفه‌ای.',en:'Visual identity, sales pages, resume and polished user experience.'}, priceFrom:600, icon:'sparkles', enabled:true },
    ],
    portfolio:[
      {id:'p1', title:'DevHub OS', url:'/projects/devhub-os'},
      {id:'p2', title:'Shop & Tools Suite', url:'/projects/shop-tools-suite'},
      {id:'p3', title:'Cloudflare Edge Architecture', url:'/projects/edge-architecture'},
    ],
    pricing:[ {name:'Starter', price:800}, {name:'Growth', price:2500}, {name:'Scale', price:6000} ],
    contactForm:{ enabled:true },
  },
  tools: {
    title:{fa:'ابزارها',en:'Tools'},
    enabled:true,
    categories:['تاریخ','تصویر','توسعه','امنیت'],
    items:[
      { id:'date-converter', title:{fa:'تبدیل تاریخ',en:'Date Converter'}, description:{fa:'تبدیل شمسی، میلادی و شاهنشاهی همراه با نام روز اوستایی.',en:'Convert Jalali, Gregorian and Imperial dates with Avestan day names.'}, url:'#date-converter', category:'تاریخ', isPro:false, enabled:true },
      { id:'image-compressor', title:{fa:'فشرده‌سازی عکس',en:'Image Compressor'}, description:{fa:'کاهش حجم تصویر داخل مرورگر بدون آپلود فایل.',en:'Compress images in-browser without uploading files.'}, url:'#image-compressor', category:'تصویر', isPro:false, enabled:true },
      { id:'json', title:{fa:'فرمت و اعتبارسنجی JSON',en:'JSON Formatter & Validator'}, description:{fa:'اعتبارسنجی، مرتب‌سازی و Minify برای توسعه‌دهنده‌ها.',en:'Validate, beautify and minify JSON for developers.'}, url:'#json', category:'توسعه', isPro:false, enabled:true },
      { id:'hash', title:{fa:'تولید هش SHA',en:'SHA Hash Generator'}, description:{fa:'ساخت SHA-256 و SHA-1 برای متن، توکن و checksum.',en:'Generate SHA-256 and SHA-1 for text, tokens and checksums.'}, url:'#hash', category:'امنیت', isPro:false, enabled:true },
      { id:'base64', title:{fa:'Base64 Encode / Decode',en:'Base64 Encode / Decode'}, description:{fa:'تبدیل متن فارسی و انگلیسی به Base64 و برعکس.',en:'Encode and decode Persian/English text to and from Base64.'}, url:'#base64', category:'توسعه', isPro:false, enabled:true },
      { id:'password', title:{fa:'سازنده رمز امن',en:'Secure Password Generator'}, description:{fa:'ساخت رمز قوی با طول دلخواه و کپی سریع.',en:'Generate strong passwords with custom length and quick copy.'}, url:'#password', category:'امنیت', isPro:false, enabled:true },
    ],
  },
  planner: {
    enabled:false,
    plans:[
      { id:'free', name:{fa:'رایگان',en:'Free'}, priceMonthly:0, priceYearly:0, features:[{fa:'نسخه مستقل در حال جداسازی',en:'Standalone version in separation'}], cta:{fa:'مشاهده پروژه',en:'View project'} },
      { id:'pro', name:{fa:'Pro',en:'Pro'}, priceMonthly:0, priceYearly:0, features:[{fa:'فعلاً در پرتفولیو فعال نیست',en:'Not active in the portfolio'}], highlighted:true, cta:{fa:'مشاهده پروژه',en:'View project'} },
    ],
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
    description:'پرتفولیوی حرفه‌ای اَوید کیا — معماری سیستم، توسعه فول‌استک، ابزارهای آنلاین، فروشگاه دیجیتال و خدمات AI.',
    keywords:'اَوید کیا, Avid Kiya, پرتفولیو, Next.js, Cloudflare, AI Automation, Full Stack Developer',
    ogImage:'/og.jpg',
  },
  analytics:{ enabled:true, plausibleDomain:'avidkiya.com', googleId:'' },
  newsletter:{ enabled:true, title:{fa:'خبرنامه',en:'Newsletter'}, subscribers:[] },
};
