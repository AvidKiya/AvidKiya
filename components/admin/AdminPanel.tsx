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
  | "messages"
  | "settings";

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "dashboard" },
  { id: "identity", label: "Identity", icon: "account_circle" },
  { id: "socials", label: "Socials", icon: "share" },
  { id: "dashboard", label: "Landing Page", icon: "home" },
  { id: "about", label: "About Page", icon: "person" },
  { id: "projects", label: "Projects Page", icon: "folder" },
  { id: "resume", label: "Resume", icon: "description" },
  { id: "gifts", label: "Gifts", icon: "rocket_launch" },
  { id: "messages", label: "Messages", icon: "inbox" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function AdminPanel() {
  const { isAdmin, state, editMode, setEditMode, logout, exportJson, importJson, reset } = useCms();
  const { dir } = useApp();
  const [section, setSection] = useState<SectionId>("overview");
  const [showImport, setShowImport] = useState(false);

  if (!isAdmin) return <LoginScreen />;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <header
        className="h-14 border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 nav-blur"
        style={{ borderColor: "var(--outline-variant)" }}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-sm font-bold hidden sm:inline" style={{ color: "var(--on-surface)" }}>
              ADMIN · {state.brand.brandName.en}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
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
            <span className="hidden sm:inline">{editMode ? "Editing ON" : "Edit mode"}</span>
          </button>
          <LangThemeSwitcher />
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-full border"
            style={{
              borderColor: "var(--outline-variant)",
              color: "var(--on-surface)",
            }}
          >
            <Icon name="logout" size={14} className="align-middle me-1" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className={`flex-1 flex ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
        {/* Sidebar */}
        <aside
          className="w-56 lg:w-64 shrink-0 border-inline-end sticky top-14"
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
                onClick={() => setSection(s.id)}
                className="flex items-center gap-3 px-3 py-2 rounded text-sm transition-all text-start"
                style={{
                  background: section === s.id ? "rgba(33,241,168,0.12)" : "transparent",
                  color: section === s.id ? "var(--primary)" : "var(--on-surface)",
                }}
              >
                <Icon name={s.icon} size={18} />
                <span>{s.label}</span>
                {s.id === "messages" && state.messages.filter((m) => !m.read).length > 0 && (
                  <span
                    className="ms-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: "var(--primary)", color: "var(--on-primary)" }}
                  >
                    {state.messages.filter((m) => !m.read).length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-3 mt-auto space-y-2 border-t" style={{ borderColor: "var(--outline-variant)" }}>
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
              Export JSON
            </button>
            <button
              onClick={() => setShowImport(true)}
              className="w-full text-xs px-3 py-2 rounded border flex items-center gap-2 justify-center"
              style={{ borderColor: "var(--outline-variant)", color: "var(--on-surface)" }}
            >
              <Icon name="upload" size={14} />
              Import JSON
            </button>
            <button
              onClick={() => {
                if (confirm("Reset everything to defaults? This can't be undone.")) reset();
              }}
              className="w-full text-xs px-3 py-2 rounded border flex items-center gap-2 justify-center"
              style={{ borderColor: "rgba(255,180,171,0.5)", color: "#ffb4ab" }}
            >
              <Icon name="restart_alt" size={14} />
              Reset
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
          {section === "messages" && <MessagesEditor />}
          {section === "settings" && <SettingsEditor />}
        </main>
      </div>

      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={importJson} />}
    </div>
  );
}

function Overview({ onGo }: { onGo: (s: SectionId) => void }) {
  const { state } = useCms();
  const unread = state.messages.filter((m) => !m.read).length;

  const cards: { id: SectionId; label: string; sub: string; icon: string; hot?: boolean }[] = [
    { id: "identity", label: "Identity", sub: `${state.identity.fullName.en}`, icon: "account_circle" },
    { id: "socials", label: "Social accounts", sub: `${state.socials.length} networks`, icon: "share" },
    { id: "dashboard", label: "Landing page", sub: `${state.dashboard.projects.length} projects · ${state.dashboard.stats.length} stats`, icon: "home" },
    { id: "about", label: "About page", sub: `${state.about.metrics.length} metrics · ${state.about.miniProjects.length} projects`, icon: "person" },
    { id: "projects", label: "Custom repos", sub: `${state.projects.customProjects.length} custom projects`, icon: "folder" },
    { id: "messages", label: "Inbox", sub: `${state.messages.length} total · ${unread} unread`, icon: "inbox", hot: unread > 0 },
    { id: "settings", label: "Site settings", sub: `GitHub: @${state.settings.githubUsername}`, icon: "settings" },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--on-surface)" }}>
        Welcome back, {state.identity.fullName.en}
      </h1>
      <p className="opacity-70 mb-8" style={{ color: "var(--on-surface-variant)" }}>
        Everything on the site is editable from here.  You can also toggle{" "}
        <b style={{ color: "var(--primary)" }}>Edit mode</b> and click ✎ pencils directly on the live pages.
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
                <Icon name={c.icon} />
              </div>
              <Icon name="arrow_outward" color={"var(--on-surface)"} className="opacity-40" />
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

      <div
        className="mt-8 glass-panel rounded-lg p-5"
        style={{ background: "var(--surface-container-solid)" }}
      >
        <h3 className="font-bold mb-2" style={{ color: "var(--primary)" }}>
          Live-edit workflow
        </h3>
        <ol className="text-sm space-y-1 list-decimal ps-6" style={{ color: "var(--on-surface-variant)" }}>
          <li>Toggle <b style={{ color: "var(--primary)" }}>Edit mode</b> from the top bar (or from any page footer).</li>
          <li>Every page then shows a small ✎ next to each editable text/element.</li>
          <li>Lists (metrics, quick links, projects, activity...) gain <b>move / edit / delete</b> handles and an <b>+ Add</b> button.</li>
          <li>All changes save automatically to <code>localStorage</code>. Use <b>Export JSON</b> to back up, and push to Cloudflare KV later.</li>
        </ol>
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
        style={{
          background: "var(--surface-container-solid)",
          border: "1px solid var(--outline-variant)",
        }}
      >
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: "var(--outline-variant)" }}>
          <h3 className="font-bold" style={{ color: "var(--primary)" }}>Import CMS JSON</h3>
          <button onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs opacity-70" style={{ color: "var(--on-surface-variant)" }}>
            Paste a previously-exported JSON blob:
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            className="cms-input font-mono text-xs"
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
