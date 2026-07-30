'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Send, ShieldCheck, Clock3, MessageSquare } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';
import { AppIcon } from '@/components/ui/icons';
import { useCms } from '@/lib/cms/cms-context';

export default function Page() {
  const { cms, tf, t } = useCms();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', budget: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const channels = [
    { title: t('ایمیل مستقیم', 'Direct email'), value: cms.identity.email, href: `mailto:${cms.identity.email}`, icon: Mail },
    { title: t('تلگرام', 'Telegram'), value: '@avidkiya', href: 'https://t.me/avidkiya', icon: MessageSquare },
    { title: t('موقعیت کاری', 'Work location'), value: tf(cms.identity.location), href: '#', icon: MapPin },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5 md:gap-6 items-start">
        <div className="space-y-4">
          <GlassCard className="!p-6 md:!p-8 overflow-hidden">
            <div className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary flex items-center justify-center mb-5">
              <AppIcon name="contact" size={24} />
            </div>
            <h1 className="text-[28px] md:text-[40px] font-black tracking-[-0.03em] leading-tight mb-4">
              {t('بیایید پروژه را دقیق شروع کنیم', 'Let’s start the project clearly')}
            </h1>
            <p className="text-text-2 text-[14px] leading-8">
              {t('برای طراحی محصول، توسعه وب‌اپ، اتوماسیون AI یا بازطراحی UI پیام بدهید. با توضیح کوتاه نیاز، زمان‌بندی و بودجه، مسیر همکاری سریع‌تر مشخص می‌شود.', 'Send a message for product design, web apps, AI automation or UI redesign. A short brief about needs, timeline and budget makes the collaboration path clear faster.')}
            </p>
            <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3 mt-6">
              <div className="rounded-[16px] bg-white/[0.035] border border-glass-border p-4 flex gap-3">
                <Clock3 className="text-emerald shrink-0" size={20} />
                <div><b className="text-sm">{t('پاسخ سریع', 'Fast reply')}</b><p className="text-xs text-text-3 mt-1">{t('معمولاً کمتر از ۱۲ ساعت', 'Usually under 12 hours')}</p></div>
              </div>
              <div className="rounded-[16px] bg-white/[0.035] border border-glass-border p-4 flex gap-3">
                <ShieldCheck className="text-cyan shrink-0" size={20} />
                <div><b className="text-sm">{t('شروع امن', 'Safe start')}</b><p className="text-xs text-text-3 mt-1">{t('امکان NDA و قرارداد مرحله‌ای', 'NDA and milestone contract available')}</p></div>
              </div>
            </div>
          </GlassCard>

          <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {channels.map(item => {
              const Icon = item.icon;
              return (
                <a key={item.title} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block">
                  <GlassCard className="!p-4 flex items-center gap-3 hover:shadow-glass-lg transition-all">
                    <div className="w-10 h-10 rounded-[13px] bg-primary/10 text-primary flex items-center justify-center"><Icon size={19} /></div>
                    <div className="min-w-0">
                      <div className="text-[12px] text-text-3">{item.title}</div>
                      <div className="text-[13px] font-bold truncate" dir={item.value.includes('@') ? 'ltr' : undefined}>{item.value}</div>
                    </div>
                  </GlassCard>
                </a>
              );
            })}
          </div>
        </div>

        <GlassCard className="!p-5 md:!p-7" id="request">
          <h2 className="text-[20px] font-black mb-1">{t('فرم درخواست پروژه', 'Project request form')}</h2>
          <p className="text-text-3 text-[12.5px] mb-5">{t('اطلاعات فقط برای بررسی پروژه استفاده می‌شود.', 'Information is only used to review your project.')}</p>
          {sent ? (
            <div className="py-14 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald/10 text-emerald mx-auto flex items-center justify-center mb-4"><AppIcon name="check" size={28} /></div>
              <div className="font-bold text-lg">{t('درخواست ثبت شد', 'Request received')}</div>
              <p className="text-text-2 text-sm mt-2">{t('برای پیگیری سریع‌تر می‌توانید از ایمیل یا تلگرام هم پیام بدهید.', 'For faster follow-up, you can also message via email or Telegram.')}</p>
              <button onClick={() => setSent(false)} className="glass-btn mt-5 !py-2 !px-4">{t('ارسال پیام جدید', 'Send another message')}</button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3">
              <input required className="glass-input" placeholder={t('نام و نام خانوادگی', 'Full name')} value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
              <input required type="email" dir="ltr" className="glass-input" placeholder="email@example.com" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
              <select className="glass-input sm:col-span-2" value={form.budget} onChange={e=>setForm({...form, budget:e.target.value})}>
                <option value="">{t('بودجه تقریبی', 'Approximate budget')}</option>
                <option>{t('کمتر از ۱۰۰۰ دلار', 'Under $1,000')}</option>
                <option>$1,000 – $3,000</option>
                <option>$3,000 – $8,000</option>
                <option>$8,000+</option>
              </select>
              <textarea required rows={7} className="glass-input sm:col-span-2 resize-none" placeholder={t('درباره پروژه، هدف، زمان‌بندی و لینک‌های مرتبط بنویسید...', 'Describe the project, goals, timeline and related links...')} value={form.message} onChange={e=>setForm({...form, message:e.target.value})} />
              <button className="glass-btn-primary sm:col-span-2 !py-3 flex items-center justify-center gap-2"><Send size={16} /> {t('ارسال درخواست', 'Send request')}</button>
            </form>
          )}
          <div className="mt-5 pt-4 border-t border-glass-border text-[12px] text-text-3 flex flex-wrap gap-3 justify-between">
            <span>{t('مشاوره اولیه رایگان', 'Free initial consultation')}</span>
            <Link href="/pricing" className="text-primary hover:underline">{t('مشاهده تعرفه‌ها', 'View pricing')}</Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
