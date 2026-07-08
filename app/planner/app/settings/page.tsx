'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: 'کاربر',
    email: 'user@example.com',
    theme: 'dark',
    language: 'fa',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportData = (format: 'json' | 'csv' | 'markdown') => {
    // In production, this would generate and download the file
    alert(`داده‌ها به فرمت ${format} خروجی گرفته شد.`);
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

      {/* Danger Zone */}
      <GlassCard className="border-red-500/20">
        <h2 className="font-bold mb-4 text-red-400">منطقه خطر</h2>
        <p className="text-text-2 text-sm mb-4">
          حذف حساب غیرقابل بازگشت است. تمام داده‌های شما حذف خواهد شد.
        </p>
        <button className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30">
          حذف حساب
        </button>
      </GlassCard>

      {/* Save Button */}
      <button onClick={handleSave} className="glass-btn-primary w-full py-3">
        ذخیره تنظیمات
      </button>
    </div>
  );
}