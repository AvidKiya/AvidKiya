'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass';
import { AppIcon, type IconName } from '@/components/ui/icons';
import { ArrowUpRight } from 'lucide-react';

export function MenuCard({
  icon, title, desc, href, index=0, accent='primary'
}: {
  icon: IconName;
  title: string;
  desc: string;
  href: string;
  index?: number;
  accent?: 'primary'|'cyan'|'emerald'|'violet'|'amber'|'rose';
}) {
  const accentMap = {
    primary: 'text-primary bg-primary/10',
    cyan: 'text-cyan bg-cyan/10',
    emerald: 'text-emerald bg-emerald/10',
    violet: 'text-violet bg-violet/10',
    amber: 'text-amber bg-amber/10',
    rose: 'text-rose bg-rose/10',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.35, ease: [0.4,0,0.2,1] }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Link href={href} className="block h-full group">
        <GlassCard className="h-full min-h-[128px] md:min-h-[138px] flex flex-col justify-between hover:shadow-glass-lg transition-all duration-300 !p-4 md:!p-5">
          <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center mb-3 ${accentMap[accent]} transition-transform group-hover:scale-105`}>
            <AppIcon name={icon} size={22} strokeWidth={1.9} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-[15px] md:text-[16px] mb-1 tracking-[-0.01em]">{title}</div>
            <div className="text-text-3 text-[12.5px]">{desc}</div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11.5px] text-text-3 group-hover:text-primary transition-colors">
            <span>باز کردن</span>
            <ArrowUpRight size={13} />
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
