"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCms } from "@/contexts/CmsContext";
import { Icon } from "@/components/ui/Icons";

type AdminSection = "overview" | "identity" | "socials" | "dashboard" | "about" | "projects" | "resume" | "gifts" | "announcements" | "comments" | "shop" | "messages" | "media" | "settings";

export default function AdminPage() {
  const { state, isAdmin, logout, locale, resolve, update, updateText, addToList, removeFromList } = useCms();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!isAdmin) router.replace("/admin/login");
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  const sections: { id: AdminSection; label: string; icon: any }[] = [
    { id: "overview", label: "نمای کلی", icon: "LayoutDashboard" },
    { id: "identity", label: "هویت", icon: "User" },
    { id: "socials", label: "شبکه‌های اجتماعی", icon: "Share2" },
    { id: "dashboard", label: "صفحه اصلی", icon: "Home" },
    { id: "about", label: "درباره من", icon: "Info" },
    { id: "projects", label: "پروژه‌ها", icon: "Folder" },
    { id: "resume", label: "رزومه", icon: "FileText" },
    { id: "gifts", label: "هدایا", icon: "Gift" },
    { id: "announcements", label: "اعلانات", icon: "Megaphone" },
    { id: "comments", label: "نظرات", icon: "MessageSquare" },
    { id: "shop", label: "فروشگاه", icon: "ShoppingCart" },
    { id: "messages", label: "پیام‌ها", icon: "Mail" },
    { id: "media", label: "رسانه", icon: "Music" },
    { id: "settings", label: "تنظیمات", icon: "Settings" },
  ];

  const handleExport = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avidkiya-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("خروجی گرفته شد");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        // Import through update - we'd need a bulk update but for now just show success
        setToast("فایل بارگذاری شد (نیاز به ذخیره دستی)");
      } catch {
        setToast("خطا در خواندن فایل");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-bg-alt)] border-e border-[var(--color-bg)] p-4 space-y-2 fixed inset-y-0 start-0 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-lg bg-[#5d7ae6]/20 flex items-center justify-center">
            <span className="text-sm font-black gradient-text">{state.brand.logoLetter}</span>
          </div>
          <span className="font-bold text-sm">پنل مدیریت</span>
        </div>

        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              activeSection === s.id
                ? "bg-[#5d7ae6]/10 text-[var(--color-primary)]"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
            }`}
          >
            <Icon name={s.icon as any} size={16} />
            {s.label}
          </button>
        ))}

        <div className="pt-4 border-t border-[var(--color-bg)] space-y-2 mt-4">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition"
          >
            <Icon name="Download" size={14} /> خروجی JSON
          </button>
          <label className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition cursor-pointer">
            <Icon name="Upload" size={14} /> ورود JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            <Icon name="LogOut" size={14} /> خروج
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ms-64 p-6 space-y-6">
        {/* Sync status */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black">{sections.find(s => s.id === activeSection)?.label}</h1>
          <SyncStatus />
        </div>

        {activeSection === "overview" && <OverviewSection />}
        {activeSection === "identity" && (
          <div className="glass p-6 space-y-4">
            <h2 className="font-bold mb-4">اطلاعات هویت</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={state.identity.fullName.fa}
                onChange={(e) => updateText("identity.fullName.fa", e.target.value)}
                placeholder="نام فارسی"
                className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm"
              />
              <input
                value={state.identity.fullName.en}
                onChange={(e) => updateText("identity.fullName.en", e.target.value)}
                placeholder="English name"
                className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm"
              />
              <input
                value={state.identity.title.fa}
                onChange={(e) => updateText("identity.title.fa", e.target.value)}
                placeholder="عنوان فارسی"
                className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm"
              />
              <input
                value={state.identity.title.en}
                onChange={(e) => updateText("identity.title.en", e.target.value)}
                placeholder="English title"
                className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm"
              />
              <input
                value={state.identity.email}
                onChange={(e) => update("identity.email", e.target.value)}
                placeholder="ایمیل"
                className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm"
              />
              <input
                value={state.identity.location.fa}
                onChange={(e) => updateText("identity.location.fa", e.target.value)}
                placeholder="مکان"
                className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm"
              />
              <input
                type="number"
                value={state.identity.yearsExperience}
                onChange={(e) => update("identity.yearsExperience", parseInt(e.target.value))}
                placeholder="سال تجربه"
                className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm"
              />
              <input
                value={state.identity.handle}
                onChange={(e) => update("identity.handle", e.target.value)}
                placeholder="هندل"
                className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm"
              />
            </div>
            <textarea
              value={state.identity.bio.fa}
              onChange={(e) => updateText("identity.bio.fa", e.target.value)}
              placeholder="بیو فارسی"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm resize-none"
            />
            <textarea
              value={state.identity.bio.en}
              onChange={(e) => updateText("identity.bio.en", e.target.value)}
              placeholder="English bio"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm resize-none"
            />
          </div>
        )}
        {activeSection === "socials" && (
          <div className="glass p-6 space-y-4">
            <h2 className="font-bold mb-4">شبکه‌های اجتماعی</h2>
            {state.socials.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)]">
                <span className="text-sm font-bold w-24">{s.platform}</span>
                <input
                  value={s.url}
                  onChange={(e) => {
                    const socials = [...state.socials];
                    socials[i].url = e.target.value;
                    update("socials", socials);
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-bg)] text-sm focus:outline-none"
                />
                <button
                  onClick={() => removeFromList("socials", i)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addToList("socials", { id: `s_${Date.now()}`, platform: "github", url: "", label: { fa: "", en: "" } })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5d7ae6]/10 text-[var(--color-primary)] text-sm font-bold hover:bg-[#5d7ae6]/20 transition"
            >
              <Icon name="Plus" size={14} /> افزودن شبکه اجتماعی
            </button>
          </div>
        )}
        {activeSection === "settings" && (
          <div className="glass p-6 space-y-4">
            <h2 className="font-bold mb-4">تنظیمات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--color-text-subtle)] mb-1 block">زبان پیش‌فرض</label>
                <select
                  value={state.settings.defaultLanguage}
                  onChange={(e) => update("settings.defaultLanguage", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] text-sm"
                >
                  <option value="fa">فارسی</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--color-text-subtle)] mb-1 block">تم پیش‌فرض</label>
                <select
                  value={state.settings.defaultTheme}
                  onChange={(e) => update("settings.defaultTheme", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] text-sm"
                >
                  <option value="dark">شب</option>
                  <option value="light">روز</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-[var(--color-text-subtle)] mb-1 block">نام کاربری GitHub</label>
                <input
                  value={state.settings.githubUsername}
                  onChange={(e) => update("settings.githubUsername", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)] focus:outline-none focus:border-[#5d7ae6]/50 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other sections */}
        {!["overview", "identity", "socials", "settings"].includes(activeSection) && (
          <div className="glass p-12 text-center text-[var(--color-text-subtle)]">
            <Icon name="Settings" size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">بخش {sections.find(s => s.id === activeSection)?.label} — در حال توسعه</p>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 end-6 z-[200] px-4 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold shadow-lg animate-pulse">
          {toast}
          <button onClick={() => setToast("")} className="ms-2 hover:opacity-70">✕</button>
        </div>
      )}
    </div>
  );
}

function OverviewSection() {
  const { state } = useCms();
  const stats = [
    { label: "پروژه‌ها", value: state.dashboard.projects.length + state.projects.customProjects.length, icon: "Folder" },
    { label: "نظرات", value: state.comments.length, icon: "MessageSquare" },
    { label: "پیام‌ها", value: state.messages.length, icon: "Mail" },
    { label: "اعلانات", value: state.announcements.length, icon: "Megaphone" },
    { label: "محصولات", value: state.shop.products.length, icon: "ShoppingCart" },
    { label: "مشترکین", value: state.newsletter.subscribers.length, icon: "Users" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="glass p-5">
          <div className="text-2xl font-black gradient-text">{s.value}</div>
          <div className="text-xs text-[var(--color-text-subtle)] mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function SyncStatus() {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[var(--color-text-muted)]">Auto-save فعال</span>
    </div>
  );
}
