'use client';
import { notFound } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass';
import Link from 'next/link';
import { useCms } from '@/lib/cms/cms-context';
import { use } from 'react';

export const runtime = 'edge';

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }){
  const { slug } = use(params);
  const { cms, tf, t } = useCms();
  const cmsPost = cms.blog.posts.find(p => p.slug === slug && p.status === 'published');
  if(!cmsPost) return notFound();

  const p = { title: tf(cmsPost.title), date: cmsPost.publishedAt || '', read: t('۵ دقیقه','5 min'), cat: cmsPost.category, body: tf(cmsPost.content) || tf(cmsPost.excerpt) };
  return <article className="max-w-[760px] mx-auto px-4 md:px-6 py-8 md:py-12"><div className="text-[11.5px] text-primary font-[600] mb-2">{p.cat} • {p.date} • {p.read}</div><h1 className="text-[26px] md:text-[34px] font-[800] tracking-[-0.015em] leading-[1.25] mb-5">{p.title}</h1><GlassCard className="!p-6 md:!p-8 max-w-none" style={{color:'rgb(var(--text))'}}><div className="whitespace-pre-wrap leading-[2] text-[14.5px] text-text-2">{p.body}</div></GlassCard><div className="flex items-center justify-between mt-6 text-[12.5px] text-text-3"><Link href="/blog" className="hover:text-text">← {t('بازگشت به بلاگ','Back to blog')}</Link></div></article>;
}
