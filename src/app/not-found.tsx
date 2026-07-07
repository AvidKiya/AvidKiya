import Link from 'next/link';
import { AsciiLogo } from '@/components/ui/ascii-logo';
import { GlassCard } from '@/components/ui/glass';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="flex justify-center mb-8 opacity-80">
        <AsciiLogo />
      </div>
      <GlassCard className="py-14">
        <h1 className="text-5xl font-black mb-3">۴۰۴</h1>
        <p className="text-text-2 mb-6">صفحه‌ای که دنبالش هستی پیدا نشد</p>
        <Link href="/" className="glass-btn-primary inline-block px-6 py-3 rounded-xl">
          بازگشت به خانه
        </Link>
      </GlassCard>
    </div>
  );
}
