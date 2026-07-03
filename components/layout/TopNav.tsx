"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Icon, BrandIcon } from "@/components/ui/Icon";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import { ui } from "@/lib/i18n";
import { useState, useEffect, useRef } from "react";

const routes = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/resume", key: "resume" },
  { href: "/gifts", key: "gifts" },
  { href: "/announcements", key: "announcements" },
  { href: "/comments", key: "comments" },
  { href: "/shop", key: "shop" },
];

export function TopNav(){
  const pathname = usePathname() || "/";
  const { lang, dir, toggleLang, toggleTheme, theme } = useApp();
  const { cms } = useCms();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(()=>{
    const el = tabRefs.current[pathname];
    if(el){
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [pathname, lang]);

  const printResume = ()=> {
    window.open('/resume', '_blank');
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-border no-print">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">
          {/* Left cluster: burger (mobile only) + logo */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-bg-soft border border-transparent hover:border-border"
              onClick={()=> setDrawerOpen(true)}
              aria-label="menu"
            >
              <Icon name="menu" />
            </button>
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Tabs - ALWAYS visible on desktop, all pages */}
          <nav className="hidden lg:flex items-center relative">
            <div className="relative flex items-center gap-1 px-1.5 py-1.5 rounded-2xl bg-bg-soft/80 border border-border shadow-inner">
              {/* moving pill */}
              <div
                className="absolute top-1.5 bottom-1.5 bg-bg-elev rounded-xl shadow-sm border border-border tab-pill-active"
                style={{ left: indicatorStyle.left, width: indicatorStyle.width, transition: "all 0.35s cubic-bezier(.34,1.56,.64,1)" }}
              />
              {routes.map(r=> (
                <Link
                  key={r.href}
                  href={r.href}
                  ref={el=> { tabRefs.current[r.href] = el }}
                  className={`relative z-10 px-4 py-2 text-sm font-medium rounded-xl transition-colors ${pathname===r.href ? "text-primary" : "text-text-muted hover:text-text"}`}
                >
                  {ui(lang, r.key)}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="px-3 py-2 rounded-xl text-xs font-bold border border-border hover:bg-bg-soft flex items-center gap-1.5"
              title={lang==="fa" ? "English" : "فارسی"}
            >
              <Icon name="globe" size={14} />
              <span>{lang==="fa" ? "EN" : "فا"}</span>
              <span className="opacity-40">|</span>
              <span onClick={(e)=>{ e.stopPropagation(); toggleTheme(); }} className="hover:text-primary">
                {theme==="dark" ? "☀️" : "🌙"}
              </span>
            </button>
            <a href="https://github.com/IR-NETLIFY" target="_blank" className="p-2 rounded-xl hover:bg-bg-soft border border-border text-text-muted hover:text-text">
              <BrandIcon platform="github" size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* Drawer - mobile only */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setDrawerOpen(false)} />
          <div
            className={`absolute top-0 bottom-0 w-[300px] bg-bg-elev border-border shadow-2xl p-5 overflow-y-auto ${dir==="rtl" ? "right-0 border-l" : "left-0 border-r"}`}
            style={{ animation: "slideIn .25s ease" }}
          >
            <div className="flex items-center justify-between mb-6">
              <Logo />
              <button onClick={()=>setDrawerOpen(false)} className="p-2 rounded-lg hover:bg-bg-soft"><Icon name="x" /></button>
            </div>
            {/* mac lights */}
            <div className="flex gap-2 mb-5 px-1">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
              <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
              <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
            </div>
            <nav className="space-y-1">
              {routes.map(r=>(
                <Link key={r.href} href={r.href} onClick={()=>setDrawerOpen(false)} className={`block px-3 py-2.5 rounded-xl ${pathname===r.href ? "bg-primary/10 text-primary font-bold" : "hover:bg-bg-soft"}`}>{ui(lang, r.key)}</Link>
              ))}
            </nav>
            <div className="mt-5 pt-5 border-t border-border space-y-3">
              <button onClick={printResume} className="w-full py-2.5 rounded-xl border border-border hover:bg-bg-soft text-sm font-medium">
                {ui(lang, "printCV")}
              </button>
              <div className="flex flex-wrap gap-3">
                {cms.socials.filter(s=>s.enabled).sort((a,b)=>a.order-b.order).map(s=>(
                  <a key={s.id} href={s.url} target="_blank" className="text-text-muted hover:text-primary"><BrandIcon platform={s.platform} /></a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(${dir==="rtl" ? "100%" : "-100%"}); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
