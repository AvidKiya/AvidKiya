import Link from 'next/link';
import { RotateCcw, FileCheck2, Clock3, ShieldCheck } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';

export const metadata = { title: 'بازپرداخت — اَوید کیا' };

export default function Page(){
  const rules = [
    { title:'محصولات دیجیتال', body:'اگر فایل هنوز تحویل نشده باشد یا مشکل فنی قابل رفع نباشد، درخواست بازپرداخت بررسی می‌شود.', icon: FileCheck2 },
    { title:'خدمات پروژه‌ای', body:'برای خدمات، پرداخت‌ها مرحله‌ای هستند و بازپرداخت مطابق وضعیت تحویل هر مرحله انجام می‌شود.', icon: ShieldCheck },
    { title:'زمان بررسی', body:'درخواست‌ها معمولاً طی ۳ روز کاری بررسی و نتیجه اعلام می‌شود.', icon: Clock3 },
  ];
  return <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
    <GlassCard className="!p-6 md:!p-8 mb-5">
      <div className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary flex items-center justify-center mb-4"><RotateCcw size={24}/></div>
      <h1 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-3">سیاست بازپرداخت</h1>
      <p className="text-text-2 text-sm leading-8">هدف، همکاری شفاف و منصفانه است. شرایط نهایی هر پروژه در پیشنهاد یا قرارداد مشخص می‌شود.</p>
    </GlassCard>
    <div className="grid gap-4 mb-6">
      {rules.map(r=>{ const Icon=r.icon; return <GlassCard key={r.title} className="!p-5 flex gap-4"><Icon className="text-primary shrink-0" size={22}/><div><h2 className="font-bold mb-2">{r.title}</h2><p className="text-sm text-text-2 leading-7">{r.body}</p></div></GlassCard> })}
    </div>
    <Link href="/contact" className="glass-btn-primary inline-flex !py-3 !px-5">ثبت درخواست بررسی</Link>
  </div>;
}
