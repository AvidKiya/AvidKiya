'use client';

import { useState, useEffect, useCallback } from 'react';
import { GlassCard } from './ui/glass';

export function ExitPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0 && !sessionStorage.getItem('exit_popup_shown')) {
      setShow(true);
      sessionStorage.setItem('exit_popup_shown', '1');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  if (!show || submitted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <GlassCard className="max-w-md w-full text-center !p-8">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 left-4 text-text-3 hover:text-text-1 text-xl"
        >
          ×
        </button>

        <div className="text-4xl mb-4">🎁</div>
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
          onClick={() => {
            if (email.includes('@')) {
              setSubmitted(true);
            }
          }}
          className="glass-btn-primary w-full py-3"
        >
          هدیه رو بگیر 🎁
        </button>

        <p className="text-xs text-text-3 mt-3">
          بدون اسپم. فقط محتوای مفید.
        </p>
      </GlassCard>
    </div>
  );
}