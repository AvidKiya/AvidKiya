'use client';
import { GlassCard } from '@/components/ui/glass';
export default function Page(){
  const name = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';
  return (
    <GlassCard className="py-12 text-center">
      <h1 className="text-[20px] font-bold mb-2 capitalize">{name}</h1>
      <p className="text-text-2 text-[13px]">ماژول KIYA — در حال تکمیل… فاز ۳</p>
      <p className="text-[11px] text-text-3 mt-3">نسخه کامل: وظایف کانبان، اهداف سلسله‌مراتبی، عادات Heatmap، AI Chat streaming، Finance نمودار، Health tracker…</p>
    </GlassCard>
  );
}
