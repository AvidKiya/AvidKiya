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
 * Single top-nav used on every page.
 * Layout: [logo] ────── [center nav] ────── [switcher + burger]
 * Center nav collapses into a burger menu on mobile.
 */
export default function TopNav() {
  const { t, dir, language } = useApp();
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

          {/* CENTER: nav — absolute-centered so it stays middle regardless of side widths */}
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

          {/* RIGHT: switcher + burger */}
          <div className="flex items-center gap-2 ms-auto" style={{ position: "relative", zIndex: 2 }}>
            <LangThemeSwitcher />
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center border"
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

      {/* Mobile menu overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-x-0 top-16 z-40 nav-blur border-b"
          style={{ borderColor: "var(--outline-variant)" }}
        >
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
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
                    background: active ? "var(--primary)" : "transparent",
                    color: active ? "var(--on-primary)" : "var(--on-surface)",
                    border: `1px solid ${active ? "var(--primary)" : "var(--outline-variant)"}`,
                  }}
                >
                  <span>{l.label}</span>
                  <Icon
                    name={dir === "rtl" ? "arrow_back" : "arrow_forward"}
                    size={14}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
