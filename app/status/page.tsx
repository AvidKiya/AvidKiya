import { Activity, CheckCircle2, Clock3, Server, ShieldCheck } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';

export const metadata = { title: 'وضعیت سرویس‌ها — اَوید کیا' };

export default function Page(){
  const services = [
    { name:'Website', status:'Operational', icon: Server, color:'text-emerald' },
    { name:'Contact Form', status:'Operational', icon: CheckCircle2, color:'text-emerald' },
    { name:'Shop', status:'Operational', icon: ShieldCheck, color:'text-emerald' },
    { name:'Tools', status:'Operational', icon: Activity, color:'text-emerald' },
  ];
  return <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14">
    <GlassCard className="!p-6 md:!p-8 mb-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-2">وضعیت سرویس‌ها</h1>
          <p className="text-text-2 text-sm leading-7">نمای کلی سلامت سایت، فرم تماس، فروشگاه و ابزارهای داخلی.</p>
        </div>
        <div className="rounded-full bg-emerald/10 text-emerald px-4 py-2 text-sm inline-flex items-center gap-2 w-fit"><CheckCircle2 size={16} /> همه سیستم‌ها فعال هستند</div>
      </div>
    </GlassCard>
    <div className="grid sm:grid-cols-2 gap-4 mb-5">
      {services.map(s=>{ const Icon=s.icon; return <GlassCard key={s.name} className="!p-5 flex items-center justify-between gap-4"><div><div className="font-bold">{s.name}</div><div className="text-xs text-text-3 mt-1">{s.status}</div></div><Icon className={s.color} size={24} /></GlassCard> })}
    </div>
    <GlassCard className="!p-5 flex items-start gap-3"><Clock3 className="text-cyan shrink-0" size={20}/><p className="text-sm text-text-2 leading-7">آخرین بررسی: مانیتورینگ سبک در سمت کاربر. برای گزارش مشکل از صفحه تماس پیام بدهید.</p></GlassCard>
  </div>;
}
