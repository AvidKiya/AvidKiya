'use client';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';
import { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, X, Tag, CreditCard, Check, Heart, FileText } from 'lucide-react';
import { AppIcon } from '@/components/ui/icons';
import Link from 'next/link';

type CartItem = { id:string; qty:number };
type InvoicePayload = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ id?: string; name: string; quantity: number; price: number; currency: string }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: 'TMN';
  couponCode?: string;
};

const formatPrice = (amount: number) => `${Math.round(amount).toLocaleString('en-US')} Toman`;

export default function ShopClient(){
  const { cms, t, tf } = useCms();
  const products = cms.shop.products.filter(p=>p.enabled);
  const allLabel = t('همه', 'All');
  const cats = [allLabel, ...cms.shop.categories];
  const [cat, setCat] = useState(allLabel);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState('');
  const [couponOk, setCouponOk] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof cms.coupons[number] | null>(null);
  const [openCart, setOpenCart] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [lastInvoice, setLastInvoice] = useState<InvoicePayload | null>(null);
  const [manualModeMessage, setManualModeMessage] = useState('');

  useEffect(() => { try { const saved = localStorage.getItem('ak_wishlist'); if (saved) setWishlist(JSON.parse(saved)); } catch {} }, []);

  const filtered = useMemo(()=> cat===allLabel ? products : products.filter(p=>p.category===cat), [cat, allLabel, products]);
  const cartItems = cart.map(ci=>{ const p = products.find(x=>x.id===ci.id); return p ? {...p, qty:ci.qty} : null; }).filter(Boolean) as Array<(typeof products[number]) & {qty:number}>;
  const subtotal = cartItems.reduce((s,i)=> s + i.price * i.qty, 0);
  const discount = appliedCoupon ? (appliedCoupon.type === 'percentage' ? Math.round(subtotal * (appliedCoupon.value / 100)) : Math.min(appliedCoupon.value, subtotal)) : 0;
  const tax = Math.round((subtotal-discount)*0.09);
  const total = subtotal - discount + tax;

  const toggleWishlist = (id: string) => setWishlist(prev => { const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]; try { localStorage.setItem('ak_wishlist', JSON.stringify(next)); } catch {} return next; });
  const add = (id:string)=> { setCart(c=>{ const f = c.find(x=>x.id===id); return f ? c.map(x=> x.id===id ? {...x, qty:x.qty+1}:x) : [...c, {id, qty:1}]; }); setOpenCart(true); };
  const dec = (id:string)=> setCart(c=> c.map(x=> x.id===id ? {...x, qty: Math.max(0, x.qty-1)}:x).filter(x=>x.qty>0));

  const applyCoupon = () => {
    setCouponError('');
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    const found = cms.coupons.find(c => c.code === code);
    if (!found) { setCouponError(t('کد تخفیف نامعتبر است', 'Invalid coupon code')); return; }
    if (!found.enabled) { setCouponError(t('این کد تخفیف غیرفعال است', 'This coupon is disabled')); return; }
    if (found.maxUses && found.uses >= found.maxUses) { setCouponError(t('سقف استفاده از این کد پر شده', 'This coupon has reached its usage limit')); return; }
    if (found.expiresAt && new Date(found.expiresAt) < new Date()) { setCouponError(t('این کد تخفیف منقضی شده', 'This coupon has expired')); return; }
    setAppliedCoupon(found); setCouponOk(true);
  };

  const buildInvoicePayload = (orderId: string): InvoicePayload => ({
    orderId,
    customerName: customerName || 'Guest',
    customerEmail,
    items: cartItems.map(it => ({ id: it.id, name: tf(it.title) || 'Product', quantity: it.qty, price: it.price, currency: 'TMN' })),
    subtotal,
    discount,
    tax,
    total,
    currency: 'TMN',
    couponCode: appliedCoupon?.code,
  });

  const checkout = async () => {
    setCheckoutError('');
    setManualModeMessage('');
    if (cartItems.length === 0) return;
    if (!customerEmail.trim()) { setCheckoutError(t('ایمیل برای صدور فاکتور الزامی است.', 'Email is required for invoice issuance.')); return; }
    setCheckingOut(true);
    try {
      const optimisticInvoice = buildInvoicePayload('pending');
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...optimisticInvoice, orderId: undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || json.message || 'Checkout failed');
      const invoice = buildInvoicePayload(json.data.orderId);
      setLastInvoice(invoice);
      try { localStorage.setItem('ak_last_invoice', JSON.stringify(invoice)); } catch {}
      if (json.data.paymentUrl) {
        window.location.href = json.data.paymentUrl;
        return;
      }
      setManualModeMessage(json.data.message || 'Gateway is not configured; order was created in manual mode.');
      setCheckoutDone(true);
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  const downloadInvoice = async () => {
    const payload = lastInvoice || (() => { try { const saved = localStorage.getItem('ak_last_invoice'); return saved ? JSON.parse(saved) as InvoicePayload : null; } catch { return null; } })();
    if (!payload) return;
    const res = await fetch('/api/shop/invoice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const html = await res.text();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${payload.orderId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if(checkoutDone){
    return <div className="max-w-xl mx-auto px-4 py-20 text-center"><GlassCard className="py-12">
      <div className="w-14 h-14 rounded-full bg-emerald/12 text-emerald flex items-center justify-center mx-auto mb-4"><Check size={26}/></div>
      <h1 className="text-[22px] font-[800] mb-2">{t('سفارش ثبت شد', 'Order created')}</h1>
      <p className="text-text-2 text-[13.5px] mb-5">{manualModeMessage || t('پرداخت انجام شد و فاکتور آماده است.', 'Payment is complete and your invoice is ready.')}</p>
      <div className="flex justify-center gap-3"><button onClick={downloadInvoice} className="glass-btn text-[13px] flex items-center gap-2"><FileText size={15}/> {t('دانلود فاکتور', 'Download invoice')}</button><Link href="/shop" onClick={()=>setCheckoutDone(false)} className="glass-btn-primary text-[13px] px-5 py-[10px] rounded-[12px]">{t('بازگشت فروشگاه', 'Back to shop')}</Link></div>
    </GlassCard></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div><h1 className="text-[26px] md:text-[30px] font-[800] tracking-[-0.015em] flex items-center gap-2"><AppIcon name="shop" size={24} className="text-emerald" />{tf(cms.shop.title) || t('فروشگاه', 'Shop')}</h1><p className="text-text-2 text-[13.5px] mt-1">{t('محصولات دیجیتال با قیمت تومان', 'Digital products priced in Toman')}</p></div>
        <button onClick={()=>setOpenCart(!openCart)} className="glass-btn !py-[10px] !px-4 flex items-center gap-2 text-[13.5px] relative"><ShoppingCart size={16} />{t('سبد خرید', 'Cart')}{cart.reduce((s,i)=>s+i.qty,0)>0 && <span className="absolute -top-[7px] -right-[7px] bg-rose text-white text-[10px] min-w-[19px] h-[19px] rounded-full flex items-center justify-center px-1">{cart.reduce((s,i)=>s+i.qty,0)}</span>}</button>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-5">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-[14px] py-[7px] rounded-full text-[12.5px] border transition ${cat===c ? 'bg-primary text-[#052e28] border-primary font-[600] light:text-white' : 'glass-card !px-[14px] !py-[7px] text-text-2 hover:text-text'}`}>{c}</button>)}</div>
          {filtered.length === 0 ? <GlassCard className="text-center text-text-3 py-12">{t('هنوز محصولی اضافه نشده است.', 'No products have been added yet.')}</GlassCard> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">{filtered.map(p=><GlassCard key={p.id} className="!p-4 flex flex-col relative"><button onClick={()=>toggleWishlist(p.id)} aria-label={t('افزودن به علاقه‌مندی‌ها','Add to wishlist')} className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full glass-card !p-0 flex items-center justify-center hover:scale-105 transition"><Heart size={14} className={wishlist.includes(p.id) ? 'text-rose fill-rose' : 'text-text-3'} /></button><div className="h-[120px] rounded-[14px] bg-gradient-to-br from-primary/18 via-cyan/10 to-violet/14 mb-3 flex items-center justify-center"><AppIcon name="layers" size={30} className="text-primary opacity-90" /></div><div className="text-[11px] text-text-3">{p.category} • Toman</div><div className="font-[700] text-[14.5px] mt-1 mb-1">{tf(p.title)}</div><div className="text-[12px] text-text-2 leading-relaxed flex-1 line-clamp-2">{tf(p.description)}</div><div className="flex items-center justify-between mt-3 pt-3 border-t border-glass-border"><div className="font-[800] text-[16px]">{formatPrice(p.price)}</div><button onClick={()=>add(p.id)} className="glass-btn-primary !py-[8px] !px-4 text-[12.5px]">{t('افزودن', 'Add')}</button></div></GlassCard>)}</div>}
        </div>
        <div className="w-[360px] shrink-0 hidden lg:block"><div className="sticky top-[84px]"><GlassCard className="!p-4"><CartContent /></GlassCard></div></div>
      </div>
      {openCart && <div className="lg:hidden fixed inset-0 z-[90] bg-black/45 backdrop-blur-[3px]" onClick={()=>setOpenCart(false)}><div className="absolute bottom-0 inset-x-0 glass-card rounded-t-[22px] !rounded-b-none p-4 max-h-[82vh] overflow-auto" onClick={e=>e.stopPropagation()}><div className="flex justify-between items-center mb-3"><b>{t('سبد خرید','Cart')}</b><button onClick={()=>setOpenCart(false)}><X size={18}/></button></div><CartContent /></div></div>}
    </div>
  );

  function CartContent() {
    return <>
      <div className="font-[700] text-[14px] mb-3 flex items-center justify-between">{t('سبد خرید','Cart')}<span className="text-[11px] text-text-3">{cartItems.reduce((s,i)=>s+i.qty,0)} {t('آیتم','items')}</span></div>
      {cartItems.length===0 ? <div className="text-text-3 text-[12.5px] text-center py-6">{t('سبد خالی است','Your cart is empty')}</div> : <div className="space-y-[9px] max-h-[240px] overflow-auto pe-1">{cartItems.map(it=><div key={it.id} className="flex items-center justify-between text-[12.5px] bg-white/[0.025] rounded-[10px] px-3 py-[9px] border border-glass-border"><div className="truncate flex-1">{tf(it.title)}</div><div className="flex items-center gap-2 ms-2"><button onClick={()=>dec(it.id)} className="w-[22px] h-[22px] rounded-[7px] bg-white/[0.06]">−</button><span className="w-5 text-center tabular-nums">{it.qty}</span><button onClick={()=>add(it.id)} className="w-[22px] h-[22px] rounded-[7px] bg-white/[0.06]">+</button></div></div>)}</div>}
      <div className="mt-3 pt-3 border-t border-glass-border space-y-2"><input value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder={t('نام خریدار', 'Customer name')} className="glass-input !py-[9px] text-[12.5px]"/><input value={customerEmail} onChange={e=>setCustomerEmail(e.target.value)} placeholder={t('ایمیل برای فاکتور', 'Email for invoice')} className="glass-input !py-[9px] text-[12.5px]" dir="ltr" type="email"/></div>
      <div className="mt-3 pt-3 border-t border-glass-border"><div className="flex gap-2"><input value={coupon} onChange={e=>{setCoupon(e.target.value); setCouponError('');}} placeholder={t('کد تخفیف', 'Coupon code')} className="glass-input !py-[9px] text-[12.5px] flex-1" dir="ltr"/><button onClick={applyCoupon} disabled={couponOk} className="glass-btn !py-[9px] !px-3 text-[12px] flex items-center gap-1"><Tag size={13} /> {t('اعمال','Apply')}</button></div>{couponOk && appliedCoupon && <div className="text-emerald text-[11px] mt-1.5 flex items-center gap-1"><Check size={11} /> {t('کوپن اعمال شد','Coupon applied')}</div>}{couponError && <div className="text-rose text-[11px] mt-1.5">{couponError}</div>}</div>
      <div className="mt-3 pt-3 border-t border-glass-border text-[12.5px] space-y-[6px]"><div className="flex justify-between text-text-2"><span>{t('جمع جزء','Subtotal')}</span><span>{formatPrice(subtotal)}</span></div>{discount>0 && <div className="flex justify-between text-emerald"><span>{t('تخفیف','Discount')}</span><span>- {formatPrice(discount)}</span></div>}<div className="flex justify-between text-text-2"><span>{t('مالیات ۹٪','Tax 9%')}</span><span>{formatPrice(tax)}</span></div><div className="flex justify-between font-[800] text-[15px] pt-[6px] border-t border-glass-border"><span>{t('مجموع','Total')}</span><span>{formatPrice(total)}</span></div></div>
      {checkoutError && <div className="text-rose text-[11.5px] mt-2">{checkoutError}</div>}
      <button disabled={cartItems.length===0 || checkingOut} onClick={checkout} className="w-full mt-3 glass-btn-primary !py-[11px] text-[13.5px] font-[600] disabled:opacity-40 flex items-center justify-center gap-2"><CreditCard size={16} /> {checkingOut ? t('در حال اتصال…','Connecting…') : t('پرداخت امن','Secure checkout')}</button>
      <div className="text-[10.5px] text-text-3 text-center mt-2">{t('درگاه زرین‌پال/لینک خارجی از env تنظیم می‌شود • فاکتور HTML/PDF', 'Zarinpal/external gateway is configured by env • HTML/PDF invoice')}</div>
    </>;
  }
}
