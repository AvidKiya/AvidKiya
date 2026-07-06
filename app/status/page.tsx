'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass';


interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  lastIncident?: string;
}

const initialServices: ServiceStatus[] = [
  { name: 'KIYA Planner', status: 'operational', uptime: 99.98 },
  { name: 'فروشگاه', status: 'operational', uptime: 99.95 },
  { name: 'API', status: 'operational', uptime: 99.99 },
  { name: 'وب‌سایت', status: 'operational', uptime: 99.97 },
];

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  date: string;
  updates: Array<{ time: string; message: string }>;
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'اختلال در سرویس API',
    status: 'resolved',
    date: '۱۴۰۳/۱۰/۱۲',
    updates: [
      { time: '۱۴:۳۰', message: 'مشکل شناسایی شد و در حال بررسی هستیم.' },
      { time: '۱۵:۰۰', message: 'مشکل برطرف شد و سرویس به حالت عادی بازگشت.' },
    ],
  },
];

export default function StatusPage() {
  const [services, setServices] = useState(initialServices);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const overallStatus = services.every((s) => s.status === 'operational')
    ? 'operational'
    : services.some((s) => s.status === 'outage')
    ? 'outage'
    : 'degraded';

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2">وضعیت سرویس‌ها</h1>
        <p className="text-text-2">
          آخرین به‌روزرسانی: {lastRefresh.toLocaleTimeString('fa-IR')}
        </p>
      </div>

      {/* Overall Status */}
      <GlassCard className="mb-8">
        <div className="flex items-center gap-3">
          <div
            className={`w-4 h-4 rounded-full ${
              overallStatus === 'operational'
                ? 'bg-green-500'
                : overallStatus === 'degraded'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
          />
          <span className="font-bold">
            {overallStatus === 'operational'
              ? 'همه سرویس‌ها فعال هستند'
              : overallStatus === 'degraded'
              ? 'برخی سرویس‌ها دچار اختلال هستند'
              : 'سرویس‌ها در دسترس نیستند'}
          </span>
        </div>
      </GlassCard>

      {/* Services */}
      <div className="space-y-4 mb-12">
        {services.map((service) => (
          <GlassCard key={service.name}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    service.status === 'operational'
                      ? 'bg-green-500'
                      : service.status === 'degraded'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="font-bold">{service.name}</span>
              </div>
              <div className="text-sm text-text-2">
                <span className="mr-4">{service.uptime}% uptime</span>
                <span className="text-text-3">
                  {service.status === 'operational'
                    ? 'فعال'
                    : service.status === 'degraded'
                    ? 'اختلال'
                    : 'قطع'}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Incidents */}
      <div>
        <h2 className="text-xl font-bold mb-4">رویدادهای اخیر</h2>
        {mockIncidents.length === 0 ? (
          <GlassCard>
            <p className="text-text-2 text-center">رویداد اخیری ثبت نشده است.</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {mockIncidents.map((incident) => (
              <GlassCard key={incident.id}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{incident.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      incident.status === 'resolved'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {incident.status === 'resolved' ? 'حل شده' : 'در حال بررسی'}
                  </span>
                </div>
                <div className="text-sm text-text-3 mb-3">{incident.date}</div>
                <div className="space-y-2">
                  {incident.updates.map((update, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-text-3">{update.time}</span>
                      <span className="text-text-2">{update.message}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}