'use client';
import { GlassCard } from './glass';
import Link from 'next/link';

export function PagePlaceholder({ icon, title, desc, next }: { icon: string; title: string; desc: string; next?: string }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <GlassCard className="py-14">
        <div className="text-5xl mb-4">{icon}</div>
        <h1 className="text-2xl font-bold mb-3">{title}</h1>
        <p className="text-text-2 mb-6">{desc}</p>
        <div className="text-xs text-amber bg-amber/10 inline-block px-3 py-1.5 rounded-full mb-6">فاز {next || 'بعدی'} — در دست ساخت</div>
        <div>
          <Link href="/" className="glass-btn-primary px-6 py-3 rounded-xl inline-block">بازگشت به خانه</Link>
        </div>
      </GlassCard>
    </div>
  );
}
