'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass';
import { AppIcon } from '@/components/ui/icons';
import { ArrowRight, Calendar } from 'lucide-react';
import {
  gregorianToJalali,
  jalaliToGregorian,
  jalaliToImperial,
  gregorianToYazdgerdi,
  PERSIAN_MONTHS,
  toPersianDigits,
} from '@/lib/calendar';

export default function DateConverterClient() {
  const today = new Date();
  const [gy, setGy] = useState(today.getFullYear());
  const [gm, setGm] = useState(today.getMonth() + 1);
  const [gd, setGd] = useState(today.getDate());
  const [mode, setMode] = useState<'g2j' | 'j2g'>('g2j');

  const [jy, setJy] = useState(1403);
  const [jm, setJm] = useState(1);
  const [jd, setJd] = useState(1);

  const gregorianResult = useMemo(() => {
    if (mode !== 'j2g') return null;
    try {
      return jalaliToGregorian(jy, jm, jd);
    } catch {
      return null;
    }
  }, [mode, jy, jm, jd]);

  const jalaliResult = useMemo(() => {
    if (mode !== 'g2j') return null;
    try {
      return gregorianToJalali(gy, gm, gd);
    } catch {
      return null;
    }
  }, [mode, gy, gm, gd]);

  const imperialYear = jalaliResult ? jalaliToImperial(jalaliResult[0]) : mode === 'j2g' ? jalaliToImperial(jy) : null;
  const yazdgerdiYear = mode === 'g2j' ? gregorianToYazdgerdi(gy) : gregorianResult ? gregorianToYazdgerdi(gregorianResult[0]) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-text-3 text-[12.5px] hover:text-text mb-5">
        <ArrowRight size={14} /> بازگشت به ابزارها
      </Link>

      <div className="mb-6">
        <h1 className="text-[26px] md:text-[30px] font-[800] tracking-[-0.015em] flex items-center gap-2">
          <AppIcon name="tools" size={24} className="text-amber" />
          مبدل تاریخ
        </h1>
        <p className="text-text-2 text-[13px] mt-1">شمسی ↔ میلادی ↔ شاهنشاهی ↔ یزدگردی — کاملاً در مرورگر شما، بدون ارسال داده</p>
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setMode('g2j')}
          className={`px-4 py-2 rounded-full text-[12.5px] transition ${mode === 'g2j' ? 'bg-primary text-[#052e28] font-[600]' : 'glass-card !px-4 !py-2 text-text-2'}`}
        >
          میلادی → شمسی
        </button>
        <button
          onClick={() => setMode('j2g')}
          className={`px-4 py-2 rounded-full text-[12.5px] transition ${mode === 'j2g' ? 'bg-primary text-[#052e28] font-[600]' : 'glass-card !px-4 !py-2 text-text-2'}`}
        >
          شمسی → میلادی
        </button>
      </div>

      <GlassCard className="!p-5 mb-5">
        {mode === 'g2j' ? (
          <div className="grid grid-cols-3 gap-3 mb-2">
            <div>
              <label className="text-[11px] text-text-3 block mb-1">سال</label>
              <input type="number" value={gy} onChange={(e) => setGy(Number(e.target.value))} className="glass-input w-full" />
            </div>
            <div>
              <label className="text-[11px] text-text-3 block mb-1">ماه</label>
              <input type="number" min={1} max={12} value={gm} onChange={(e) => setGm(Number(e.target.value))} className="glass-input w-full" />
            </div>
            <div>
              <label className="text-[11px] text-text-3 block mb-1">روز</label>
              <input type="number" min={1} max={31} value={gd} onChange={(e) => setGd(Number(e.target.value))} className="glass-input w-full" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 mb-2">
            <div>
              <label className="text-[11px] text-text-3 block mb-1">سال (شمسی)</label>
              <input type="number" value={jy} onChange={(e) => setJy(Number(e.target.value))} className="glass-input w-full" />
            </div>
            <div>
              <label className="text-[11px] text-text-3 block mb-1">ماه</label>
              <input type="number" min={1} max={12} value={jm} onChange={(e) => setJm(Number(e.target.value))} className="glass-input w-full" />
            </div>
            <div>
              <label className="text-[11px] text-text-3 block mb-1">روز</label>
              <input type="number" min={1} max={31} value={jd} onChange={(e) => setJd(Number(e.target.value))} className="glass-input w-full" />
            </div>
          </div>
        )}
      </GlassCard>

      <GlassCard className="!p-5">
        <div className="flex items-center gap-2 font-[700] mb-4 text-[14px]">
          <Calendar size={16} className="text-primary" /> نتیجه
        </div>
        <div className="space-y-3 text-[13.5px]">
          {mode === 'g2j' && jalaliResult && (
            <div className="flex items-center justify-between glass-card !p-3">
              <span className="text-text-2">تاریخ شمسی</span>
              <span className="font-[700]">
                {toPersianDigits(jalaliResult[2])} {PERSIAN_MONTHS[jalaliResult[1] - 1]} {toPersianDigits(jalaliResult[0])}
              </span>
            </div>
          )}
          {mode === 'j2g' && gregorianResult && (
            <div className="flex items-center justify-between glass-card !p-3">
              <span className="text-text-2">تاریخ میلادی</span>
              <span className="font-[700]" dir="ltr">
                {gregorianResult[0]}-{String(gregorianResult[1]).padStart(2, '0')}-{String(gregorianResult[2]).padStart(2, '0')}
              </span>
            </div>
          )}
          {imperialYear != null && (
            <div className="flex items-center justify-between glass-card !p-3">
              <span className="text-text-2">سال شاهنشاهی</span>
              <span className="font-[700]">{toPersianDigits(imperialYear)}</span>
            </div>
          )}
          {yazdgerdiYear != null && (
            <div className="flex items-center justify-between glass-card !p-3">
              <span className="text-text-2">سال یزدگردی</span>
              <span className="font-[700]">{toPersianDigits(yazdgerdiYear)}</span>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
