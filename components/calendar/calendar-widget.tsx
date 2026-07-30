'use client';
import { useEffect, useState } from 'react';
import { getTodayCalendar, getDailyQuote, toPersianDigits, getMonthCalendar } from '@/lib/calendar';
import { GlassCard } from '@/components/ui/glass';
import { LiveClock } from './live-clock';
import { useCms } from '@/lib/cms/cms-context';
import { AppIcon } from '@/components/ui/icons';
import { Sparkles } from 'lucide-react';

export function CalendarWidget() {
  const [cal, setCal] = useState(() => getTodayCalendar());
  const [quote] = useState(() => getDailyQuote());
  const { t } = useCms();

  useEffect(() => {
    const id = setInterval(() => setCal(getTodayCalendar()), 60_000);
    return () => clearInterval(id);
  }, []);

  const monthDays = getMonthCalendar(cal.jalali.y, cal.jalali.m, cal.jalali.d);

  return (
    <GlassCard className="relative overflow-hidden !p-4 md:!p-5 min-w-0">
      <div className="scan-line" />
      <div className="flex items-center gap-2 mb-3 text-[13px] text-text-2">
        <AppIcon name="calendar" size={15} className="text-primary" />
        <strong className="tracking-[-0.01em]">{t('تقویم‌های ایرانی','Iranian Calendars')}</strong>
        <span className="ms-auto text-[10.5px] px-2 py-1 rounded-full bg-emerald/10 text-emerald">LIVE</span>
      </div>

      <div className="mb-4">
        <LiveClock />
      </div>

      <div className="grid gap-[9px] text-[13px] mb-3 leading-relaxed">
        <div className="flex justify-between border-b border-glass-border pb-[9px] text-[12.5px]">
          <span className="text-text-3 flex items-center gap-1.5"><AppIcon name="clock" size={13} /> {t('میلادی','Gregorian')}</span>
          <span dir="ltr" className="tabular-nums">{cal.gregorian.y}-{String(cal.gregorian.m).padStart(2,'0')}-{String(cal.gregorian.d).padStart(2,'0')}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-text-3 shrink-0">{t('شمسی','Jalali')}</span>
          <span className="font-[600] text-end min-w-0">{toPersianDigits(`${cal.jalali.y}/${cal.jalali.m}/${cal.jalali.d}`)} — {cal.jalali.monthName}</span>
        </div>
        <div className="flex justify-between text-[12.5px] text-text-2">
          <span>{t('شاهنشاهی','Imperial')}</span>
          <span>{toPersianDigits(`${cal.imperial.y}/${cal.imperial.m}/${cal.imperial.d}`)}</span>
        </div>
        <div className="flex justify-between text-[12.5px] text-text-2 border-b border-glass-border pb-[9px]">
          <span>{t('ایران باستان','Ancient')}</span>
          <span>{toPersianDigits(`${cal.yazdgerdi.y}/${cal.yazdgerdi.m}/${cal.yazdgerdi.d}`)}</span>
        </div>
      </div>

      <div className="text-[12.5px] space-y-1.5 mb-3">
        {cal.festival && (
          <div className="flex items-center gap-2 text-amber">
            <Sparkles size={14} />
            <span>{t('جشن امروز:','Festival:')} <b>{cal.festival}</b></span>
          </div>
        )}
        <div className="flex items-center gap-2 text-text-2">
          <AppIcon name="target" size={14} />
          <span>{t('نام روز:','Day:')} <b className="text-text">{cal.ancientDay}</b> • {cal.jalali.weekDay}</span>
        </div>
      </div>

      {/* month grid — compact */}
      <div className="mt-3">
        <div className="grid grid-cols-7 text-[10.5px] text-text-3 mb-1 text-center">
          {['ش','ی','د','س','چ','پ','ج'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-[4px] text-center text-[11.5px]">
          {monthDays.map(d => (
            <div key={d.day}
              className={`py-[6px] rounded-[8px] transition font-[500] ${
                d.isToday
                  ? 'bg-primary text-white shadow-sm'
                  : d.festival
                  ? 'bg-amber/12 text-amber'
                  : 'hover:bg-white/[0.045] text-text-2'
              }`}
              title={d.ancientName + (d.festival ? ' — ' + d.festival : '')}
            >
              {toPersianDigits(d.day)}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-glass-border text-[12.5px]">
        <div className="text-text-3 mb-1 flex items-center gap-1.5 text-[11px]">
          <AppIcon name="book" size={13} /> {t('سخن امروز','Quote')}
        </div>
        <p className="leading-relaxed text-text-2">«{quote.text}»</p>
        <div className="text-left text-[10.5px] text-text-3 mt-1" dir="ltr">— {quote.author}</div>
      </div>
    </GlassCard>
  );
}
