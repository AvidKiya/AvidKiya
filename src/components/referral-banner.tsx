'use client';

import { useState } from 'react';
import { GlassCard } from './ui/glass';
import { Gift, Check } from 'lucide-react';

export function ReferralBanner() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'KIYA-REF-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Gift size={22} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold">دوستت رو دعوت کن</h3>
          <p className="text-text-2 text-sm">
            هر دو نفر ۷ روز Pro رایگان می‌گیرید!
          </p>
        </div>
        <button
          onClick={copyCode}
          className="glass-btn px-4 py-2 text-sm font-mono flex items-center gap-1.5"
        >
          {copied ? (<><Check size={14} className="text-emerald" /> کپی شد</>) : referralCode}
        </button>
      </div>
    </GlassCard>
  );
}
