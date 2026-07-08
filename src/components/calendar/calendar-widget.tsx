'use client';
import { useEffect, useMemo, useState } from 'react';
import { getTodayCalendar, toPersianDigits, getMonthCalendar } from '@/lib/calendar';
import { GlassCard } from '@/components/ui/glass';
import { LiveClock } from './live-clock';
import { useCms } from '@/lib/cms/cms-context';
import { AppIcon } from '@/components/ui/icons';
import { Sparkles } from 'lucide-react';

const EN_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function CalendarWidget() {
  const [now, setNow] = useState(() => new Date());
  const [cal, setCal] = useState(() => getTodayCalendar());
  const { t, lang, cms } = useCms();
  const quote = useMemo(() => {
    const custom = cms.quotes.custom.map(q => ({ text: q.text, author: q.author }));
    const historical = [
      ...cms.quotes.kourosh.map(text => ({ text, author: lang === 'fa' ? 'کوروش بزرگ' : 'Cyrus the Great' })),
      ...cms.quotes.mohammadReza.map(text => ({ text, author: lang === 'fa' ? 'محمدرضا شاه پهلوی' : 'Mohammad Reza Shah Pahlavi' })),
      ...cms.quotes.rezaShah.map(text => ({ text, author: lang === 'fa' ? 'رضا شاه' : 'Reza Shah' })),
      ...custom,
    ].filter(q => q.text.trim());
    if (!cms.quotes.enabled || historical.length === 0) {
      return lang === 'fa'
        ? { text: 'برای نمایش سخن روز، از پنل مدیر بخش Calendar یک نقل‌قول اضافه کنید.', author: 'CMS' }
        : { text: 'Add daily quotes from the admin Calendar section.', author: 'CMS' };
    }
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(),0,0).getTime()) / 86400000);
    return historical[dayOfYear % historical.length];
  }, [cms.quotes, lang, now]);

  useEffect(() => {
    const id = setInterval(() => { const d = new Date(); setNow(d); setCal(getTodayCalendar(d)); }, 60_000);
    return () => clearInterval(id);
  }, []);

  const monthDays = useMemo(() => getMonthCalendar(cal.jalali.y, cal.jalali.m, cal.jalali.d), [cal]);
  const monthStartOffset = useMemo(() => new Date(now.getFullYear(), now.getMonth(), 1).getDay(), [now]);
  const daysInGregorianMonth = useMemo(() => new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), [now]);
  const enMonthDays = Array.from({ length: monthStartOffset + daysInGregorianMonth }, (_, i) => i < monthStartOffset ? null : i - monthStartOffset + 1);

  if (lang === 'en') {
    return (
      <GlassCard className="relative overflow-hidden !p-4 md:!p-5">
        <div className="scan-line" />
        <div className="flex items-center gap-2 mb-3 text-[13px] text-text-2">
          <AppIcon name="calendar" size={15} className="text-primary" />
          <strong className="tracking-[-0.01em]">Calendar</strong>
          <span className="ms-auto text-[10.5px] px-2 py-1 rounded-full bg-emerald/10 text-emerald">LIVE</span>
        </div>

        <div className="mb-4"><LiveClock /></div>

        <div className="grid gap-[9px] text-[13px] mb-3 leading-relaxed">
          <div className="flex justify-between border-b border-glass-border pb-[9px] text-[12.5px]">
            <span className="text-text-3 flex items-center gap-1.5"><AppIcon name="clock" size={13} /> Gregorian</span>
            <span dir="ltr" className="tabular-nums">{now.getFullYear()}-{String(now.getMonth()+1).padStart(2,'0')}-{String(now.getDate()).padStart(2,'0')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-3">Month</span>
            <span className="font-[600]">{EN_MONTHS[now.getMonth()]} {now.getFullYear()}</span>
          </div>
          <div className="flex justify-between text-[12.5px] text-text-2 border-b border-glass-border pb-[9px]">
            <span>Today</span>
            <span>{EN_DAYS[now.getDay()]}</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="grid grid-cols-7 text-[10.5px] text-text-3 mb-1 text-center">
            {EN_DAYS.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-[4px] text-center text-[11.5px]">
            {enMonthDays.map((d, i) => (
              <div key={i} className={`py-[6px] rounded-[8px] transition font-[500] ${d === now.getDate() ? 'bg-primary text-white shadow-sm' : 'hover:bg-white/[0.045] text-text-2'}`}>
                {d || ''}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-glass-border text-[12.5px]">
          <div className="text-text-3 mb-1 flex items-center gap-1.5 text-[11px]"><AppIcon name="book" size={13} /> Quote</div>
          <p className="leading-relaxed text-text-2">“{quote.text}”</p>
          <div className="text-left text-[10.5px] text-text-3 mt-1" dir="ltr">— {quote.author}</div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="relative overflow-hidden !p-4 md:!p-5">
      <div className="scan-line" />
      <div className="flex items-center gap-2 mb-3 text-[13px] text-text-2">
        <AppIcon name="calendar" size={15} className="text-primary" />
        <strong className="tracking-[-0.01em]">{t('تقویم‌های ایرانی','Iranian Calendars')}</strong>
        <span className="ms-auto text-[10.5px] px-2 py-1 rounded-full bg-emerald/10 text-emerald">LIVE</span>
      </div>

      <div className="mb-4"><LiveClock /></div>

      <div className="grid gap-[9px] text-[13px] mb-3 leading-relaxed">
        <div className="flex justify-between border-b border-glass-border pb-[9px] text-[12.5px]">
          <span className="text-text-3 flex items-center gap-1.5"><AppIcon name="clock" size={13} /> {t('میلادی','Gregorian')}</span>
          <span dir="ltr" className="tabular-nums">{cal.gregorian.y}-{String(cal.gregorian.m).padStart(2,'0')}-{String(cal.gregorian.d).padStart(2,'0')}</span>
        </div>
        <div className="flex justify-between"><span className="text-text-3">{t('شمسی','Jalali')}</span><span className="font-[600]">{toPersianDigits(`${cal.jalali.y}/${cal.jalali.m}/${cal.jalali.d}`)} — {cal.jalali.monthName}</span></div>
        <div className="flex justify-between text-[12.5px] text-text-2"><span>{t('شاهنشاهی','Imperial')}</span><span>{toPersianDigits(`${cal.imperial.y}/${cal.imperial.m}/${cal.imperial.d}`)}</span></div>
        <div className="flex justify-between text-[12.5px] text-text-2 border-b border-glass-border pb-[9px]"><span>{t('ایران باستان','Ancient')}</span><span>{toPersianDigits(`${cal.yazdgerdi.y}/${cal.yazdgerdi.m}/${cal.yazdgerdi.d}`)}</span></div>
      </div>

      <div className="text-[12.5px] space-y-1.5 mb-3">
        {cal.festival && <div className="flex items-center gap-2 text-amber"><Sparkles size={14} /><span>{t('جشن امروز:','Festival:')} <b>{cal.festival}</b></span></div>}
        <div className="flex items-center gap-2 text-text-2"><AppIcon name="target" size={14} /><span>{t('نام روز:','Day:')} <b className="text-text">{cal.ancientDay}</b> • {cal.jalali.weekDay}</span></div>
      </div>

      <div className="mt-3">
        <div className="grid grid-cols-7 text-[10.5px] text-text-3 mb-1 text-center">{['ش','ی','د','س','چ','پ','ج'].map(d => <div key={d}>{d}</div>)}</div>
        <div className="grid grid-cols-7 gap-[4px] text-center text-[11.5px]">
          {monthDays.map(d => <div key={d.day} className={`py-[6px] rounded-[8px] transition font-[500] ${d.isToday ? 'bg-primary text-white shadow-sm' : d.festival ? 'bg-amber/12 text-amber' : 'hover:bg-white/[0.045] text-text-2'}`} title={d.ancientName + (d.festival ? ' — ' + d.festival : '')}>{toPersianDigits(d.day)}</div>)}
        </div>
      </div>
    </GlassCard>
  );
}
