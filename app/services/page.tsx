'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass';

export const metadata = { title: 'خدمات — AvidKiya' };

interface Service {
  id: string;
  title: string;
  description: string;
  priceFrom?: number;
  icon: string;
}

const services: Service[] = [
  {
    id: '1',
    title: 'توسعه وب',
    description: 'طراحی و توسعه وب‌سایت با تکنولوژی‌های مدرن',
    priceFrom: 500,
    icon: '💻',
  },
  {
    id: '2',
    title: 'اپلیکیشن موبایل',
    description: 'توسعه اپلیکیشن iOS و Android',
    priceFrom: 800,
    icon: '📱',
  },
  {
    id: '3',
    title: 'مشاوره فنی',
    description: 'مشاوره و راهنمایی پروژه‌های نرم‌افزاری',
    priceFrom: 100,
    icon: '🎯',
  },
  {
    id: '4',
    title: 'طراحی UI/UX',
    description: 'طراحی رابط کاربری و تجربه کاربری',
    priceFrom: 300,
    icon: '🎨',
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">خدمات</h1>
        <p className="text-text-2">خدمات حرفه‌ای توسعه نرم‌افزار</p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <GlassCard key={service.id}>
            <div className="flex items-start gap-4">
              <span className="text-4xl">{service.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                <p className="text-text-2 mb-4">{service.description}</p>
                {service.priceFrom && (
                  <div className="text-sm text-text-3 mb-4">
                    شروع از <span className="text-primary font-bold">${service.priceFrom}</span>
                  </div>
                )}
                <button
                  onClick={() => setSelectedService(service.id)}
                  className="glass-btn-primary px-4 py-2"
                >
                  درخواست
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Contact Form */}
      {selectedService && (
        <div className="mt-12">
          <GlassCard>
            <h2 className="font-bold text-lg mb-6">درخواست خدمات</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">نام</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">ایمیل</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">بودجه</label>
                <input
                  type="text"
                  placeholder="مثال: ۵۰۰-۱۰۰۰ دلار"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">توضیحات پروژه</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="glass-btn-primary px-6 py-2">
                  ارسال درخواست
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="glass-btn px-6 py-2"
                >
                  انصراف
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}