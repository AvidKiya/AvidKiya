'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { ScrollText, KeyRound, AlertTriangle, Info } from 'lucide-react';

interface License {
  id: string;
  code: string;
  plan: string;
  status: string;
  createdAt: string;
}

interface LogEntry {
  id: string;
  type: 'info' | 'license' | 'warning';
  message: string;
  time: string;
}

export default function KiyaAdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kiya_jwt');
    if (!token) { setLoading(false); return; }
    fetch('/api/planner/admin/licenses', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const licenseLogs: LogEntry[] = (d.data as License[]).map((l) => ({
            id: l.id,
            type: 'license',
            message: `لایسنس ${l.code} (پلن ${l.plan}) ساخته شد`,
            time: l.createdAt,
          }));
          setLogs(licenseLogs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-[20px] font-[800] flex items-center gap-2"><ScrollText size={18} className="text-amber" /> لاگ‌های سیستم</h1>
      <p className="text-text-3 text-[12.5px]">
        در حالت فعلی (بدون دیتابیس D1 متصل)، لاگ‌ها از رویدادهای واقعی حافظه‌ی موقت (مثل ساخت لایسنس) ساخته می‌شوند.
        پس از اتصال D1 (طبق راهنمای Deploy)، این بخش لاگ‌های کامل ورود، خطا و API را نمایش می‌دهد.
      </p>

      <GlassCard className="!p-5">
        {loading ? (
          <div className="text-text-3 text-[13px] py-8 text-center">در حال بارگذاری…</div>
        ) : logs.length === 0 ? (
          <div className="text-text-3 text-[13px] py-8 text-center flex flex-col items-center gap-2">
            <Info size={20} className="text-text-3" />
            هنوز رویدادی ثبت نشده است.
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((l) => (
              <div key={l.id} className="flex items-start gap-2.5 text-[12.5px] py-2 border-b border-glass-border/60 last:border-0">
                <KeyRound size={13} className="text-amber mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div>{l.message}</div>
                  <div className="text-text-3 text-[11px]">{new Date(l.time).toLocaleString('fa-IR')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <GlassCard className="!p-4 flex items-start gap-2.5">
        <AlertTriangle size={15} className="text-amber shrink-0 mt-0.5" />
        <p className="text-[12px] text-text-2">
          توجه: چون این پروژه فعلاً از حافظه موقت (in-memory) به‌جای دیتابیس واقعی استفاده می‌کند، لاگ‌ها با هر ری‌استارت سرور پاک می‌شوند. برای لاگ دائمی، اتصال Cloudflare D1 طبق فایل ۱۹-DEPLOYMENT.md لازم است.
        </p>
      </GlassCard>
    </div>
  );
}
