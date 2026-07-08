'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass';
import { formatToman, toPersianDigits } from '@/lib/format';
import { CreditCard, Building2, Copy, CheckCircle2, ArrowLeft, Shield, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const amount = Number(searchParams.get('amount')) || 0;

  const [method, setMethod] = useState<'card' | 'gateway' | null>(null);
  const [copied, setCopied] = useState(false);
  const [gatewayLoading, setGatewayLoading] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);

  // تنظیمات کارت — از env خوانده می‌شود
  const CARD_NUMBER = '۶۰۳۷-۹۹۷۰-XXXX-XXXX'; // در production از env بخوانید
  const CARD_HOLDER = 'اَوید کیا';

  function copyCard() {
    navigator.clipboard.writeText(CARD_NUMBER.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleGateway() {
    setGatewayLoading(true);
    // در production اینجا به درگاه پرداخت وصل می‌شه (زرین‌پال، آی‌دی‌پی و ...)
    // window.location.href = `/api/cafe/payment/gateway?code=${code}&amount=${amount}`;
    setTimeout(() => {
      setGatewayLoading(false);
      alert('درگاه پرداخت به‌زودی فعال می‌شود. لطفاً از روش کارت به کارت استفاده کنید.');
    }, 1500);
  }

  if (!code || !amount) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <GlassCard className="!p-8 text-center max-w-xl mx-auto">
          <AlertTriangle size={32} className="mx-auto text-amber mb-4" />
          <h2 className="text-[18px] font-[800] mb-2">اطلاعات سفارش ناقص است</h2>
          <p className="text-[13px] text-text-2 mb-5">لطفاً ابتدا سفارش خود را ثبت کنید.</p>
          <Link href="/cafe/order" className="glass-btn-primary !py-2.5 !px-5 text-[13px]">ثبت سفارش جدید</Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-[24px] md:text-[30px] font-[800] mb-2">پرداخت سفارش</h1>
        <p className="text-[13.5px] text-text-2">روش پرداخت موردنظر خود را انتخاب کنید</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Order Summary */}
        <GlassCard className="!p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] text-text-3 mb-1">کد رهگیری</div>
              <div className="font-mono font-bold text-primary">{code}</div>
            </div>
            <div className="text-left">
              <div className="text-[12px] text-text-3 mb-1">مبلغ قابل پرداخت</div>
              <div className="text-[20px] font-[800] text-primary">{formatToman(amount)}</div>
            </div>
          </div>
        </GlassCard>

        {/* Payment Method Selection */}
        {!method && (
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Card to Card */}
            <button onClick={() => setMethod('card')} className="text-right">
              <GlassCard className="!p-6 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer h-full">
                <div className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-[16px] font-[800] mb-1">کارت به کارت</h3>
                <p className="text-[12.5px] text-text-2 leading-relaxed mb-3">
                  مبلغ را به شماره کارت اعلام‌شده واریز کنید و رسید را ارسال کنید.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-text-3">
                  <Clock size={12} /> تأیید حداکثر ۲ ساعته
                </div>
              </GlassCard>
            </button>

            {/* Payment Gateway */}
            <button onClick={() => setMethod('gateway')} className="text-right">
              <GlassCard className="!p-6 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer h-full">
                <div className="w-12 h-12 rounded-[16px] bg-cyan/10 text-cyan flex items-center justify-center mb-4">
                  <Building2 size={24} />
                </div>
                <h3 className="text-[16px] font-[800] mb-1">درگاه پرداخت</h3>
                <p className="text-[12.5px] text-text-2 leading-relaxed mb-3">
                  پرداخت آنلاین از طریق درگاه بانکی — تأیید آنی.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-text-3">
                  <Shield size={12} /> پرداخت امن SSL
                </div>
              </GlassCard>
            </button>
          </div>
        )}

        {/* Card to Card Flow */}
        {method === 'card' && (
          <GlassCard className="!p-6 md:!p-8">
            <button onClick={() => setMethod(null)} className="flex items-center gap-1.5 text-[12px] text-text-2 hover:text-text mb-5">
              <ArrowLeft size={14} /> تغییر روش پرداخت
            </button>

            <h2 className="text-[18px] font-[800] mb-1">💳 کارت به کارت</h2>
            <p className="text-[12.5px] text-text-2 mb-6">مبلغ <span className="text-primary font-bold">{formatToman(amount)}</span> را به شماره کارت زیر واریز کنید:</p>

            {/* Card Display */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/15 to-cyan/10 p-6 mb-6 text-center">
              <div className="text-[11px] text-text-3 mb-3">شماره کارت</div>
              <div className="text-[24px] md:text-[28px] font-black font-mono tracking-[.15em] text-primary mb-2" dir="ltr">
                {CARD_NUMBER}
              </div>
              <div className="text-[13px] font-medium text-text-2">{CARD_HOLDER}</div>
              <button
                onClick={copyCard}
                className="glass-btn !px-4 !py-2 mt-4 text-[12px] flex items-center gap-2 mx-auto"
              >
                {copied ? <><CheckCircle2 size={14} className="text-emerald" /> کپی شد!</> : <><Copy size={14} /> کپی شماره کارت</>}
              </button>
            </div>

            {/* Important Notes */}
            <div className="rounded-xl bg-amber/10 p-4 mb-6 text-[12px] text-text-2 leading-relaxed space-y-2">
              <div className="font-bold text-amber mb-1">⚠️ نکات مهم:</div>
              <p>• حتماً <strong>کد رهگیری ({code})</strong> را در توضیحات فیش واریزی بنویسید.</p>
              <p>• رسید واریز را در مرحله بعد آپلود کنید.</p>
              <p>• سفارش شما پس از تأیید پرداخت (حداکثر ۲ ساعت) شروع می‌شود.</p>
            </div>

            {/* Upload Receipt */}
            {!receiptUploaded ? (
              <div>
                <label className="block text-[12px] font-medium text-text-2 mb-2">آپلود رسید واریز</label>
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-glass-border bg-white/[0.03] px-4 py-8 text-[13px] text-text-3 hover:border-primary/50 transition-colors">
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={() => setReceiptUploaded(true)} />
                  📎 کلیک کنید یا فایل رسید را اینجا بکشید
                </label>
              </div>
            ) : (
              <div className="rounded-xl bg-emerald/10 p-5 text-center">
                <CheckCircle2 size={28} className="text-emerald mx-auto mb-2" />
                <div className="font-[700] text-[14px] mb-1">رسید با موفقیت آپلود شد!</div>
                <div className="text-[12px] text-text-2">سفارش شما در صف بررسی قرار گرفت. پس از تأیید، پیامک دریافت می‌کنید.</div>
                <Link href={`/cafe/track?code=${code}`} className="glass-btn !py-2.5 !px-5 mt-4 inline-flex items-center gap-2 text-[12.5px]">
                  پیگیری سفارش <ArrowLeft size={13} />
                </Link>
              </div>
            )}
          </GlassCard>
        )}

        {/* Gateway Flow */}
        {method === 'gateway' && (
          <GlassCard className="!p-6 md:!p-8">
            <button onClick={() => setMethod(null)} className="flex items-center gap-1.5 text-[12px] text-text-2 hover:text-text mb-5">
              <ArrowLeft size={14} /> تغییر روش پرداخت
            </button>

            <h2 className="text-[18px] font-[800] mb-1">🏦 درگاه پرداخت آنلاین</h2>
            <p className="text-[12.5px] text-text-2 mb-6">با کلیک روی دکمه زیر به درگاه امن بانکی هدایت می‌شوید.</p>

            <div className="rounded-xl bg-white/[0.04] p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12.5px] text-text-2">مبلغ پرداختی</span>
                <span className="text-[16px] font-[800] text-primary">{formatToman(amount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] text-text-2">شماره سفارش</span>
                <span className="font-mono font-bold text-[13px]">{code}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-text-3 mb-5">
              <Shield size={13} className="text-emerald" />
              پرداخت امن از طریق درگاه شاپرک — SSL رمزنگاری شده
            </div>

            <button
              onClick={handleGateway}
              disabled={gatewayLoading}
              className="glass-btn-primary w-full !py-4 text-[15px] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {gatewayLoading ? (
                <><span className="animate-spin">⏳</span> در حال اتصال به درگاه...</>
              ) : (
                <>🔒 پرداخت {formatToman(amount)}</>
              )}
            </button>

            <div className="text-[11px] text-text-3 text-center mt-4">
              پس از پرداخت موفق، به‌صورت خودکار به سایت بازمی‌گردید.
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <div className="animate-spin text-2xl">⏳</div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
