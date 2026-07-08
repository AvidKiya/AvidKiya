'use client';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard, GlassButton } from '@/components/ui/glass';
import { AppIcon } from '@/components/ui/icons';
import { useState } from 'react';
import { Check, Send } from 'lucide-react';

export default function ServicesClient(){
  const { cms, updateCms, tf, t } = useCms();
  const services = cms.freelancing.services.filter(s=>s.enabled);
  const [form, setForm] = useState({name:'', email:'', budget:'', message:''});
  const [sent, setSent] = useState(false);

  const submit = (e:React.FormEvent)=>{
    e.preventDefault();
    const newMessage = {
      id: 'req' + Date.now(),
      name: form.name,
      email: form.email,
      message: `[درخواست پروژه — بودجه: ${form.budget || 'نامشخص'}] ${form.message}`,
      date: new Date().toISOString().slice(0, 10),
      read: false,
    };
    updateCms({ messages: [newMessage, ...cms.messages] });
    setForm({name:'', email:'', budget:'', message:''});
    setSent(true);
    setTimeout(()=>setSent(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-7 md:py-10">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-[26px] md:text-[34px] font-[800] tracking-[-0.015em] mb-3">
          {t('فریلنسری حرفه‌ای','Freelance — Pro')}
        </h1>
        <p className="text-text-2 text-[14px] leading-relaxed">
          طراحی و توسعه سیستم‌های مقیاس‌پذیر — Next.js • Cloudflare Edge • AI Agents
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {services.map(s=>(
          <GlassCard key={s.id} className="!p-5">
            <div className="w-11 h-11 rounded-[14px] bg-primary/10 text-primary flex items-center justify-center mb-3">
              <AppIcon name="zap" size={20} />
            </div>
            <div className="font-[700] text-[15px] mb-1">{tf(s.title)}</div>
            <div className="text-[12.5px] text-text-2 leading-relaxed min-h-[44px]">{tf(s.description)}</div>
            <div className="text-[12px] text-text-3 mt-3">{t('از', 'From')} {(s.priceFrom || 0).toLocaleString('en-US')} {t('تومان', 'Toman')}+</div>
            <a href="#request" className="mt-3 inline-block text-[12.5px] text-primary hover:underline">{t('درخواست پروژه', 'Request project')} →</a>
          </GlassCard>
        ))}
      </div>

      {/* portfolio strip */}
      <div className="mb-10">
        <h3 className="text-[15px] font-[700] mb-3 px-1">نمونه‌کارهای منتخب</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {cms.freelancing.portfolio.map(p=>(
            <GlassCard key={p.id} className="!p-4 text-[13px]">
              <div className="font-[600] mb-1">{p.title}</div>
              <a href={p.url||'#'} className="text-[11.5px] text-primary hover:underline">مشاهده →</a>
            </GlassCard>
          ))}
          <GlassCard className="!p-4 text-[13px] opacity-80">
            <div className="font-[600] mb-1">+ ۸۴ پروژه دیگر</div>
            <div className="text-[11.5px] text-text-3">در GitHub</div>
          </GlassCard>
        </div>
      </div>

      {/* request form */}
      <div id="request" className="max-w-3xl mx-auto">
        <GlassCard className="!p-5 md:!p-7">
          <h2 className="text-[18px] font-[800] mb-1">درخواست پروژه</h2>
          <p className="text-text-2 text-[12.5px] mb-4">فرم را پر کنید — کمتر از ۱۲ ساعت پاسخ می‌دهم</p>
          {sent ? (
            <div className="text-center py-8">
              <Check size={32} className="mx-auto text-emerald mb-3" />
              <div className="font-[700]">درخواست شما ثبت شد!</div>
              <div className="text-[12.5px] text-text-2 mt-1">به‌زودی ایمیل می‌زنم</div>
            </div>
          ) : (
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 text-[13.5px]">
            <input required placeholder="نام" className="glass-input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input required type="email" placeholder="ایمیل" dir="ltr" className="glass-input" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            <select className="glass-input sm:col-span-2" value={form.budget} onChange={e=>setForm({...form, budget:e.target.value})}>
              <option value="">{t('بودجه تقریبی…', 'Estimated budget…')}</option>
              <option>&lt; 50,000,000 تومان</option>
              <option>50,000,000 – 150,000,000 تومان</option>
              <option>150,000,000 – 400,000,000 تومان</option>
              <option>400,000,000+ تومان</option>
            </select>
            <textarea required placeholder="توضیح پروژه…" rows={4} className="glass-input sm:col-span-2 resize-none"
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
