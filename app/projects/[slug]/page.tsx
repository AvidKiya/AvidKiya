import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';
import { defaultCmsState } from '@/lib/cms/default-state';

const projectMeta: Record<string, {
  role: string;
  status: string;
  timeline: string;
  summary: string;
  highlights: string[];
  stack: string[];
  next: string[];
}> = {
  'devhub-os': {
    role: 'Product Designer / Full-Stack Developer',
    status: 'Active',
    timeline: '2026',
    summary: 'پرتفولیوی حرفه‌ای اَوید کیا با تمرکز روی برند شخصی، خدمات، ابزارهای کاربردی، فروشگاه دیجیتال و تجربه کاربری سریع.',
    highlights: ['ناوبری تمیز و متمرکز روی پرتفولیو', 'CMS محلی و قابل توسعه', 'طراحی Liquid Glass و حالت تاریک/روشن', 'سازگار با Cloudflare Pages'],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Cloudflare'],
    next: ['اتصال فرم تماس به ایمیل', 'ساخت داشبورد محتوای واقعی', 'افزودن تست‌های E2E'],
  },
  'automation-studio': {
    role: 'AI Workflow Architect',
    status: 'Concept / Client-ready',
    timeline: '2026',
    summary: 'سیستم طراحی اتوماسیون برای تولید محتوا، تحلیل داده، پاسخگویی مشتری و اتصال APIهای کسب‌وکار.',
    highlights: ['طراحی agent قابل کنترل', 'قابل اتصال به Telegram/Email/API', 'مناسب تیم‌های کوچک و فروشگاه‌ها', 'تمرکز روی امنیت داده و لاگ‌پذیری'],
    stack: ['TypeScript', 'Workers AI', 'OpenAI-compatible APIs', 'Queues', 'KV'],
    next: ['ساخت نمونه دمو', 'افزودن داشبورد مانیتورینگ', 'پکیج‌کردن قالب workflow'],
  },
  'shop-tools-suite': {
    role: 'Full-Stack Developer',
    status: 'Active',
    timeline: '2026',
    summary: 'مجموعه فروشگاه دیجیتال و ابزارهای آنلاین که داخل پرتفولیو اجرا می‌شود و برای فروش قالب، چک‌لیست و ابزارهای سبک آماده است.',
    highlights: ['فیلتر، جستجو و مرتب‌سازی محصول', 'سبد خرید دمو و کوپن تخفیف', 'ابزارهای JSON، رمز، اسلاگ و پاک‌سازی متن', 'اجرای client-side بدون ثبت‌نام'],
    stack: ['React', 'Next.js', 'Tailwind CSS', 'Local State'],
    next: ['اتصال درگاه پرداخت', 'دانلود امن فایل بعد از خرید', 'ذخیره سفارش در دیتابیس'],
  },
  'edge-architecture': {
    role: 'Cloudflare Architect',
    status: 'Service Blueprint',
    timeline: '2026',
    summary: 'الگوی معماری برای اپلیکیشن‌های کم‌هزینه، سریع و مقیاس‌پذیر روی Cloudflare Edge.',
    highlights: ['کاهش هزینه سرور سنتی', 'SSR/Static مناسب نیاز پروژه', 'استفاده از D1/KV/R2 بر اساس داده', 'قابل توسعه برای SaaS و پنل مدیریت'],
    stack: ['Cloudflare Pages', 'Workers', 'D1', 'KV', 'R2', 'OpenNext'],
    next: ['مستندکردن سناریوهای deploy', 'افزودن observability', 'ساخت boilerplate عمومی'],
  },
  'kiya-planner-standalone': {
    role: 'Founder / Product Architect',
    status: 'Separated from portfolio',
    timeline: 'Standalone roadmap',
    summary: 'KIYA Planner از ناوبری و ساختار اصلی پرتفولیو جدا شد تا به‌عنوان محصول مستقل با مسیر توسعه، برند و دیپلوی جدا پیش برود.',
    highlights: ['حذف از منوی اصلی سایت شخصی', 'تبدیل به کیس‌استادی مستقل در بخش پروژه‌ها', 'آماده‌سازی برای ریپوی جداگانه', 'تمرکز پرتفولیو روی خدمات و نمونه‌کارها'],
    stack: ['Next.js', 'AI Assistant', 'Calendar', 'Telegram Mini App'],
    next: ['انتقال کد به ریپوی مستقل', 'تعریف برند و دامنه جدا', 'طراحی roadmap محصولی'],
  },
  'kianet-standalone': {
    role: 'Product Architect',
    status: 'Separated from portfolio',
    timeline: 'Standalone roadmap',
    summary: 'KIANET / کافی‌نت آنلاین از سایت شخصی جدا شد تا مثل یک محصول مستقل با هویت، مسیر سفارش، پرداخت و عملیات جدا توسعه پیدا کند.',
    highlights: ['حذف از ناوبری و صفحه اصلی پرتفولیو', 'تبدیل به پروژه مستقل در بخش نمونه‌کارها', 'آماده‌سازی برای سرویس سفارش جدا', 'شفاف‌تر شدن برند شخصی اَوید کیا'],
    stack: ['Next.js', 'Order Flow', 'Payments', 'Admin Ops'],
    next: ['انتقال کد به ریپوی مستقل', 'طراحی پنل عملیات سفارش', 'اتصال درگاه و پیامک'],
  },
};

export async function generateStaticParams() {
  return Object.keys(projectMeta).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = defaultCmsState.projects.customProjects.find(p => p.id === slug);
  return {
    title: project ? `${project.title} — پروژه اَوید کیا` : 'پروژه — اَوید کیا',
    description: project?.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = defaultCmsState.projects.customProjects.find(p => p.id === slug);
  const meta = projectMeta[slug];
  if (!project || !meta) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <Link href="/projects" className="inline-flex items-center gap-2 text-[12.5px] text-text-3 hover:text-text mb-5">
        <ArrowLeft size={14} /> بازگشت به نمونه‌کارها
      </Link>

      <GlassCard className="!p-6 md:!p-8 overflow-hidden relative mb-5">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4 text-[11.5px]">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{meta.status}</span>
            <span className="px-3 py-1 rounded-full bg-white/[0.045] text-text-3 border border-glass-border">{project.language}</span>
            <span className="px-3 py-1 rounded-full bg-white/[0.045] text-text-3 border border-glass-border">{meta.timeline}</span>
          </div>
          <h1 className="text-[30px] md:text-[44px] font-[850] tracking-[-0.035em] leading-[1.12]">{project.title}</h1>
          <p className="text-text-2 text-[14px] md:text-[15px] leading-8 mt-4 max-w-3xl">{meta.summary}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            <Link href="/contact" className="glass-btn-primary !py-3 !px-5 text-[13px]">درخواست پروژه مشابه</Link>
            <Link href="/services" className="glass-btn !py-3 !px-5 text-[13px] inline-flex items-center gap-2">خدمات مرتبط <ExternalLink size={14}/></Link>
          </div>
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-[1fr_300px] gap-5 items-start">
        <div className="space-y-5">
          <GlassCard className="!p-5">
            <h2 className="text-[18px] font-[800] mb-3">نکات کلیدی</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {meta.highlights.map(item => (
                <div key={item} className="rounded-[14px] border border-glass-border bg-white/[0.035] p-3 text-[13px] text-text-2 leading-6">✓ {item}</div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="!p-5">
            <h2 className="text-[18px] font-[800] mb-3">قدم‌های بعدی</h2>
            <ol className="space-y-2 text-[13px] text-text-2 leading-7 list-decimal ps-5">
              {meta.next.map(item => <li key={item}>{item}</li>)}
            </ol>
          </GlassCard>
        </div>

        <div className="space-y-4 sticky top-[84px]">
          <GlassCard className="!p-4">
            <div className="text-[11px] text-text-3 mb-1">نقش</div>
            <div className="font-bold text-[14px] mb-4">{meta.role}</div>
            <div className="text-[11px] text-text-3 mb-2">تکنولوژی‌ها</div>
            <div className="flex flex-wrap gap-2">
              {meta.stack.map(item => <span key={item} className="px-2.5 py-1 rounded-full bg-white/[0.055] border border-glass-border text-[11.5px] text-text-2">{item}</span>)}
            </div>
          </GlassCard>
          <GlassCard className="!p-4 text-[12.5px] text-text-2 leading-7">
            <b className="text-text">یادداشت:</b> کافی‌نت و پلنر دیگر بخش اصلی سایت شخصی نیستند و به‌صورت پروژه‌های مستقل نمایش داده می‌شوند.
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
