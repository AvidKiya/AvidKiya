'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { Plus, Copy, Check, Trash2, Download } from 'lucide-react';

interface License {
  id: string;
  code: string;
  plan: string;
  status: string;
  expiresAt?: string;
  isAdmin: boolean;
  name?: string;
  createdAt: string;
}

const PLAN_LABELS: Record<string, string> = { free: 'رایگان', pro: 'Pro', 'pro-ai': 'Pro+AI', team: 'Team' };
const DURATION_OPTIONS = [
  { label: '۳۰ روز', days: 30 },
  { label: '۹۰ روز', days: 90 },
  { label: '۳۶۵ روز', days: 365 },
  { label: 'نامحدود', days: 0 },
];

export default function LicensesAdminPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState('');

  // فرم ساخت
  const [plan, setPlan] = useState('free');
  const [durationDays, setDurationDays] = useState(30);
  const [count, setCount] = useState(1);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [lastCreated, setLastCreated] = useState<License[] | null>(null);

  const token = () => (typeof window !== 'undefined' ? localStorage.getItem('kiya_jwt') : null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/planner/admin/licenses', { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      if (data.success) setLicenses(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createLicense = async () => {
    setCreating(true);
    setLastCreated(null);
    try {
      const expiresAt = durationDays > 0 ? new Date(Date.now() + durationDays * 86400000).toISOString() : undefined;
      const res = await fetch('/api/planner/admin/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ plan, count, name: name || undefined, expiresAt }),
      });
      const data = await res.json();
      if (data.success) {
        setLastCreated(data.data);
        setLicenses((prev) => [...data.data, ...prev]);
        setName('');
      }
    } finally {
      setCreating(false);
    }
  };

  const deleteLicense = async (id: string) => {
    if (!confirm('این لایسنس حذف شود؟')) return;
    const res = await fetch(`/api/planner/admin/licenses?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    });
    const data = await res.json();
    if (data.success) setLicenses((prev) => prev.filter((l) => l.id !== id));
  };

  const copyCode = (l: License) => {
    navigator.clipboard.writeText(l.code);
    setCopiedId(l.id);
    setTimeout(() => setCopiedId(''), 1500);
  };

  const exportCsv = () => {
    const header = 'code,plan,status,name,expiresAt,createdAt\n';
    const rows = licenses
      .map((l) => [l.code, l.plan, l.status, l.name || '', l.expiresAt || '', l.createdAt].join(','))
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kiya-licenses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-[800]">لایسنس‌ها — {licenses.length} عدد</h1>
        <button onClick={exportCsv} disabled={licenses.length === 0} className="glass-btn !py-[7px] !px-3 text-[12px] flex items-center gap-1 disabled:opacity-40">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* فرم ساخت لایسنس */}
      <GlassCard className="!p-5">
        <h2 className="font-[700] mb-3 text-[14px]">ساخت لایسنس جدید</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[13px]">
          <label className="block">
            <div className="text-text-3 text-[11.5px] mb-1">پلن</div>
            <select value={plan} onChange={(e) => setPlan(e.target.value)} className="glass-input !py-[9px]">
              <option value="free">رایگان</option>
              <option value="pro">Pro</option>
              <option value="pro-ai">Pro+AI</option>
              <option value="team">Team</option>
            </select>
          </label>
          <label className="block">
            <div className="text-text-3 text-[11.5px] mb-1">مدت</div>
            <select value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} className="glass-input !py-[9px]">
              {DURATION_OPTIONS.map((o) => <option key={o.days} value={o.days}>{o.label}</option>)}
            </select>
          </label>
          <label className="block">
            <div className="text-text-3 text-[11.5px] mb-1">نام / یادداشت (اختیاری)</div>
            <input value={name} onChange={(e) => setName(e.target.value)} className="glass-input !py-[9px]" placeholder="مثلاً: مشتری ویژه" />
          </label>
          <label className="block">
            <div className="text-text-3 text-[11.5px] mb-1">تعداد (ساخت انبوه)</div>
            <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.max(1, Number(e.target.value)))} className="glass-input !py-[9px]" />
          </label>
        </div>
        <button onClick={createLicense} disabled={creating} className="glass-btn-primary mt-3 !py-[10px] !px-5 text-[13px] flex items-center gap-2 disabled:opacity-50">
          <Plus size={15} /> {creating ? 'در حال ساخت…' : `ساخت ${count > 1 ? `${count} لایسنس` : 'لایسنس'}`}
        </button>

        {lastCreated && (
          <div className="mt-4 space-y-2">
            {lastCreated.map((l) => (
              <div key={l.id} className="flex items-center justify-between bg-emerald/[0.06] border border-emerald/20 rounded-[10px] px-3 py-[9px] text-[12.5px]">
                <span className="font-mono">{l.code}</span>
                <button onClick={() => copyCode(l)} className="text-emerald flex items-center gap-1">
                  {copiedId === l.id ? (<><Check size={13} /> کپی شد</>) : (<><Copy size={13} /> کپی</>)}
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* لیست لایسنس‌ها */}
      <GlassCard className="!p-5">
        <h2 className="font-[700] mb-3 text-[14px]">همه لایسنس‌ها</h2>
        {loading ? (
          <div className="text-text-3 text-[13px] py-6 text-center">در حال بارگذاری…</div>
        ) : licenses.length === 0 ? (
          <div className="text-text-3 text-[13px] py-6 text-center">هنوز لایسنسی ساخته نشده.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-[12.5px]">
              <thead className="text-text-3 text-[11px] uppercase">
                <tr className="border-b border-glass-border">
                  <th className="text-start py-2 px-2">کد</th>
                  <th className="text-start py-2 px-2">پلن</th>
                  <th className="text-start py-2 px-2">نام</th>
                  <th className="text-start py-2 px-2">انقضا</th>
                  <th className="text-start py-2 px-2">وضعیت</th>
                  <th className="text-start py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((l) => (
                  <tr key={l.id} className="border-b border-glass-border/60">
                    <td className="py-[10px] px-2 font-mono text-[11.5px] flex items-center gap-2">
                      {l.code}
                      <button onClick={() => copyCode(l)} className="text-text-3 hover:text-primary">
                        {copiedId === l.id ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                      </button>
                    </td>
                    <td className="px-2">{PLAN_LABELS[l.plan] || l.plan}</td>
                    <td className="px-2 text-text-2">{l.name || '—'}</td>
                    <td className="px-2">{l.expiresAt ? new Date(l.expiresAt).toLocaleDateString('fa-IR') : 'نامحدود'}</td>
                    <td className="px-2"><span className="text-emerald text-[11px]">● {l.status}</span></td>
                    <td className="px-2">
                      <button onClick={() => deleteLicense(l.id)} className="text-rose"><Trash2 size={13} /></button>
                    </td>
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
