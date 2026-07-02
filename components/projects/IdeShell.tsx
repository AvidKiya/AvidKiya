"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import { siteConfig } from "@/lib/config";
import {
  CustomProject,
  fetchUser,
  fetchUserRepos,
  formatRepoSize,
  GithubRepo,
  GithubUser,
  languageColor,
  loadCustomProjects,
  saveCustomProjects,
} from "@/lib/github";
import ProjectCard from "./ProjectCard";
import CustomProjectModal from "./CustomProjectModal";
import LangThemeSwitcher from "@/components/ui/LangThemeSwitcher";

type Filter = "all" | "active" | "archived" | "custom";
type Sort = "updated" | "stars" | "name";

export default function IdeShell() {
  const { t, dir, language } = useApp();

  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [custom, setCustom] = useState<CustomProject[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("updated");
  const [activeTab, setActiveTab] = useState<"about" | "skills" | "contact">("about");

  useEffect(() => {
    setCustom(loadCustomProjects());
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [r, u] = await Promise.all([
          fetchUserRepos(siteConfig.githubUsername),
          fetchUser(siteConfig.githubUsername),
        ]);
        setRepos(r.filter((x) => !x.fork));
        setUser(u);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredRepos = useMemo(() => {
    let list = repos.slice();
    if (filter === "active") list = list.filter((r) => !r.archived);
    if (filter === "archived") list = list.filter((r) => r.archived);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          (r.description ?? "").toLowerCase().includes(s) ||
          r.topics?.some((t) => t.toLowerCase().includes(s))
      );
    }
    switch (sort) {
      case "stars":
        list.sort((a, b) => b.stargazers_count - a.stargazers_count);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort(
          (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
        );
    }
    return list;
  }, [repos, q, filter, sort]);

  const displayCustom = filter === "custom" || filter === "all";

  function handleAddCustom(p: CustomProject) {
    const next = [p, ...custom];
    setCustom(next);
    saveCustomProjects(next);
    setShowModal(false);
  }
  function handleRemoveCustom(id: string) {
    const next = custom.filter((c) => c.id !== id);
    setCustom(next);
    saveCustomProjects(next);
  }

  const explorerSide = dir === "rtl" ? "right" : "left";

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* ─── Title bar (VS Code style) ───────────────────────── */}
      <header
        className="h-10 flex items-center justify-between px-4 border-b shrink-0"
        style={{
          background: "var(--surface-container-lowest, #08100b)",
          borderColor: "var(--outline-variant)",
        }}
      >
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              className="w-5 h-5 rounded flex items-center justify-center font-bold text-[11px]"
              style={{ background: "var(--primary)", color: "var(--on-primary)" }}
            >
              A
            </span>
            <span
              className="font-mono text-[11px] tracking-widest opacity-60"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {t("ideTitle")}
            </span>
          </Link>
          <nav
            className="hidden md:flex items-center text-xs gap-4"
            style={{ color: "var(--on-surface-variant)" }}
          >
            {["File", "Edit", "View", "Go", "Run", "Terminal", "Help"].map((x) => (
              <button key={x} className="hover:opacity-100 opacity-70 transition-opacity">
                {x}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div
            className="rounded-md px-3 py-1 flex items-center gap-2 text-xs border"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "var(--outline-variant)",
              color: "var(--on-surface-variant)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              search
            </span>
            <span className="opacity-70">
              {language === "fa" ? "جستجو در پرتفولیو اوید کیا" : "Search AVID KIYA Portfolio"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LangThemeSwitcher />
          <Link
            href="/"
            className="text-xs opacity-70 hover:opacity-100 transition-opacity px-2"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              home
            </span>
          </Link>
        </div>
      </header>

      {/* ─── Body: activity bar + explorer + editor ─────────── */}
      <div className={`flex flex-1 overflow-hidden ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
        {/* Activity icon bar */}
        <aside
          className="w-12 flex flex-col items-center py-4 gap-6 shrink-0 border-inline-end"
          style={{
            background: "var(--surface-container-lowest, #08100b)",
            borderColor: "var(--outline-variant)",
            borderInlineEndWidth: 1,
            borderInlineEndStyle: "solid",
          }}
        >
          <ActivityIcon icon="file_copy" active />
          <ActivityIcon icon="search" />
          <ActivityIcon icon="account_tree" />
          <ActivityIcon icon="bug_report" />
          <ActivityIcon icon="extension" />
          <div className="mt-auto flex flex-col gap-5">
            <Link href="/admin">
              <ActivityIcon icon="admin_panel_settings" />
            </Link>
            <ActivityIcon icon="settings" />
          </div>
        </aside>

        {/* Explorer */}
        <aside
          className="w-64 shrink-0 flex flex-col border-inline-end overflow-hidden"
          style={{
            background: "var(--surface-container-low)",
            borderColor: "var(--outline-variant)",
            borderInlineEndWidth: 1,
            borderInlineEndStyle: "solid",
          }}
        >
          <div className="px-4 py-3 flex justify-between items-center shrink-0">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {t("ideExplorer")}
            </span>
            <span
              className="material-symbols-outlined text-sm cursor-pointer opacity-60"
              style={{ color: "var(--on-surface-variant)" }}
            >
              more_horiz
            </span>
          </div>

          <div className="flex-1 overflow-y-auto text-xs" style={{ color: "var(--on-surface-variant)" }}>
            {/* SRC */}
            <ExplorerSection title={t("ideSectionSrc")}>
              <ExplorerFile
                label={t("ideAbout")}
                icon="description"
                iconColor="var(--primary)"
                active={activeTab === "about"}
                onClick={() => setActiveTab("about")}
              />
              <ExplorerFile
                label={t("ideSkills")}
                icon="code"
                iconColor="#efc051"
                active={activeTab === "skills"}
                onClick={() => setActiveTab("skills")}
              />
              <ExplorerFile
                label={t("ideContact")}
                icon="terminal"
                iconColor="#98d3b9"
                active={activeTab === "contact"}
                onClick={() => setActiveTab("contact")}
              />
            </ExplorerSection>

            {/* PROJECTS */}
            <ExplorerSection title={t("ideSectionProjects")}>
              {loading && (
                <div className="px-4 py-2 opacity-60 text-[11px]">{t("loadingRepos")}</div>
              )}
              {!loading &&
                repos.slice(0, 12).map((r) => (
                  <ExplorerFile
                    key={r.id}
                    label={r.name + "/"}
                    icon="folder"
                    iconColor="var(--primary)"
                    onClick={() => window.open(r.html_url, "_blank")}
                  />
                ))}
            </ExplorerSection>

            {/* CUSTOM */}
            {custom.length > 0 && (
              <ExplorerSection title={t("ideSectionCustom")}>
                {custom.map((c) => (
                  <ExplorerFile
                    key={c.id}
                    label={c.name}
                    icon="star"
                    iconColor="#efc051"
                    onClick={() => window.open(c.url, "_blank")}
                  />
                ))}
              </ExplorerSection>
            )}
          </div>
        </aside>

        {/* Editor / main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div
            className="h-9 flex items-center border-b overflow-x-auto shrink-0"
            style={{
              background: "var(--surface-container-low)",
              borderColor: "var(--outline-variant)",
            }}
          >
            <EditorTab
              icon="description"
              label={t("ideAbout")}
              active={activeTab === "about"}
              onClick={() => setActiveTab("about")}
            />
            <EditorTab
              icon="code"
              iconColor="#efc051"
              label={t("ideSkills")}
              active={activeTab === "skills"}
              onClick={() => setActiveTab("skills")}
            />
            <EditorTab
              icon="terminal"
              label={t("ideContact")}
              active={activeTab === "contact"}
              onClick={() => setActiveTab("contact")}
            />
          </div>

          {/* Editor content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6" style={{ background: "var(--bg)" }}>
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Hero panel */}
              <HeroPanel user={user} />

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2
                  className="text-2xl font-bold flex items-center gap-3"
                  style={{ color: "var(--on-surface)" }}
                >
                  <span className="material-symbols-outlined" style={{ color: "var(--primary)" }}>
                    extension
                  </span>
                  {t("activeModules")}
                  <span
                    className="text-xs opacity-60 font-mono"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    {t("modulesListing")} @{siteConfig.githubUsername}
                  </span>
                </h2>

                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded border text-xs"
                    style={{
                      background: "var(--surface-container-solid)",
                      borderColor: "var(--outline-variant)",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      search
                    </span>
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder={t("searchRepos")}
                      className="bg-transparent outline-none w-40"
                      style={{ color: "var(--on-surface)" }}
                    />
                  </div>

                  <FilterChip label={t("filterAll")} active={filter === "all"} onClick={() => setFilter("all")} />
                  <FilterChip label={t("filterActive")} active={filter === "active"} onClick={() => setFilter("active")} />
                  <FilterChip label={t("filterArchived")} active={filter === "archived"} onClick={() => setFilter("archived")} />

                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className="text-xs rounded border px-2 py-1.5 outline-none"
                    style={{
                      background: "var(--surface-container-solid)",
                      borderColor: "var(--outline-variant)",
                      color: "var(--on-surface)",
                    }}
                  >
                    <option value="updated">{t("sortUpdated")}</option>
                    <option value="stars">{t("sortStars")}</option>
                    <option value="name">{t("sortName")}</option>
                  </select>

                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-bold"
                    style={{ background: "var(--primary)", color: "var(--on-primary)" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      add
                    </span>
                    {t("addCustomProject")}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="glass-panel rounded-lg p-4 flex items-center justify-between"
                  style={{ borderColor: "rgba(255,180,171,0.4)" }}
                >
                  <span style={{ color: "#ffb4ab" }}>
                    {t("errorLoading")}: {error}
                  </span>
                  <button
                    onClick={() => location.reload()}
                    className="text-xs px-3 py-1 rounded border"
                    style={{ borderColor: "var(--outline-variant)", color: "var(--on-surface)" }}
                  >
                    {t("retry")}
                  </button>
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {loading &&
                  Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

                {!loading &&
                  displayCustom &&
                  custom.map((c) => (
                    <ProjectCard
                      key={c.id}
                      title={c.name}
                      description={language === "fa" && c.descriptionFa ? c.descriptionFa : c.description}
                      url={c.url}
                      language={c.language ?? null}
                      topics={c.topics ?? []}
                      status={c.status ?? "STABLE"}
                      isCustom
                      onRemove={() => handleRemoveCustom(c.id)}
                    />
                  ))}

                {!loading &&
                  filter !== "custom" &&
                  filteredRepos.map((r) => (
                    <ProjectCard
                      key={r.id}
                      title={r.name}
                      description={r.description ?? ""}
                      url={r.html_url}
                      homepage={r.homepage}
                      language={r.language}
                      topics={r.topics ?? []}
                      status={r.archived ? "ARCHIVED" : "STABLE"}
                      stars={r.stargazers_count}
                      forks={r.forks_count}
                      size={formatRepoSize(r.size)}
                      updatedAt={r.pushed_at}
                    />
                  ))}

                {!loading && !error && filteredRepos.length === 0 && custom.length === 0 && (
                  <div className="col-span-full text-center py-12 opacity-60">
                    {t("noProjects")}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terminal */}
          <TerminalPanel repos={repos} user={user} loading={loading} />
        </main>
      </div>

      {/* Status bar */}
      <footer
        className="h-6 px-3 flex items-center justify-between text-[11px] font-mono shrink-0"
        style={{ background: "#17523f", color: "#dbe5dd" }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-2 h-full" style={{ background: "rgba(0,0,0,0.1)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              account_tree
            </span>
            <span>main*</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: user ? "var(--primary-fixed)" : "#efc051" }}
            />
            <span>{user ? t("githubStatus") : "Reconnecting..."}</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              sync
            </span>
            <span>
              {repos.length} repos ↓ · {custom.length} custom ↑
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span>UTF-8</span>
          <span>Spaces: 2</span>
          <span>{language === "fa" ? "فارسی" : "English"}</span>
        </div>
      </footer>

      {showModal && (
        <CustomProjectModal onClose={() => setShowModal(false)} onSave={handleAddCustom} />
      )}
    </div>
  );
}

/* ────────────────────────── sub-components ────────────────────────── */

function ActivityIcon({ icon, active }: { icon: string; active?: boolean }) {
  return (
    <div
      className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
      style={{
        color: active ? "var(--primary)" : "var(--on-surface-variant)",
        opacity: active ? 1 : undefined,
      }}
    >
      <span className="material-symbols-outlined">{icon}</span>
    </div>
  );
}

function ExplorerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-1">
      <div
        className="flex items-center gap-1 px-2 py-1 cursor-pointer"
        style={{ background: "var(--surface-container-high)" }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          expand_more
        </span>
        <span className="font-bold text-[11px] uppercase">{title}</span>
      </div>
      <div className="pl-4 py-1">{children}</div>
    </div>
  );
}

function ExplorerFile({
  label,
  icon,
  iconColor,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  iconColor?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1 cursor-pointer transition-colors"
      style={{
        color: active ? "var(--primary)" : undefined,
        background: active ? "rgba(33,241,168,0.08)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "rgba(33,241,168,0.06)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16, color: iconColor }}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
}

function EditorTab({
  icon,
  iconColor,
  label,
  active,
  onClick,
}: {
  icon: string;
  iconColor?: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="h-full px-4 flex items-center gap-2 text-xs min-w-max cursor-pointer border-inline-end"
      style={{
        background: active ? "rgba(33,241,168,0.12)" : "transparent",
        color: active ? "var(--primary)" : "var(--on-surface-variant)",
        borderInlineEndWidth: 1,
        borderInlineEndStyle: "solid",
        borderColor: "var(--outline-variant)",
        borderBottom: active ? `2px solid var(--primary)` : "2px solid transparent",
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 14, color: iconColor }}>
        {icon}
      </span>
      <span>{label}</span>
      <span
        className="material-symbols-outlined opacity-40 hover:opacity-100"
        style={{ fontSize: 12, marginInlineStart: 8 }}
      >
        close
      </span>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1.5 rounded border transition-colors"
      style={{
        background: active ? "var(--primary)" : "var(--surface-container-solid)",
        color: active ? "var(--on-primary)" : "var(--on-surface)",
        borderColor: active ? "var(--primary)" : "var(--outline-variant)",
      }}
    >
      {label}
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-panel rounded-lg p-5 animate-pulse">
      <div className="h-4 w-1/2 rounded mb-3" style={{ background: "var(--surface-container-highest)" }} />
      <div className="h-3 w-3/4 rounded mb-2" style={{ background: "var(--surface-container-highest)" }} />
      <div className="h-3 w-2/3 rounded mb-6" style={{ background: "var(--surface-container-highest)" }} />
      <div className="flex gap-2">
        <div className="h-4 w-10 rounded" style={{ background: "var(--surface-container-highest)" }} />
        <div className="h-4 w-10 rounded" style={{ background: "var(--surface-container-highest)" }} />
      </div>
    </div>
  );
}

function HeroPanel({ user }: { user: GithubUser | null }) {
  const { t, language } = useApp();
  const displayName =
    language === "fa" ? siteConfig.identity.fullNameFa : user?.name ?? siteConfig.identity.fullNameEn;
  const title = language === "fa" ? siteConfig.identity.titleFa : siteConfig.identity.titleEn;
  const location = language === "fa" ? siteConfig.identity.locationFa : siteConfig.identity.locationEn;

  return (
    <div className="glass-panel p-6 md:p-8 rounded-xl relative overflow-hidden group">
      <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
        <div className="w-32 md:w-44 shrink-0">
          <div
            className="p-2 rounded-lg border overflow-hidden"
            style={{
              background: "var(--surface-container-highest)",
              borderColor: "rgba(33,241,168,0.2)",
            }}
          >
            {user ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={displayName}
                className="w-full h-auto rounded"
                style={{ filter: "drop-shadow(0 0 15px rgba(33,241,168,0.3))" }}
              />
            ) : (
              <div
                className="aspect-square w-full rounded flex items-center justify-center text-4xl font-bold"
                style={{ background: "var(--primary)", color: "var(--on-primary)" }}
              >
                A
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 w-full">
          <div
            className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest mb-3 border"
            style={{
              background: "rgba(33,241,168,0.1)",
              color: "var(--primary)",
              borderColor: "rgba(33,241,168,0.25)",
            }}
          >
            SYSTEM_OVERVIEW_V4
          </div>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--on-surface)" }}>
            {displayName}
          </h1>
          <p className="opacity-80 text-lg font-medium mb-5" style={{ color: "var(--primary)" }}>
            {title}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <MetaTile label="LOCATION" value={location} />
            <MetaTile label="STATUS" value={t("systemOnline")} valueColor="var(--primary-fixed)" />
            <MetaTile
              label="REPOS"
              value={user ? String(user.public_repos) : "—"}
            />
            <MetaTile
              label="FOLLOWERS"
              value={user ? String(user.followers) : "—"}
            />
          </div>
        </div>
      </div>

      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl transition-colors"
        style={{ background: "rgba(33,241,168,0.06)" }}
      />
    </div>
  );
}

function MetaTile({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      className="p-3 rounded-lg border"
      style={{
        background: "rgba(0,0,0,0.2)",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <div className="mb-1 opacity-60" style={{ color: "var(--on-surface-variant)" }}>
        {label}
      </div>
      <div style={{ color: valueColor ?? "var(--on-surface)" }}>{value}</div>
    </div>
  );
}

function TerminalPanel({
  repos,
  user,
  loading,
}: {
  repos: GithubRepo[];
  user: GithubUser | null;
  loading: boolean;
}) {
  const { t } = useApp();
  return (
    <div
      className="h-40 border-t flex flex-col shrink-0"
      style={{
        background: "var(--surface-container-lowest, #08100b)",
        borderColor: "var(--outline-variant)",
      }}
    >
      <div
        className="h-8 flex items-center px-4 gap-6 shrink-0"
        style={{ background: "var(--surface-container-low)" }}
      >
        <div
          className="text-xs font-bold h-full flex items-center px-1 border-b-2"
          style={{ borderColor: "var(--primary)", color: "var(--on-surface-variant)" }}
        >
          {t("ideTerminal")}
        </div>
        <div className="text-xs opacity-60" style={{ color: "var(--on-surface-variant)" }}>
          {t("ideProblems")}
        </div>
        <div className="text-xs opacity-60" style={{ color: "var(--on-surface-variant)" }}>
          {t("ideOutput")}
        </div>
      </div>

      <div
        className="flex-1 p-4 font-mono text-xs overflow-y-auto"
        style={{ color: "var(--on-surface-variant)" }}
      >
        <TerminalLine
          prompt="sys@avidkiya"
          path="~/portfolio"
          command="gh api /users/avidkiya"
        />
        {loading && <div className="opacity-70">→ fetching...</div>}
        {!loading && user && (
          <>
            <div className="opacity-80">→ connected as {user.login} ({user.public_repos} repos)</div>
            <div className="opacity-80">→ loaded {repos.length} owned repositories</div>
          </>
        )}
        <TerminalLine prompt="sys@avidkiya" path="~/portfolio" command="npm run deploy" />
        <div className="opacity-80">→ Compiled successfully · Ready for Cloudflare Pages</div>
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--primary)" }}>sys@avidkiya:</span>
          <span style={{ color: "var(--primary-fixed)" }}>~/portfolio</span>
          <span>$</span>
          <span
            className="inline-block w-2 h-4 align-middle"
            style={{ background: "var(--primary)", animation: "pulse-soft 1s infinite" }}
          />
        </div>
      </div>
    </div>
  );
}

function TerminalLine({
  prompt,
  path,
  command,
}: {
  prompt: string;
  path: string;
  command: string;
}) {
  return (
    <div className="mb-1">
      <span style={{ color: "var(--primary)" }}>{prompt}:</span>
      <span style={{ color: "var(--primary-fixed)" }}>{path}</span>
      <span> $ {command}</span>
    </div>
  );
}
