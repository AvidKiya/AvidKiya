'use client';
import { GlassCard } from '@/components/ui/glass';
import { Brain, Zap, Target, Repeat, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ReferralBanner } from '@/components/referral-banner';

export default function PlannerDashboard(){
  const [capture, setCapture] = useState('');
  const [items, setItems] = useState<string[]>([]);

  const quickAdd = () => {
    if(!capture.trim()) return;
    setItems([capture, ...items].slice(0,5));
    setCapture('');
  };

  return (
    <div className="space-y-4">
      {/* top stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {l:'وظایف امروز', v:'3 / 5', c:'text-primary'},
          {l:'Streak عادت', v:'12 روز', c:'text-emerald'},
          {l:'هدف فعال', v:'2', c:'text-amber'},
          {l:'انرژی', v:'7.4 / 10', c:'text-violet'},
        ].map(s=>(
          <GlassCard key={s.l} className="!p-4">
            <div className="text-[11.5px] text-text-3">{s.l}</div>
            <div className={`text-[20px] font-[800] ${s.c}`}>{s.v}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Quick Capture */}
        <GlassCard className="lg:col-span-2 !p-4">
          <div className="flex items-center gap-2 text-[13px] font-[700] mb-3">
            <Zap size={15} className="text-amber" /> Quick Capture — ثبت سریع
          </div>
          <div className="flex gap-2">
            <input
              value={capture}
              onChange={e=>setCapture(e.target.value)}
              onKeyDown={e=> e.key==='Enter' && quickAdd()}
              placeholder="هر فکری داری بنویس… AI طبقه‌بندی می‌کند"
              className="glass-input !py-[11px] text-[13.5px] flex-1"
            />
            <button onClick={quickAdd} className="glass-btn-primary !px-4 text-[13px]">ثبت</button>
          </div>
          {items.length>0 && (
            <div className="mt-3 space-y-[7px] text-[12.5px]">
              {items.map((it,i)=>(
                <div key={i} className="flex items-center gap-2 px-3 py-[8px] rounded-[10px] bg-white/[0.03] border border-glass-border">
                  <span className="w-[7px] h-[7px] rounded-full bg-emerald"></span>
                  {it}
                  <span className="ms-auto text-[10.5px] text-text-3">AI → TASK</span>
                </div>
              ))}
            </div>
          )}
          <div className="text-[11px] text-text-3 mt-2">نمونه: «فردا ساعت ۳ جلسه با علی» → AI تشخیص می‌دهد: TASK • فردا ۱۵:۰۰ • یادآوری خودکار</div>
        </GlassCard>

        {/* AI Insight */}
        <GlassCard className="!p-4">
          <div className="flex items-center gap-2 text-[13px] font-[700] mb-2">
            <Brain size={15} className="text-violet" /> بینش امروز
          </div>
          <p className="text-[12.5px] text-text-2 leading-relaxed">
            وقتی صبح‌ها ورزش می‌کنی، انرژی روزانه‌ات به‌طور میانگین <b className="text-emerald">۲.۱ نمره</b> بالاتر است.
            پیشنهاد: جلسه‌های مهم را بعد ورزش تنظیم کن.
          </p>
          <div className="text-[11px] text-text-3 mt-3">AI • بر اساس ۲۸ روز داده</div>
        </GlassCard>
      </div>

      {/* modules grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          {t:'وظایف',h:'/planner/app/tasks',d:'۳ فعال • ۲ تکمیل امروز',p:'68%'},
          {t:'اهداف',h:'/planner/app/goals',d:'۲ هدف فعال',p:'42%'},
          {t:'عادات',h:'/planner/app/habits',d:'Streak 12 روز',p:'80%'},
          {t:'تقویم',h:'/planner/app/calendar',d:'۲ رویداد امروز',p:''},
          {t:'دانش',h:'/planner/app/knowledge',d:'۱۴ یادداشت',p:''},
          {t:'AI Chat',h:'/planner/app/chat',d:'۱۰ پیام رایگان باقی',p:''},
        ].map(m=>(
          <Link key={m.t} href={m.h} className="block group">
            <GlassCard className="!p-4 hover:shadow-glass-lg transition-all">
              <div className="flex items-center justify-between mb-1">
                <div className="font-[600] text-[14px]">{m.t}</div>
                <TrendingUp size={14} className="text-text-3 group-hover:text-primary transition" />
              </div>
              <div className="text-[12px] text-text-2">{m.d}</div>
              {m.p && (
                <div className="mt-3 h-[5px] bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{width:m.p}} />
                </div>
              )}
            </GlassCard>
          </Link>
        ))}
      </div>

      <ReferralBanner />

      <div className="text-[11px] text-text-3 text-center">
        KIYA Planner v2.1 • Pro Plan • تا ۱۴۰۵/۰۸/۰۱ معتبر • <Link href="/planner/settings" className="text-primary hover:underline">مدیریت لایسنس</Link>
      </div>
    </div>
  );
}
