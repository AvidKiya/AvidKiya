'use client';
import { useEffect, useState } from 'react';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard, GlassButton } from '@/components/ui/glass';
import Link from 'next/link';

export default function AdminPanelPage() {
  const { cms, updateCms, editMode, setEditMode, exportJson, importJson, syncStatus, t } = useCms();
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
      <div className="max-w-md mx-auto px-4 py-28">
        <GlassCard className="text-center py-10">
          <div className="text-3xl mb-3">🔐</div>
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">پنل مدیر — اَوید کیا</h1>
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-3 py-1.5 rounded-full glass-card !p-0 !px-3 !py-1.5 ${syncStatus==='synced'?'text-emerald':syncStatus==='syncing'?'text-amber':'text-rose'}`}>
            {syncStatus==='synced' ? '✅ synced' : syncStatus==='syncing' ? '🔄 syncing' : '⚠️ ' + syncStatus}
          </span>
          <label className="flex items-center gap-2 glass-card !px-3 !py-1.5 cursor-pointer">
            <input type="checkbox" checked={editMode} onChange={e=>setEditMode(e.target.checked)} />
            <span>Edit Mode ✎</span>
          </label>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <GlassCard className="lg:col-span-2">
          <h2 className="font-bold mb-4">هویت</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <label className="text-text-3 text-xs">نام فارسی</label>
              <input className="glass-input !py-2 mt-1"
                value={cms.identity.fullName.fa}
                onChange={e=> updateCms({ identity: { ...cms.identity, fullName: { ...cms.identity.fullName, fa: e.target.value }}})}
              />
            </div>
            <div>
              <label className="text-text-3 text-xs">Name EN</label>
              <input className="glass-input !py-2 mt-1"
                value={cms.identity.fullName.en}
                onChange={e=> updateCms({ identity: { ...cms.identity, fullName: { ...cms.identity.fullName, en: e.target.value }}})}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-text-3 text-xs">عنوان</label>
              <input className="glass-input !py-2 mt-1"
                value={cms.identity.title.fa}
                onChange={e=> updateCms({ identity: { ...cms.identity, title: { ...cms.identity.title, fa: e.target.value, en: cms.identity.title.en }}})}
              />
            </div>
            <div>
              <label className="text-text-3 text-xs">ایمیل</label>
              <input className="glass-input !py-2 mt-1"
                value={cms.identity.email}
                onChange={e=> updateCms({ identity: { ...cms.identity, email: e.target.value }})}
              />
            </div>
            <div>
              <label className="text-text-3 text-xs">GitHub username</label>
              <input className="glass-input !py-2 mt-1"
                value={cms.settings.githubUsername}
                onChange={e=> updateCms({ settings: { ...cms.settings, githubUsername: e.target.value }})}
              />
            </div>
          </div>
          <p className="text-[11px] text-text-3 mt-3">Auto-save هر ۸۰۰ms → localStorage (در Production: Cloudflare KV)</p>
        </GlassCard>

        <GlassCard>
          <h2 className="font-bold mb-3">ابزارها</h2>
          <div className="space-y-2 text-sm">
            <button onClick={exportJson} className="glass-btn w-full text-sm">📤 Export JSON</button>
            <label className="glass-btn w-full text-sm text-center cursor-pointer block">
              📥 Import JSON
              <input type="file" accept="application/json" className="hidden"
                onChange={e=> e.target.files?.[0] && importJson(e.target.files[0])}
              />
            </label>
            <Link href="/" className="glass-btn w-full text-sm text-center block">🏠 مشاهده سایت</Link>
            <button onClick={()=> { sessionStorage.removeItem('ak_admin_ok'); location.href='/'; }} className="glass-btn w-full text-sm text-rose">خروج</button>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-3">
          <h2 className="font-bold mb-3">بخش‌های پنل (۱۸ بخش — فاز ۵ کامل می‌شود)</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[13px] text-text-2">
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
              '➕ مدیریت بلاگ',
              '➕ مدیریت کوپن',
              '➕ مدیریت ایمیل',
              '➕ Lead Magnet',
            ].map(x=><div key={x} className="glass-card !p-3 !py-2">{x}</div>)}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-3">
          <h3 className="font-bold mb-2">Onboarding Checklist ادمین</h3>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
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
            ].map((c,i)=>(
              <label key={c} className="flex items-center gap-2 text-text-2">
                <input type="checkbox" />
                <span>{c}</span>
              </label>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="text-center text-xs text-text-3 mt-10">
        پنل مدیر مخفیانه — مسیر: <code>#kiya/panel</code> — رمز پیش‌فرض: <code>admin</code>
      </div>
    </div>
  );
}
