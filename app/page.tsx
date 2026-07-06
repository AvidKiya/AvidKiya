'use client';
import { AsciiLogo } from '@/components/ui/ascii-logo';
import { CalendarWidget } from '@/components/calendar/calendar-widget';
import { MenuCard } from '@/components/home/menu-card';
import { useCms } from '@/lib/cms/cms-context';
import Link from 'next/link';
import { getDailyQuote } from '@/lib/calendar';
import { useMemo } from 'react';

export default function HomePage() {
  const { lang, t, cms, tf } = useCms();
  const quote = useMemo(() => getDailyQuote(), []);

  const cards = [
    { icon:'🧠', title: t('KIYA','KIYA'), desc: t('مغز دوم','Second brain'), href:'/planner' },
    { icon:'🛒', title: t('فروشگاه','Shop'), desc: t('محصولات','Products'), href:'/shop' },
    { icon:'💼', title: t('خدمات','Services'), desc: t('فریلنسری','Freelance'), href:'/services' },
    { icon:'🔧', title: t('ابزارها','Tools'), desc: t('آنلاین','Online'), href:'/tools' },
    { icon:'📄', title: t('پروژه‌ها','Projects'), desc: t('من','Mine'), href:'/projects' },
    { icon:'💬', title: t('نظرات','Comments'), desc: t('کاربران','Users'), href:'/comments' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">
      {/* ASCII Logo hero */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-5">
          <AsciiLogo />
        </div>
        <h1 className="text-[22px] md:text-[28px] font-bold">
          <span>{tf(cms.identity.fullName) || 'اَوید کیا'}</span>
          <span className="text-text-3 mx-2">—</span>
          <span className="gradient-text">{t('معمار سیستم','Systems Architect')}</span>
        </h1>
        <p className="text-text-2 text-sm mt-2 max-w-xl mx-auto">
          {t('سیستم‌های مقیاس‌پذیر می‌سازم — از ایده تا دیپلوی.','Building scalable systems — from idea to deploy.')}
        </p>
      </div>

      {/* Calendar - نقطه جذب */}
      <div className="max-w-xl mx-auto mb-10">
        <CalendarWidget />
      </div>

      {/* 6 menu cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-3xl mx-auto">
        {cards.map((c,i)=> (
          <MenuCard key={c.href} {...c} index={i} />
        ))}
      </div>

      {/* سخن امروز */}
      <div className="max-w-2xl mx-auto text-center mt-12">
        <div className="text-text-3 text-xs mb-2">── {t('سخن امروز','Quote today')} ──</div>
        <p className="text-[15px] md:text-[17px] leading-relaxed">«{quote.text}»</p>
        <div className="text-text-3 text-xs mt-2">— {quote.author}</div>
      </div>

      {/* لینک‌های پایین */}
      <div className="flex justify-center gap-6 md:gap-10 mt-10 text-sm text-text-2 flex-wrap">
        <Link href="/about" className="hover:text-text transition">[ {t('درباره من','About me')} ← ]</Link>
        <Link href="/resume" className="hover:text-text transition">[ {t('رزومه','Resume')} ← ]</Link>
        <Link href="/contact" className="hover:text-text transition">[ {t('تماس','Contact')} ← ]</Link>
        <Link href="/blog" className="hover:text-text transition">[ {t('بلاگ','Blog')} ← ]</Link>
      </div>

      {/* socials quick */}
      <div className="flex justify-center gap-4 mt-8 text-text-3 text-xs">
        {cms.socials.filter(s=>s.enabled).slice(0,5).map(s=>(
          <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-text transition">
            {tf(s.label)}
          </a>
        ))}
      </div>
    </div>
  );
}
