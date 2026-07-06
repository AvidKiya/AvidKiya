'use client';

import { GlassCard } from './glass';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'خطایی رخ داد', onRetry }: ErrorStateProps) {
  return (
    <GlassCard className="text-center py-12">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="font-bold mb-2">خطا</h3>
      <p className="text-text-2 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="glass-btn px-4 py-2">
          تلاش مجدد
        </button>
      )}
    </GlassCard>
  );
}

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ count = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <GlassCard key={i}>
          <div className="animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon = '📭',
  title = 'داده‌ای وجود ندارد',
  description = 'هنوز موردی ثبت نشده است.',
  action,
}: EmptyStateProps) {
  return (
    <GlassCard className="text-center py-12">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-text-2 mb-4">{description}</p>
      {action && (
        <button onClick={action.onClick} className="glass-btn-primary px-4 py-2">
          {action.label}
        </button>
      )}
    </GlassCard>
  );
}