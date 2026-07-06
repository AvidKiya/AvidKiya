'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { motion } from 'framer-motion';

export function GlassCard({ className, children, hover=true, ...props }: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div className={cn('glass-card p-5 md:p-6', hover && 'transition-all duration-300', className)} {...props}>
      {children}
    </div>
  );
}

export function GlassButton({ className, variant='default', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default'|'primary'|'ghost' }) {
  const base = variant==='primary' ? 'glass-btn-primary' : variant==='ghost' ? 'px-4 py-2 rounded-full hover:bg-white/5 transition' : 'glass-btn';
  return <button className={cn(base, className)} {...props} />;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('glass-skeleton h-6 w-full', className)} />;
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <GlassCard className="text-center py-10">
      <div className="text-4xl mb-3">😵</div>
      <p className="text-text-2 mb-4">{message || 'مشکلی پیش آمد'}</p>
      {onRetry && <GlassButton variant="primary" onClick={onRetry}>تلاش مجدد</GlassButton>}
    </GlassCard>
  );
}

export function EmptyState({ icon='📋', title, description, action }: { icon?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <GlassCard className="text-center py-12">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {description && <p className="text-text-2 text-sm mb-4">{description}</p>}
      {action}
    </GlassCard>
  );
}
