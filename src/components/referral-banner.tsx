'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from './ui/glass';
import { Gift, Check } from 'lucide-react';

export function ReferralBanner() {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('kiya_jwt');
    if (!token) return;
    fetch('/api/referrals', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setReferralCode(d.data.referral.code); })
      .catch(() => {});
  }, []);

  const copyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Gift size={22} /></div>
        <div className="flex-1"><h3 className="font-bold">Invite a friend</h3><p className="text-text-2 text-sm">Both users get 7 free Pro reward days.</p></div>
        <button onClick={copyCode} disabled={!referralCode} className="glass-btn px-4 py-2 text-sm font-mono flex items-center gap-1.5 disabled:opacity-50">
          {copied ? (<><Check size={14} className="text-emerald" /> Copied</>) : (referralCode || 'Loading…')}
        </button>
      </div>
    </GlassCard>
  );
}
