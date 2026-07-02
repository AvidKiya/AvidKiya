/**
 * GitHub REST API helpers.
 * Runs client-side (no token needed for public data — 60 req/hr per IP).
 * For higher limits, a token can be injected via NEXT_PUBLIC_GITHUB_TOKEN
 * or through the admin panel later.
 */

import { siteConfig } from "./config";

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  visibility: string;
  pushed_at: string;
  created_at: string;
  updated_at: string;
  size: number;
  default_branch: string;
  owner: { login: string; avatar_url: string };
}

export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

const GH = "https://api.github.com";

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_GITHUB_TOKEN
      : undefined;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export async function fetchUserRepos(
  username: string = siteConfig.githubUsername,
  { perPage = 100, sort = "pushed" }: { perPage?: number; sort?: "pushed" | "updated" | "created" | "full_name" } = {}
): Promise<GithubRepo[]> {
  const url = `${GH}/users/${username}/repos?per_page=${perPage}&sort=${sort}&type=owner`;
  const res = await fetch(url, { headers: headers(), next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function fetchUser(
  username: string = siteConfig.githubUsername
): Promise<GithubUser> {
  const res = await fetch(`${GH}/users/${username}`, {
    headers: headers(),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

/** Rough size formatter — GitHub returns KB. */
export function formatRepoSize(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

/** Deterministic pseudo-color for language chip. */
export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

export function languageColor(lang: string | null): string {
  if (!lang) return "#84958a";
  return languageColors[lang] ?? "#21f1a8";
}

/** Custom project stored locally (later moved to KV via admin). */
export interface CustomProject {
  id: string;
  name: string;
  description: string;
  descriptionFa?: string;
  url: string;
  language?: string;
  topics?: string[];
  status?: "STABLE" | "BETA" | "ALPHA" | "ARCHIVED";
  createdAt: string;
}

const LS_CUSTOM = "avidkiya:custom-projects";

export function loadCustomProjects(): CustomProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_CUSTOM);
    return raw ? (JSON.parse(raw) as CustomProject[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomProjects(items: CustomProject[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_CUSTOM, JSON.stringify(items));
}
