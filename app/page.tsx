'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';
import { AsciiLogo } from '@/components/ui/ascii-logo';
import { CalendarWidget } from '@/components/calendar/calendar-widget';
import { MenuCard } from '@/components/home/menu-card';
import { GlassCard } from '@/components/ui/glass';
import { AppIcon, type IconName } from '@/components/ui/icons';
import { useCms } from '@/lib/cms/cms-context';
import { getDailyQuote } from '@/lib/calendar';

const statIcons: IconName[] = ['zap', 'layers', 'cpu', 'cloud'];

export default function HomePage() {
  const { t, cms, tf } = useCms();
  const quote = useMemo(() => getDailyQuote(), []);

  const cards: {icon: IconName; title:string; desc:string; href:string; accent: 'primary'|'cyan'|'emerald'|'violet'|'amber'|'rose'}[] = [
    { icon:'projects', title: t('نمونه‌کارها','Projects'), desc: t('کیس‌استادی و کد', 'Case studies & code'), href:'/projects', accent:'primary' },
    { icon:'services', title: t('خدمات','Services'), desc: t('طراحی و توسعه وب', 'Web & product builds'), href:'/services', accent:'cyan' },
    { icon:'tools', title: t('ابزارها','Tools'), desc: t('ابزارهای سریع آنلاین', 'Fast online utilities'), href:'/tools', accent:'amber' },
    { icon:'shop', title: t('فروشگاه','Shop'), desc: t('قالب، کیت و آموزش', 'Templates, kits & guides'), href:'/shop', accent:'emerald' },
    { icon:'resume', title: t('رزومه','Resume'), desc: t('PDF و سوابق حرفه‌ای', 'CV & experience'), href:'/resume', accent:'violet' },
    { icon:'contact', title: t('تماس','Contact'), desc: t('شروع همکاری', 'Start a collaboration'), href:'/contact', accent:'rose' },
  ];

  const featured = cms.projects.customProjects.filter(p=>p.featured).slice(0,3);
  const stats = cms.dashboard.stats;
  const process = [
    { icon:'target' as IconName, title: t('کشف مسئله', 'Discovery'), text: t('هدف، مخاطب، محدودیت‌ها و معیار موفقیت را شفاف می‌کنم.', 'Clarify goals, audience, constraints and success metrics.') },
    { icon:'layers' as IconName, title: t('طراحی سیستم', 'System Design'), text: t('معماری، تجربه کاربری و مسیر رشد محصول را قبل از کدنویسی می‌چینم.', 'Design architecture, UX and scale path before coding.') },
    { icon:'check' as IconName, title: t('تحویل تمیز', 'Clean Delivery'), text: t('کد قابل نگهداری، مستندات، تست پایه و دیپلوی پایدار تحویل می‌دهم.', 'Ship maintainable code, docs, basic tests and stable deployment.') },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-6 py-5 md:py-10">
      <section className="grid xl:grid-cols-[minmax(0,1fr)_390px] lg:grid-cols-[minmax(0,1fr)_360px] gap-4 md:gap-6 items-start mb-7 md:mb-10">
        <div className="space-y-4 md:space-y-5 min-w-0">
          <GlassCard className="!p-5 sm:!p-6 md:!p-8 overflow-hidden relative min-h-[430px] flex items-center">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-28 -right-20 w-72 h-72 rounded-full bg-cyan/10 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="relative z-10 w-full">
              <div className="mb-4 opacity-95 max-w-full overflow-hidden scale-[0.78] sm:scale-[0.9] md:scale-100 origin-right md:origin-left" dir="ltr">
                <AsciiLogo small />
              </div>
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald/25 bg-emerald/10 px-3 py-1.5 text-[11px] sm:text-[11.5px] text-emerald mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse shrink-0" />
                <span className="truncate">{t('آماده همکاری روی پروژه‌های وب و AI', 'Available for web & AI projects')}</span>
              </div>
              <h1 className="text-[28px] sm:text-[36px] md:text-[48px] font-[850] tracking-[-0.04em] leading-[1.12] max-w-3xl">
                {tf(cms.identity.fullName)}؛
                <span className="gradient-text block mt-1">{tf(cms.identity.title)}</span>
              </h1>
              <p className="text-[13.5px] sm:text-[14.5px] md:text-[15px] text-text-2 mt-4 max-w-[700px] leading-8">
                {tf(cms.identity.bio)} {t('تمرکز من ساخت محصول‌های سریع، زیبا، قابل توسعه و قابل اعتماد است؛ از پرتفولیوی شخصی تا داشبوردهای SaaS و اتوماسیون‌های هوشمند.', 'I build fast, elegant, scalable and reliable products; from personal portfolios to SaaS dashboards and intelligent automations.')}
              </p>
              <div className="flex flex-col xs:flex-row sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 mt-6">
                <Link href="/projects" className="glass-btn-primary !py-3 !px-5 text-[13.5px] inline-flex items-center justify-center gap-2">
                  {t('دیدن نمونه‌کارها','View work')} <ArrowUpRight size={15} />
                </Link>
                <Link href="/contact" className="glass-btn !py-3 !px-5 text-[13.5px] inline-flex items-center justify-center gap-2">
                  {t('درخواست پروژه','Start a project')} <ArrowLeft size={15} />
                </Link>
                <Link href="/resume" className="text-[12.5px] text-text-3 hover:text-text transition-colors px-2 py-2 text-center">
                  {t('دانلود/چاپ رزومه', 'Resume / PDF')}
                </Link>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {stats.map((s, i)=>(
              <GlassCard key={s.id} className="!p-4 md:!p-5 flex items-center justify-between gap-3 min-w-0 min-h-[112px]">
                <div className="min-w-0">
                  <div className="text-[24px] md:text-[30px] font-black tracking-tight truncate">{s.value}</div>
                  <div className="text-[11.5px] text-text-3 mt-1 truncate">{tf(s.label)}</div>
                </div>
                <div className="w-10 h-10 rounded-[14px] bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <AppIcon name={statIcons[i] || 'chart'} size={19} />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <aside className="space-y-3 md:space-y-4 lg:sticky lg:top-[78px] min-w-0 order-first lg:order-none">
          <CalendarWidget />
        </aside>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-[14px] mb-9 md:mb-11">
        {cards.map((c,i)=> <MenuCard key={c.href} {...c} index={i} />)}
      </section>

      <section className="grid lg:grid-cols-[1fr_360px] gap-5 items-start mb-9 md:mb-11">
        <div>
          <div className="flex items-center justify-between gap-3 mb-3 px-1">
            <h2 className="text-[17px] md:text-[19px] font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-amber" />
              {t('روش کار حرفه‌ای','Professional workflow')}
            </h2>
            <Link href="/services" className="text-[12.5px] text-text-3 hover:text-text flex items-center gap-1 shrink-0">
              {t('جزئیات خدمات','Service details')} <ExternalLink size={13} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {process.map((item, i)=>(
              <GlassCard key={item.title} className="!p-4">
                <div className="w-10 h-10 rounded-[13px] bg-primary/10 text-primary flex items-center justify-center mb-3"><AppIcon name={item.icon} size={18} /></div>
                <div className="text-[12px] text-text-3 mb-1">0{i+1}</div>
                <div className="text-[14px] font-bold mb-1">{item.title}</div>
                <p className="text-[12.5px] text-text-2 leading-relaxed">{item.text}</p>
              </GlassCard>
            ))}
          </div>
          <GlassCard className="!p-4 mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-[14px]">{t('کافی‌نت و پلنر از ساختار اصلی سایت جدا شدند.', 'Café-Net and Planner were separated from the main site structure.')}</div>
                <div className="text-[12.5px] text-text-3 mt-1">{t('الان سایت روی برند شخصی، خدمات، فروشگاه و ابزارهای کاربردی متمرکز است.', 'The site now focuses on personal brand, services, shop and practical tools.')}</div>
              </div>
            </div>
            <Link href="/projects" className="glass-btn !py-2 !px-4 text-[12.5px] shrink-0 text-center">{t('دیدن پروژه‌های مستقل','View standalone projects')}</Link>
          </GlassCard>
        </div>

        <GlassCard className="!p-5">
          <div className="text-[11px] text-text-3 mb-2 tracking-wide">{t('سخن امروز','Quote today')}</div>
          <p className="text-[14px] md:text-[15px] leading-relaxed">«{quote.text}»</p>
          <div className="text-[11px] text-text-3 mt-2">— {quote.author}</div>
        </GlassCard>
      </section>

      <section className="mb-9 md:mb-11">
        <div className="flex items-center justify-between gap-3 mb-3 px-1">
          <h2 className="text-[17px] md:text-[19px] font-bold flex items-center gap-2">
            <AppIcon name="projects" size={18} className="text-primary" />
            {t('نمونه‌کارهای منتخب','Featured work')}
          </h2>
          <Link href="/projects" className="text-[12.5px] text-text-3 hover:text-text flex items-center gap-1 shrink-0">
            {t('همه پروژه‌ها','All projects')} <ExternalLink size={13} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {featured.map((p) => (
            <GlassCard key={p.id} className="!p-5 hover:shadow-glass-lg transition-all group">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="text-[15px] font-bold leading-snug">{p.title}</div>
                <span className="text-[10.5px] px-2 py-1 rounded-full bg-white/[0.06] text-text-3 shrink-0">{p.language}</span>
              </div>
              <p className="text-[12.8px] text-text-2 leading-relaxed min-h-[48px]">{p.description}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-glass-border text-[11.5px] text-text-3">
                <span className="flex items-center gap-1"><AppIcon name="star" size={13} /> {p.stars||0}</span>
                <Link href={p.url||'/projects'} className="text-primary hover:underline flex items-center gap-1">
                  {t('مشاهده','Open')} <ArrowLeft size={12} />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4 mb-9">
        <Link href="/tools" className="group block">
          <GlassCard className="!p-5 h-full hover:shadow-glass-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-[14px] bg-amber/10 text-amber flex items-center justify-center"><AppIcon name="tools" size={21} /></div>
              <div>
                <div className="font-bold">{t('ابزارهای آنلاین بهینه‌شده','Optimized online tools')}</div>
                <div className="text-[11.5px] text-text-3">Date • Image • JSON • Hash</div>
              </div>
            </div>
            <p className="text-[12.8px] text-text-2 leading-relaxed">{t('تبدیل تاریخ، فشرده‌سازی عکس، JSON، هش، Base64 و رمز امن داخل مرورگر اجرا می‌شوند؛ سریع و بدون آپلود فایل.', 'Date conversion, image compression, JSON, hash, Base64 and secure passwords run in-browser; fast and without file uploads.')}</p>
          </GlassCard>
        </Link>
        <Link href="/shop" className="group block">
          <GlassCard className="!p-5 h-full hover:shadow-glass-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-[14px] bg-emerald/10 text-emerald flex items-center justify-center"><AppIcon name="shop" size={21} /></div>
              <div>
                <div className="font-bold">{t('فروشگاه مرتب‌تر','Cleaner shop')}</div>
                <div className="text-[11.5px] text-text-3">Search • Sort • Cart • Coupon</div>
              </div>
            </div>
            <p className="text-[12.8px] text-text-2 leading-relaxed">{t('فیلتر، جستجو، مرتب‌سازی، سبد خرید و نمایش مبلغ‌ها حرفه‌ای‌تر شده‌اند.', 'Filtering, search, sorting, cart and money display are more polished now.')}</p>
          </GlassCard>
        </Link>
      </section>

      <div className="flex justify-center gap-5 mt-8 text-text-3 flex-wrap">
        {cms.socials.filter(s=>s.enabled).slice(0,5).map(s=>(
          <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-text transition text-[12px]">
            {s.platform}
          </a>
        ))}
      </div>
    </div>
  );
}
