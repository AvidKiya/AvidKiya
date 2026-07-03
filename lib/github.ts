export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  size: number;
  topics?: string[];
}

export async function fetchGithubRepos(username: string): Promise<GithubRepo[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      next: { revalidate: 3600 }
    });
    if(!res.ok) return [];
    const data = await res.json();
    return data;
  } catch {
    return [];
  }
}

export function githubOgImage(fullName: string){
  return `https://opengraph.githubassets.com/1/${fullName}`;
}
