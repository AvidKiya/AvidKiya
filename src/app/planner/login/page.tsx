'use client';
import { useState } from 'react';
import { GlassCard, GlassButton } from '@/components/ui/glass';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, KeyRound, Sparkles } from 'lucide-react';

export default function PlannerLogin(){
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    const raw = code.trim();
    const isShortcut = raw.toLowerCase()==='admin' || raw.toLowerCase()==='demo';
    // کدهای میانبر تست به فرمت رسمی لایسنس نگاشت می‌شوند تا API واقعی بتواند اعتبارسنجی کند
    const normalized = raw.toLowerCase()==='admin'
      ? 'KIYA-ADMIN-0000-0001'
      : raw.toLowerCase()==='demo'
        ? 'KIYA-DEMO-0001-ABCD'
        : raw.toUpperCase();

    try {
      const res = await fetch('/api/planner/auth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: normalized }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const isAdmin = !!data.data?.user?.isAdmin;
        localStorage.setItem('kiya_license', normalized);
        localStorage.setItem('kiya_license_ok', '1');
        localStorage.setItem('kiya_is_admin', isAdmin ? '1' : '0');
        localStorage.setItem('kiya_jwt', data.data?.token || '');
        router.push(isAdmin ? '/planner/admin' : '/planner/app');
      } else {
        setErr(data.error || 'کد لایسنس معتبر نیست — فرمت: KIYA-XXXX-XXXX-XXXX — یا از کد demo استفاده کن');
      }
    } catch {
      setErr('اتصال برقرار نشد. اینترنتت رو چک کن و دوباره امتحان کن.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[440px] mx-auto px-4 py-14 md:py-24">
      <GlassCard className="!p-7 md:!p-9 text-center">
        <div className="w-14 h-14 rounded-[18px] bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <Brain size={26} />
        </div>
        <h1 className="text-[22px] font-[800] mb-1">ورود به KIYA Planner</h1>
        <p className="text-text-2 text-[13.5px] mb-6">کد لایسنس خود را وارد کنید</p>

        <form onSubmit={submit} className="space-y-4 text-start" dir="ltr">
          <div>
            <label className="text-[12px] text-text-3">License Code</label>
            <div className="relative mt-1">
              <KeyRound size={16} className="absolute left-3 top-[13px] text-text-3" />
              <input
                value={code}
                onChange={e=>setCode(e.target.value)}
                placeholder="KIYA-XXXX-XXXX-XXXX"
                className="glass-input !ps-10 tracking-wider font-mono text-[14px] uppercase"
                autoFocus
              />
            </div>
          </div>
          {err && <div className="text-rose text-[12.5px] bg-rose/8 border border-rose/15 rounded-[12px] px-3 py-[10px]">{err}</div>}
          <GlassButton variant="primary" disabled={loading || code.length < 4} className="w-full !py-[12px] text-[14px] font-[600]">
            {loading ? 'در حال بررسی…' : 'ورود به داشبورد →'}
          </GlassButton>
        </form>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Link href="/api/auth/oauth/google" className="glass-btn !py-[10px] text-[12.5px]">Google</Link>
          <Link href="/api/auth/oauth/github" className="glass-btn !py-[10px] text-[12.5px]">GitHub</Link>
        </div>

        <div className="mt-6 pt-5 border-t border-glass-border text-[12.5px] text-text-2 space-y-2 text-start" dir="rtl">
          <div>• تست: کد <code className="bg-white/[0.06] px-1.5 py-0.5 rounded">demo</code> یا کد مدیریتی <code className="bg-white/[0.06] px-1.5 py-0.5 rounded">admin</code></div>
          <div>• لایسنس ندارید؟ <a href="/pricing" className="text-primary hover:underline">۱۴ روز رایگان شروع کنید</a></div>
          <div>• پشتیبانی تلگرام: <a className="text-primary" href="https://t.me/avidkiya" target="_blank">@avidkiya</a></div>
        </div>
      </GlassCard>

      <div className="text-center text-[11.5px] text-text-3 mt-5 flex items-center justify-center gap-1.5">
        <Sparkles size={13} /> امن — Edge encrypted — Cloudflare
      </div>
    </div>
  );
}
