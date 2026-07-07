'use client';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';
import { Bot, Save, Check } from 'lucide-react';
import { useState } from 'react';

export default function KiyaAdminAiPage() {
  const { cms, updateCms } = useCms();
  const ai = cms.planner.ai;
  const [form, setForm] = useState(ai);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateCms({ planner: { ...cms.planner, ai: form } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-[20px] font-[800] flex items-center gap-2"><Bot size={18} className="text-amber" /> تنظیمات AI</h1>
      <p className="text-text-3 text-[12.5px]">استراتژی دولایه: لایه ۱ رایگان (Workers AI) برای همه، لایه ۲ پولی (OpenAI/Claude) برای پلن‌های بالاتر.</p>

      <GlassCard className="!p-5 space-y-4">
        <div>
          <label className="text-[12px] text-text-3 block mb-1">ارائه‌دهنده لایه رایگان</label>
          <input
            value={form.freeLayerProvider}
            onChange={(e) => setForm({ ...form, freeLayerProvider: e.target.value })}
            className="glass-input w-full"
          />
        </div>
        <div>
          <label className="text-[12px] text-text-3 block mb-1">ارائه‌دهنده لایه پولی</label>
          <input
            value={form.paidLayerProvider}
            onChange={(e) => setForm({ ...form, paidLayerProvider: e.target.value })}
            className="glass-input w-full"
          />
        </div>
        <div>
          <label className="text-[12px] text-text-3 block mb-1">سقف پیام AI Chat روزانه (پلن رایگان)</label>
          <input
            type="number"
            value={form.freeChatLimitPerDay}
            onChange={(e) => setForm({ ...form, freeChatLimitPerDay: Number(e.target.value) })}
            className="glass-input w-full"
          />
        </div>
        <div>
          <label className="text-[12px] text-text-3 block mb-1">شخصیت سیستم (System Persona)</label>
          <textarea
            value={form.systemPersona}
            onChange={(e) => setForm({ ...form, systemPersona: e.target.value })}
            rows={3}
            className="glass-input w-full resize-none"
          />
        </div>
        <button onClick={save} className="glass-btn-primary !px-4 !py-2 text-[13px] flex items-center gap-1.5">
          {saved ? <Check size={14} /> : <Save size={14} />} {saved ? 'ذخیره شد' : 'ذخیره تنظیمات'}
        </button>
      </GlassCard>
    </div>
  );
}
