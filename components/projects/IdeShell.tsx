"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import { useCms } from "@/contexts/CmsContext";
import {
  fetchUser,
  fetchUserRepos,
  formatRepoSize,
  GithubRepo,
  GithubUser,
} from "@/lib/github";
import type { CustomRepoProject } from "@/lib/cms/schema";
import ProjectCard from "./ProjectCard";
import CustomProjectModal from "./CustomProjectModal";
import LangThemeSwitcher from "@/components/ui/LangThemeSwitcher";
import Icon from "@/components/ui/Icon";

type Filter = "all" | "active" | "archived" | "custom";
type Sort = "updated" | "stars" | "name";

export default function IdeShell() {
  const { t, dir, language } = useApp();
  const { state, isAdmin, addToList, removeFromList } = useCms();

  const githubUsername = state.settings.githubUsername || "avidkiya";
  const custom = state.projects.customProjects;

  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("updated");
  const [activeTab, setActiveTab] = useState<"about" | "skills" | "contact">("about");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [r, u] = await Promise.all([
          fetchUserRepos(githubUsername),
          fetchUser(githubUsername),
        ]);
        setRepos(r.filter((x) => !x.fork));
        setUser(u);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [githubUsername]);

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

  function handleAddCustom(p: CustomRepoProject) {
    addToList<CustomRepoProject>("projects.customProjects", p);
    setShowModal(false);
  }
  function handleRemoveCustom(id: string) {
    const idx = custom.findIndex((c) => c.id === id);
    if (idx >= 0) removeFromList("projects.customProjects", idx);
  }

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
            <Icon name="search" size={14} />
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
            <Icon name="home" size={18} />
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
            <Icon name="more_horiz" color={"var(--on-surface-variant)"} className="text-sm cursor-pointer opacity-60" />
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
            {activeTab === "skills" && (
              <SkillsPanel />
            )}
            {activeTab === "contact" && (
              <ContactPanel />
            )}
            {activeTab === "about" && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Hero panel */}
              <HeroPanel user={user} />

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2
                  className="text-2xl font-bold flex items-center gap-3"
                  style={{ color: "var(--on-surface)" }}
                >
                  <Icon name="extension" color={"var(--primary)"} />
                  {t("activeModules")}
                  <span
                    className="text-xs opacity-60 font-mono"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    {t("modulesListing")} @{githubUsername}
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
                    <Icon name="search" size={14} />
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

                  {isAdmin ? (
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-bold"
                      style={{ background: "var(--primary)", color: "var(--on-primary)" }}
                    >
                      <Icon name="add" size={16} />
                      {t("addCustomProject")}
                    </button>
                  ) : (
                    <Link
                      href="/admin"
                      title={
                        language === "fa"
                          ? "برای افزودن پروژه ابتدا وارد پنل مدیریت شوید"
                          : "Log in to admin to add projects"
                      }
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border opacity-60 hover:opacity-100"
                      style={{
                        borderColor: "var(--outline-variant)",
                        color: "var(--on-surface-variant)",
                      }}
                    >
                      <Icon name="lock" size={16} />
                      {language === "fa" ? "ورود مدیر" : "Admin"}
                    </Link>
                  )}
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
                      image={c.image}
                      onRemove={isAdmin ? () => handleRemoveCustom(c.id) : undefined}
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
                      image={`https://opengraph.githubassets.com/1/${r.full_name}`}
                    />
                  ))}

                {!loading && !error && filteredRepos.length === 0 && custom.length === 0 && (
                  <div className="col-span-full text-center py-12 opacity-60">
                    {t("noProjects")}
                  </div>
                )}
              </div>
            </div>
            )}
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
            <Icon name="account_tree" size={14} />
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
            <Icon name="sync" size={14} />
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
      <Icon name={icon} />
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
        <Icon name="expand_more" size={16} />
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
      <Icon name={icon} size={16} />
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
      <Icon name={icon} size={14} />
      <span>{label}</span>
      <Icon name="close" size={12} className="opacity-40 hover:opacity-100" />
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
  const { t } = useApp();
  const { state, resolve } = useCms();
  const displayName = resolve(state.identity.fullName);
  const title = resolve(state.identity.title);
  const location = resolve(state.identity.location);

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

/* ─────────────── Skills panel (Skills.json tab) ─────────────── */
function SkillsPanel() {
  const { language } = useApp();
  const { state } = useCms();
  const s = state.resume.skills;
  const jsonPreview = JSON.stringify(
    { skills: s.map((k) => ({ name: k.name, level: k.level })) },
    null,
    2
  );
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="glass-panel rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="code" color="#efc051" size={22} />
          <h2 className="text-2xl font-bold" style={{ color: "var(--on-surface)" }}>
            Skills.json
          </h2>
          <span className="text-xs opacity-60 font-mono" style={{ color: "var(--on-surface-variant)" }}>
            {language === "fa" ? "پشته فناوری" : "Tech stack"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {s.map((k) => (
            <div key={k.id}>
              <div className="flex justify-between mb-1.5 text-sm">
                <span className="font-bold" style={{ color: "var(--on-surface)" }}>
                  {k.name}
                </span>
                <span className="font-mono opacity-70" style={{ color: "var(--on-surface-variant)" }}>
                  {k.level}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-container-highest)" }}>
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${k.level}%`,
                    background: `linear-gradient(90deg, var(--primary-dim, #00e29c), var(--primary))`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4 md:p-6" style={{ background: "rgba(0,0,0,0.35)" }}>
        <div className="text-[10px] uppercase opacity-60 mb-2 font-mono" style={{ color: "var(--on-surface-variant)" }}>
          Skills.json — raw
        </div>
        <pre
          className="font-mono text-xs overflow-x-auto"
          style={{ color: "var(--primary)", margin: 0, whiteSpace: "pre-wrap" }}
        >
{jsonPreview}
        </pre>
      </div>
    </div>
  );
}

/* ─────────────── Contact panel (Contact.sh tab) ─────────────── */
function ContactPanel() {
  const { language } = useApp();
  const { state, resolve } = useCms();
  const socials = state.socials.filter((x) => x.enabled);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="glass-panel rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="terminal" color="#98d3b9" size={22} />
          <h2 className="text-2xl font-bold" style={{ color: "var(--on-surface)" }}>
            Contact.sh
          </h2>
        </div>

        <div className="font-mono text-sm space-y-2 mb-8" style={{ color: "var(--on-surface-variant)" }}>
          <div style={{ color: "var(--primary)" }}>
            # ./contact.sh --help
          </div>
          <div>&gt; {language === "fa" ? "روش‌های ارتباطی زیر پشتیبانی می‌شوند:" : "Supported channels:"}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ContactRow
            icon="mail"
            label={language === "fa" ? "ایمیل" : "Email"}
            value={state.identity.email}
            href={`mailto:${state.identity.email}`}
          />
          <ContactRow
            icon="alternate_email"
            label={language === "fa" ? "موقعیت" : "Location"}
            value={resolve(state.identity.location)}
          />
          {socials.map((s) => (
            <ContactRow
              key={s.id}
              icon={s.icon}
              label={s.platform}
              value={s.handle}
              href={s.href}
            />
          ))}
        </div>

        <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--outline-variant)" }}>
          <div className="font-mono text-sm mb-3" style={{ color: "var(--primary)" }}>
            # ./contact.sh --send-message
          </div>
          <p className="text-sm opacity-80 mb-4" style={{ color: "var(--on-surface-variant)" }}>
            {language === "fa"
              ? "برای ارسال پیام مستقیم، به صفحه About بروید (فرم تماس در ترمینال)."
              : "To send a direct message, visit the About page (contact form in the terminal)."}
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-4 py-2 rounded font-bold text-sm"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            <Icon name="mail" size={16} />
            {language === "fa" ? "باز کردن فرم تماس" : "Open contact form"}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div
      className="flex items-center gap-3 p-3 rounded border transition-colors group"
      style={{
        background: "rgba(0,0,0,0.2)",
        borderColor: "var(--outline-variant)",
        color: "var(--on-surface)",
      }}
    >
      <div
        className="w-8 h-8 rounded grid place-items-center shrink-0"
        style={{ background: "rgba(33,241,168,0.1)", color: "var(--primary)" }}
      >
        <Icon name={icon} size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[10px] uppercase tracking-widest opacity-70"
          style={{ color: "var(--on-surface-variant)" }}
        >
          {label}
        </div>
        <div className="text-sm font-mono truncate" dir="ltr">
          {value}
        </div>
      </div>
      {href && <Icon name="open_in_new" size={14} color="var(--on-surface-variant)" />}
    </div>
  );
  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {inner}
      </a>
    );
  }
  return inner;
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
