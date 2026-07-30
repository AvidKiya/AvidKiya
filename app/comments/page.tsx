'use client';

import { Star, Quote, MessageSquare } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';
import { useCms } from '@/lib/cms/cms-context';

export default function Page() {
  const { cms, t } = useCms();
  const comments = cms.comments.filter(c => c.approved);
  const average = comments.length ? (comments.reduce((sum, c) => sum + (c.rating || 5), 0) / comments.length).toFixed(1) : '5.0';

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4"><MessageSquare size={24} /></div>
        <h1 className="text-[28px] md:text-[38px] font-black tracking-[-0.03em] mb-3">{t('نظرات کاربران و مشتریان', 'Client testimonials')}</h1>
        <p className="text-text-2 text-sm leading-8">{t('بازخوردهایی از همکاری در طراحی، توسعه، معماری و تحویل محصول‌های وب.', 'Feedback from collaborations in design, development, architecture and web product delivery.')}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <GlassCard className="!p-5 text-center"><div className="text-3xl font-black">{average}</div><div className="text-xs text-text-3 mt-1">{t('میانگین امتیاز', 'Average rating')}</div></GlassCard>
        <GlassCard className="!p-5 text-center"><div className="text-3xl font-black">{comments.length}</div><div className="text-xs text-text-3 mt-1">{t('نظر تأییدشده', 'Approved reviews')}</div></GlassCard>
        <GlassCard className="!p-5 text-center"><div className="text-3xl font-black">100%</div><div className="text-xs text-text-3 mt-1">{t('تمرکز روی تحویل', 'Delivery focused')}</div></GlassCard>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {comments.map((item) => (
          <GlassCard key={item.id} className="!p-5 flex flex-col h-full">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-cyan/10 flex items-center justify-center font-black text-primary">{item.author.slice(0,1)}</div>
              <div className="flex gap-0.5 text-amber" dir="ltr">{Array.from({ length: item.rating || 5 }).map((_, i)=><Star key={i} size={14} fill="currentColor" />)}</div>
            </div>
            <Quote size={18} className="text-text-3 mb-2" />
            <p className="text-sm text-text-2 leading-8 flex-1">{item.text}</p>
            <div className="mt-5 pt-4 border-t border-glass-border">
              <div className="font-bold text-[14px]">{item.author}</div>
              <div className="text-[11.5px] text-text-3 mt-1">{item.role} • {item.createdAt}</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
