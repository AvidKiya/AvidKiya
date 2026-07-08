'use client';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass';
import { useState, useMemo } from 'react';
import { useCms } from '@/lib/cms/cms-context';

export default function BlogClient(){
  const { cms, tf, t } = useCms();
  const allLabel = t('همه', 'All');
  const [cat, setCat] = useState(allLabel);
  const [q, setQ] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.includes('@')) return;
    try {
      await fetch('/api/email/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail, source: 'blog' }),
      });
      setNewsletterDone(true);
      setNewsletterEmail('');
    } catch {}
  };

  const allPosts = useMemo(() => cms.blog.posts.filter(p => p.status === 'published').map((p, i) => ({ slug: p.slug, title: tf(p.title), excerpt: tf(p.excerpt), cat: p.category || 'General', date: p.publishedAt || '', read: t('۵ دقیقه','5 min'), featured: i < 2 })), [cms.blog.posts, tf, t]);
  const cats = useMemo(() => [allLabel, ...Array.from(new Set(allPosts.map(p => p.cat)))], [allLabel, allPosts]);
  const list = useMemo(()=> allPosts.filter(p=> (cat===allLabel||p.cat===cat) && (!q || (p.title+p.excerpt).toLowerCase().includes(q.toLowerCase()))), [allPosts, cat, allLabel, q]);
  const featured = list.filter(p=>p.featured);
  const rest = list.filter(p=>!p.featured);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-7 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6"><div><h1 className="text-[26px] md:text-[32px] font-[800] tracking-[-0.015em]">{t('بلاگ','Blog')}</h1><p className="text-text-2 text-[13.5px] mt-1">{t('مقاله‌های منتشرشده شما اینجا نمایش داده می‌شود.','Your published posts will appear here.')}</p></div><input value={q} onChange={e=>setQ(e.target.value)} placeholder={t('جستجوی مقالات…','Search posts…')} className="glass-input !w-full sm:!w-[260px] !py-[9px] text-[13px]" /></div>
      <div className="flex flex-wrap gap-2 mb-6 text-[12.5px]">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-3 py-[7px] rounded-full border transition ${cat===c ? 'bg-primary text-[#052e28] border-primary font-[600]' : 'glass-card !px-3 !py-[7px] text-text-2'}`}>{c}</button>)}</div>
      {featured.length>0 && <div className="grid md:grid-cols-2 gap-4 mb-8">{featured.map(p=><PostCard key={p.slug} post={p} featured />)}</div>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{rest.map(p=><PostCard key={p.slug} post={p} />)}</div>
      {list.length===0 && <div className="text-center text-text-3 py-14 text-[13px]">{t('مقاله‌ای وجود ندارد','No posts yet')}</div>}
      {cms.newsletter.enabled && <GlassCard className="max-w-2xl mx-auto mt-12 !p-6 text-center"><div className="text-[15px] font-[700] mb-1">{tf(cms.newsletter.title) || t('خبرنامه','Newsletter')}</div>{newsletterDone ? <div className="text-emerald text-[13px] py-3">{t('عضویت ثبت شد.','Subscription saved.')}</div> : <form onSubmit={subscribe} className="flex gap-2 max-w-md mx-auto"><input required type="email" value={newsletterEmail} onChange={e=>setNewsletterEmail(e.target.value)} placeholder={t('ایمیل شما…','Your email…')} className="glass-input flex-1 !py-[10px] text-[13px]" dir="ltr" /><button className="glass-btn-primary !px-5 text-[13px]">{t('عضویت','Subscribe')}</button></form>}</GlassCard>}
    </div>
  );
}

function PostCard({ post, featured=false }: { post: {slug:string; title:string; excerpt:string; cat:string; date:string; read:string}; featured?: boolean }) {
  return <Link href={`/blog/${post.slug}`} className="block group"><GlassCard className={`${featured ? '!p-5' : '!p-4'} h-full hover:shadow-glass-lg transition-all`}><div className="text-[11px] text-primary font-[600] mb-1">{post.cat}{featured ? ' • Featured' : ''}</div><div className={`${featured ? 'text-[17px] md:text-[18px]' : 'text-[14.5px]'} font-[750] mb-2 leading-snug group-hover:text-primary transition-colors`}>{post.title}</div><div className="text-[13px] text-text-2 leading-relaxed mb-3">{post.excerpt}</div><div className="text-[11px] text-text-3">{post.date} • {post.read}</div></GlassCard></Link>;
}
