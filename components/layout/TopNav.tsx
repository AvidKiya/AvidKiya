"use client";

import React, { useState, useEffect } from "react";
import { useCms } from "@/contexts/CmsContext";
import { Icon, BrandIcon } from "@/components/ui/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNav() {
  const { locale, setLocale, theme, setTheme, t, state } = useCms();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [sliderPos, setSliderPos] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isHome = pathname === "/";

  const tabs = [
    { id: "home", href: "/", label: t("nav", "home") },
    { id: "projects", href: "/projects", label: t("nav", "projects") },
    { id: "about", href: "/about", label: t("nav", "about") },
    { id: "resume", href: "/resume", label: t("nav", "resume") },
    { id: "gifts", href: "/gifts", label: t("nav", "gifts") },
    { id: "announcements", href: "/announcements", label: t("nav", "announcements") },
    { id: "comments", href: "/comments", label: t("nav", "comments") },
    { id: "shop", href: "/shop", label: t("nav", "shop") },
  ];

  useEffect(() => {
    const current = tabs.find((tab) => tab.href === pathname);
    if (current) setActiveTab(current.id);
  }, [pathname]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleLang = () => setLocale(locale === "fa" ? "en" : "fa");

  const handlePrintResume = () => {
    window.location.href = "/resume?print=1";
    setTimeout(() => window.print(), 300);
  };

  const isRtl = locale === "fa";

  return (
    <>
      {/* Hidden admin route handler */}
      <AdminRouteHandler />

      {/* Top Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`lg:hidden p-2 rounded-xl hover:bg-[var(--color-bg-alt)] transition ${isRtl ? "order-first" : "order-first"}`}
              aria-label="Menu"
            >
              <Icon name="Menu" size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#5d7ae6]/20 border border-[#5d7ae6]/30 flex items-center justify-center">
                {state.brand.logoImage ? (
                  <img src={state.brand.logoImage} alt="Logo" className="w-7 h-7 object-contain rounded-lg" />
                ) : (
                  <span className="text-sm font-black gradient-text">{state.brand.logoLetter}</span>
                )}
              </div>
              <span className="font-bold text-sm hidden sm:block">{state.brand.brandName}</span>
            </Link>

            {/* Tabs - only on desktop for all pages */}
            {isDesktop && (
              <div className="pill-container">
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-300
                      ${activeTab === tab.id
                        ? "text-[var(--color-primary)] bg-[#5d7ae6]/10"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                      }
                    `}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Print Resume */}
              <button
                onClick={handlePrintResume}
                className="p-2 rounded-xl hover:bg-[var(--color-bg-alt)] transition"
                title={t("resume", "print")}
              >
                <Icon name="Printer" size={18} />
              </button>

              {/* Language/Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-[var(--color-bg-alt)] transition"
                title={theme === "dark" ? "Light Mode" : "Dark Mode"}
              >
                <Icon name={theme === "dark" ? "Sun" : "Moon"} size={18} />
              </button>
              <button
                onClick={toggleLang}
                className="px-2 py-1 rounded-xl text-xs font-bold hover:bg-[var(--color-bg-alt)] transition"
                title={locale === "fa" ? "English" : "فارسی"}
              >
                {locale === "fa" ? "EN" : "فا"}
              </button>

              {/* GitHub */}
              {state.socials.find((s) => s.platform === "github") && (
                <a
                  href={state.socials.find((s) => s.platform === "github")!.url}
                  target="_blank"
                  rel="noopener"
                  className="p-2 rounded-xl hover:bg-[var(--color-bg-alt)] transition"
                >
                  <BrandIcon platform="github" size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] no-print">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div
            className={`absolute top-0 bottom-0 w-72 bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] shadow-2xl flex flex-col ${
              isRtl ? "right-0" : "left-0"
            }`}
          >
            {/* Mac traffic lights */}
            <div className={`flex items-center gap-2 p-4 ${isRtl ? "flex-row-reverse" : ""}`}>
              <div className="w-3 h-3 rounded-full bg-red-500" onClick={() => setDrawerOpen(false)} />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto px-4 space-y-1">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium
                    ${pathname === tab.href
                      ? "bg-[#5d7ae6]/10 text-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
                    }
                  `}
                >
                  <Icon name={
                    tab.id === "home" ? "Home" :
                    tab.id === "projects" ? "Folder" :
                    tab.id === "about" ? "User" :
                    tab.id === "resume" ? "FileText" :
                    tab.id === "gifts" ? "Gift" :
                    tab.id === "announcements" ? "Megaphone" :
                    tab.id === "comments" ? "MessageSquare" :
                    "ShoppingCart"
                  } size={18} />
                  {tab.label}
                </Link>
              ))}
            </div>

            {/* Socials */}
            <div className="border-t border-[var(--color-bg)] p-4">
              <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                {state.socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener"
                    className="p-2 rounded-lg hover:bg-[var(--color-bg)] transition text-[var(--color-text-muted)]"
                  >
                    <BrandIcon platform={s.platform} size={18} />
                  </a>
                ))}
              </div>
              <button
                onClick={handlePrintResume}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-[#5d7ae6]/10 text-[var(--color-primary)] hover:bg-[#5d7ae6]/20 transition"
              >
                <Icon name="Printer" size={16} />
                {t("resume", "print")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AdminRouteHandler() {
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#kiya/panel") {
        window.location.href = "/admin";
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);
  return null;
}
