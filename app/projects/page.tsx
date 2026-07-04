"use client";

import React, { useEffect, useState } from "react";
import RootPageLayout from "@/components/layout/RootPageLayout";
import { useCms } from "@/contexts/CmsContext";
import { Icon, BrandIcon } from "@/components/ui/Icons";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  size: number;
  updated_at: string;
  topics: string[];
}

export default function ProjectsPage() {
  const { t, state, resolve, locale } = useCms();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"github" | "custom">("github");

  useEffect(() => {
    const fetchRepos = async () => {
      const username = state.settings.githubUsername;
      if (!username) { setLoading(false); return; }
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=50&sort=updated`);
        if (!res.ok) throw new Error("GitHub API error");
        const data = await res.json();
        setRepos(data.filter((r: any) => !r.fork));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, [state.settings.githubUsername]);

  return (
    <RootPageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("github")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "github"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]"
            }`}
          >
            <BrandIcon platform="github" size={16} />
            {t("projects", "githubRepos")}
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
              activeTab === "custom"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]"
            }`}
          >
            <Icon name="Folder" size={16} />
            {t("projects", "customProjects")}
          </button>
        </div>

        {activeTab === "github" && (
          <div>
            {loading && (
              <div className="text-center py-20 text-[var(--color-text-muted)]">{t("common", "loading")}</div>
            )}
            {error && (
              <div className="glass p-6 text-center text-red-400">{t("common", "error")}: {error}</div>
            )}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass p-5 hover:border-[#5d7ae6]/30 transition group block"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-sm group-hover:text-[var(--color-primary)] transition truncate">
                        {repo.name}
                      </h3>
                      <Icon name="ExternalLink" size={14} className="text-[var(--color-text-subtle)]" />
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-4 line-clamp-2 min-h-[2.5em]">
                      {repo.description || (locale === "fa" ? "بدون توضیحات" : "No description")}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[var(--color-text-subtle)]">
                      <div className="flex items-center gap-3">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Icon name="Star" size={12} /> {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="GitFork" size={12} /> {repo.forks_count}
                        </span>
                      </div>
                      <span>{(repo.size / 1024).toFixed(1)} MB</span>
                    </div>
                    <div className="mt-3 text-[10px] text-[var(--color-text-subtle)]">
                      {new Date(repo.updated_at).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US")}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.projects.customProjects.map((project) => (
              <div key={project.id} className="glass p-6 hover:border-[#5d7ae6]/30 transition group">
                <div className="w-12 h-12 rounded-xl bg-[#5d7ae6]/10 flex items-center justify-center mb-4">
                  <Icon name="FolderGit2" size={24} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-[var(--color-primary)] transition">
                  {project.title[locale] || project.title.en}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  {project.description[locale] || project.description.en}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-[var(--color-bg-alt)] text-xs font-medium text-[var(--color-text-subtle)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RootPageLayout>
  );
}
