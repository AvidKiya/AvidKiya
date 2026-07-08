'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { Check } from 'lucide-react';
import { useCms } from '@/lib/cms/cms-context';

const formatToman = (value: number) => `${Math.round(value).toLocaleString('en-US')} Toman`;

export default function PricingPage() {
  const { cms, tf, t } = useCms();
  const [isYearly, setIsYearly] = useState(false);
  const plans = cms.planner.plans;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black mb-2">{t('قیمت‌گذاری KIYA', 'KIYA Pricing')}</h1>
        <p className="text-text-2 mb-6">{t('پلن‌ها از پنل مدیریت قابل تنظیم هستند و مبلغ‌ها با تومان نمایش داده می‌شوند.', 'Plans are editable from the admin panel and prices are shown in Toman.')}</p>
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm ${!isYearly ? 'text-text-1 font-bold' : 'text-text-3'}`}>{t('ماهانه', 'Monthly')}</span>
          <button onClick={() => setIsYearly(!isYearly)} className={`relative w-14 h-7 rounded-full transition-colors ${isYearly ? 'bg-primary' : 'bg-text-3'}`} aria-label="Toggle billing period">
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isYearly ? 'left-8' : 'left-1'}`} />
          </button>
          <span className={`text-sm ${isYearly ? 'text-text-1 font-bold' : 'text-text-3'}`}>{t('سالانه', 'Yearly')}<span className="text-primary text-xs ms-1">{t('تخفیف', 'save')}</span></span>
        </div>
      </div>

      {plans.length === 0 ? (
        <GlassCard className="max-w-2xl mx-auto text-center !p-8">
          <h2 className="text-xl font-bold mb-2">{t('هنوز پلنی ساخته نشده است.', 'No pricing plans yet.')}</h2>
          <p className="text-text-2 mb-5 text-[13.5px]">{t('از پنل مدیریت بخش KIYA Planner / Plans پلن‌های تومان را اضافه کنید.', 'Add Toman-based plans from KIYA Planner / Plans in the admin panel.')}</p>
          <Link href="/planner/admin/plans" className="glass-btn-primary inline-block px-5 py-2.5 text-[13px]">{t('مدیریت پلن‌ها', 'Manage plans')}</Link>
        </GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;
            const isFree = price === 0;
            return (
              <GlassCard key={plan.id} className={plan.highlighted ? 'ring-2 ring-primary/40 scale-[1.02]' : ''}>
                {plan.highlighted && <div className="text-center text-xs font-bold text-primary mb-2 bg-primary/10 py-1 rounded">{t('محبوب‌ترین', 'Most popular')}</div>}
                <div className="text-lg font-bold mb-1">{tf(plan.name)}</div>
                <div className="text-3xl font-black mb-1">
                  {isFree ? t('رایگان', 'Free') : formatToman(price)}
                  {!isFree && <span className="text-sm text-text-3 font-normal">/{isYearly ? t('سال', 'year') : t('ماه', 'month')}</span>}
                </div>
                {!isFree && isYearly && <div className="text-xs text-primary mb-4">{t('معادل', 'Equivalent')} {formatToman(Math.round(price / 12))}/{t('ماه', 'month')}</div>}
                {isFree && <div className="mb-4" />}
                <ul className="text-sm space-y-2 text-text-2 mb-5">
                  {plan.features.map((f, i) => <li key={i} className="flex items-center gap-1.5"><Check size={14} className="text-emerald shrink-0" /> {tf(f)}</li>)}
                </ul>
                <Link href="/planner/login" className={`${plan.highlighted ? 'glass-btn-primary' : 'glass-btn'} block text-center w-full py-3`}>{tf(plan.cta) || (isFree ? t('شروع رایگان', 'Start free') : t('خرید اشتراک', 'Subscribe'))}</Link>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
