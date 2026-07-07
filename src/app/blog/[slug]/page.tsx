'use client';
import { notFound } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass';
import Link from 'next/link';
import { useCms } from '@/lib/cms/cms-context';
import { use } from 'react';

export const runtime = 'edge';

// Fallback sample content — shown until an admin publishes real posts from the CMS panel.
const FALLBACK_POSTS: Record<string, any> = {
  'second-brain-kiya': {
    title: 'مغز دوم چیست و چرا KIYA بهترین انتخاب است؟',
    date: '۱۴۰۴/۱۰/۰۵',
    read: '7 دقیقه',
    cat: 'KIYA',
    body: `مغز دوم یک سیستم خارجی قابل اعتماد است که ایده‌ها، وظایف و دانش شما را ذخیره و سازماندهی می‌کند.

## چرا KIYA؟
- ثبت سریع (Quick Capture) — در کمتر از ۲ ثانیه
- طبقه‌بندی خودکار با AI
- Knowledge Graph بصری
- یادآوری هوشمند تلگرام
- کاملاً فارسی، RTL native

## روش PARA در KIYA
- **Projects**: پروژه‌های فعال
- **Areas**: حوزه‌های مسئولیت
- **Resources**: منابع و مرجع
- **Archive**: آرشیف

## شروع در ۳ دقیقه
1. ثبت‌نام رایگان در /planner/login
2. اولین Capture را ثبت کن
3. بگذار AI طبقه‌بندی کند
4. داشبورد روزانه‌ات آماده است

> سادگی، نهایت پیچیدگی است — و KIYA ساده‌ترین مغز دومی است که ساخته‌ام.

— اَوید کیا`
  }
};

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }){
  const { slug } = use(params);
  const { cms, tf } = useCms();

  const cmsPost = cms.blog.posts.find(p => p.slug === slug && p.status === 'published');
  const p = cmsPost
    ? {
        title: tf(cmsPost.title),
        date: cmsPost.publishedAt || '',
        read: '5 دقیقه',
        cat: cmsPost.category,
        body: tf(cmsPost.content) || tf(cmsPost.excerpt),
      }
    : FALLBACK_POSTS[slug];

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
        <Link href="/planner/login" className="glass-btn-primary px-5 py-[10px] text-[13px] inline-block">امتحان KIYA رایگان</Link>
      </GlassCard>
    </article>
  );
}
