'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { EmptyState } from '@/components/ui/states';

interface License {
  id: string;
  code: string;
  plan: string;
  status: string;
  name?: string;
  createdAt: string;
}

export default function UsersAdminPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kiya_jwt');
    fetch('/api/planner/admin/licenses', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.success) setLicenses(d.data || []); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-[20px] font-[800]">کاربران — {licenses.length} نفر</h1>
      <GlassCard className="!p-5">
        {loading ? (
          <div className="text-text-3 text-[13px] py-6 text-center">در حال بارگذاری…</div>
        ) : licenses.length === 0 ? (
          <EmptyState icon="users" title="هنوز کاربری ندارید" description="با ساخت اولین لایسنس، اولین کاربر شما ثبت می‌شود." />
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-[12.5px]">
              <thead className="text-text-3 text-[11px] uppercase">
                <tr className="border-b border-glass-border">
                  <th className="text-start py-2 px-2">نام</th>
                  <th className="text-start py-2 px-2">لایسنس</th>
                  <th className="text-start py-2 px-2">پلن</th>
                  <th className="text-start py-2 px-2">تاریخ عضویت</th>
                  <th className="text-start py-2 px-2">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((l) => (
                  <tr key={l.id} className="border-b border-glass-border/60">
                    <td className="py-[10px] px-2">{l.name || 'بدون نام'}</td>
                    <td className="px-2 font-mono text-[11.5px]">{l.code}</td>
                    <td className="px-2">{l.plan}</td>
                    <td className="px-2 text-text-3">{new Date(l.createdAt).toLocaleDateString('fa-IR')}</td>
                    <td className="px-2"><span className="text-emerald text-[11px]">● {l.status}</span></td>
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
