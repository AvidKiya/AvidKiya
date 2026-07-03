"use client";

import Link from "next/link";
import { useState } from "react";
import { useCms } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";
import LangThemeSwitcher from "@/components/ui/LangThemeSwitcher";
import Logo from "@/components/ui/Logo";
import LoginScreen from "./LoginScreen";
import IdentityEditor from "./sections/IdentityEditor";
import SocialsEditor from "./sections/SocialsEditor";
import DashboardEditor from "./sections/DashboardEditor";
import AboutEditor from "./sections/AboutEditor";
import ProjectsEditor from "./sections/ProjectsEditor";
import ResumeEditor from "./sections/ResumeEditor";
import GiftsEditor from "./sections/GiftsEditor";
import AnnouncementsEditor from "./sections/AnnouncementsEditor";
import CommentsEditor from "./sections/CommentsEditor";
import ShopEditor from "./sections/ShopEditor";
import MessagesEditor from "./sections/MessagesEditor";
import SettingsEditor from "./sections/SettingsEditor";
import Icon from "@/components/ui/Icon";

type SectionId =
  | "overview"
  | "identity"
  | "socials"
  | "dashboard"
  | "about"
  | "projects"
  | "resume"
  | "gifts"
  | "announcements"
  | "comments"
  | "shop"
  | "messages"
  | "settings";

export default function AdminPanel() {
  const {
    isAdmin,
    state,
    editMode,
    setEditMode,
    logout,
    exportJson,
    importJson,
    reset,
  } = useCms();
  const { t, language, dir } = useApp();
  const [section, setSection] = useState<SectionId>("overview");
  const [showImport, setShowImport] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  if (!isAdmin) return <LoginScreen />;

  const SECTIONS: { id: SectionId; label: string; icon: string; badge?: number }[] = [
    { id: "overview", label: t("adminOverview"), icon: "dashboard" },
    { id: "identity", label: t("adminIdentity"), icon: "account_circle" },
    { id: "socials", label: t("adminSocials"), icon: "share" },
    { id: "dashboard", label: t("adminDashboard"), icon: "home" },
    { id: "about", label: t("adminAbout"), icon: "person" },
    { id: "projects", label: t("adminProjects"), icon: "folder" },
    { id: "resume", label: t("adminResume"), icon: "description" },
    { id: "gifts", label: t("adminGifts"), icon: "rocket_launch" },
    { id: "announcements", label: t("adminAnnouncements"), icon: "campaign" },
    {
      id: "comments",
      label: t("adminComments"),
      icon: "message",
      badge: state.comments.filter((c) => !c.approved).length || undefined,
    },
    { id: "shop", label: t("adminShop"), icon: "shopping_cart" },
    {
      id: "messages",
      label: t("adminMessages"),
      icon: "inbox",
      badge: state.messages.filter((m) => !m.read).length || undefined,
    },
    { id: "settings", label: t("adminSettings"), icon: "settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <header
        className="h-14 border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 nav-blur"
        style={{ borderColor: "var(--outline-variant)" }}
      >
        <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <button
            onClick={() => setMobileNav(!mobileNav)}
            className="lg:hidden w-10 h-10 rounded-lg grid place-items-center"
            style={{
              background: mobileNav ? "var(--primary)" : "transparent",
              color: mobileNav ? "var(--on-primary)" : "var(--on-surface)",
              border: "1px solid var(--outline-variant)",
            }}
          >
            <Icon name={mobileNav ? "close" : "menu"} size={18} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span
              className="text-sm font-bold hidden sm:inline"
              style={{ color: "var(--on-surface)" }}
            >
              {language === "fa" ? "پنل مدیریت" : "ADMIN"} · {language === "fa" ? state.brand.brandName.fa : state.brand.brandName.en}
            </span>
          </Link>
        </div>

        <div className={`flex items-center gap-2 md:gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1"
            style={{
              background: editMode ? "var(--primary)" : "transparent",
              color: editMode ? "var(--on-primary)" : "var(--on-surface)",
              border: `1px solid ${editMode ? "var(--primary)" : "var(--outline-variant)"}`,
            }}
          >
            <Icon name={editMode ? "check_circle" : "edit"} size={14} />
            <span className="hidden sm:inline">
              {editMode ? t("adminEditing") : t("adminEditMode")}
            </span>
          </button>
          <LangThemeSwitcher />
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-full border"
            style={{ borderColor: "var(--outline-variant)", color: "var(--on-surface)" }}
          >
            <Icon name="logout" size={14} className="me-1" />
            <span className="hidden sm:inline">{t("adminLogout")}</span>
          </button>
        </div>
      </header>

      <div className={`flex-1 flex ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
        {/* Sidebar */}
        <aside
          className={`shrink-0 border-inline-end lg:sticky lg:top-14 ${
            mobileNav
              ? "fixed inset-y-0 z-40 top-14 w-64"
              : "hidden lg:block w-56 lg:w-64"
          }`}
          style={{
            borderInlineEndWidth: 1,
            borderInlineEndStyle: "solid",
            borderColor: "var(--outline-variant)",
            background: "var(--surface-container-low)",
            height: "calc(100vh - 56px)",
            overflowY: "auto",
          }}
        >
          <nav className="p-3 flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSection(s.id);
                  setMobileNav(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-all text-start ${
                  dir === "rtl" ? "flex-row-reverse text-right" : "text-left"
                }`}
                style={{
                  background: section === s.id ? "rgba(33,241,168,0.12)" : "transparent",
                  color: section === s.id ? "var(--primary)" : "var(--on-surface)",
                }}
              >
                <Icon name={s.icon} size={18} />
                <span className="flex-1">{s.label}</span>
                {s.badge != null && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: "var(--primary)", color: "var(--on-primary)" }}
                  >
                    {s.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div
            className="p-3 border-t space-y-2"
            style={{ borderColor: "var(--outline-variant)" }}
          >
            <button
              onClick={() => {
                const blob = new Blob([exportJson()], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `avidkiya-cms-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full text-xs px-3 py-2 rounded border flex items-center gap-2 justify-center"
              style={{ borderColor: "var(--outline-variant)", color: "var(--on-surface)" }}
            >
              <Icon name="download" size={14} />
              {t("adminExport")}
            </button>
            <button
              onClick={() => setShowImport(true)}
              className="w-full text-xs px-3 py-2 rounded border flex items-center gap-2 justify-center"
              style={{ borderColor: "var(--outline-variant)", color: "var(--on-surface)" }}
            >
              <Icon name="upload" size={14} />
              {t("adminImport")}
            </button>
            <button
              onClick={() => {
                if (
                  confirm(
                    language === "fa"
                      ? "بازنشانی همه چیز به مقادیر پیش‌فرض؟"
                      : "Reset everything to defaults?"
                  )
                )
                  reset();
              }}
              className="w-full text-xs px-3 py-2 rounded border flex items-center gap-2 justify-center"
              style={{ borderColor: "rgba(255,180,171,0.5)", color: "#ffb4ab" }}
            >
              <Icon name="restart_alt" size={14} />
              {t("adminReset")}
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {section === "overview" && <Overview onGo={setSection} />}
          {section === "identity" && <IdentityEditor />}
          {section === "socials" && <SocialsEditor />}
          {section === "dashboard" && <DashboardEditor />}
          {section === "about" && <AboutEditor />}
          {section === "projects" && <ProjectsEditor />}
          {section === "resume" && <ResumeEditor />}
          {section === "gifts" && <GiftsEditor />}
          {section === "announcements" && <AnnouncementsEditor />}
          {section === "comments" && <CommentsEditor />}
          {section === "shop" && <ShopEditor />}
          {section === "messages" && <MessagesEditor />}
          {section === "settings" && <SettingsEditor />}
        </main>
      </div>

      {showImport && (
        <ImportModal onClose={() => setShowImport(false)} onImport={importJson} />
      )}
    </div>
  );
}

function Overview({ onGo }: { onGo: (s: SectionId) => void }) {
  const { state } = useCms();
  const { t, language } = useApp();
  const unread = state.messages.filter((m) => !m.read).length;
  const pending = state.comments.filter((c) => !c.approved).length;

  const cards: {
    id: SectionId;
    label: string;
    sub: string;
    icon: string;
    hot?: boolean;
  }[] = [
    { id: "identity", label: t("adminIdentity"), sub: state.identity.fullName.en, icon: "account_circle" },
    { id: "socials", label: t("adminSocials"), sub: `${state.socials.length} networks`, icon: "share" },
    { id: "dashboard", label: t("adminDashboard"), sub: `${state.dashboard.projects.length} · ${state.dashboard.stats.length}`, icon: "home" },
    { id: "about", label: t("adminAbout"), sub: `${state.about.metrics.length} metrics`, icon: "person" },
    { id: "projects", label: t("adminProjects"), sub: `${state.projects.customProjects.length} custom`, icon: "folder" },
    { id: "resume", label: t("adminResume"), sub: `${state.resume.experience.length} roles`, icon: "description" },
    { id: "gifts", label: t("adminGifts"), sub: `${state.gifts.downloads.length} downloads`, icon: "rocket_launch" },
    { id: "announcements", label: t("adminAnnouncements"), sub: `${state.announcements.length} items`, icon: "campaign" },
    { id: "comments", label: t("adminComments"), sub: `${state.comments.length} · ${pending} pending`, icon: "message", hot: pending > 0 },
    { id: "shop", label: t("adminShop"), sub: `${state.shop.products.length} products`, icon: "shopping_cart" },
    { id: "messages", label: t("adminMessages"), sub: `${state.messages.length} · ${unread} unread`, icon: "inbox", hot: unread > 0 },
    { id: "settings", label: t("adminSettings"), sub: `@${state.settings.githubUsername}`, icon: "settings" },
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--on-surface)" }}>
        {t("adminWelcome")}, {language === "fa" ? state.identity.fullName.fa : state.identity.fullName.en}
      </h1>
      <p className="opacity-70 mb-8" style={{ color: "var(--on-surface-variant)" }}>
        {language === "fa"
          ? "همه چیز از اینجا قابل ویرایش است. حالت ویرایش را روشن کن تا آیکون ✎ کنار هر متن روی صفحه ظاهر شود."
          : "Everything is editable from here. Toggle Edit mode to see ✎ pencils on the live pages."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => onGo(c.id)}
            className="glass-panel rounded-lg p-5 text-start transition-all hover:-translate-y-0.5"
            style={{ background: "var(--surface-container-solid)" }}
          >
            <div className="flex justify-between items-start mb-3">
              <div
                className="p-2.5 rounded-lg"
                style={{
                  background: c.hot ? "var(--primary)" : "rgba(33,241,168,0.1)",
                  color: c.hot ? "var(--on-primary)" : "var(--primary)",
                }}
              >
                <Icon name={c.icon} size={20} />
              </div>
              <Icon name="arrow_outward" size={16} color="var(--on-surface-variant)" />
            </div>
            <h3 className="font-bold text-lg mb-1" style={{ color: "var(--on-surface)" }}>
              {c.label}
            </h3>
            <p className="text-xs opacity-70" style={{ color: "var(--on-surface-variant)" }}>
              {c.sub}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ImportModal({
  onClose,
  onImport,
}: {
  onClose: () => void;
  onImport: (json: string) => boolean;
}) {
  const [text, setText] = useState("");
  const [err, setErr] = useState<string | null>(null);
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl overflow-hidden"
        style={{ background: "var(--surface-container-solid)", border: "1px solid var(--outline-variant)" }}
      >
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: "var(--outline-variant)" }}>
          <h3 className="font-bold" style={{ color: "var(--primary)" }}>Import CMS JSON</h3>
          <button onClick={onClose}><Icon name="close" size={20} /></button>
        </div>
        <div className="p-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            className="w-full rounded-md px-3 py-2 text-xs font-mono outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--outline-variant)", color: "var(--on-surface)" }}
            placeholder='{"version":1,...}'
          />
          {err && <div className="text-xs" style={{ color: "#ffb4ab" }}>{err}</div>}
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded border text-sm" style={{ borderColor: "var(--outline-variant)", color: "var(--on-surface)" }}>
              Cancel
            </button>
            <button
              onClick={() => {
                const ok = onImport(text);
                if (!ok) setErr("Invalid JSON.");
                else onClose();
              }}
              className="px-4 py-2 rounded text-sm font-bold"
              style={{ background: "var(--primary)", color: "var(--on-primary)" }}
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
