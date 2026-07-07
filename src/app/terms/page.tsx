import { GlassCard } from '@/components/ui/glass';
export const metadata = { title: 'قوانین استفاده — اَوید کیا' };
export default function Page(){
  return <div className="max-w-3xl mx-auto px-4 py-16"><GlassCard>
    <h1 className="text-2xl font-bold mb-4">شرایط استفاده</h1>
    <div className="prose prose-invert max-w-none text-text-2 text-sm leading-8 space-y-3">
      <p>با استفاده از پلتفرم اَوید کیا، شما شرایط زیر را می‌پذیرید...</p>
      <p>این متن از پنل مدیر قابل ویرایش است (CMS).</p>
    </div>
  </GlassCard></div>;
}
