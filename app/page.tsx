import { Hero } from '@/components/dashboard/Hero';
import { PersianClock } from '@/components/ui/PersianClock';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { Newsletter } from '@/components/dashboard/Newsletter';
export default function Home(){return <main className="page-wrap space-y-8"><Hero/><PersianClock/><ProjectGrid/><StatsBar/><Newsletter/></main>}
