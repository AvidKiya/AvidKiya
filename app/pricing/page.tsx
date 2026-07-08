import { GlassCard } from '@/components/ui/glass';
// server component simple
export const metadata = { title: 'قیمت‌گذاری — KIYA Planner' };
export default function Page(){
  const plans = [
    { name:'Free', price:'۰', features:['۵۰ capture / ماه','AI ۱۰ پیام/روز','۵۰ وظیفه'] },
    { name:'Pro', price:'۹$', highlight:true, features:['نامحدود','Knowledge Graph','پشتیبانی اولویت‌دار'] },
    { name:'Pro+AI', price:'۱۹$', features:['AI نامحدود','Finance + Health','تلگرام پیشرفته'] },
    { name:'Team', price:'۴۹$', features:['۵ کاربر','مدیریت تیم','API Access'] },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black mb-2">قیمت‌گذاری KIYA</h1>
        <p className="text-text-2">۱۴ روز رایگان — بدون کارت اعتباری — ۳۰ روز گارانتی بازگشت</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map(p=>(
          <GlassCard key={p.name} className={p.highlight ? 'ring-2 ring-primary/40 scale-[1.02]' : ''}>
            <div className="text-lg font-bold mb-1">{p.name}</div>
            <div className="text-3xl font-black mb-4">{p.price}<span className="text-sm text-text-3">/ماه</span></div>
            <ul className="text-sm space-y-2 text-text-2 mb-5">
              {p.features.map(f=><li key={f}>✓ {f}</li>)}
            </ul>
            <button className={p.highlight ? 'glass-btn-primary w-full py-3' : 'glass-btn w-full py-3'}>شروع</button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
