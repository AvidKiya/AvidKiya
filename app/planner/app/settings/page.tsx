'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass';

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    name: 'کاربر',
    email: 'user@example.com',
    theme: 'dark',
    language: 'fa',
  });
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteScheduled, setDeleteScheduled] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportData = (format: 'json' | 'csv' | 'markdown') => {
    const ts = new Date().toISOString().slice(0, 10);
    if (format === 'json') {
      downloadFile(`kiya-export-${ts}.json`, JSON.stringify({ user: settings, exportedAt: new Date().toISOString() }, null, 2), 'application/json');
    } else if (format === 'csv') {
      downloadFile(`kiya-export-${ts}.csv`, `field,value\nname,${settings.name}\nemail,${settings.email}\ntheme,${settings.theme}\nlanguage,${settings.language}\n`, 'text/csv');
    } else {
      downloadFile(`kiya-export-${ts}.md`, `# خروجی داده‌های KIYA\n\n- نام: ${settings.name}\n- ایمیل: ${settings.email}\n- تاریخ خروجی: ${ts}\n`, 'text/markdown');
    }
  };

  const requestDelete = () => {
    if (deleteConfirm.trim() !== settings.name.trim()) return;
    localStorage.setItem('kiya_delete_requested_at', new Date().toISOString());
    setDeleteScheduled(true);
    setDeleteOpen(false);
  };

  const cancelDelete = () => {
    localStorage.removeItem('kiya_delete_requested_at');
    setDeleteScheduled(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تنظیمات</h1>
        {saved && (
          <span className="text-green-400 text-sm">ذخیره شد ✓</span>
        )}
      </div>

      {/* Profile */}
      <GlassCard>
        <h2 className="font-bold mb-4">پروفایل</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">نام</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">ایمیل</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </GlassCard>

      {/* Appearance */}
      <GlassCard>
        <h2 className="font-bold mb-4">ظاهر</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">پوسته</label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              <option value="dark">تاریک</option>
              <option value="light">روشن</option>
              <option value="system">سیستم</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">زبان</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              <option value="fa">فارسی</option>
              <option value="en">انگلیسی</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* License Info */}
      <GlassCard>
        <h2 className="font-bold mb-4">لایسنس</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-text-2">کد لایسنس</span>
            <span className="font-mono">KIYA-XXXX-XXXX-XXXX</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-2">پلن</span>
            <span className="text-primary font-bold">Pro</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-2">تاریخ انقضا</span>
            <span>۱۴۰۴/۰۱/۰۱</span>
          </div>
        </div>
      </GlassCard>

      {/* Export Data */}
      <GlassCard>
        <h2 className="font-bold mb-4">خروجی داده‌ها</h2>
        <div className="flex gap-2">
          <button onClick={() => exportData('json')} className="glass-btn px-4 py-2">
            JSON
          </button>
          <button onClick={() => exportData('csv')} className="glass-btn px-4 py-2">
            CSV
          </button>
          <button onClick={() => exportData('markdown')} className="glass-btn px-4 py-2">
            Markdown
          </button>
        </div>
      </GlassCard>

      {/* Integrations */}
      <GlassCard>
        <h2 className="font-bold mb-4">ادغام‌ها</h2>
        <div className="space-y-3 text-sm">
          {[
            { name: 'Google Calendar', desc: 'همگام‌سازی دوطرفه رویدادها', connected: false },
            { name: 'Google Tasks', desc: 'ایمپورت وظایف', connected: false },
            { name: 'Notion', desc: 'ایمپورت یادداشت‌ها', connected: false },
            { name: 'GitHub', desc: 'اتصال Issues', connected: false },
          ].map((it) => (
            <div key={it.name} className="flex items-center justify-between glass-card !p-3">
              <div>
                <div className="font-bold">{it.name}</div>
                <div className="text-text-3 text-xs">{it.desc}</div>
              </div>
              <button className="glass-btn px-3 py-1.5 text-xs">
                {it.connected ? 'قطع اتصال' : 'اتصال'}
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between glass-card !p-3">
            <div>
              <div className="font-bold">Webhook</div>
              <div className="text-text-3 text-xs">ارسال رویدادها به آدرس دلخواه</div>
            </div>
            <button className="glass-btn px-3 py-1.5 text-xs">تنظیم</button>
          </div>
          <div className="flex items-center justify-between glass-card !p-3">
            <div>
              <div className="font-bold">API Key</div>
              <div className="text-text-3 text-xs font-mono">kiya_sk_••••••••••••</div>
            </div>
            <button className="glass-btn px-3 py-1.5 text-xs">ساخت مجدد</button>
          </div>
        </div>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard className="border-red-500/20">
        <h2 className="font-bold mb-4 text-red-400">منطقه خطر</h2>

        {deleteScheduled ? (
          <div className="space-y-3">
            <p className="text-amber text-sm">
              درخواست حذف حساب ثبت شد. تا ۳۰ روز دیگر تمام داده‌هایتان برای همیشه حذف می‌شود.
              در هر لحظه پیش از آن می‌توانید انصراف دهید.
            </p>
            <button onClick={cancelDelete} className="glass-btn px-4 py-2">
              انصراف از حذف حساب
            </button>
          </div>
        ) : deleteOpen ? (
          <div className="space-y-3">
            <p className="text-text-2 text-sm">
              تمام داده‌های شما (وظایف، اهداف، یادداشت‌ها، تاریخچه چت) پس از ۳۰ روز برای همیشه حذف خواهد شد. این عمل غیرقابل بازگشت است.
            </p>
            <p className="text-text-3 text-xs">برای تایید، نام خود («{settings.name}») را دقیقاً تایپ کنید:</p>
            <input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-red-400 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={requestDelete}
                disabled={deleteConfirm.trim() !== settings.name.trim()}
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 disabled:opacity-40"
              >
                تایید نهایی حذف
              </button>
              <button onClick={() => { setDeleteOpen(false); setDeleteConfirm(''); }} className="glass-btn px-4 py-2">
                بیخیال
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-text-2 text-sm mb-4">
              حذف حساب غیرقابل بازگشت است. تمام داده‌های شما پس از ۳۰ روز مهلت، برای همیشه حذف خواهد شد.
            </p>
            <button onClick={() => setDeleteOpen(true)} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30">
              حذف حساب
            </button>
          </>
        )}
      </GlassCard>

      {/* Save Button */}
      <button onClick={handleSave} className="glass-btn-primary w-full py-3">
        ذخیره تنظیمات
      </button>
    </div>
  );
}