'use client';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass';
import { useCms } from '@/lib/cms/cms-context';
import { Check, Sparkles, Zap, Shield, Clock, Brain } from 'lucide-react';
import { SocialProof } from '@/components/social-proof';

function IconBox({children}:{children:React.ReactNode}) {
  return <div className="w-11 h-11 rounded-[14px] bg-primary/10 text-primary flex items-center justify-center mb-3">{children}</div>;
}

export default function PlannerLandingClient(){
  const { t, cms } = useCms();
  const plans = cms.planner.plans;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      {/* Hero */}
      <section className="py-12 md:py-20 text-center">
        <div className="inline-flex items-center gap-2 text-[11px] px-3 py-[6px] rounded-full glass-card mb-4">
          <Sparkles size={13} className="text-amber" />
          <span className="text-text-2">مغز دوم AI — نسخه ۲.1 — جدید</span>
        </div>
        <h1 className="text-[30px] md:text-[46px] font-[800] tracking-[-0.018em] leading-[1.08] mb-4">
          مغز دوم تو،<br />
          <span className="gradient-text">همیشه همراهت</span>
        </h1>
        <p className="text-[15px] md:text-[17px] text-text-2 max-w-[640px] mx-auto leading-relaxed">
          KIYA Planner همه فکرها، وظایف، اهداف و عادت‌هایت را می‌گیرد، 
          با AI سازماندهی می‌کند، و هر روز به تو بینش می‌دهد.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <Link href="/planner/login" className="glass-btn-primary !px-7 !py-[13px] text-[15px] font-[600]">
            شروع رایگان — ۱۴ روز
          </Link>
          <Link href="#features" className="glass-btn !px-6 !py-[13px] text-[14px]">
            دیدن ویژگی‌ها
          </Link>
        </div>
        <div className="text-[11.5px] text-text-3 mt-3">بدون کارت اعتباری • لغو آنی • ۳۰ روز گارانتی</div>
        <div className="mt-3"><SocialProof /></div>

        {/* trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8 mt-8 text-[12px] text-text-3">
          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald"/> ۱,۲۴۰+ کاربر فعال</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald"/> ۴.۹/۵ رضایت</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald"/> آپ‌تایم ۹۹.۹٪</span>
        </div>
      </section>

      {/* problems */}
      <section id="features" className="py-8 md:py-12">
        <h2 className="text-center text-[22px] md:text-[28px] font-[800] mb-8">چرا مغز دوم لازم داری؟</h2>
        <div className="grid md:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
          {[
            {icon:<Brain size={20}/>, t:'همه‌چیز پراکنده است', d:'یادداشت‌ها در ۵ اپ مختلف — گم می‌شوند'},
            {icon:<Clock size={20}/>, t:'ددلاین‌ها یادت می‌رود', d:'بدون سیستم یادآوری هوشمند'},
            {icon:<Zap size={20}/>, t:'انرژی‌ات هدر می‌رود', d:'نمی‌دانی چه زمانی روی چه کاری تمرکز کنی'},
            {icon:<Shield size={20}/>, t:'هدف‌ها گم می‌شوند', d:'سالانه می‌نویسی، ماهانه فراموش'},
            {icon:<Sparkles size={20}/>, t:'بینش نداری', d:'الگوهای رفتاری‌ات را نمی‌بینی'},
            {icon:<Check size={20}/>, t:'عادت‌ها نمی‌چسبند', d:'بدون پیگیری و streak'},
          ].map((c,i)=>(
            <GlassCard key={i} className="!p-5">
              <div className="text-primary mb-2">{c.icon}</div>
              <div className="font-[700] text-[14.5px] mb-1">{c.t}</div>
              <div className="text-[12.5px] text-text-2 leading-relaxed">{c.d}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* features 8 */}
      <section className="py-10 md:py-14">
        <h2 className="text-center text-[22px] md:text-[28px] font-[800] mb-2">۸ قابلیت — یک مغز</h2>
        <p className="text-center text-text-2 text-[14px] mb-8">همه چیزهایی که برای مدیریت زندگی نیاز داری</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            ['Quick Capture','ثبت آنی فکر — AI طبقه‌بندی می‌کند'],
            ['Tasks Kanban','وظایف با اولویت AI'],
            ['Goals Tree','اهداف سالانه → هفتگی'],
            ['Habits Heatmap','عادت‌ها + Streak'],
            ['Knowledge Graph','یادداشت‌ها + گراف'],
            ['Finance','درآمد/هزینه — نمودار'],
            ['Health','خواب، ورزش، انرژی'],
            ['AI Chat','مکالمه + فرمان'],
          ].map(([title,desc])=>(
            <GlassCard key={title} className="!p-4">
              <div className="w-9 h-9 rounded-[11px] bg-primary/10 text-primary flex items-center justify-center mb-[10px]">
                <Sparkles size={16} />
              </div>
              <div className="font-[700] text-[13.5px] mb-1">{title}</div>
              <div className="text-[12px] text-text-2 leading-relaxed">{desc}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* pricing */}
      <section className="py-10 md:py-14" id="pricing">
        <h2 className="text-center text-[24px] md:text-[30px] font-[800] mb-2">قیمت‌گذاری شفاف</h2>
        <p className="text-center text-text-2 text-[13.5px] mb-8">۱۴ روز رایگان — ارتقا هر زمان — لغو آنی</p>
        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {plans.map(pl=>(
            <GlassCard key={pl.id} className={`!p-5 flex flex-col ${pl.highlighted ? 'ring-[1.5px] ring-primary/40 scale-[1.015]' : ''}`}>
              {pl.highlighted && <div className="text-[10.5px] text-primary font-[700] mb-1 flex items-center gap-1"><Sparkles size={12} /> پیشنهاد شده</div>}
              <div className="text-[17px] font-[800] mb-1">{pl.name.fa}</div>
              <div className="text-[28px] font-black mb-1">
                {pl.priceMonthly===0 ? 'رایگان' : `$${pl.priceMonthly}`}
                {pl.priceMonthly>0 && <span className="text-[12px] text-text-3 font-[500]"> /ماه</span>}
              </div>
              {pl.priceYearly>0 && <div className="text-[11px] text-emerald mb-3">سالانه ${pl.priceYearly} — ۲ ماه رایگان</div>}
              <ul className="text-[12.5px] text-text-2 space-y-[7px] mb-5 flex-1">
                {pl.features.map((f,i)=><li key={i} className="flex gap-2"><Check size={14} className="text-emerald mt-[2px] shrink-0" />{f.fa}</li>)}
              </ul>
              <Link href="/planner/login" className={pl.highlighted ? 'glass-btn-primary text-center py-[11px] rounded-[12px] text-[13.5px] font-[600]' : 'glass-btn text-center py-[11px] rounded-[12px] text-[13.5px]'}>
                {pl.cta.fa}
              </Link>
            </GlassCard>
          ))}
        </div>
        <div className="text-center text-[11.5px] text-text-3 mt-5">
          پرداخت امن • فاکتور رسمی • ۳۰ روز گارانتی بازگشت وجه • پشتیبانی تلگرام
        </div>
      </section>

      {/* FAQ / CTA */}
      <section className="py-10 text-center">
        <h3 className="text-[22px] font-[800] mb-3">آماده‌ای مغز دومت رو فعال کنی؟</h3>
        <p className="text-text-2 text-[14px] mb-5">۱۴ روز رایگان — بدون کارت — ۲ دقیقه راه‌اندازی</p>
        <Link href="/planner/login" className="glass-btn-primary px-8 py-[13px] text-[15px] font-[600] rounded-[14px] inline-block">
          ورود با لایسنس / شروع رایگان →
        </Link>
        <div className="mt-6 flex justify-center gap-5 text-[12px] text-text-3">
          <Link href="/planner/compare" className="hover:text-text-2 underline-offset-2 hover:underline">مقایسه با رقبا</Link>
          <Link href="/help" className="hover:text-text-2 underline-offset-2 hover:underline">مرکز راهنما</Link>
          <Link href="/changelog" className="hover:text-text-2 underline-offset-2 hover:underline">تغییرات</Link>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
