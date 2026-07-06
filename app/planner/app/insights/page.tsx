'use client';

import { GlassCard } from '@/components/ui/glass';

interface Insight {
  id: string;
  type: 'pattern' | 'suggestion' | 'achievement';
  title: string;
  description: string;
  icon: string;
}

const insights: Insight[] = [
  {
    id: '1',
    type: 'pattern',
    title: 'الگوی انرژی',
    description: 'وقتی صبح ورزش می‌کنید، انرژی شما ۲.۱ واحد بیشتر است.',
    icon: '⚡',
  },
  {
    id: '2',
    type: 'pattern',
    title: 'زمان بهینه',
    description: 'بیشترین بهره‌وری شما بین ساعت ۱۰ ت۱۲ است.',
    icon: '⏰',
  },
  {
    id: '3',
    type: 'achievement',
    title: 'دستاورد جدید',
    description: '۵ روز streak ورزش ثبت کردید!',
    icon: '🏆',
  },
  {
    id: '4',
    type: 'suggestion',
    title: 'پیشنهاد',
    description: 'برای بهبود خواب، ۱ ساعت قبل از خواب از گوشی استفاده نکنید.',
    icon: '💡',
  },
];

const typeColors = {
  pattern: 'bg-blue-500/10 border-blue-500/20',
  suggestion: 'bg-yellow-500/10 border-yellow-500/20',
  achievement: 'bg-green-500/10 border-green-500/20',
};

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">بینش‌ها</h1>
        <div className="text-sm text-text-3">تحلیل رفتار شما</div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <GlassCard key={insight.id} className={typeColors[insight.type]}>
            <div className="flex items-start gap-4">
              <span className="text-3xl">{insight.icon}</span>
              <div>
                <h3 className="font-bold mb-1">{insight.title}</h3>
                <p className="text-text-2 text-sm">{insight.description}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Weekly Summary */}
      <GlassCard>
        <h2 className="font-bold mb-4">خلاصه هفتگی</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">۱۲</div>
            <div className="text-sm text-text-2">وظیفه تکمیل شده</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">۵</div>
            <div className="text-sm text-text-2">روز streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">۷.۵</div>
            <div className="text-sm text-text-2">میانگین انرژی</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">۳</div>
            <div className="text-sm text-text-2">پروژه فعال</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}