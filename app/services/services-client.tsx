'use client';
import Link from 'next/link';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';
import { AppIcon, type IconName } from '@/components/ui/icons';
import { useState } from 'react';
import { Check, Send, ArrowLeft } from 'lucide-react';

const serviceIcons: IconName[] = ['code', 'cloud', 'brain', 'sparkles'];

export default function ServicesClient(){
  const { cms, tf, t } = useCms();
  const services = cms.freelancing.services.filter(s=>s.enabled);
  const [form, setForm] = useState({name:'', email:'', budget:'', message:''});
  const [sent, setSent] = useState(false);

  const submit = (e:React.FormEvent)=>{ e.preventDefault(); setSent(true); setTimeout(()=>setSent(false), 3000); };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-[28px] md:text-[40px] font-black tracking-[-0.03em] mb-3">
          {t('خدمات حرفه‌ای','Professional Services')}
        </h1>
        <p className="text-text-2 text-[14px] leading-8">
          طراحی و توسعه سیستم‌های مقیاس‌پذیر با تمرکز روی Next.js، Cloudflare Edge و AI Agents
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {services.map((s, i)=>(
          <GlassCard key={s.id} className="!p-5 hover:shadow-glass-lg transition-all">
            <div className="w-11 h-11 rounded-[14px] bg-primary/10 text-primary flex items-center justify-center mb-3">
              <AppIcon name={serviceIcons[i] || 'zap'} size={20} />
            </div>
            <div className="font-[700] text-[15px] mb-1">{tf(s.title)}</div>
            <div className="text-[12.5px] text-text-2 leading-relaxed min-h-[54px]">{tf(s.description)}</div>
            <div className="text-[12px] text-text-3 mt-3">از ${s.priceFrom?.toLocaleString()}+</div>
            <a href="#request" className="mt-3 inline-flex items-center gap-1 text-[12.5px] text-primary hover:underline">درخواست پروژه <ArrowLeft size={12} /></a>
          </GlassCard>
        ))}
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between gap-3 mb-3 px-1">
          <h3 className="text-[16px] font-[800]">نمونه‌کارهای منتخب</h3>
          <Link href="/projects" className="text-xs text-text-3 hover:text-text">همه پروژه‌ها</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cms.freelancing.portfolio.map(p=>(
            <GlassCard key={p.id} className="!p-4 text-[13px]">
              <div className="font-[600] mb-1">{p.title}</div>
              <a href={p.url||'#'} className="text-[11.5px] text-primary hover:underline inline-flex items-center gap-1">مشاهده <ArrowLeft size={12}/></a>
            </GlassCard>
          ))}
          <GlassCard className="!p-4 text-[13px] opacity-90">
            <div className="font-[600] mb-1">۸۴ پروژه دیگر</div>
            <div className="text-[11.5px] text-text-3">در GitHub و همکاری‌های خصوصی</div>
          </GlassCard>
        </div>
      </div>

      <div id="request" className="max-w-3xl mx-auto scroll-mt-24">
        <GlassCard className="!p-5 md:!p-7">
          <h2 className="text-[18px] font-[800] mb-1">درخواست پروژه</h2>
          <p className="text-text-2 text-[12.5px] mb-4">فرم را پر کنید؛ کمتر از ۱۲ ساعت پاسخ می‌دهم.</p>
          {sent ? (
            <div className="text-center py-8">
              <Check size={32} className="mx-auto text-emerald mb-3" />
              <div className="font-[700]">درخواست شما ثبت شد</div>
              <div className="text-[12.5px] text-text-2 mt-1">به‌زودی ایمیل می‌زنم.</div>
            </div>
          ) : (
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 text-[13.5px]">
            <input required placeholder="نام" className="glass-input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input required type="email" placeholder="ایمیل" dir="ltr" className="glass-input" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            <select className="glass-input sm:col-span-2" value={form.budget} onChange={e=>setForm({...form, budget:e.target.value})}>
              <option value="">بودجه تقریبی</option>
              <option>&lt; $1,000</option>
              <option>$1,000 – $3,000</option>
              <option>$3,000 – $8,000</option>
              <option>$8,000+</option>
            </select>
            <textarea required placeholder="توضیح پروژه" rows={4} className="glass-input sm:col-span-2 resize-none"
              value={form.message} onChange={e=>setForm({...form, message:e.target.value})} />
            <button className="glass-btn-primary sm:col-span-2 !py-[12px] flex items-center justify-center gap-2">
              <Send size={15} /> ارسال درخواست
            </button>
          </form>
          )}
          <div className="text-[11px] text-text-3 mt-3 text-center">پاسخ ۱۲ ساعته • NDA موجود • فاکتور رسمی</div>
        </GlassCard>
      </div>
    </div>
  );
}
