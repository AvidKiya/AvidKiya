'use client';

import { useState } from 'react';
import { GlassCard } from './ui/glass';

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
        <span className="text-3xl">🎁</span>
        <div className="flex-1">
          <h3 className="font-bold">دوستت رو دعوت کن</h3>
          <p className="text-text-2 text-sm">
            هر دو نفر ۷ روز Pro رایگان می‌گیرید!
          </p>
        </div>
        <button
          onClick={copyCode}
          className="glass-btn px-4 py-2 text-sm font-mono"
        >
          {copied ? '✓ کپی شد' : referralCode}
        </button>
      </div>
    </GlassCard>
  );
}