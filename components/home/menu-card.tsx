'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass';

export function MenuCard({
  icon, title, desc, href, index=0
}: {
  icon: string;
  title: string;
  desc: string;
  href: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Link href={href} className="block menu-card">
        <GlassCard className="h-full min-h-[138px] flex flex-col justify-between hover:shadow-glass-lg">
          <div className="text-3xl mb-3">{icon}</div>
          <div>
            <div className="font-bold text-[16px] mb-1">{title}</div>
            <div className="text-text-3 text-[13px]">{desc}</div>
          </div>
          <div className="mt-3 text-primary text-xs opacity-80">باز کردن ←</div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
