'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShieldCheck, LayoutDashboard, KeyRound, Users, Layers, Bot, Send, ScrollText, LogOut, Brain } from 'lucide-react';

const nav = [
  { href: '/planner/admin', icon: LayoutDashboard, labelFa: 'داشبورد', labelEn: 'Dashboard' },
  { href: '/planner/admin/licenses', icon: KeyRound, labelFa: 'لایسنس‌ها', labelEn: 'Licenses' },
  { href: '/planner/admin/users', icon: Users, labelFa: 'کاربران', labelEn: 'Users' },
  { href: '/planner/admin/plans', icon: Layers, labelFa: 'پلن‌ها', labelEn: 'Plans' },
  { href: '/planner/admin/ai', icon: Bot, labelFa: 'AI', labelEn: 'AI' },
  { href: '/planner/admin/telegram', icon: Send, labelFa: 'تلگرام', labelEn: 'Telegram' },
  { href: '/planner/admin/logs', icon: ScrollText, labelFa: 'لاگ‌ها', labelEn: 'Logs' },
];

export default function KiyaAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const licenseOk = localStorage.getItem('kiya_license_ok');
    const isAdmin = localStorage.getItem('kiya_is_admin') === '1';
    if (!licenseOk) {
      router.replace('/planner/login');
    } else if (!isAdmin) {
      router.replace('/planner/app');
    } else {
      setOk(true);
    }
  }, [router]);

  if (!ok) return <div className="min-h-[60vh] flex items-center justify-center text-text-3 text-sm">در حال بررسی دسترسی مدیر…</div>;

  return (
    <div className="max-w-[1280px] mx-auto px-3 md:px-5 py-4 md:py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-[700]">
          <div className="w-8 h-8 rounded-[10px] bg-amber/12 text-amber flex items-center justify-center"><ShieldCheck size={16} /></div>
          <span>KIYA <span className="text-text-3 font-[500] text-[12px]">Admin</span></span>
          <span className="text-[10px] px-2 py-[3px] rounded-full bg-amber/12 text-amber ms-2">is_admin</span>
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <Link href="/planner/app" className="glass-btn !px-3 !py-[7px] text-[12px] flex items-center gap-1"><Brain size={13} /> داشبورد کاربر</Link>
          <button
            onClick={() => { localStorage.removeItem('kiya_license_ok'); localStorage.removeItem('kiya_is_admin'); router.push('/planner/login'); }}
            className="glass-btn !px-3 !py-[7px] text-[12px] flex items-center gap-1"
          >
            <LogOut size={13} /> خروج
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-4">
        <aside className="glass-card !p-2 h-fit lg:sticky lg:top-[84px]">
          <nav className="space-y-[4px] text-[13px]">
            {nav.map((n) => {
              const active = pathname === n.href;
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex items-center gap-[10px] px-3 py-[9px] rounded-[12px] transition ${
                    active ? 'bg-amber/10 text-amber' : 'text-text-2 hover:bg-white/[0.035] hover:text-text'
                  }`}
                >
                  <Icon size={16} />
                  <span>{n.labelFa}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
