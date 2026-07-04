'use client';

import Hero from '@/components/dashboard/Hero';
import PersianClock from '@/components/ui/PersianClock';
import StatsBar from '@/components/dashboard/StatsBar';
import FeaturedProjects from '@/components/dashboard/FeaturedProjects';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="max-w-sm">
          <PersianClock />
        </div>
      </div>
      <FeaturedProjects />
      <StatsBar />
    </div>
  );
}
