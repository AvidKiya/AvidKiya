'use client';
import { useEffect, useState } from 'react';
import { toPersianDigits } from '@/lib/calendar';
import { useCms } from '@/lib/cms/cms-context';

export function LiveClock() {
  const { lang } = useCms();
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2,'0');
      const m = String(d.getMinutes()).padStart(2,'0');
      const s = String(d.getSeconds()).padStart(2,'0');
      const raw = `${h}:${m}:${s}`;
      setTime(lang === 'fa' ? toPersianDigits(raw) : raw);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lang]);
  return (
    <div className="text-center">
      <div className="text-[34px] sm:text-[44px] font-bold tracking-wider tabular-nums gradient-text" dir="ltr">
        {time || (lang === 'fa' ? '۰۰:۰۰:۰۰' : '00:00:00')}
      </div>
      <div className="text-xs text-text-3 mt-1">Asia/Tehran — {lang === 'fa' ? 'زنده' : 'live'}</div>
    </div>
  );
}
