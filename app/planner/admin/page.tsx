'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { Users, KeyRound, CircleDollarSign, TrendingUp } from 'lucide-react';

interface License {
  id: string;
  code: string;
  plan: string;
  status: string;
  isAdmin: boolean;
  name?: string;
  createdAt: string;
}

export default function KiyaAdminDashboard() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kiya_jwt');
    if (!token) { setLoading(false); return; }
    fetch('/api/planner/admin/licenses', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.success) setLicenses(d.data || []); })
      .finally(() => setLoading(false));
  }, []);

  const active = licenses.filter((l) => l.status === 'active').length;
  const proCount = licenses.filter((l) => l.plan === 'pro' || l.plan === 'pro-ai').length;

  const stats = [
    { label: 'کل لایسنس‌ها', value: String(licenses.length), icon: KeyRound },
    { label: 'فعال', value: String(active), icon: Users },
    { label: 'Pro / Pro+AI', value: String(proCount), icon: TrendingUp },
    { label: 'درآمد این ماه', value: '$0', icon: CircleDollarSign },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-[20px] font-[800]">داشبورد مدیریت KIYA Planner</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <GlassCard key={s.label} className="!p-4">
              <div className="flex items-center gap-2 text-text-3 text-[11.5px] mb-1"><Icon size={13} /> {s.label}</div>
              <div className="text-[22px] font-[800]">{s.value}</div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="!p-5">
        <h2 className="font-[700] mb-3">لایسنس‌های اخیر</h2>
        {loading ? (
          <div className="text-text-3 text-[13px] py-6 text-center">در حال بارگذاری…</div>
        ) : licenses.length === 0 ? (
          <div className="text-text-3 text-[13px] py-6 text-center">
            هنوز لایسنسی ساخته نشده. از بخش «لایسنس‌ها» اولین لایسنس را بسازید.
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-[12.5px]">
              <thead className="text-text-3 text-[11px] uppercase">
                <tr className="border-b border-glass-border">
                  <th className="text-start py-2 px-2">کد</th>
                  <th className="text-start py-2 px-2">پلن</th>
                  <th className="text-start py-2 px-2">وضعیت</th>
                  <th className="text-start py-2 px-2">تاریخ ساخت</th>
                </tr>
              </thead>
              <tbody>
                {licenses.slice(0, 8).map((l) => (
                  <tr key={l.id} className="border-b border-glass-border/60">
                    <td className="py-[10px] px-2 font-mono text-[11.5px]">{l.code}</td>
                    <td className="px-2">{l.plan}</td>
                    <td className="px-2"><span className="text-emerald text-[11px]">● {l.status}</span></td>
                    <td className="px-2 text-text-3">{new Date(l.createdAt).toLocaleDateString('fa-IR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
