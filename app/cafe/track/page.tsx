'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass';
import { Search, Package, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const [code, setCode] = useState(initialCode);
  const [searched, setSearched] = useState(!!initialCode);
  const [order, setOrder] = useState<null | { code: string; status: string; service: string; date: string; price: string }>(null);
  const [notFound, setNotFound] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    // در production از API خوانده می‌شود
    // const res = await fetch(`/api/cafe/orders?code=${code}`);
    // شبیه‌سازی:
    setSearched(true);
    setNotFound(true);
    setOrder(null);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-[24px] md:text-[30px] font-[800] mb-2">پیگیری سفارش</h1>
        <p className="text-[13.5px] text-text-2">کد رهگیری سفارش خود را وارد کنید</p>
      </div>

      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3" />
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="کد رهگیری (مثلاً: KIYA-AB12CD)"
                className="glass-input !pr-11 text-[13.5px] font-mono"
                dir="ltr"
              />
            </div>
            <button type="submit" className="glass-btn-primary !px-6 text-[13.5px]">
              پیگیری
            </button>
          </div>
        </form>

        {searched && notFound && (
          <GlassCard className="!p-8 text-center">
            <Package size={40} className="mx-auto text-text-3 mb-4" />
            <h3 className="text-[16px] font-[700] mb-2">سفارشی یافت نشد</h3>
            <p className="text-[13px] text-text-2 mb-5">
              کد رهگیری وارد شده معتبر نیست یا هنوز در سیستم ثبت نشده. لطفاً دوباره بررسی کنید.
            </p>
            <Link href="/cafe/order" className="glass-btn !py-2.5 !px-5 text-[13px] inline-flex items-center gap-2">
              ثبت سفارش جدید <ArrowLeft size={14} />
            </Link>
          </GlassCard>
        )}

        {order && (
          <GlassCard className="!p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary flex items-center justify-center">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div className="font-bold text-[15px]">{order.service}</div>
                <div className="text-[12px] text-text-3 font-mono">{order.code}</div>
              </div>
            </div>
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between"><span className="text-text-2">وضعیت</span><span className="text-primary font-medium">{order.status}</span></div>
              <div className="flex justify-between"><span className="text-text-2">تاریخ ثبت</span><span>{order.date}</span></div>
              <div className="flex justify-between"><span className="text-text-2">مبلغ</span><span className="font-bold">{order.price}</span></div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <div className="animate-spin text-2xl">⏳</div>
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
