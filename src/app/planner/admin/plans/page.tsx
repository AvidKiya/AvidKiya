'use client';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';
import { Layers, Star, Trash2, Plus } from 'lucide-react';
import type { Plan } from '@/lib/cms/types';

export default function KiyaAdminPlansPage() {
  const { cms, updateCms, tf } = useCms();
  const plans = cms.planner.plans;

  const setPlans = (next: Plan[]) => {
    updateCms({ planner: { ...cms.planner, plans: next } });
  };

  const addPlan = () => {
    const name = window.prompt('نام پلن (فارسی):');
    if (!name) return;
    const nameEn = window.prompt('نام پلن (انگلیسی):', name) || name;
    const priceMonthly = Number(window.prompt('قیمت ماهانه (دلار):', '0') || 0);
    const priceYearly = Number(window.prompt('قیمت سالانه (دلار):', '0') || 0);
    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      name: { fa: name, en: nameEn },
      priceMonthly,
      priceYearly,
      features: [],
      cta: { fa: 'انتخاب پلن', en: 'Choose plan' },
    };
    setPlans([...plans, newPlan]);
  };

  const removePlan = (id: string) => {
    if (!window.confirm('حذف این پلن؟')) return;
    setPlans(plans.filter((p) => p.id !== id));
  };

  const toggleHighlight = (id: string) => {
    setPlans(plans.map((p) => (p.id === id ? { ...p, highlighted: !p.highlighted } : p)));
  };

  const addFeature = (id: string) => {
    const fa = window.prompt('ویژگی جدید (فارسی):');
    if (!fa) return;
    const en = window.prompt('ویژگی جدید (انگلیسی):', fa) || fa;
    setPlans(plans.map((p) => (p.id === id ? { ...p, features: [...p.features, { fa, en }] } : p)));
  };

  const removeFeature = (id: string, idx: number) => {
    setPlans(plans.map((p) => (p.id === id ? { ...p, features: p.features.filter((_, i) => i !== idx) } : p)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-[800] flex items-center gap-2"><Layers size={18} className="text-amber" /> پلن‌های KIYA Planner</h1>
        <button onClick={addPlan} className="glass-btn-primary !px-3 !py-[7px] text-[12.5px] flex items-center gap-1">
          <Plus size={14} /> پلن جدید
        </button>
      </div>
      <p className="text-text-3 text-[12.5px]">این پلن‌ها مستقیماً در صفحه‌ی لندینگ KIYA (`/planner`) و مقایسه (`/planner/compare`) نمایش داده می‌شوند.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {plans.map((p) => (
          <GlassCard key={p.id} className={`!p-4 relative ${p.highlighted ? 'ring-1 ring-amber/50' : ''}`}>
            <button
              onClick={() => toggleHighlight(p.id)}
              className={`absolute top-3 left-3 ${p.highlighted ? 'text-amber' : 'text-text-3 hover:text-amber'}`}
              title="پلن ویژه/برجسته"
            >
              <Star size={15} fill={p.highlighted ? 'currentColor' : 'none'} />
            </button>
            <div className="font-[800] text-[15px] mb-1">{tf(p.name)}</div>
            <div className="text-[20px] font-[800] mb-1">
              ${p.priceMonthly}<span className="text-[11px] font-[500] text-text-3">/ماه</span>
            </div>
            <div className="text-[11px] text-text-3 mb-3">${p.priceYearly}/سال</div>
            <ul className="space-y-1.5 mb-3 text-[12px]">
              {p.features.map((f, idx) => (
                <li key={idx} className="flex items-center justify-between gap-1 text-text-2">
                  <span>• {tf(f)}</span>
                  <button onClick={() => removeFeature(p.id, idx)} className="text-text-3 hover:text-rose"><Trash2 size={11} /></button>
                </li>
              ))}
            </ul>
            <button onClick={() => addFeature(p.id)} className="glass-btn !w-full !py-[6px] text-[11.5px] flex items-center justify-center gap-1 mb-2">
              <Plus size={12} /> افزودن ویژگی
            </button>
            <button onClick={() => removePlan(p.id)} className="w-full text-rose text-[11.5px] flex items-center justify-center gap-1 py-[6px] hover:bg-rose/10 rounded-lg transition">
              <Trash2 size={12} /> حذف پلن
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
