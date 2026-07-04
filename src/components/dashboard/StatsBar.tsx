'use client';

import { useCms, useApp } from '@/contexts/AppContext';
import { Icon } from '@/components/ui/Icon';

export function StatsBar() {
  const { language } = useApp();
  const { cms, t } = useCms();
  
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="glass-card-strong p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {cms.dashboard.stats.map((stat, index) => (
              <div
                key={stat.id}
                className="text-center animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary-glow)] mb-4">
                  <Icon name={stat.icon} size={24} className="text-[var(--primary)]" />
                </div>
                
                <div className="text-3xl font-black gradient-text mb-1">
                  {stat.value}
                </div>
                
                <div className="text-sm text-[var(--text-secondary)]">
                  {t(stat.label)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsBar;
