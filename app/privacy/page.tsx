import { Lock, Eye, Database, Mail } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';

export const metadata = { title: 'حریم خصوصی — اَوید کیا' };

export default function Page(){
  const sections = [
    { title:'اطلاعاتی که دریافت می‌شود', body:'در فرم تماس فقط نام، ایمیل، بودجه و توضیح پروژه دریافت می‌شود تا بتوانیم پاسخ دقیق‌تری بدهیم.', icon: Database },
    { title:'نحوه استفاده', body:'اطلاعات شما برای بررسی درخواست، پاسخ‌گویی و آماده‌سازی پیشنهاد همکاری استفاده می‌شود و به فروش نمی‌رسد.', icon: Eye },
    { title:'امنیت و نگهداری', body:'دسترسی به پیام‌ها محدود است و در صورت نیاز می‌توانید درخواست حذف اطلاعات خود را ارسال کنید.', icon: Lock },
    { title:'ارتباط', body:'برای سؤال یا درخواست حذف داده‌ها از ایمیل hello@avidkiya.com استفاده کنید.', icon: Mail },
  ];
  return <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
    <GlassCard className="!p-6 md:!p-8 mb-5">
      <h1 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-3">حریم خصوصی</h1>
      <p className="text-text-2 text-sm leading-8">این صفحه شفاف توضیح می‌دهد چه اطلاعاتی جمع‌آوری می‌شود و چگونه از آن محافظت می‌کنیم.</p>
    </GlassCard>
    <div className="grid gap-4">
      {sections.map(s=>{ const Icon=s.icon; return <GlassCard key={s.title} className="!p-5 flex gap-4"><div className="w-11 h-11 rounded-[14px] bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon size={20}/></div><div><h2 className="font-bold mb-2">{s.title}</h2><p className="text-sm text-text-2 leading-7">{s.body}</p></div></GlassCard> })}
    </div>
  </div>;
}
