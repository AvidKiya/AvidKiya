'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, CreditCard, Search, ShieldCheck, ShoppingCart, Tag, Trash2, X } from 'lucide-react';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';
import { AppIcon } from '@/components/ui/icons';
import type { Product } from '@/lib/cms/types';

type CartItem = { id:string; qty:number };
type SortMode = 'popular' | 'price-asc' | 'price-desc' | 'name';

const currencies: Product['currency'][] = ['USD', 'EUR', 'IRR'];

function formatMoney(amount: number, currency: Product['currency']) {
  if (currency === 'IRR') return `${Math.round(amount).toLocaleString('fa-IR')} تومان`;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export default function ShopClient(){
  const { cms, t, tf } = useCms();
  const products = cms.shop.products.filter(p=>p.enabled);
  const cats = ['همه', ...cms.shop.categories];
  const [cat, setCat] = useState('همه');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortMode>('popular');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState('');
  const [couponOk, setCouponOk] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const filtered = useMemo(()=> {
    const query = q.trim().toLowerCase();
    const base = products.filter(p =>
      (cat==='همه' || p.category===cat) &&
      (!query || `${tf(p.title)} ${tf(p.description)} ${p.category}`.toLowerCase().includes(query))
    );
    return [...base].sort((a,b)=>{
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name') return tf(a.title).localeCompare(tf(b.title));
      return products.findIndex(x=>x.id===a.id) - products.findIndex(x=>x.id===b.id);
    });
  }, [cat, products, q, sort, tf]);

  const cartItems = cart.map(ci=>{
    const p = products.find(x=>x.id===ci.id);
    return p ? {...p, qty:ci.qty} : null;
  }).filter(Boolean) as Array<Product & {qty:number}>;

  const totals = useMemo(() => currencies.map(currency => {
    const subtotal = cartItems.filter(i=>i.currency===currency).reduce((s,i)=> s + i.price * i.qty, 0);
    const discount = couponOk ? Math.round(subtotal*0.15) : 0;
    const tax = Math.round((subtotal-discount)*0.09);
    const total = subtotal - discount + tax;
    return { currency, subtotal, discount, tax, total };
  }).filter(x=>x.subtotal>0), [cartItems, couponOk]);

  const totalQty = cart.reduce((s,i)=>s+i.qty,0);
  const orderCode = useMemo(()=>`AK-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`, []);

  const add = (id:string)=> {
    setCart(c=>{
      const f = c.find(x=>x.id===id);
      if(f) return c.map(x=> x.id===id ? {...x, qty:x.qty+1}:x);
      return [...c, {id, qty:1}];
    });
    setOpenCart(true);
  };
  const dec = (id:string)=> setCart(c=> c.map(x=> x.id===id ? {...x, qty: Math.max(0, x.qty-1)}:x).filter(x=>x.qty>0));
  const remove = (id:string)=> setCart(c=>c.filter(x=>x.id!==id));
  const applyCoupon = ()=> {
    if(!cartItems.length) return;
    if(['WELCOME','AVID15'].includes(coupon.trim().toUpperCase())) setCouponOk(true);
    else alert('کوپن نامعتبر است. کد نمونه: AVID15');
  };

  if(checkoutDone){
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <GlassCard className="py-12 !px-6">
          <div className="w-14 h-14 rounded-full bg-emerald/12 text-emerald flex items-center justify-center mx-auto mb-4"><Check size={26}/></div>
          <h1 className="text-[22px] font-[800] mb-2">سفارش ثبت شد</h1>
          <p className="text-text-2 text-[13.5px] mb-3 leading-7">کد سفارش: <b dir="ltr" className="text-text">{orderCode}</b><br/>در نسخه واقعی، لینک دانلود و فاکتور به ایمیل مشتری ارسال می‌شود.</p>
          <div className="rounded-[14px] bg-white/[0.035] border border-glass-border p-3 text-[12px] text-text-3 mb-5">
            این پرداخت در حالت دمو است؛ اتصال درگاه واقعی در مرحله بعد انجام می‌شود.
          </div>
          <div className="flex justify-center gap-3">
            <button onClick={()=>window.print()} className="glass-btn text-[13px]">چاپ رسید</button>
            <Link href="/shop" onClick={()=>{setCheckoutDone(false); setCart([]); setCouponOk(false);}} className="glass-btn-primary text-[13px] px-5 py-[10px] rounded-[12px]">بازگشت فروشگاه</Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  const CartPanel = ({ mobile=false }: { mobile?: boolean }) => (
    <GlassCard className="!p-4">
      <div className="font-[700] text-[14px] mb-3 flex items-center justify-between">
        سبد خرید
        <span className="text-[11px] text-text-3">{totalQty} آیتم</span>
      </div>
      {cartItems.length===0 ? (
        <div className="text-text-3 text-[12.5px] text-center py-8">
          <ShoppingCart size={24} className="mx-auto mb-2 opacity-50" />
          سبد خالی است
        </div>
      ) : (
        <div className={`${mobile ? '' : 'max-h-[300px] overflow-auto pe-1'} space-y-[9px]`}>
          {cartItems.map(it=>(
            <div key={it.id} className="text-[12.5px] bg-white/[0.025] rounded-[12px] p-3 border border-glass-border">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="font-[600] truncate">{tf(it.title)}</div>
                  <div className="text-[11px] text-text-3 mt-0.5">{formatMoney(it.price, it.currency)}</div>
                </div>
                <button onClick={()=>remove(it.id)} className="text-text-3 hover:text-rose"><Trash2 size={14}/></button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={()=>dec(it.id)} className="w-[25px] h-[25px] rounded-[8px] bg-white/[0.06]">−</button>
                  <span className="w-6 text-center tabular-nums">{it.qty}</span>
                  <button onClick={()=>add(it.id)} className="w-[25px] h-[25px] rounded-[8px] bg-white/[0.06]">+</button>
                </div>
                <b>{formatMoney(it.price * it.qty, it.currency)}</b>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-glass-border">
        <div className="flex gap-2">
          <input
            value={coupon}
            onChange={e=>setCoupon(e.target.value)}
            placeholder="کد تخفیف — AVID15"
            className="glass-input !py-[9px] text-[12.5px] flex-1"
          />
          <button onClick={applyCoupon} disabled={couponOk || !cartItems.length} className="glass-btn !py-[9px] !px-3 text-[12px] flex items-center gap-1 disabled:opacity-40">
            <Tag size={13} /> اعمال
          </button>
        </div>
        {couponOk && <div className="text-emerald text-[11px] mt-1.5">✓ کوپن ۱۵٪ اعمال شد</div>}
      </div>

      <div className="mt-3 pt-3 border-t border-glass-border text-[12.5px] space-y-[7px]">
        {totals.length===0 ? (
          <div className="flex justify-between text-text-2"><span>مجموع</span><span>—</span></div>
        ) : totals.map(row=>(
          <div key={row.currency} className="rounded-[12px] bg-white/[0.025] p-3 space-y-1.5">
            <div className="flex justify-between text-text-2"><span>جمع جزء</span><span>{formatMoney(row.subtotal, row.currency)}</span></div>
            {row.discount>0 && <div className="flex justify-between text-emerald"><span>تخفیف</span><span>- {formatMoney(row.discount, row.currency)}</span></div>}
            <div className="flex justify-between text-text-2"><span>مالیات ۹٪</span><span>{formatMoney(row.tax, row.currency)}</span></div>
            <div className="flex justify-between font-[800] text-[14px] pt-[5px] border-t border-glass-border"><span>مجموع</span><span>{formatMoney(row.total, row.currency)}</span></div>
          </div>
        ))}
      </div>

      <button
        disabled={cartItems.length===0}
        onClick={()=>setCheckoutDone(true)}
        className="w-full mt-3 glass-btn-primary !py-[11px] text-[13.5px] font-[600] disabled:opacity-40 flex items-center justify-center gap-2"
      >
        <CreditCard size={16} /> پرداخت امن دمو
      </button>
      <div className="text-[10.5px] text-text-3 text-center mt-2">تحویل آنی • فایل دیجیتال • فاکتور قابل چاپ</div>
    </GlassCard>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="grid lg:grid-cols-[1fr_320px] gap-4 mb-6 items-stretch">
        <GlassCard className="!p-6 md:!p-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald/10 text-emerald border border-emerald/20 px-3 py-1 text-[11.5px] mb-4">
            <ShieldCheck size={13}/> {t('محصولات دیجیتال آماده استفاده', 'Ready-to-use digital products')}
          </div>
          <h1 className="text-[28px] md:text-[36px] font-[850] tracking-[-0.025em] flex items-center gap-2">
            <AppIcon name="shop" size={28} className="text-emerald" />
            {t('فروشگاه دیجیتال','Digital Shop')}
          </h1>
          <p className="text-text-2 text-[13.5px] md:text-[14px] mt-3 leading-7 max-w-2xl">قالب، ابزار، آموزش و چک‌لیست برای ساخت سریع‌تر محصول و پرتفولیو — با خرید دمو، سبد حرفه‌ای و کوپن تست.</p>
        </GlassCard>
        <GlassCard className="!p-5 flex flex-col justify-center gap-3">
          <button onClick={()=>setOpenCart(!openCart)} className="glass-btn-primary !py-[11px] !px-4 flex items-center justify-center gap-2 text-[13.5px] relative">
            <ShoppingCart size={16} />
            سبد خرید
            {totalQty>0 && <span className="bg-rose text-white text-[10px] min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1">{totalQty}</span>}
          </button>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-text-3">
            <div className="rounded-[12px] bg-white/[0.035] py-2">{products.length} محصول</div>
            <div className="rounded-[12px] bg-white/[0.035] py-2">AVID15</div>
            <div className="rounded-[12px] bg-white/[0.035] py-2">Demo</div>
          </div>
        </GlassCard>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
        <div className="flex flex-wrap gap-2">
          {cats.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              className={`px-[14px] py-[7px] rounded-full text-[12.5px] border transition ${cat===c ? 'bg-primary text-[#052e28] border-primary font-[600]' : 'glass-card !px-[14px] !py-[7px] text-text-2 hover:text-text'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-[260px]">
            <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-text-3" />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="جستجوی محصول…" className="glass-input !py-[9px] text-[13px] w-full pe-9" />
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value as SortMode)} className="glass-input !py-[9px] text-[12.5px] !w-[145px]">
            <option value="popular">پیشنهادی</option>
            <option value="price-asc">ارزان‌تر</option>
            <option value="price-desc">گران‌تر</option>
            <option value="name">نام</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filtered.map((p, index)=>(
              <GlassCard key={p.id} className="!p-4 flex flex-col hover:shadow-glass-lg transition-all">
                <div className="h-[128px] rounded-[16px] bg-gradient-to-br from-primary/18 via-cyan/10 to-emerald/14 mb-3 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.16),transparent_35%)]" />
                  <AppIcon name={index % 2 ? 'layers' : 'sparkles'} size={32} className="text-primary opacity-90 relative" />
                </div>
                <div className="flex items-center justify-between gap-2 text-[11px] text-text-3">
                  <span>{p.category}</span>
                  <span>{p.currency}</span>
                </div>
                <div className="font-[750] text-[15px] mt-1 mb-1 leading-snug">{tf(p.title)}</div>
                <div className="text-[12.5px] text-text-2 leading-relaxed flex-1 line-clamp-3">{tf(p.description)}</div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-glass-border">
                  <div className="font-[850] text-[16px]">{formatMoney(p.price, p.currency)}</div>
                  <button onClick={()=>add(p.id)} className="glass-btn-primary !py-[8px] !px-4 text-[12.5px]">افزودن</button>
                </div>
              </GlassCard>
            ))}
          </div>
          {filtered.length===0 && <GlassCard className="!p-10 text-center text-text-3 text-[13px]">محصولی پیدا نشد</GlassCard>}
        </div>

        <div className="w-[350px] shrink-0 hidden lg:block">
          <div className="sticky top-[84px] space-y-3">
            <CartPanel />
            <GlassCard className="!p-3 text-[11.5px] text-text-3 leading-relaxed">
              • گارانتی ۳۰ روز بازگشت وجه<br/>
              • آپدیت رایگان برای فایل‌های خریداری‌شده<br/>
              • پشتیبانی تلگرام برای نصب و استفاده
            </GlassCard>
          </div>
        </div>
      </div>

      {openCart && (
        <div className="lg:hidden fixed inset-0 z-[90] bg-black/45 backdrop-blur-[3px]" onClick={()=>setOpenCart(false)}>
          <div className="absolute bottom-0 inset-x-0 glass-card rounded-t-[22px] !rounded-b-none p-4 max-h-[84vh] overflow-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <b>سبد خرید</b>
              <button onClick={()=>setOpenCart(false)}><X size={18}/></button>
            </div>
            <CartPanel mobile />
          </div>
        </div>
      )}
    </div>
  );
}
