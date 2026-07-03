"use client";
import { useCms } from "@/contexts/CmsContext";
import { useState } from "react";
export default function ShopPage(){
  const { cms, resolve } = useCms();
  const [cat,setCat] = useState("all");
  const products = cms.shop.products.filter(p=> cat==="all" || p.category===cat);
  return (
    <div>
      <h1 className="text-3xl font-black mb-2">{resolve(cms.shop.title)}</h1>
      <div className="flex flex-wrap gap-2 my-5">
        <button onClick={()=>setCat("all")} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${cat==="all"?"bg-primary text-white border-primary":"border-border"}`}>All</button>
        {cms.shop.categories.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${cat===c?"bg-primary text-white border-primary":"border-border"}`}>{c}</button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map(p=>{
          const price = p.priceUSD ?? p.priceEUR ?? p.priceIRR ?? 0;
          const currency = p.priceUSD ? "USD" : p.priceEUR ? "EUR" : "IRR";
          const discounted = p.discountPercent ? Math.round(price * (1 - p.discountPercent/100)) : price;
          return (
            <div key={p.id} className="glass rounded-2xl p-5 relative overflow-hidden">
              {p.featured && <span className="absolute top-3 end-3 text-[10px] px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">⭐ FEATURED</span>}
              {p.soldOut && <span className="absolute top-3 start-3 text-[10px] px-2 py-1 bg-danger/20 text-danger rounded-full">SOLD OUT</span>}
              {p.discountPercent ? <span className="absolute top-10 end-3 text-[10px] px-2 py-1 bg-success/20 text-success rounded-full">-{p.discountPercent}% OFF</span> : null}
              <div className="h-28 bg-bg-soft rounded-xl mb-3 flex items-center justify-center text-text-faint text-xs">image</div>
              <div className="font-black">{resolve(p.title)}</div>
              <div className="text-xs text-text-muted mt-1">{resolve(p.description)}</div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  {p.discountPercent ? <span className="text-[11px] line-through text-text-faint me-2">{price} {currency}</span> : null}
                  <span className="font-black text-primary">{discounted} {currency}</span>
                </div>
                <a href={p.buyUrl || `mailto:avid@kiya.dev?subject=Buy ${resolve(p.title)}`} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${p.soldOut ? "bg-bg-soft text-text-faint pointer-events-none" : "bg-primary text-white"}`}>Buy</a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
