import { GitBranch, Sparkles, Wrench, LayoutDashboard } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';

export const metadata = { title: 'تغییرات — اَوید کیا' };

export default function Page(){
  const logs = [
    { date:'2026-07-30', title:'بازطراحی کامل صفحه اصلی', body:'تقویم به بخش بالای صفحه منتقل شد، چیدمان ریسپانسیو بازسازی شد و کارت‌ها منظم‌تر شدند.', icon: LayoutDashboard },
    { date:'2026-07-30', title:'حذف ایموجی‌ها', body:'آیکون‌های lucide جایگزین ایموجی‌ها و نمادهای تزئینی شدند تا ظاهر حرفه‌ای‌تر شود.', icon: Sparkles },
    { date:'2026-07-30', title:'تکمیل صفحات ناقص', body:'صفحه تماس، نظرات، وضعیت، راهنما، حریم خصوصی و بازپرداخت محتوای واقعی دریافت کردند.', icon: Wrench },
  ];
  return <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
    <GlassCard className="!p-6 md:!p-8 mb-5">
      <div className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary flex items-center justify-center mb-4"><GitBranch size={24}/></div>
      <h1 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-3">تغییرات پروژه</h1>
      <p className="text-text-2 text-sm leading-8">ثبت تغییرات مهم طراحی، محتوا و تجربه کاربری سایت.</p>
    </GlassCard>
    <div className="relative space-y-4">
      {logs.map(log=>{ const Icon=log.icon; return <GlassCard key={log.title} className="!p-5"><div className="flex gap-4"><div className="w-11 h-11 rounded-[14px] bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon size={20}/></div><div><div className="text-xs text-text-3 mb-1" dir="ltr">{log.date}</div><h2 className="font-bold mb-2">{log.title}</h2><p className="text-sm text-text-2 leading-7">{log.body}</p></div></div></GlassCard> })}
    </div>
  </div>;
}
