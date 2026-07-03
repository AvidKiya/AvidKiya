export interface GitHubRepo { id:number; name:string; full_name:string; html_url:string; description:string|null; stargazers_count:number; forks_count:number; language:string|null; size:number; updated_at:string; fork:boolean; }
export async function fetchGithubRepos(username: string): Promise<GitHubRepo[]> {
  if (!username) return [];
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, { next: { revalidate: 3600 } }).catch(() => null);
  if (!res || !res.ok) return [];
  return (await res.json()) as GitHubRepo[];
}
