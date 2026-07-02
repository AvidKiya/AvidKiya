"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import LangThemeSwitcher from "@/components/ui/LangThemeSwitcher";

export default function TopNav() {
  const { t, dir, language } = useApp();
  const { state } = useCms();
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("navWorkspace") },
    { href: "/projects", label: t("navProjects") },
    { href: "/about", label: t("navAbout") },
  ];

  const github = state.socials.find((s) => s.icon === "github");
  const telegram = state.socials.find((s) => s.icon === "telegram");

  return (
    <header
      className={`fixed top-0 inset-x-0 h-16 nav-blur z-50 px-4 md:px-6 flex items-center justify-between border-b ${
        dir === "rtl" ? "flex-row-reverse" : ""
      }`}
      style={{ borderColor: "var(--outline-variant)" }}
    >
      <div className={`flex items-center gap-4 md:gap-8 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
        <Link href="/" className={`flex items-center gap-3 group ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-105"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            {state.brand.logoLetter}
          </div>
          <span className="font-bold tracking-tight text-xl hidden sm:block">
            {language === "fa" ? state.brand.brandName.fa : state.brand.brandName.en}
          </span>
        </Link>

        <nav className={`hidden md:flex items-center gap-5 text-sm font-medium ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
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

        <div className="hidden md:flex gap-3 opacity-70">
          {github && (
            <a
              href={github.href}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hover:opacity-100 transition-opacity"
              style={{ color: "var(--on-surface)" }}
            >
              <span className="material-symbols-outlined text-xl">hub</span>
            </a>
          )}
          <a
            href={`mailto:${state.identity.email}`}
            className="hover:opacity-100 transition-opacity"
            style={{ color: "var(--on-surface)" }}
            aria-label="Email"
          >
            <span className="material-symbols-outlined text-xl">alternate_email</span>
          </a>
          {telegram && (
            <a
              href={telegram.href}
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="hover:opacity-100 transition-opacity"
              style={{ color: "var(--on-surface)" }}
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
