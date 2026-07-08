'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { GlassCard } from '@/components/ui/glass';
import { useCms } from '@/lib/cms/cms-context';
import { ShoppingBag, Wrench, Briefcase } from 'lucide-react';

type Item = { id:string; type:'product'|'tool'|'service'; title:string; desc:string; price?:number; href:string; category:string; enabled:boolean };
const format = (n?:number) => n ? `${n.toLocaleString('en-US')} Toman` : 'Free / Contact';

export default function MarketplacePage(){
  const { cms, tf, t } = useCms();
  const [filter,setFilter]=useState<'all'|'product'|'tool'|'service'>('all');
  const items = useMemo<Item[]>(()=>[
    ...cms.shop.products.map(p=>({id:p.id,type:'product' as const,title:tf(p.title),desc:tf(p.description),price:p.price,href:'/shop',category:p.category,enabled:p.enabled})),
    ...cms.tools.items.map(i=>({id:i.id,type:'tool' as const,title:tf(i.title),desc:tf(i.description),href:i.url,category:i.category,enabled:i.enabled})),
    ...cms.freelancing.services.map(s=>({id:s.id,type:'service' as const,title:tf(s.title),desc:tf(s.description),price:s.priceFrom,href:'/services#request',category:'service',enabled:s.enabled})),
  ].filter(x=>x.enabled && x.title),[cms,tf]);
  const list = filter==='all' ? items : items.filter(i=>i.type===filter);
  const icon = (type:Item['type']) => type==='product'?<ShoppingBag size={18}/>:type==='tool'?<Wrench size={18}/>:<Briefcase size={18}/>;
  return <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12"><div className="text-center mb-8"><h1 className="text-3xl md:text-4xl font-black mb-2">{t('مارکت‌پلیس','Marketplace')}</h1><p className="text-text-2">{t('محصولات، ابزارها و خدمات قابل سفارش در یک جا','Products, tools and services in one place')}</p></div><div className="flex justify-center gap-2 mb-8 flex-wrap">{(['all','product','tool','service'] as const).map(f=><button key={f} onClick={()=>setFilter(f)} className={`px-4 py-2 rounded-full border ${filter===f?'bg-primary text-white border-primary':'glass-card text-text-2'}`}>{f}</button>)}</div>{list.length===0?<GlassCard className="text-center text-text-3 py-12">{t('هنوز آیتمی اضافه نشده است.','No marketplace items yet.')}</GlassCard>:<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{list.map(item=><GlassCard key={`${item.type}-${item.id}`} className="!p-5 flex flex-col"><div className="w-11 h-11 rounded-[14px] bg-primary/10 text-primary flex items-center justify-center mb-3">{icon(item.type)}</div><div className="text-[11px] text-text-3 uppercase mb-1">{item.type} • {item.category}</div><h2 className="font-bold text-[16px] mb-2">{item.title}</h2><p className="text-text-2 text-[13px] leading-relaxed flex-1">{item.desc}</p><div className="flex items-center justify-between mt-4 pt-3 border-t border-glass-border"><b className="text-[13px]">{format(item.price)}</b><Link href={item.href} className="glass-btn-primary px-4 py-2 text-[12px]">Open</Link></div></GlassCard>)}</div>}</div>;
}
