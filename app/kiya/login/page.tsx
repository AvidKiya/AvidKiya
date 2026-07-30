'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';

export default function AdminLoginPage(){
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const next = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('next') : null;
      router.replace(next || '/kiya/panel');
    } else {
      const data = await res.json().catch(()=>({message:'ورود ناموفق بود'}));
      setError(data.message || 'ورود ناموفق بود');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[72vh] flex items-center justify-center px-4 py-10">
      <GlassCard className="w-full max-w-[440px] !p-7 overflow-hidden">
        <div className="w-14 h-14 rounded-[18px] bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <LockKeyhole size={27} />
        </div>
        <h1 className="text-center text-2xl font-black mb-2">ورود امن مدیر</h1>
        <p className="text-center text-text-3 text-[12.5px] leading-7 mb-5">این مسیر با Cookie امن، امضای HMAC و رمز محیطی محافظت می‌شود.</p>
        <form onSubmit={submit} className="space-y-3">
          <input type="password" autoFocus value={password} onChange={e=>setPassword(e.target.value)} placeholder="رمز اختصاصی مدیر" className="glass-input text-center" />
          {error && <div className="rounded-[14px] bg-rose/10 border border-rose/20 text-rose text-[12px] p-3 text-center">{error}</div>}
          <button disabled={loading || !password} className="glass-btn-primary w-full !py-3 disabled:opacity-50 flex items-center justify-center gap-2">
            <ShieldCheck size={16} /> {loading ? 'در حال بررسی...' : 'ورود به پنل'}
          </button>
        </form>
        <div className="mt-4 text-[11px] text-text-3 leading-6 border-t border-glass-border pt-4">
          برای فعال‌سازی روی Cloudflare مقدار <code>ADMIN_PASSWORD</code> و ترجیحاً <code>ADMIN_SECRET</code> را در Environment Variables تنظیم کن.
        </div>
      </GlassCard>
    </div>
  );
}
