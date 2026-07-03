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
 * Top navigation.
 * • On the LANDING page ("/") the full tab bar is shown, centred, on desktop.
 * • On every OTHER page (and on mobile everywhere) a hamburger button is shown
 *   instead. Clicking it drops down the full menu.
 */
export default function TopNav() {
  const { t, language } = useApp();
  const { state } = useCms();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: "/", label: t("navWorkspace") },
    { href: "/projects", label: t("navProjects") },
    { href: "/about", label: t("navAbout") },
    { href: "/resume", label: t("navResume") },
    { href: "/gifts", label: t("navGifts") },
    { href: "/announcements", label: t("navAnnouncements") },
    { href: "/shop", label: t("navShop") },
  ];

  const isHome = pathname === "/";

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 h-16 z-50 border-b nav-blur"
        style={{ borderColor: "var(--outline-variant)" }}
      >
        <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 flex items-center">
          {/* LEFT: logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5"
            style={{ position: "relative", zIndex: 2 }}
          >
            <Logo size={36} />
            <span
              className="font-bold tracking-tight text-lg hidden sm:inline"
              style={{ color: "var(--on-surface)" }}
            >
              {language === "fa" ? state.brand.brandName.fa : state.brand.brandName.en}
            </span>
          </Link>

          {/* CENTER: full tab bar — ONLY on desktop landing */}
          {isHome && (
            <nav
              className="hidden lg:flex items-center gap-1 absolute left-1/2 top-1/2"
              style={{
                transform: "translate(-50%, -50%)",
                background: "var(--surface-container-solid)",
                border: "1px solid var(--outline-variant)",
                borderRadius: 999,
                padding: "6px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            >
              {links.map((l) => {
                const active =
                  pathname === l.href ||
                  (l.href !== "/" && pathname?.startsWith(l.href));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: active ? "var(--primary)" : "transparent",
                      color: active ? "var(--on-primary)" : "var(--on-surface)",
                    }}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* RIGHT: switcher + burger */}
          <div className="flex items-center gap-2 ms-auto" style={{ position: "relative", zIndex: 2 }}>
            <LangThemeSwitcher />
            {/* Burger: always on mobile, always on non-home desktop */}
            <button
              onClick={() => setOpen(!open)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                isHome ? "lg:hidden" : ""
              }`}
              style={{
                background: open ? "var(--primary)" : "transparent",
                color: open ? "var(--on-primary)" : "var(--on-surface)",
                borderColor: "var(--outline-variant)",
              }}
              aria-label="Menu"
              aria-expanded={open}
            >
              <Icon name={open ? "close" : "menu"} size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Dropdown menu */}
      {open && (
        <div
          className="fixed inset-x-0 top-16 z-40 nav-blur border-b"
          style={{ borderColor: "var(--outline-variant)" }}
        >
          <nav className="max-w-4xl mx-auto px-4 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {links.map((l) => {
              const active =
                pathname === l.href ||
                (l.href !== "/" && pathname?.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between"
                  style={{
                    background: active ? "var(--primary)" : "var(--surface-container-solid)",
                    color: active ? "var(--on-primary)" : "var(--on-surface)",
                    border: `1px solid ${active ? "var(--primary)" : "var(--outline-variant)"}`,
                  }}
                >
                  <span>{l.label}</span>
                  <Icon name="arrow_forward" size={14} />
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
