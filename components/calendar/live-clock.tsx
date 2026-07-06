'use client';
import { useEffect, useState } from 'react';
import { toPersianDigits } from '@/lib/calendar';

export function LiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2,'0');
      const m = String(d.getMinutes()).padStart(2,'0');
      const s = String(d.getSeconds()).padStart(2,'0');
      setTime(toPersianDigits(`${h}:${m}:${s}`));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-center">
      <div className="text-[34px] sm:text-[44px] font-bold tracking-wider tabular-nums gradient-text" dir="ltr">
        {time || '۰۰:۰۰:۰۰'}
      </div>
      <div className="text-xs text-text-3 mt-1">Asia/Tehran — زنده</div>
    </div>
  );
}
