'use client';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';
import { Send, Save, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function KiyaAdminTelegramPage() {
  const { cms, updateCms } = useCms();
  const tg = cms.planner.telegram;
  const [form, setForm] = useState(tg);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateCms({ planner: { ...cms.planner, telegram: form } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-[20px] font-[800] flex items-center gap-2"><Send size={18} className="text-amber" /> تنظیمات ربات تلگرام</h1>
      <p className="text-text-3 text-[12.5px]">
        منشی تلگرامی KIYA — Webhook در <code className="text-[11px] bg-white/5 px-1.5 py-0.5 rounded">/api/telegram/webhook</code> پیاده‌سازی شده است.
      </p>

      <GlassCard className="!p-5 space-y-4">
        <div>
          <label className="text-[12px] text-text-3 block mb-1">نام کاربری ربات</label>
          <input
            value={form.botUsername}
            onChange={(e) => setForm({ ...form, botUsername: e.target.value })}
            className="glass-input w-full"
            dir="ltr"
          />
        </div>
        <div>
          <label className="text-[12px] text-text-3 block mb-1">پیام خوش‌آمدگویی</label>
          <textarea
            value={form.welcomeMessage}
            onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
            rows={3}
            className="glass-input w-full resize-none"
          />
        </div>
        <label className="flex items-center gap-2 text-[13px] cursor-pointer">
          <input
            type="checkbox"
            checked={form.webhookEnabled}
            onChange={(e) => setForm({ ...form, webhookEnabled: e.target.checked })}
          />
          Webhook فعال است (نیازمند تنظیم TELEGRAM_BOT_TOKEN در Secrets)
        </label>
        <button onClick={save} className="glass-btn-primary !px-4 !py-2 text-[13px] flex items-center gap-1.5">
          {saved ? <Check size={14} /> : <Save size={14} />} {saved ? 'ذخیره شد' : 'ذخیره تنظیمات'}
        </button>
      </GlassCard>

      <GlassCard className="!p-5">
        <h2 className="font-[700] text-[14px] mb-2">راهنمای اتصال</h2>
        <ol className="text-[12.5px] text-text-2 space-y-1.5 list-decimal ps-4">
          <li>در <a href="https://t.me/BotFather" target="_blank" className="text-primary hover:underline inline-flex items-center gap-1">BotFather <ExternalLink size={10} /></a> یک ربات بساز و توکن را بگیر.</li>
          <li>توکن را در Cloudflare Pages به‌عنوان Secret با نام <code className="text-[11px] bg-white/5 px-1 rounded">TELEGRAM_BOT_TOKEN</code> ثبت کن.</li>
          <li>Webhook را با فراخوانی <code className="text-[11px] bg-white/5 px-1 rounded">setWebhook</code> به آدرس <code className="text-[11px] bg-white/5 px-1 rounded">/api/telegram/webhook</code> وصل کن.</li>
        </ol>
      </GlassCard>
    </div>
  );
}
