'use client';
import { useEffect, useState } from 'react';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard, GlassButton } from '@/components/ui/glass';
import Link from 'next/link';
import { Lock, CheckCircle, RefreshCw, AlertTriangle, Upload, Download, Home, LogOut, Settings, PenTool } from 'lucide-react';

export default function AdminPanelPage() {
  const { cms, updateCms, editMode, setEditMode, exportJson, importJson, syncStatus } = useCms();
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('ak_admin_ok') === '1') setAuthed(true);
  }, []);

  const login = () => {
    if (pass === 'admin') {
      sessionStorage.setItem('ak_admin_ok','1');
      setAuthed(true);
      setEditMode(true);
    } else {
      alert('رمز اشتباه است');
    }
  };

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 md:py-28">
        <GlassCard className="text-center py-10">
          <div className="flex justify-center mb-3 text-primary"><Lock size={32} /></div>
          <h1 className="text-xl font-bold mb-4">پنل مدیر — #kiya/panel</h1>
          <input
            type="password"
            placeholder="رمز مدیر"
            value={pass}
            onChange={e=>setPass(e.target.value)}
            className="glass-input mb-4 text-center"
            onKeyDown={e=> e.key==='Enter' && login()}
          />
          <GlassButton variant="primary" onClick={login} className="w-full">ورود</GlassButton>
          <p className="text-xs text-text-3 mt-3">رمز پیش‌فرض: admin</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      <div className="flex items-center justify-between mb-5 md:mb-6 flex-wrap gap-3">
        <h1 className="text-[22px] md:text-[26px] font-[800] tracking-[-0.01em] flex items-center gap-2">
          <Settings size={22} className="text-primary" />
          پنل مدیر — اَوید کیا
        </h1>
        <div className="flex items-center gap-2 text-[12px]">
          <span className={`px-3 py-[7px] rounded-full glass-card !p-0 !px-3 !py-[7px] flex items-center gap-1.5 ${syncStatus==='synced'?'text-emerald':syncStatus==='syncing'?'text-amber':'text-rose'}`}>
            {syncStatus==='synced' ? <><CheckCircle size={13}/> synced</> : syncStatus==='syncing' ? <><RefreshCw size={13} className="animate-spin"/> syncing</> : <><AlertTriangle size={13}/> {syncStatus}</>}
          </span>
          <label className="flex items-center gap-2 glass-card !px-3 !py-[7px] cursor-pointer text-[12px]">
            <input type="checkbox" checked={editMode} onChange={e=>setEditMode(e.target.checked)} />
            <span className="flex items-center gap-1">Edit Mode <PenTool size={12}/></span>
          </label>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-5">
        <GlassCard className="lg:col-span-2 !p-5">
          <h2 className="font-bold mb-4 text-[15px]">هویت برند</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-[13px]">
            <div>
              <label className="text-text-3 text-[11px]">نام فارسی</label>
              <input className="glass-input !py-[10px] mt-1 text-[13px]"
                value={cms.identity.fullName.fa}
                onChange={e=> updateCms({ identity: { ...cms.identity, fullName: { ...cms.identity.fullName, fa: e.target.value }}})}
              />
            </div>
            <div>
              <label className="text-text-3 text-[11px]">Name EN</label>
              <input className="glass-input !py-[10px] mt-1 text-[13px]"
                value={cms.identity.fullName.en}
                onChange={e=> updateCms({ identity: { ...cms.identity, fullName: { ...cms.identity.fullName, en: e.target.value }}})}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-text-3 text-[11px]">عنوان / Title</label>
              <input className="glass-input !py-[10px] mt-1 text-[13px]"
                value={cms.identity.title.fa}
                onChange={e=> updateCms({ identity: { ...cms.identity, title: { ...cms.identity.title, fa: e.target.value, en: cms.identity.title.en }}})}
              />
            </div>
            <div>
              <label className="text-text-3 text-[11px]">ایمیل</label>
              <input className="glass-input !py-[10px] mt-1 text-[13px]"
                value={cms.identity.email}
                onChange={e=> updateCms({ identity: { ...cms.identity, email: e.target.value }})}
              />
            </div>
            <div>
              <label className="text-text-3 text-[11px]">GitHub username</label>
              <input className="glass-input !py-[10px] mt-1 text-[13px]"
                value={cms.settings.githubUsername}
                onChange={e=> updateCms({ settings: { ...cms.settings, githubUsername: e.target.value }})}
              />
            </div>
          </div>
          <p className="text-[11px] text-text-3 mt-3">Auto-save 800ms → localStorage • Production: Cloudflare KV</p>
        </GlassCard>

        <GlassCard className="!p-4">
          <h2 className="font-bold mb-3 text-[14px]">ابزارها</h2>
          <div className="space-y-[9px] text-[13px]">
            <button onClick={exportJson} className="glass-btn w-full text-[13px] !py-[10px] flex items-center justify-center gap-2">
              <Upload size={15} /> Export JSON
            </button>
            <label className="glass-btn w-full text-[13px] !py-[10px] flex items-center justify-center gap-2 cursor-pointer">
              <Download size={15} /> Import JSON
              <input type="file" accept="application/json" className="hidden"
                onChange={e=> e.target.files?.[0] && importJson(e.target.files[0])}
              />
            </label>
            <Link href="/" className="glass-btn w-full text-[13px] !py-[10px] flex items-center justify-center gap-2">
              <Home size={15} /> مشاهده سایت
            </Link>
            <button onClick={()=> { sessionStorage.removeItem('ak_admin_ok'); location.href='/'; }} className="glass-btn w-full text-[13px] !py-[10px] text-rose flex items-center justify-center gap-2">
              <LogOut size={15} /> خروج
            </button>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-3 !p-5">
          <h2 className="font-bold mb-3 text-[14px]">بخش‌های پنل — ۱۸+ ماژول</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[9px] text-[12.5px] text-text-2">
            {[
              '۱. نمای کلی — آمار + بازدید',
              '۲. هویت — نام، لوگو، ایمیل',
              '۳. شبکه‌های اجتماعی',
              '۴. صفحه اصلی — Hero, stats',
              '۵. درباره من',
              '۶. پروژه‌ها + GitHub',
              '۷. رزومه',
              '۸. هدیه‌ها',
              '۹. اعلان‌ها',
              '۱۰. نظرات',
              '۱۱. فروشگاه',
              '۱۲. فریلنسرینگ',
              '۱۳. ابزارها',
              '۱۴. KIYA Planner — لایسنس‌ها',
              '۱۵. پیام‌ها',
              '۱۶. رسانه — موزیک + Hero Object',
              '۱۷. تقویم — سخنان + جشن‌ها',
              '۱۸. تنظیمات — رمز + SEO + Analytics',
              '+ مدیریت بلاگ',
              '+ مدیریت کوپن',
              '+ مدیریت ایمیل',
              '+ Lead Magnet',
            ].map(x=><div key={x} className="glass-card !px-3 !py-[9px] text-[12px]">{x}</div>)}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-3 !p-5">
          <h3 className="font-bold mb-3 text-[14px]">Onboarding Checklist ادمین</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[10px] text-[13px]">
            {[
              'لوگو آپلود شد',
              'نام و عنوان تنظیم شد',
              'شبکه‌های اجتماعی اضافه شد',
              'اولین پروژه اضافه شد',
              'رزومه تکمیل شد',
              'اولین محصول اضافه شد',
              'اولین خدمت اضافه شد',
              'اولین مقاله نوشته شد',
              'سخنان بزرگان اضافه شد',
              'رمز مدیر عوض شد',
              'ایمیل تنظیم شد',
              'SEO تنظیم شد',
            ].map((c)=>(
              <label key={c} className="flex items-center gap-2 text-text-2 cursor-pointer">
                <input type="checkbox" className="accent-[#5d7ae6]" />
                <span>{c}</span>
              </label>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="text-center text-[11px] text-text-3 mt-8">
        پنل مدیر مخفیانه — مسیر: <code className="px-1.5 py-0.5 bg-white/[0.05] rounded">#kiya/panel</code> — رمز پیش‌فرض: <code className="px-1.5 py-0.5 bg-white/[0.05] rounded">admin</code>
      </div>
    </div>
  );
}
