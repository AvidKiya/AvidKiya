"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import LangThemeSwitcher from "@/components/ui/LangThemeSwitcher";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

/**
 * Top navigation — hamburger button on the left opens the drawer,
 * centre nav shows on the landing page in desktop, right cluster
 * has status pill + lang/theme + burger fallback for mobile.
 */
export default function TopNav() {
  const { t, dir, language } = useApp();
  const { state } = useCms();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  // Close drawer on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const links = [
    { href: "/", label: t("navWorkspace"), icon: "home" },
    { href: "/projects", label: t("navProjects"), icon: "folder" },
    { href: "/about", label: t("navAbout"), icon: "person" },
    { href: "/resume", label: t("navResume"), icon: "description" },
    { href: "/gifts", label: t("navGifts"), icon: "rocket_launch" },
    { href: "/announcements", label: t("navAnnouncements"), icon: "campaign" },
    { href: "/comments", label: t("navComments"), icon: "message" },
    { href: "/shop", label: t("navShop"), icon: "shopping_cart" },
  ];

  const socials = state.socials.filter((s) => s.enabled);
  const gh = socials.find((s) => s.icon === "github");
  const isHome = pathname === "/";

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 h-16 z-50 border-b nav-blur px-4 sm:px-6 flex items-center justify-between gap-3 no-print"
        style={{ borderColor: "var(--outline-variant)" }}
      >
        {/* LEFT: burger + logo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => setOpen(true)}
            className="btn btn-ghost"
            style={{ padding: "0.5rem", borderRadius: "0.5rem" }}
            aria-label="menu"
          >
            <Icon name="menu" size={20} />
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <Logo size={36} />
            <div className="leading-tight hidden sm:block">
              <div className="font-extrabold tracking-tight text-[15px]" style={{ color: "var(--on-surface)" }}>
                {language === "fa" ? state.brand.brandName.fa : state.brand.brandName.en}
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--outline)" }}>
                DEVHUB_OS
              </div>
            </div>
          </Link>

          {/* CENTER: desktop nav only on landing */}
          {isHome && (
            <nav className="hidden lg:flex items-center gap-7 ms-4">
              {links.slice(0, 5).map((l) => {
                const active =
                  pathname === l.href ||
                  (l.href !== "/" && pathname?.startsWith(l.href));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`nav-link ${active ? "active" : ""}`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* RIGHT: lang/theme + gh */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LangThemeSwitcher />
          {gh && (
            <a
              href={gh.href}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex btn btn-ghost"
              style={{ padding: "0.5rem", borderRadius: "0.5rem" }}
              title="GitHub"
              aria-label="GitHub"
            >
              <Icon name="github" size={18} />
            </a>
          )}
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] no-print"
          style={{
            background: "rgba(4,6,12,0.6)",
            backdropFilter: "blur(3px)",
            opacity: open ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 bottom-0 z-[70] flex flex-col glass no-print`}
        style={{
          width: "min(86vw, 330px)",
          borderRadius: 0,
          transform: open
            ? "translateX(0)"
            : dir === "rtl"
            ? "translateX(105%)"
            : "translateX(-105%)",
          [dir === "rtl" ? "right" : "left"]: 0,
          transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
        } as React.CSSProperties}
      >
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--outline-variant)" }}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-rose)" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-amber)" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-emerald)" }} />
            <span className="ms-2 text-[11px] font-mono tracking-widest" style={{ color: "var(--outline)" }}>
              NAV_PANEL
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="btn btn-ghost"
            style={{ padding: "0.375rem", borderRadius: "0.5rem" }}
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto thin-scroll">
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition"
                style={{
                  color: active ? "var(--primary-bright)" : "var(--on-surface-variant)",
                  background: active ? "var(--chip-bg)" : "transparent",
                }}
              >
                <Icon name={l.icon} size={18} />
                <span>{l.label}</span>
              </Link>
            );
          })}

          <div className="my-3 border-t" style={{ borderColor: "var(--outline-variant)" }} />
          <div className="px-4 py-1 text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--outline)" }}>
            {language === "fa" ? "لینک‌های سریع" : "Quick links"}
          </div>
          {socials.slice(0, 5).map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition"
              style={{ color: "var(--on-surface-variant)" }}
            >
              <Icon name={s.icon} size={18} />
              <span>{s.platform}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: "var(--outline-variant)" }}>
          <Link
            href="/resume"
            className="btn btn-primary w-full justify-center"
          >
            <Icon name="print" size={16} />
            <span>{language === "fa" ? "چاپ رزومه" : "Print CV / Resume"}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
