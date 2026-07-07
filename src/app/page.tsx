'use client';
import { AsciiLogo } from '@/components/ui/ascii-logo';
import { CalendarWidget } from '@/components/calendar/calendar-widget';
import { MenuCard } from '@/components/home/menu-card';
import { useCms } from '@/lib/cms/cms-context';
import Link from 'next/link';
import { getDailyQuote } from '@/lib/calendar';
import { useMemo } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { AppIcon, type IconName } from '@/components/ui/icons';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const { t, cms, tf } = useCms();
  const quote = useMemo(() => getDailyQuote(), []);

  const cards: {icon: IconName; title:string; desc:string; href:string; accent: 'primary'|'cyan'|'emerald'|'violet'|'amber'|'rose'}[] = [
    { icon:'brain', title: t('KIYA','KIYA'), desc: t('مغز دوم','Second brain'), href:'/planner', accent:'violet' },
    { icon:'shop', title: t('فروشگاه','Shop'), desc: t('محصولات','Products'), href:'/shop', accent:'emerald' },
    { icon:'services', title: t('خدمات','Services'), desc: t('فریلنسری','Freelance'), href:'/services', accent:'cyan' },
    { icon:'tools', title: t('ابزارها','Tools'), desc: t('آنلاین','Online'), href:'/tools', accent:'amber' },
    { icon:'projects', title: t('پروژه‌ها','Projects'), desc: t('من','Mine'), href:'/projects', accent:'primary' },
    { icon:'comments', title: t('نظرات','Reviews'), desc: t('کاربران','Users'), href:'/comments', accent:'rose' },
  ];

  const featured = cms.projects.customProjects.filter(p=>p.featured).slice(0,3);
  const stats = cms.dashboard.stats;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Compact Hero — portfolio style */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6 md:mb-8">
        <div>
          <div className="mb-3 opacity-95 scale-[0.92] origin-right md:origin-left" dir="ltr">
            <AsciiLogo small />
          </div>
          <h1 className="text-[24px] md:text-[30px] font-[700] tracking-[-0.015em] leading-tight">
            {tf(cms.dashboard.heroTitleA)}
            <span className="text-text-3 font-[500] mx-[10px]">—</span>
            <span className="gradient-text">{tf(cms.dashboard.heroTitleB)}</span>
          </h1>
          <p className="text-[13.5px] md:text-[14.5px] text-text-2 mt-2 max-w-[620px] leading-relaxed">
            {tf(cms.dashboard.heroDescription)}
            <span className="mx-2 text-text-3">•</span>
            <span className="text-text-3">{tf(cms.identity.location)} • {cms.identity.yearsExperience}+ {t('سال تجربه','years')}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] shrink-0">
          <Link href="/projects" className="glass-btn !py-2 !px-4 text-[13px]">
            {tf(cms.dashboard.ctaPrimary)}
          </Link>
          <Link href="/contact" className="glass-btn-primary !py-2 !px-4 text-[13px]">
            {tf(cms.dashboard.ctaSecondary)}
          </Link>
        </div>
      </div>

      {/* Two column: Calendar | Menu Grid — dense desktop */}
      <div className="grid lg:grid-cols-[420px_1fr] gap-4 md:gap-5 items-start mb-8 md:mb-10">
        <div className="order-2 lg:order-1">
          <CalendarWidget />
        </div>
        <div className="order-1 lg:order-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-[14px]">
            {cards.map((c,i)=> (
              <MenuCard key={c.href} {...c} index={i} />
            ))}
          </div>
          {/* quick links row — compact */}
          <div className="flex flex-wrap gap-3 md:gap-5 text-[12.5px] text-text-2 mt-3 px-1">
            <Link href="/about" className="hover:text-text flex items-center gap-1 transition-colors">
              {t('درباره','About')} <ArrowLeft size={13} className="opacity-60" />
            </Link>
            <Link href="/resume" className="hover:text-text flex items-center gap-1 transition-colors">
              {t('رزومه','Resume')} <ArrowLeft size={13} className="opacity-60" />
            </Link>
            <Link href="/blog" className="hover:text-text flex items-center gap-1 transition-colors">
              {t('بلاگ','Blog')} <ArrowLeft size={13} className="opacity-60" />
            </Link>
            <Link href="/contact" className="hover:text-text flex items-center gap-1 transition-colors">
              {t('تماس','Contact')} <ArrowLeft size={13} className="opacity-60" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Work — portfolio */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[16px] md:text-[18px] font-bold flex items-center gap-2">
            <AppIcon name="sparkles" size={17} className="text-amber" />
            {t('کارهای برجسته','Featured Work')}
          </h2>
          <Link href="/projects" className="text-[12.5px] text-text-3 hover:text-text flex items-center gap-1">
            {t('همه پروژه‌ها','All projects')} <ExternalLink size={13} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {featured.map((p) => (
            <GlassCard key={p.id} className="!p-4 hover:shadow-glass-lg transition-all group">
              <div className="flex items-start justify-between mb-2">
                <div className="text-[13.5px] font-bold">{p.title}</div>
                <span className="text-[10.5px] px-2 py-1 rounded-full bg-white/[0.06] text-text-3">{p.language}</span>
              </div>
              <p className="text-[12.5px] text-text-2 leading-relaxed min-h-[38px]">{p.description}</p>
              <div className="flex items-center justify-between mt-3 text-[11.5px] text-text-3">
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><AppIcon name="star" size={13} /> {p.stars||0}</span>
                  <span>TS</span>
                </span>
                <Link href={p.url||'/projects'} className="text-primary hover:underline flex items-center gap-1">
                  {t('مشاهده','Open')} <ArrowLeft size={12} />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Stats strip — compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stats.map(s=>(
          <GlassCard key={s.id} className="!py-3 !px-4 text-center">
            <div className="text-[20px] font-black tracking-tight">{s.value}</div>
            <div className="text-[11.5px] text-text-3 mt-0.5">{tf(s.label)}</div>
          </GlassCard>
        ))}
      </div>

      {/* Comments — compact carousel */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 px-1">
          <AppIcon name="comments" size={16} className="text-emerald" />
          <h3 className="text-[15px] font-bold">{t('نظر کاربران','User reviews')}</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {cms.comments.filter(c=>c.approved).slice(0,3).map(c=>(
            <GlassCard key={c.id} className="!p-4">
              <div className="text-[12.5px] leading-relaxed text-text-2 mb-2">“{c.text}”</div>
              <div className="text-[11.5px] text-text-3">— {c.author}{c.role ? ` • ${c.role}` : ''}</div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Quote — compact */}
      <GlassCard className="!py-4 !px-5 text-center max-w-3xl mx-auto">
        <div className="text-[11px] text-text-3 mb-1 tracking-wide">{t('سخن امروز','Quote today')}</div>
        <p className="text-[14px] md:text-[15px] leading-relaxed">«{quote.text}»</p>
        <div className="text-[11px] text-text-3 mt-1">— {quote.author}</div>
      </GlassCard>

      {/* socials — compact, icon only */}
      <div className="flex justify-center gap-5 mt-8 text-text-3">
        {cms.socials.filter(s=>s.enabled).slice(0,5).map(s=>(
          <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-text transition text-[12px]">
            {s.platform}
          </a>
        ))}
      </div>
    </div>
  );
}
