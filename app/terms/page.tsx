import { FileText, Handshake, ShieldAlert, CreditCard } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';

export const metadata = { title: 'قوانین استفاده — اَوید کیا' };

export default function Page(){
  const sections = [
    { title:'استفاده از سایت', body:'محتوا، ابزارها و محصولات باید به شکل قانونی و مطابق حقوق مالکیت فکری استفاده شوند.', icon: FileText },
    { title:'همکاری پروژه‌ای', body:'محدوده کار، زمان‌بندی، پرداخت و تحویل قبل از شروع هر پروژه به‌صورت شفاف توافق می‌شود.', icon: Handshake },
    { title:'پرداخت و تحویل', body:'برای محصولات دیجیتال و خدمات، شرایط پرداخت و تحویل در صفحه محصول یا پیشنهاد همکاری مشخص می‌شود.', icon: CreditCard },
    { title:'مسئولیت‌ها', body:'کاربر مسئول صحت اطلاعات ارسالی، دسترسی‌ها و مجوزهای لازم برای انجام پروژه است.', icon: ShieldAlert },
  ];
  return <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
    <GlassCard className="!p-6 md:!p-8 mb-5"><h1 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-3">شرایط استفاده</h1><p className="text-text-2 text-sm leading-8">با استفاده از پلتفرم اَوید کیا، شرایط زیر را می‌پذیرید. این متن می‌تواند بر اساس قرارداد هر پروژه تکمیل شود.</p></GlassCard>
    <div className="grid gap-4">{sections.map(s=>{ const Icon=s.icon; return <GlassCard key={s.title} className="!p-5 flex gap-4"><Icon className="text-primary shrink-0" size={22}/><div><h2 className="font-bold mb-2">{s.title}</h2><p className="text-sm text-text-2 leading-7">{s.body}</p></div></GlassCard> })}</div>
  </div>;
}
