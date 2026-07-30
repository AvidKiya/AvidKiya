'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  type CalendarMode,
  getCalendarGrid,
  getDailyQuote,
  getTodayCalendar,
  toPersianDigits,
} from '@/lib/calendar';
import { GlassCard } from '@/components/ui/glass';
import { LiveClock } from './live-clock';
import { useCms } from '@/lib/cms/cms-context';
import { AppIcon } from '@/components/ui/icons';
import { Circle, Flame, Leaf, Sparkles } from 'lucide-react';

const modes: Array<{ id: CalendarMode; fa: string; en: string }> = [
  { id: 'imperial', fa: 'شاهنشاهی', en: 'Imperial' },
  { id: 'jalali', fa: 'شمسی', en: 'Jalali' },
  { id: 'gregorian', fa: 'میلادی', en: 'Gregorian' },
];

export function CalendarWidget() {
  const [cal, setCal] = useState(() => getTodayCalendar());
  const [mode, setMode] = useState<CalendarMode>('imperial');
  const [quote] = useState(() => getDailyQuote());
  const { t, lang } = useCms();

  useEffect(() => {
    const id = setInterval(() => setCal(getTodayCalendar()), 60_000);
    return () => clearInterval(id);
  }, []);

  const grid = useMemo(() => getCalendarGrid(mode, cal), [mode, cal]);

  return (
    <GlassCard className="relative overflow-hidden !p-4 md:!p-5 min-w-0">
      <div className="scan-line" />
      <div className="flex items-center gap-2 mb-3 text-[13px] text-text-2">
        <AppIcon name="calendar" size={15} className="text-primary" />
        <strong className="tracking-[-0.01em]">{t('تقویم','Calendar')}</strong>
        <span className="ms-auto text-[10.5px] px-2 py-1 rounded-full bg-emerald/10 text-emerald">LIVE</span>
      </div>

      <div className="glass-card !p-1 flex items-center gap-1 rounded-full mb-4 overflow-x-auto">
        {modes.map(item => {
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={`relative flex-1 min-w-fit rounded-full px-3 py-2 text-[11.5px] transition-colors ${
                active ? 'text-primary font-[800]' : 'text-text-3 hover:text-text'
              }`}
            >
              {active && <span className="absolute inset-0 tab-active-pill" />}
              <span className="relative z-10">{lang === 'fa' ? item.fa : item.en}</span>
            </button>
          );
        })}
      </div>

      <div className="mb-4">
        <LiveClock />
      </div>

      <div className="rounded-[18px] bg-white/[0.028] border border-glass-border p-3 mb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <div className="text-[16px] font-black tracking-[-0.02em] truncate">{grid.title}</div>
            <div className="text-[11.5px] text-text-3 mt-1 leading-5">{grid.meta}</div>
          </div>
          <div className="text-[10.5px] text-primary bg-primary/10 border border-primary/15 rounded-full px-2.5 py-1 shrink-0">
            {mode === 'imperial' ? 'AVESTAN' : mode === 'jalali' ? 'IR' : 'GREG'}
          </div>
        </div>
        <div className="text-[12.5px] text-text-2 leading-6 flex items-center gap-2">
          <AppIcon name="target" size={14} className="text-primary shrink-0" />
          <span className="min-w-0">{t('امروز:', 'Today:')} <b className="text-text">{grid.todayLabel}</b> • {cal.jalali.weekDay}</span>
        </div>
      </div>

      <div className="grid gap-[8px] text-[12.5px] mb-3 leading-relaxed">
        <div className="grid grid-cols-3 gap-2">
          <div className={`rounded-[14px] border p-2 ${mode === 'imperial' ? 'border-primary/30 bg-primary/10' : 'border-glass-border bg-white/[0.025]'}`}>
            <div className="text-[10px] text-text-3 mb-1">شاهنشاهی</div>
            <div className="font-bold">{toPersianDigits(`${cal.imperial.y}/${cal.imperial.m}/${cal.imperial.d}`)}</div>
          </div>
          <div className={`rounded-[14px] border p-2 ${mode === 'jalali' ? 'border-primary/30 bg-primary/10' : 'border-glass-border bg-white/[0.025]'}`}>
            <div className="text-[10px] text-text-3 mb-1">شمسی</div>
            <div className="font-bold">{toPersianDigits(`${cal.jalali.y}/${cal.jalali.m}/${cal.jalali.d}`)}</div>
          </div>
          <div className={`rounded-[14px] border p-2 ${mode === 'gregorian' ? 'border-primary/30 bg-primary/10' : 'border-glass-border bg-white/[0.025]'}`}>
            <div className="text-[10px] text-text-3 mb-1">میلادی</div>
            <div className="font-bold" dir="ltr">{cal.gregorian.y}/{String(cal.gregorian.m).padStart(2,'0')}/{String(cal.gregorian.d).padStart(2,'0')}</div>
          </div>
        </div>
      </div>

      {cal.festival && (
        <div className="flex items-center gap-2 text-amber text-[12.5px] mb-3 rounded-[14px] bg-amber/10 border border-amber/15 px-3 py-2">
          <Sparkles size={14} />
          <span>{t('جشن امروز:','Festival:')} <b>{cal.festival}</b></span>
        </div>
      )}

      <div className="mt-3">
        <div className="grid grid-cols-7 text-[10.5px] text-text-3 mb-1.5 text-center">
          {grid.weekDays.map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-[4px] text-center">
          {grid.cells.map((d) => (
            <div
              key={d.key}
              className={`min-h-[38px] rounded-[9px] transition flex flex-col items-center justify-center border ${
                !d.day
                  ? 'border-transparent opacity-0'
                  : d.isToday
                  ? 'bg-primary text-[#052e28] border-primary shadow-sm font-black'
                  : d.isFestival
                  ? 'bg-amber/12 text-amber border-amber/18'
                  : d.isRest
                  ? 'bg-cyan/10 text-cyan border-cyan/15'
                  : d.isNabor
                  ? 'bg-rose/10 text-rose border-rose/15'
                  : 'hover:bg-white/[0.045] text-text-2 border-transparent'
              }`}
              title={d.title}
            >
              {d.day && (
                <>
                  <span className={`${mode === 'imperial' ? 'text-[9.5px] leading-3 px-0.5' : 'text-[12px]'} font-[800] max-w-full truncate`}>{d.label}</span>
                  {d.subLabel && <span className={`mt-0.5 max-w-full truncate ${d.isToday ? 'text-[#052e28]/75' : 'text-text-3'} ${mode === 'imperial' ? 'text-[9px]' : 'text-[9.5px]'}`}>{d.subLabel}</span>}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {mode === 'imperial' && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-[10.5px] text-text-3">
          <div className="flex items-center gap-1"><Circle size={9} className="text-cyan fill-cyan" /> استراحت</div>
          <div className="flex items-center gap-1"><Leaf size={11} className="text-rose" /> نَبُر</div>
          <div className="flex items-center gap-1"><Flame size={11} className="text-amber" /> جشن</div>
        </div>
      )}

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
