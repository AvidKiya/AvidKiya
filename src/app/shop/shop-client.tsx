'use client';
import { useCms } from '@/lib/cms/cms-context';
import { GlassCard } from '@/components/ui/glass';
import { useState, useMemo } from 'react';
import { ShoppingCart, X, Tag, CreditCard, Check, Heart } from 'lucide-react';
import { AppIcon } from '@/components/ui/icons';
import Link from 'next/link';
import { useEffect } from 'react';

type CartItem = { id:string; qty:number };

export default function ShopClient(){
  const { cms, t, tf, lang } = useCms();
  const products = cms.shop.products.filter(p=>p.enabled);
  const cats = ['همه', ...cms.shop.categories];
  const [cat, setCat] = useState('همه');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState('');
  const [couponOk, setCouponOk] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof cms.coupons[number] | null>(null);
  const [openCart, setOpenCart] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ak_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem('ak_wishlist', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const filtered = useMemo(()=> cat==='همه' ? products : products.filter(p=>p.category===cat), [cat, products]);
  const cartItems = cart.map(ci=>{
    const p = products.find(x=>x.id===ci.id);
    return p ? {...p, qty:ci.qty} : null;
  }).filter(Boolean) as any[];

  const subtotal = cartItems.reduce((s,i)=> s + i.price * i.qty, 0);
  const discount = appliedCoupon
    ? (appliedCoupon.type === 'percentage' ? Math.round(subtotal * (appliedCoupon.value / 100)) : Math.min(appliedCoupon.value, subtotal))
    : 0;
  const tax = Math.round((subtotal-discount)*0.09);
  const total = subtotal - discount + tax;

  const add = (id:string)=> {
    setCart(c=>{
      const f = c.find(x=>x.id===id);
      if(f) return c.map(x=> x.id===id ? {...x, qty:x.qty+1}:x);
      return [...c, {id, qty:1}];
    });
    setOpenCart(true);
  };
  const dec = (id:string)=> setCart(c=> c.map(x=> x.id===id ? {...x, qty: Math.max(0, x.qty-1)}:x).filter(x=>x.qty>0));
  const applyCoupon = () => {
    setCouponError('');
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    const found = cms.coupons.find(c => c.code === code);
    if (!found) { setCouponError('کد تخفیف نامعتبر است'); return; }
    if (!found.enabled) { setCouponError('این کد تخفیف غیرفعال است'); return; }
    if (found.maxUses && found.uses >= found.maxUses) { setCouponError('سقف استفاده از این کد پر شده'); return; }
    if (found.expiresAt && new Date(found.expiresAt) < new Date()) { setCouponError('این کد تخفیف منقضی شده'); return; }
    setAppliedCoupon(found);
    setCouponOk(true);
  };

  if(checkoutDone){
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <GlassCard className="py-12">
          <div className="w-14 h-14 rounded-full bg-emerald/12 text-emerald flex items-center justify-center mx-auto mb-4"><Check size={26}/></div>
          <h1 className="text-[22px] font-[800] mb-2">پرداخت موفق بود!</h1>
          <p className="text-text-2 text-[13.5px] mb-5">لینک‌های دانلود به ایمیل شما ارسال شد.<br/>فاکتور PDF هم در دسترس است.</p>
          <div className="flex justify-center gap-3">
            <button className="glass-btn text-[13px]">دانلود فاکتور PDF</button>
            <Link href="/shop" onClick={()=>setCheckoutDone(false)} className="glass-btn-primary text-[13px] px-5 py-[10px] rounded-[12px]">بازگشت فروشگاه</Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-[26px] md:text-[30px] font-[800] tracking-[-0.015em] flex items-center gap-2">
            <AppIcon name="shop" size={24} className="text-emerald" />
            {t('فروشگاه محصولات دیجیتال','Digital Shop')}
          </h1>
          <p className="text-text-2 text-[13.5px] mt-1">قالب • ابزار • آموزش — تحویل آنی • لایسنس مادام‌العمر</p>
        </div>
        <button onClick={()=>setOpenCart(!openCart)} className="glass-btn !py-[10px] !px-4 flex items-center gap-2 text-[13.5px] relative">
          <ShoppingCart size={16} />
          سبد خرید
          {cart.reduce((s,i)=>s+i.qty,0)>0 && (
            <span className="absolute -top-[7px] -right-[7px] bg-rose text-white text-[10px] min-w-[19px] h-[19px] rounded-full flex items-center justify-center px-1">
              {cart.reduce((s,i)=>s+i.qty,0)}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          {/* categories */}
          <div className="flex flex-wrap gap-2 mb-5">
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)}
                className={`px-[14px] py-[7px] rounded-full text-[12.5px] border transition ${
                  cat===c ? 'bg-primary text-[#052e28] border-primary font-[600] light:text-white' : 'glass-card !px-[14px] !py-[7px] text-text-2 hover:text-text'
                }`}>
                {c}
              </button>
            ))}
          </div>

          {/* products grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filtered.map(p=>(
              <GlassCard key={p.id} className="!p-4 flex flex-col relative">
                <button
                  onClick={()=>toggleWishlist(p.id)}
                  aria-label="افزودن به علاقه‌مندی‌ها"
                  className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full glass-card !p-0 flex items-center justify-center hover:scale-105 transition"
                >
                  <Heart size={14} className={wishlist.includes(p.id) ? 'text-rose fill-rose' : 'text-text-3'} />
                </button>
                <div className="h-[120px] rounded-[14px] bg-gradient-to-br from-primary/18 via-cyan/10 to-violet/14 mb-3 flex items-center justify-center">
                  <AppIcon name="layers" size={30} className="text-primary opacity-90" />
                </div>
                <div className="text-[11px] text-text-3">{p.category} • {p.currency}</div>
                <div className="font-[700] text-[14.5px] mt-1 mb-1">{tf(p.title)}</div>
                <div className="text-[12px] text-text-2 leading-relaxed flex-1 line-clamp-2">{tf(p.description)}</div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-glass-border">
                  <div className="font-[800] text-[16px]">
                    {p.currency==='IRR' ? p.price.toLocaleString('fa-IR')+' تومان' : '$'+p.price}
                  </div>
                  <button onClick={()=>add(p.id)} className="glass-btn-primary !py-[8px] !px-4 text-[12.5px]">افزودن</button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* cart sidebar — desktop */}
        <div className={`w-[340px] shrink-0 hidden lg:block ${openCart ? '' : 'opacity-95'}`}>
          <div className="sticky top-[84px] space-y-3">
            <GlassCard className="!p-4">
              <div className="font-[700] text-[14px] mb-3 flex items-center justify-between">
                سبد خرید
                <span className="text-[11px] text-text-3">{cartItems.reduce((s,i)=>s+i.qty,0)} آیتم</span>
              </div>
              {cartItems.length===0 ? (
                <div className="text-text-3 text-[12.5px] text-center py-6">سبد خالی است</div>
              ) : (
                <div className="space-y-[9px] max-h-[300px] overflow-auto pe-1">
                  {cartItems.map(it=>(
                    <div key={it.id} className="flex items-center justify-between text-[12.5px] bg-white/[0.025] rounded-[10px] px-3 py-[9px] border border-glass-border">
                      <div className="truncate flex-1">{tf(it.title)}</div>
                      <div className="flex items-center gap-2 ms-2">
                        <button onClick={()=>dec(it.id)} className="w-[22px] h-[22px] rounded-[7px] bg-white/[0.06]">−</button>
                        <span className="w-5 text-center tabular-nums">{it.qty}</span>
                        <button onClick={()=>add(it.id)} className="w-[22px] h-[22px] rounded-[7px] bg-white/[0.06]">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* coupon */}
              <div className="mt-3 pt-3 border-t border-glass-border">
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={e=>{setCoupon(e.target.value); setCouponError('');}}
                    placeholder="کد تخفیف — WELCOME10"
                    className="glass-input !py-[9px] text-[12.5px] flex-1"
                    dir="ltr"
                  />
                  <button onClick={applyCoupon} disabled={couponOk} className="glass-btn !py-[9px] !px-3 text-[12px] flex items-center gap-1">
                    <Tag size={13} /> اعمال
                  </button>
                </div>
                {couponOk && appliedCoupon && (
                  <div className="text-emerald text-[11px] mt-1.5 flex items-center gap-1">
                    <Check size={11} /> کوپن {appliedCoupon.type==='percentage' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`} اعمال شد
                  </div>
                )}
                {couponError && <div className="text-rose text-[11px] mt-1.5">{couponError}</div>}
              </div>

              {/* totals */}
              <div className="mt-3 pt-3 border-t border-glass-border text-[12.5px] space-y-[6px]">
                <div className="flex justify-between text-text-2"><span>جمع جزء</span><span>${subtotal}</span></div>
                {discount>0 && <div className="flex justify-between text-emerald"><span>تخفیف</span><span>- ${discount}</span></div>}
                <div className="flex justify-between text-text-2"><span>مالیات ۹٪</span><span>${tax}</span></div>
                <div className="flex justify-between font-[800] text-[15px] pt-[6px] border-t border-glass-border"><span>مجموع</span><span>${total}</span></div>
              </div>

              <button
                disabled={cartItems.length===0}
                onClick={()=>setCheckoutDone(true)}
                className="w-full mt-3 glass-btn-primary !py-[11px] text-[13.5px] font-[600] disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <CreditCard size={16} /> پرداخت امن →
              </button>
              <div className="text-[10.5px] text-text-3 text-center mt-2">پرداخت خارجی • تحویل آنی • فاکتور PDF</div>
            </GlassCard>

            <GlassCard className="!p-3 text-[11.5px] text-text-3 leading-relaxed">
              • گارانتی ۳۰ روز بازگشت وجه<br/>
              • آپدیت رایگان مادام‌العمر<br/>
              • پشتیبانی تلگرام
            </GlassCard>
          </div>
        </div>
      </div>

      {/* mobile cart drawer */}
      {openCart && (
        <div className="lg:hidden fixed inset-0 z-[90] bg-black/45 backdrop-blur-[3px]" onClick={()=>setOpenCart(false)}>
          <div className="absolute bottom-0 inset-x-0 glass-card rounded-t-[22px] !rounded-b-none p-4 max-h-[78vh] overflow-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <b>سبد خرید</b>
              <button onClick={()=>setOpenCart(false)}><X size={18}/></button>
            </div>
            {/* duplicate cart content simplified */}
            <div className="text-[12.5px] mb-3">جمع: <b>${total}</b> — {cartItems.reduce((s,i)=>s+i.qty,0)} آیتم</div>
            <button onClick={()=>{setOpenCart(false); setCheckoutDone(true);}} disabled={cartItems.length===0}
              className="w-full glass-btn-primary py-[12px] disabled:opacity-40">پرداخت</button>
          </div>
        </div>
      )}
    </div>
  );
}

