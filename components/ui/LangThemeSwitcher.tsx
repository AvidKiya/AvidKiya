"use client";

import { useApp } from "@/contexts/AppContext";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";

/**
 * Combined language + theme switcher.
 * - Menu opens on the RIGHT in RTL (Persian) mode and on the LEFT in LTR (English) mode,
 *   as required.
 * - Persists selection in localStorage via AppContext.
 */
export default function LangThemeSwitcher() {
  const { language, theme, setLanguage, setTheme, toggleTheme, toggleLanguage, t, dir, mounted } =
    useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Prevent hydration mismatch flash
  if (!mounted) {
    return (
      <div
        className="w-9 h-9 rounded-full border"
        style={{ borderColor: "var(--outline-variant)" }}
        aria-hidden
      />
    );
  }

  const menuSide =
    dir === "rtl" ? "right-0" : "left-0"; // in RTL the trigger is on the left-of-cluster so menu drops right; adjust as needed
  // NOTE: the requirement says: menu on the RIGHT for FA, on the LEFT for EN.
  const menuAlign = dir === "rtl" ? "right-0" : "left-0";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors hover:opacity-100 opacity-80"
        style={{
          borderColor: "var(--outline-variant)",
          background: "rgba(255,255,255,0.03)",
        }}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Icon name="language" size={16} />
        <span className="font-mono uppercase tracking-widest">
          {language === "fa" ? "فا" : "EN"}
        </span>
        <span
          className="inline-block w-px h-3"
          style={{ background: "var(--outline-variant)" }}
        />
        <Icon name={theme === "dark" ? "dark_mode" : "light_mode"} size={16} />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute top-full mt-2 ${menuAlign} w-56 rounded-lg overflow-hidden glass-panel z-50`}
          style={{ background: "var(--surface-container-solid)" }}
          dir={dir}
        >
          <div className="p-3">
            <div
              className="text-[10px] uppercase tracking-widest mb-2 opacity-60"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {t("languageLabel")}
            </div>
            <div className="flex gap-2 mb-4">
              <MenuChip
                active={language === "fa"}
                onClick={() => setLanguage("fa")}
                label="فارسی"
              />
              <MenuChip
                active={language === "en"}
                onClick={() => setLanguage("en")}
                label="English"
              />
            </div>

            <div
              className="text-[10px] uppercase tracking-widest mb-2 opacity-60"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {t("themeLabel")}
            </div>
            <div className="flex gap-2">
              <MenuChip
                active={theme === "dark"}
                onClick={() => setTheme("dark")}
                label={t("toggleThemeDark")}
                icon="dark_mode"
              />
              <MenuChip
                active={theme === "light"}
                onClick={() => setTheme("light")}
                label={t("toggleThemeLight")}
                icon="light_mode"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 flex-1 justify-center px-2.5 py-1.5 rounded-md text-xs border transition-all"
      style={{
        background: active ? "var(--primary)" : "transparent",
        color: active ? "var(--on-primary)" : "var(--on-surface)",
        borderColor: active ? "var(--primary)" : "var(--outline-variant)",
      }}
    >
      {icon && (
        <Icon name={icon} size={14} />
      )}
      {label}
    </button>
  );
}
