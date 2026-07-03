"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import LangThemeSwitcher from "@/components/ui/LangThemeSwitcher";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

export default function TopNav() {
  const { t, dir, language } = useApp();
  const { state } = useCms();
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("navWorkspace") },
    { href: "/projects", label: t("navProjects") },
    { href: "/about", label: t("navAbout") },
    { href: "/resume", label: language === "fa" ? "رزومه" : "Resume" },
    { href: "/gifts", label: language === "fa" ? "هدیه‌ها" : "Gifts" },
  ];

  // Show these 4 platforms on the top-right (same icons as the footer)
  const topSocials = state.socials
    .filter((s) => s.enabled && ["github", "telegram", "instagram", "x"].includes(s.icon))
    .slice(0, 4);

  return (
    <header
      className={`fixed top-0 inset-x-0 h-16 nav-blur z-50 px-4 md:px-6 flex items-center justify-between border-b ${
        dir === "rtl" ? "flex-row-reverse" : ""
      }`}
      style={{ borderColor: "var(--outline-variant)" }}
    >
      <div className={`flex items-center gap-4 md:gap-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
        <Link
          href="/"
          className={`flex items-center gap-3 group ${dir === "rtl" ? "flex-row-reverse" : ""}`}
        >
          <Logo size={36} />
          <span className="font-bold tracking-tight text-xl hidden sm:block">
            {language === "fa" ? state.brand.brandName.fa : state.brand.brandName.en}
          </span>
        </Link>

        <nav
          className={`hidden md:flex items-center gap-5 text-sm font-medium ${
            dir === "rtl" ? "flex-row-reverse" : ""
          }`}
        >
          {links.map((l) => {
            const active =
              pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`transition-colors hover:opacity-100 ${
                  active ? "opacity-100" : "opacity-60"
                }`}
                style={active ? { color: "var(--primary)" } : {}}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`flex items-center gap-3 md:gap-5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border"
          style={{
            background: "rgba(255,255,255,0.04)",
            borderColor: "var(--outline-variant)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full active-status"
            style={{ background: "var(--primary)" }}
          />
          <span className="text-[11px] font-mono uppercase tracking-widest opacity-70">
            {t("systemOnline")}
          </span>
        </div>

        <LangThemeSwitcher />

        <div className={`hidden md:flex gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          {topSocials.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.platform}
              className="opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: "var(--on-surface)" }}
            >
              <Icon name={s.icon} size={20} />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
