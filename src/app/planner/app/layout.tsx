'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Brain, LayoutDashboard, CheckSquare, FolderKanban, Target, Repeat, Calendar, BookOpen, Wallet, HeartPulse, MessageSquare, Lightbulb, BarChart3, Settings, LogOut, MessageCircleHeart, ShieldCheck, Upload } from 'lucide-react';
import { OnboardingTour } from '@/components/onboarding-tour';
import { NotificationBell } from '@/components/notification-bell';
import { FeedbackWidget } from '@/components/feedback-widget';

const nav = [
  {href:'/planner/app', icon:LayoutDashboard, labelFa:'داشبورد', labelEn:'Dashboard'},
  {href:'/planner/app/tasks', icon:CheckSquare, labelFa:'وظایف', labelEn:'Tasks'},
  {href:'/planner/app/projects', icon:FolderKanban, labelFa:'پروژه‌ها', labelEn:'Projects'},
  {href:'/planner/app/goals', icon:Target, labelFa:'اهداف', labelEn:'Goals'},
  {href:'/planner/app/habits', icon:Repeat, labelFa:'عادات', labelEn:'Habits'},
  {href:'/planner/app/calendar', icon:Calendar, labelFa:'تقویم', labelEn:'Calendar'},
  {href:'/planner/app/knowledge', icon:BookOpen, labelFa:'دانش', labelEn:'Knowledge'},
  {href:'/planner/app/finance', icon:Wallet, labelFa:'مالی', labelEn:'Finance'},
  {href:'/planner/app/health', icon:HeartPulse, labelFa:'سلامت', labelEn:'Health'},
  {href:'/planner/app/chat', icon:MessageSquare, labelFa:'AI Chat', labelEn:'AI Chat'},
  {href:'/planner/app/insights', icon:Lightbulb, labelFa:'بینش‌ها', labelEn:'Insights'},
  {href:'/planner/app/reports', icon:BarChart3, labelFa:'گزارش‌ها', labelEn:'Reports'},
  {href:'/planner/app/import', icon:Upload, labelFa:'ایمپورت', labelEn:'Import'},
  {href:'/planner/app/feedback', icon:MessageCircleHeart, labelFa:'بازخورد', labelEn:'Feedback'},
  {href:'/planner/app/settings', icon:Settings, labelFa:'تنظیمات', labelEn:'Settings'},
];

export default function PlannerAppLayout({children}:{children:React.ReactNode}){
  const pathname = usePathname();
  const router = useRouter();
  const [ok, setOk] = useState(false);
  useEffect(()=>{
    const v = localStorage.getItem('kiya_license_ok');
    if(!v){ router.replace('/planner/login'); } else setOk(true);
  },[router]);
  if(!ok) return <div className="min-h-[60vh] flex items-center justify-center text-text-3 text-sm">در حال بررسی لایسنس…</div>;
  return (
    <div className="max-w-[1280px] mx-auto px-3 md:px-5 py-4 md:py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-[700]">
          <div className="w-8 h-8 rounded-[10px] bg-primary/12 text-primary flex items-center justify-center"><Brain size={16}/></div>
          <span>KIYA <span className="text-text-3 font-[500] text-[12px]">Planner</span></span>
          <span className="text-[10px] px-2 py-[3px] rounded-full bg-emerald/12 text-emerald ms-2">Pro</span>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="hidden sm:inline text-text-3">license: {typeof window!=='undefined' ? localStorage.getItem('kiya_license')?.slice(0,12)+'…' : ''}</span>
          {typeof window!=='undefined' && localStorage.getItem('kiya_is_admin')==='1' && (
            <Link href="/planner/admin" className="glass-btn !px-3 !py-[7px] text-[12px] flex items-center gap-1 text-amber"><ShieldCheck size={13}/> پنل مدیر KIYA</Link>
          )}
          <NotificationBell />
          <button onClick={()=>{localStorage.removeItem('kiya_license_ok'); router.push('/planner/login')}} className="glass-btn !px-3 !py-[7px] text-[12px] flex items-center gap-1"><LogOut size={13}/> خروج</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-4">
        <aside className="glass-card !p-2 h-fit lg:sticky lg:top-[84px]">
          <nav className="space-y-[4px] text-[13px]">
            {nav.map(n=>{
              const active = pathname === n.href;
              const Icon = n.icon;
              return (
                <Link key={n.href} href={n.href}
                  className={`flex items-center gap-[10px] px-3 py-[9px] rounded-[12px] transition ${
                    active ? 'bg-primary/10 text-primary' : 'text-text-2 hover:bg-white/[0.035] hover:text-text'
                  }`}>
                  <Icon size={16} />
                  <span>{n.labelFa}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <section className="min-w-0">
          {children}
        </section>
      </div>
      <OnboardingTour />
      <FeedbackWidget />
    </div>
  );
}
