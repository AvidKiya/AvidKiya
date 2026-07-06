'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';

const plans = [
  {
    name: 'Free',
    nameEn: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      '۵۰ capture / ماه',
      'AI ۱۰ پیام / روز',
      '۵۰ وظیفه',
      '۵ هدف',
      '۵ عادت',
      'حافظه ۳۰ روزه',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    nameEn: 'Pro',
    priceMonthly: 9.99,
    priceYearly: 99,
    features: [
      'وظایف نامحدود',
      'اهداف نامحدود',
      'عادات نامحدود',
      'Knowledge Graph',
      '۵۰۰ capture / ماه',
      'AI ۵۰ پیام / روز',
      'حافظه ۹۰ روزه',
    ],
    highlighted: true,
  },
  {
    name: 'Pro+AI',
    nameEn: 'Pro+AI',
    priceMonthly: 14.99,
    priceYearly: 149,
    features: [
      'همه امکانات Pro',
      'AI نامحدود',
      'ماژول مالی',
      'ماژول سلامت',
      'پشتیبانی اولویت‌دار',
      'حافظه ۱ ساله',
    ],
    highlighted: false,
  },
  {
    name: 'Team',
    nameEn: 'Team',
    priceMonthly: 29.99,
    priceYearly: 299,
    features: [
      'همه امکانات Pro+AI',
      '۵ کاربر',
      'فضای کاری اشتراکی',
      'تحلیل تیم',
      'پنل مدیریت',
      'دسترسی API',
    ],
    highlighted: false,
  },
];

export const metadata = { title: 'قیمت‌گذاری — KIYA Planner' };

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black mb-2">قیمت‌گذاری KIYA</h1>
        <p className="text-text-2 mb-6">۱۴ روز رایگان — بدون کارت اعتباری — ۳۰ روز گارانتی بازگشت</p>
        
        {/* Monthly/Yearly Toggle */}
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm ${!isYearly ? 'text-text-1 font-bold' : 'text-text-3'}`}>ماهانه</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isYearly ? 'bg-primary' : 'bg-text-3'
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                isYearly ? 'left-8' : 'left-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isYearly ? 'text-text-1 font-bold' : 'text-text-3'}`}>
            سالانه
            <span className="text-primary text-xs mr-1">۲۰٪ تخفیف</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const price = isYearly ? plan.priceYearly : plan.priceMonthly;
          const isFree = price === 0;

          return (
            <GlassCard
              key={plan.nameEn}
              className={plan.highlighted ? 'ring-2 ring-primary/40 scale-[1.02]' : ''}
            >
              {plan.highlighted && (
                <div className="text-center text-xs font-bold text-primary mb-2 bg-primary/10 py-1 rounded">
                  محبوب‌ترین
                </div>
              )}
              <div className="text-lg font-bold mb-1">{plan.name}</div>
              <div className="text-3xl font-black mb-1">
                {isFree ? 'رایگان' : `$${price}`}
                {!isFree && (
                  <span className="text-sm text-text-3 font-normal">
                    /{isYearly ? 'سال' : 'ماه'}
                  </span>
                )}
              </div>
              {!isFree && isYearly && (
                <div className="text-xs text-primary mb-4">
                  معادل ${Math.round(price / 12)}/ماه
                </div>
              )}
              {isFree && <div className="mb-4" />}
              <ul className="text-sm space-y-2 text-text-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <button
                className={
                  plan.highlighted
                    ? 'glass-btn-primary w-full py-3'
                    : 'glass-btn w-full py-3'
                }
              >
                {isFree ? 'شروع رایگان' : 'خرید اشتراک'}
              </button>
            </GlassCard>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">مقایسه امکانات</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-3 px-4">امکانات</th>
                <th className="text-center py-3 px-4">Free</th>
                <th className="text-center py-3 px-4 text-primary">Pro</th>
                <th className="text-center py-3 px-4">Pro+AI</th>
                <th className="text-center py-3 px-4">Team</th>
              </tr>
            </thead>
            <tbody className="text-text-2">
              <tr className="border-b border-white/5">
                <td className="py-3 px-4">وظایف</td>
                <td className="text-center py-3 px-4">۵۰</td>
                <td className="text-center py-3 px-4 text-primary">نامحدود</td>
                <td className="text-center py-3 px-4">نامحدود</td>
                <td className="text-center py-3 px-4">نامحدود</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4">AI پیام / روز</td>
                <td className="text-center py-3 px-4">۱۰</td>
                <td className="text-center py-3 px-4 text-primary">۵۰</td>
                <td className="text-center py-3 px-4">نامحدود</td>
                <td className="text-center py-3 px-4">نامحدود</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4">ماژول مالی</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4 text-primary">—</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4">ماژول سلامت</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4 text-primary">—</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4"> Knowledge Graph</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4 text-primary">✓</td>
                <td className="text-center py-3 px-4">✓</td>
                <td className="text-center py-3 px-4">✓</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4">تیم</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4 text-primary">—</td>
                <td className="text-center py-3 px-4">—</td>
                <td className="text-center py-3 px-4">۵ کاربر</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}