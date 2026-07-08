'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass';
import { serviceCategories } from '@/lib/cafe-services';
import { formatToman } from '@/lib/format';
import {
  ArrowLeft, ArrowRight, Clock, Paperclip, X, AlertCircle,
  Sparkles, CheckCircle2, Loader2, FileText, Copy, Send
} from 'lucide-react';
import Link from 'next/link';

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export default function CafeOrderPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [categorySlug, setCategorySlug] = useState(serviceCategories[0]?.slug || '');
  const [serviceSlug, setServiceSlug] = useState(serviceCategories[0]?.items[0]?.slug || '');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [urgent, setUrgent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ trackingCode: string; price: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const category = useMemo(
    () => serviceCategories.find(c => c.slug === categorySlug) ?? serviceCategories[0],
    [categorySlug]
  );
  const service = useMemo(
    () => category.items.find(i => i.slug === serviceSlug) ?? category.items[0],
    [category, serviceSlug]
  );
  const estimatedPrice = Math.round(service.price * quantity * (urgent ? 1.3 : 1));

  function handleCategoryChange(slug: string) {
    setCategorySlug(slug);
    const cat = serviceCategories.find(c => c.slug === slug);
    setServiceSlug(cat?.items[0]?.slug ?? '');
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_BYTES) {
      setError('حجم فایل نباید بیشتر از ۵ مگابایت باشد.');
      e.target.value = '';
      return;
    }
    setError(null);
    setFile(selected);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || fullName.trim().length < 3) { setError('نام و نام‌خانوادگی را کامل وارد کنید.'); return; }
    if (!/^0?9\d{9}$/.test(phone.trim())) { setError('شماره موبایل معتبر نیست (مثال: ۰۹۱۲xxxxxxx).'); return; }
    if (description.trim().length < 10) { setError('توضیحات سفارش را کامل‌تر بنویسید (حداقل ۱۰ حرف).'); return; }

    setSubmitting(true);
    try {
      let attachment: { name: string; mime: string; data: string } | null = null;
      if (file) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const base64 = dataUrl.split(',')[1] ?? '';
        attachment = { name: file.name, mime: file.type || 'application/octet-stream', data: base64 };
      }

      const res = await fetch('/api/cafe/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categorySlug: category.slug,
          serviceSlug: service.slug,
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          description: description.trim(),
          quantity,
          urgent,
          attachment,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'ثبت سفارش با خطا مواجه شد.');
        setSubmitting(false);
        return;
      }

      setSuccess({ trackingCode: json.order.trackingCode, price: json.order.estimatedPrice });
      setStep(3);
    } catch {
      setError('ارتباط با سرور برقرار نشد. دوباره تلاش کنید.');
    } finally {
      setSubmitting(false);
    }
  }

  // Success Screen
  if (success) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <GlassCard className="!p-8 md:!p-12 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald/15 text-emerald flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-[22px] font-[800] mb-3">سفارش شما ثبت شد!</h2>
          <p className="text-[13.5px] text-text-2 leading-relaxed mb-6">
            کد رهگیری‌تون رو یادداشت کنید. با این کد می‌تونید وضعیت سفارش و فایل نهایی رو پیگیری کنید.
          </p>
          <div className="glass-card !p-4 max-w-xs mx-auto flex items-center justify-between mb-4">
            <span className="font-mono text-[18px] font-bold text-primary tracking-wider">{success.trackingCode}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(success.trackingCode); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
              className="glass-btn !p-2"
            >
              {copied ? <CheckCircle2 size={15} className="text-emerald" /> : <Copy size={15} />}
            </button>
          </div>
          <p className="text-[14px] font-medium mb-6">
            مبلغ قابل پرداخت: <span className="text-primary font-bold">{formatToman(success.price)}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/cafe/payment?code=${success.trackingCode}&amount=${success.price}`}
              className="glass-btn-primary !py-3 !px-6 text-[14px] flex items-center gap-2"
            >
              💳 پرداخت آنلاین
            </Link>
            <Link
              href={`/cafe/track?code=${success.trackingCode}`}
              className="glass-btn !py-3 !px-5 text-[13px] flex items-center gap-2"
            >
              پیگیری سفارش <ArrowLeft size={14} />
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <div className="text-center mb-8">
        <span className="glass-card !rounded-full !px-4 !py-2 text-[12px] text-text-2 inline-flex items-center gap-2">
          ثبت سفارش آنلاین
        </span>
        <h1 className="text-[24px] md:text-[30px] font-[800] mt-4">سفارشتو ثبت کن، ما انجامش می‌دیم</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= s ? 'bg-primary text-[#052018]' : 'bg-white/10 text-text-3'
              }`}>{s}</div>
              {s < 2 && <div className={`h-0.5 w-12 sm:w-16 ${step > s ? 'bg-primary' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {step === 1 ? (
          <GlassCard className="!p-6 md:!p-8">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Sparkles size={16} />
              <span className="text-[12px] font-medium">مرحله ۱ از ۲ — انتخاب خدمت</span>
            </div>
            <h2 className="text-[20px] font-[800] mb-6">چه کاری برات انجام بدیم؟</h2>

            <label className="block text-[12px] font-medium text-text-2 mb-2">دسته‌بندی خدمت</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {serviceCategories.map(c => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => handleCategoryChange(c.slug)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-right text-[12.5px] transition-colors ${
                    categorySlug === c.slug
                      ? 'border-primary/60 bg-primary/10 text-text'
                      : 'border-glass-border bg-white/[0.03] text-text-2 hover:text-text'
                  }`}
                >
                  <span>{c.title}</span>
                </button>
              ))}
            </div>

            <label className="block text-[12px] font-medium text-text-2 mb-2">نوع خدمت</label>
            <div className="flex flex-col gap-2">
              {category.items.map(item => (
                <label
                  key={item.slug}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition-colors ${
                    serviceSlug === item.slug
                      ? 'border-primary/60 bg-primary/10'
                      : 'border-glass-border bg-white/[0.03] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input type="radio" name="service" className="mt-1 accent-[#21F1A8]" checked={serviceSlug === item.slug} onChange={() => setServiceSlug(item.slug)} />
                    <div>
                      <p className="text-[13.5px] font-bold">{item.title}</p>
                      <p className="text-[11.5px] text-text-3 mt-1">{item.description}</p>
                      <p className="text-[10.5px] text-text-3 mt-1 flex items-center gap-1"><Clock size={11} />{item.deliveryTime}</p>
                    </div>
                  </div>
                  <span className="text-[12.5px] font-bold text-primary shrink-0">{formatToman(item.price)}</span>
                </label>
              ))}
            </div>

            <button type="button" onClick={() => setStep(2)} className="glass-btn-primary w-full !py-3.5 mt-8 flex items-center justify-center gap-2 text-[14px]">
              ادامه ثبت سفارش <ArrowLeft size={16} />
            </button>
          </GlassCard>
        ) : (
          <form onSubmit={handleSubmit}>
            <GlassCard className="!p-6 md:!p-8">
              <div className="flex items-center justify-between mb-5">
                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1.5 text-[12px] text-text-2 hover:text-text">
                  <ArrowRight size={14} /> تغییر خدمت
                </button>
                <span className="text-[12px] font-medium text-primary">مرحله ۲ از ۲ — اطلاعات سفارش</span>
              </div>

              {/* Selected service badge */}
              <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">☕</div>
                <div>
                  <p className="text-[13.5px] font-bold">{service.title}</p>
                  <p className="text-[11.5px] text-text-3">{category.title}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-text-2 mb-1.5">نام و نام‌خانوادگی</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)} className="glass-input text-[13.5px]" placeholder="مثلاً: علی رضایی" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-text-2 mb-1.5">شماره موبایل</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="numeric" className="glass-input text-[13.5px]" placeholder="09xxxxxxxxx" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-text-2 mb-1.5">ایمیل (اختیاری)</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="glass-input text-[13.5px]" placeholder="example@mail.com" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-text-2 mb-1.5">تعداد</label>
                  <input value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value) || 1))} type="number" min={1} max={500} className="glass-input text-[13.5px]" />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-[12px] font-medium text-text-2 mb-1.5">توضیحات سفارش</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} className="glass-input text-[13.5px] resize-none" placeholder="دقیقاً توضیح بده چه کاری می‌خوای انجام بدیم..." />
              </div>

              <div className="mt-4">
                <label className="block text-[12px] font-medium text-text-2 mb-1.5">پیوست فایل (اختیاری، حداکثر ۵ مگابایت)</label>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-glass-border bg-white/[0.03] px-4 py-3.5 text-[12px] text-text-3 hover:border-primary/50">
                  <span className="flex items-center gap-2"><Paperclip size={15} />{file ? file.name : 'انتخاب فایل (عکس، ورد، PDF و ...)'}</span>
                  {file && <button type="button" onClick={e => { e.preventDefault(); setFile(null); }} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><X size={12} /></button>}
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <label className="mt-4 flex items-center gap-2.5 rounded-xl bg-amber/10 px-4 py-3 text-[12px] font-medium cursor-pointer">
                <input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} className="accent-amber" />
                سفارش فوری (اولویت‌دار) — ۳۰٪ هزینه اضافه
              </label>

              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose/10 px-4 py-3 text-[12px] text-rose">
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-primary/10 px-5 py-4">
                <span className="text-[13px] text-text-2">مبلغ تخمینی سفارش</span>
                <span className="text-[20px] font-[800] text-primary">{formatToman(estimatedPrice)}</span>
              </div>

              <button type="submit" disabled={submitting} className="glass-btn-primary w-full !py-3.5 mt-6 flex items-center justify-center gap-2 text-[14px] disabled:opacity-60">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {submitting ? 'در حال ثبت سفارش...' : 'ثبت نهایی سفارش'}
              </button>
            </GlassCard>
          </form>
        )}
      </div>
    </div>
  );
}
