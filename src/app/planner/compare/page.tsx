'use client';

import { GlassCard } from '@/components/ui/glass';
import { Check, X } from 'lucide-react';
import { useCms } from '@/lib/cms/cms-context';

interface Feature {
  fa: string;
  en: string;
  kiya: boolean | string;
  notion: boolean | string;
  obsidian: boolean | string;
  clickup: boolean | string;
  todoist: boolean | string;
}

const features: Feature[] = [
  { fa: 'هوش مصنوعی', en: 'AI assistant', kiya: '✓', notion: '✓', obsidian: '✗', clickup: '✓', todoist: '✗' },
  { fa: 'برنامه‌ریزی روزانه', en: 'Daily planning', kiya: '✓', notion: '✓', obsidian: '✓', clickup: '✓', todoist: '✓' },
  { fa: 'ردیابی عادت', en: 'Habit tracking', kiya: '✓', notion: '✗', obsidian: '✓', clickup: '✗', todoist: '✓' },
  { fa: 'مدیریت مالی', en: 'Finance tracking', kiya: '✓', notion: '✗', obsidian: '✓', clickup: '✗', todoist: '✗' },
  { fa: 'ردیابی سلامت', en: 'Health tracking', kiya: '✓', notion: '✗', obsidian: '✗', clickup: '✗', todoist: '✗' },
  { fa: 'پشتیبانی فارسی', en: 'Persian support', kiya: '✓', notion: '✓', obsidian: '✓', clickup: '✗', todoist: '✗' },
  { fa: 'قیمت', en: 'Pricing', kiya: 'Free+', notion: 'Free+', obsidian: 'Free', clickup: 'Free+', todoist: 'Free+' },
  { fa: 'آنلاین/آفلاین', en: 'Online/offline', kiya: 'Both', notion: 'Online', obsidian: 'Offline', clickup: 'Online', todoist: 'Both' },
];

function FeatureCell({ value, highlight = false }: { value: boolean | string; highlight?: boolean }) {
  if (value === '✓') return <Check size={16} className="text-green-400 mx-auto" />;
  if (value === '✗') return <X size={16} className="text-red-400 mx-auto" />;
  return <span className={highlight ? 'text-primary font-bold' : ''}>{value}</span>;
}

export default function ComparePage() {
  const { t, lang } = useCms();
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">{t('مقایسه KIYA با رقبا', 'KIYA competitor comparison')}</h1>
        <p className="text-text-2">{t('بررسی سریع تفاوت‌ها برای انتخاب بهتر.', 'A quick comparison to help users choose confidently.')}</p>
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10"><th className="text-start py-3 px-4">{t('امکانات','Features')}</th><th className="text-center py-3 px-4 text-primary font-bold">KIYA</th><th className="text-center py-3 px-4">Notion</th><th className="text-center py-3 px-4">Obsidian</th><th className="text-center py-3 px-4">ClickUp</th><th className="text-center py-3 px-4">Todoist</th></tr></thead>
            <tbody>
              {features.map((feature) => <tr key={feature.en} className="border-b border-white/5"><td className="py-3 px-4 text-text-2">{lang === 'fa' ? feature.fa : feature.en}</td><td className="text-center py-3 px-4"><FeatureCell value={feature.kiya} highlight /></td><td className="text-center py-3 px-4"><FeatureCell value={feature.notion} /></td><td className="text-center py-3 px-4"><FeatureCell value={feature.obsidian} /></td><td className="text-center py-3 px-4"><FeatureCell value={feature.clickup} /></td><td className="text-center py-3 px-4"><FeatureCell value={feature.todoist} /></td></tr>)}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="text-center mt-12"><GlassCard><h2 className="text-xl font-bold mb-4">{t('آماده شروع هستید؟','Ready to start?')}</h2><p className="text-text-2 mb-6">{t('همین حالا KIYA را امتحان کنید.', 'Try KIYA now.')}</p><a href="/planner" className="glass-btn-primary px-8 py-3">{t('شروع رایگان','Start free')}</a></GlassCard></div>
    </div>
  );
}
