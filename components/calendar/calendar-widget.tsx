'use client';
import { useEffect, useState } from 'react';
import { getTodayCalendar, getDailyQuote, toPersianDigits, getMonthCalendar } from '@/lib/calendar';
import { GlassCard } from '@/components/ui/glass';
import { LiveClock } from './live-clock';
import { useCms } from '@/lib/cms/cms-context';

export function CalendarWidget() {
  const [cal, setCal] = useState(() => getTodayCalendar());
  const [quote] = useState(() => getDailyQuote());
  const { lang, t } = useCms();

  useEffect(() => {
    const id = setInterval(() => setCal(getTodayCalendar()), 60_000);
    return () => clearInterval(id);
  }, []);

  const monthDays = getMonthCalendar(cal.jalali.y, cal.jalali.m, cal.jalali.d);

  return (
    <GlassCard className="relative overflow-hidden">
      <div className="scan-line" />
      <div className="flex items-center gap-2 mb-4 text-sm text-text-2">
        <span>📅</span>
        <strong>{t('تقویم‌های ایرانی','Iranian Calendars')}</strong>
      </div>

      {/* Clock */}
      <div className="mb-5">
        <LiveClock />
      </div>

      {/* Dates */}
      <div className="grid gap-2 text-[13.5px] mb-4 leading-relaxed">
        <div className="flex justify-between border-b border-glass-border pb-2">
          <span className="text-text-3">{t('میلادی','Gregorian')}</span>
          <span dir="ltr" className="tabular-nums">{cal.gregorian.y}-{String(cal.gregorian.m).padStart(2,'0')}-{String(cal.gregorian.d).padStart(2,'0')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-3">{t('شمسی','Jalali')}</span>
          <span className="font-medium">{toPersianDigits(`${cal.jalali.y}/${cal.jalali.m}/${cal.jalali.d}`)} — {cal.jalali.monthName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-3">{t('شاهنشاهی','Imperial')}</span>
          <span>{toPersianDigits(`${cal.imperial.y}/${cal.imperial.m}/${cal.imperial.d}`)} — {cal.jalali.monthName}</span>
        </div>
        <div className="flex justify-between border-b border-glass-border pb-2">
          <span className="text-text-3">{t('ایران باستان','Ancient')}</span>
          <span>{toPersianDigits(`${cal.yazdgerdi.y}/${cal.yazdgerdi.m}/${cal.yazdgerdi.d}`)} — {cal.jalali.monthName}</span>
        </div>
      </div>

      {/* Festival & ancient day */}
      <div className="text-[13px] space-y-1.5 mb-4">
        {cal.festival && (
          <div className="flex items-center gap-2">
            <span>🎉</span>
            <span className="text-amber">{t('جشن امروز:','Festival:')} <b>{cal.festival}</b></span>
          </div>
        )}
        <div className="flex items-center gap-2 text-text-2">
          <span>📛</span>
          <span>{t('نام روز باستانی:','Ancient day:')} <b className="text-text">{cal.ancientDay}</b> — {cal.jalali.weekDay}</span>
        </div>
      </div>

      {/* Mini month grid */}
      <div className="mt-4">
        <div className="grid grid-cols-7 text-[11px] text-text-3 mb-1 text-center">
          {['ش','ی','د','س','چ','پ','ج'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-[5px] text-center text-[12px]">
          {monthDays.map(d => (
            <div key={d.day}
              className={`py-1.5 rounded-md transition ${
                d.isToday
                  ? 'bg-primary text-white font-bold shadow'
                  : d.festival
                  ? 'bg-amber/15 text-amber'
                  : 'hover:bg-white/[0.05]'
              }`}
              title={d.ancientName + (d.festival ? ' — ' + d.festival : '')}
            >
              {toPersianDigits(d.day)}
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div className="mt-5 pt-4 border-t border-glass-border text-[13px]">
        <div className="text-text-3 mb-1">💬 {t('سخن امروز','Quote of the day')}</div>
        <p className="leading-relaxed">«{quote.text}»</p>
        <div className="text-left text-[11px] text-text-3 mt-1" dir="ltr">— {quote.author}</div>
      </div>
    </GlassCard>
  );
}
