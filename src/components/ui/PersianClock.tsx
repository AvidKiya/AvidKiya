'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { getPersianDate, getTodayOccasion, getNextOccasion } from '@/lib/persian-calendar';
import { toPersianNum } from '@/lib/i18n';

export default function PersianClock() {
  const { lang } = useApp();
  const [time, setTime] = useState('');
  const [pd, setPd] = useState(getPersianDate());

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTime(lang === 'fa' ? toPersianNum(`${h}:${m}:${s}`) : `${h}:${m}:${s}`);
      setPd(getPersianDate(now));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  const occasion = getTodayOccasion(pd.jm, pd.jd);
  const nextOcc = !occasion ? getNextOccasion(pd.jm, pd.jd) : null;

  return (
    <div className="glass-card p-5 space-y-3">
      {/* Time */}
      <div className="text-center">
        <div className="text-3xl font-mono font-black tracking-wider gradient-text">{time}</div>
      </div>

      {/* Date */}
      <div className="text-center space-y-1">
        <div className="text-sm font-bold text-text-primary">
          {lang === 'fa' ? pd.weekday : pd.weekdayEn}
        </div>
        <div className="text-sm text-text-secondary">
          {lang === 'fa'
            ? `${toPersianNum(pd.jd)} ${pd.monthName} ${toPersianNum(pd.jy)}`
            : `${pd.jd} ${pd.monthNameEn} ${pd.jy}`
          }
        </div>
        <div className="text-xs text-text-muted">
          {lang === 'fa'
            ? `سال هخامنشی: ${toPersianNum(pd.akhYear)}`
            : `Achaemenid Year: ${pd.akhYear}`
          }
        </div>
      </div>

      {/* Occasion */}
      {occasion && (
        <div className="text-center text-sm font-bold text-accent-amber bg-accent-amber/10 rounded-lg px-3 py-2">
          {lang === 'fa' ? occasion.fa : occasion.en}
        </div>
      )}
      {nextOcc && (
        <div className="text-center text-xs text-text-muted">
          {lang === 'fa' ? `مناسبت پیش‌رو: ${nextOcc.fa}` : `Upcoming: ${nextOcc.en}`}
        </div>
      )}
    </div>
  );
}
