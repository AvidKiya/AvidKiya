'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { GlassCard } from './ui/glass';
import { Gift, X } from 'lucide-react';
import { useCms } from '@/lib/cms/cms-context';

export function ExitPopup() {
  const { cms, updateCms } = useCms();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // در اپ داخلی KIYA Planner (پشت لاگین) و پنل مدیر نمایش داده نشود
  const isAppArea = pathname?.startsWith('/planner/app') || pathname?.startsWith('/planner/admin') || pathname?.startsWith('/kiya/panel');

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (!cms.leadMagnet.exitPopupEnabled || isAppArea) return;
    if (e.clientY <= 0 && !sessionStorage.getItem('exit_popup_shown')) {
      setShow(true);
      sessionStorage.setItem('exit_popup_shown', '1');
    }
  }, [cms.leadMagnet.exitPopupEnabled, isAppArea]);

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  if (!cms.leadMagnet.exitPopupEnabled || isAppArea || !show || submitted) return null;

  const submit = async () => {
    if (!email.includes('@')) return;
    updateCms({
      newsletter: { ...cms.newsletter, subscribers: [...cms.newsletter.subscribers, email] },
      leadMagnet: { ...cms.leadMagnet, stats: { ...cms.leadMagnet.stats, emailsCollected: cms.leadMagnet.stats.emailsCollected + 1, downloads: cms.leadMagnet.stats.downloads + 1 } },
    });
    try {
      await fetch('/api/email/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exit-popup' }),
      });
    } catch {}
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <GlassCard className="max-w-md w-full text-center !p-8">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 left-4 text-text-3 hover:text-text-1"
        >
          <X size={18} />
        </button>

        <div className="flex justify-center mb-4"><Gift size={38} className="text-primary" /></div>
        <h2 className="text-xl font-bold mb-2">صبر کن!</h2>
        <p className="text-text-2 text-sm mb-6">
          یه هدیه رایگان برات داریم — PDF «۱۰ عادت موفقیت» + ۷ روز Pro رایگان
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیلت رو وارد کن"
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-primary focus:outline-none mb-4"
          dir="ltr"
        />

        <button
          onClick={submit}
          className="glass-btn-primary w-full py-3 flex items-center justify-center gap-2"
        >
          <Gift size={16} /> هدیه رو بگیر
        </button>


        <p className="text-xs text-text-3 mt-3">
          بدون اسپم. فقط محتوای مفید.
        </p>
      </GlassCard>
    </div>
  );
}
