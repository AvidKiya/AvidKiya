import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass';

export const metadata = { title: 'تعرفه خدمات — اَوید کیا' };

export default function Page(){
  const plans = [
    { name:'Starter', price:'۶۰۰$', desc:'برای پرتفولیو، لندینگ یا اصلاح UI', features:['تحلیل سریع نیاز', 'طراحی/پیاده‌سازی ۱ تا ۳ صفحه', 'ریسپانسیو و SEO پایه'] },
    { name:'Product', price:'۱,۵۰۰$', highlight:true, desc:'برای وب‌اپ یا MVP قابل ارائه', features:['Next.js + TypeScript', 'داشبورد یا جریان اصلی محصول', 'دیپلوی و مستندات پایه'] },
    { name:'Automation', price:'۱,۲۰۰$', desc:'برای workflow هوشمند و اتصال API', features:['طراحی AI Agent', 'اتصال Telegram/Email/API', 'لاگ و ساختار توسعه‌پذیر'] },
    { name:'Scale', price:'۳,۵۰۰$+', desc:'برای معماری و رشد محصول', features:['Cloudflare Edge Architecture', 'بهینه‌سازی هزینه و سرعت', 'پلن فنی و roadmap'] },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black mb-2">تعرفه خدمات حرفه‌ای</h1>
        <p className="text-text-2">قیمت‌ها پایه هستند؛ بعد از بررسی دقیق، پیشنهاد شفاف و مرحله‌بندی‌شده می‌دهم.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map(p=>(
          <GlassCard key={p.name} className={p.highlight ? 'ring-2 ring-primary/40 scale-[1.02]' : ''}>
            <div className="text-lg font-bold mb-1">{p.name}</div>
            <div className="text-3xl font-black mb-2">{p.price}<span className="text-sm text-text-3">/شروع</span></div>
            <p className="text-[12.5px] text-text-2 leading-6 mb-4 min-h-[48px]">{p.desc}</p>
            <ul className="text-sm space-y-2 text-text-2 mb-5">
              {p.features.map(f=><li key={f}>✓ {f}</li>)}
            </ul>
            <Link href="/contact" className={p.highlight ? 'glass-btn-primary w-full py-3 text-center block rounded-[12px]' : 'glass-btn w-full py-3 text-center block rounded-[12px]'}>درخواست مشاوره</Link>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
