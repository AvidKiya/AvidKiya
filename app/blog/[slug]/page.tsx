import { notFound } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass';
import Link from 'next/link';

const posts: Record<string, any> = {
  'second-brain-kiya': {
    title: 'مغز دوم چیست و چطور برای خودمان سیستم دانش بسازیم؟',
    date: '۱۴۰۴/۱۰/۰۵',
    read: '7 دقیقه',
    cat: 'AI',
    body: `مغز دوم یک سیستم خارجی قابل اعتماد است که ایده‌ها، وظایف و دانش شما را ذخیره و سازماندهی می‌کند.

## اصل مهم
سیستم دانش نباید یک اپلیکیشن پیچیده باشد؛ باید یک جریان ساده و تکرارپذیر باشد:
- ثبت سریع ایده و کار
- دسته‌بندی قابل اعتماد
- مرور دوره‌ای
- اتصال دانش به پروژه‌های واقعی

## روش PARA
- **Projects**: پروژه‌های فعال
- **Areas**: حوزه‌های مسئولیت
- **Resources**: منابع و مرجع
- **Archive**: آرشیو

## شروع در ۳ دقیقه
1. یک inbox ساده برای ثبت سریع بساز
2. هر روز ۵ دقیقه inbox را خالی کن
3. هر یادداشت را به یک پروژه یا حوزه وصل کن
4. هفته‌ای یک‌بار خروجی‌ها را مرور کن

> ابزار مهم است، اما سیستم مهم‌تر است. اول جریان را بساز، بعد ابزار را انتخاب کن.

— اَوید کیا`
  }
};

export async function generateStaticParams(){
  return Object.keys(posts).map(slug => ({ slug }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const p = posts[slug];
  if(!p) return notFound();
  return (
    <article className="max-w-[760px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="text-[11.5px] text-primary font-[600] mb-2">{p.cat} • {p.date} • {p.read}</div>
      <h1 className="text-[26px] md:text-[34px] font-[800] tracking-[-0.015em] leading-[1.25] mb-5">{p.title}</h1>
      <GlassCard className="!p-6 md:!p-8 max-w-none" style={{color:'rgb(var(--text))'}}>
        <div className="whitespace-pre-wrap leading-[2] text-[14.5px] text-text-2" style={{fontFamily:'Vazirmatn, system-ui'}}>
          {p.body}
        </div>
      </GlassCard>
      <div className="flex items-center justify-between mt-6 text-[12.5px] text-text-3">
        <Link href="/blog" className="hover:text-text">← بازگشت به بلاگ</Link>
        <div>اشتراک‌گذاری • ذخیره</div>
      </div>

      <GlassCard className="mt-8 !p-5 text-center">
        <div className="font-[700] mb-1">این مقاله مفید بود؟</div>
        <div className="text-[12.5px] text-text-2 mb-3">مشترک خبرنامه شو — هفته‌ای ۱ مقاله + ۱ ابزار رایگان</div>
        <Link href="/tools" className="glass-btn-primary px-5 py-[10px] text-[13px] inline-block">دیدن ابزارهای رایگان</Link>
      </GlassCard>
    </article>
  );
}
