'use client';
import { GlassCard } from './glass';
import Link from 'next/link';
import { AppIcon, type IconName } from './icons';
import { Construction } from 'lucide-react';

export function PagePlaceholder({ icon='settings', title, desc, next }: { icon?: IconName; title: string; desc: string; next?: string }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <GlassCard className="py-14">
        <div className="flex justify-center mb-4 text-text-3">
          <AppIcon name={icon} size={44} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold mb-3">{title}</h1>
        <p className="text-text-2 mb-6">{desc}</p>
        <div className="text-[11px] text-amber bg-amber/10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-6">
          <Construction size={13} /> فاز {next || 'بعدی'} — در دست ساخت
        </div>
        <div>
          <Link href="/" className="glass-btn-primary px-6 py-3 rounded-xl inline-block">بازگشت به خانه</Link>
        </div>
      </GlassCard>
    </div>
  );
}
