import { DeveloperProfile, Language, Repository } from './types';

const colorMap: Record<string, string> = {
  'TypeScript': '#3178c6', 'JavaScript': '#f1e05a', 'Python': '#3572A5',
  'Java': '#b07219', 'Go': '#00ADD8', 'C++': '#f34b7d', 'Ruby': '#701516',
  'PHP': '#4F5D95', 'C#': '#178600', 'HTML': '#e34c26', 'CSS': '#563d7c',
  'Rust': '#dea584', 'Swift': '#F05138', 'Kotlin': '#7F52FF', 'Dart': '#00B4AB',
  'Shell': '#89e051', 'Vue': '#41b883', 'Svelte': '#ff3e00',
};

export async function fetchDeveloperProfile(username: string): Promise<{
  profile: DeveloperProfile;
  synthesis: string | null;
}> {
  const response = await fetch('/api/github', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to fetch profile');
  }

  const { data, synthesis } = await response.json();

  // Build real language percentages from repo language byte sizes
  const languageCounts: Record<string, number> = {};
  let totalBytes = 0;

  data.repositories.nodes.forEach((repo: any) => {
    repo.languages.edges.forEach((edge: any) => {
      const name = edge.node.name;
      languageCounts[name] = (languageCounts[name] || 0) + edge.size;
      totalBytes += edge.size;
    });
  });

  const topLanguages: Language[] = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, size]) => ({
      name,
      percentage: Math.round((size / totalBytes) * 100),
      color: colorMap[name] || `hsl(${name.charCodeAt(0) * 37 % 360}, 60%, 55%)`,
    }));

  const repositories: Repository[] = data.repositories.nodes.map((repo: any) => ({
    name: repo.name,
    stars: repo.stargazerCount,
    language: repo.primaryLanguage?.name || 'Unknown',
    description: repo.description || '',
    url: repo.url,
    pushedAt: repo.pushedAt,
  }));

  const profile: DeveloperProfile = {
    name: data.name || username,
    username,
    avatar: data.avatarUrl,
    bio: data.bio || 'No bio available.',
    totalContributions: data.contributionsCollection.contributionCalendar.totalContributions,
    topLanguages,
    repositories,
    synthesis, // AI synthesis stored directly in the profile
  };

  return {
    profile,
    synthesis,
  };
}