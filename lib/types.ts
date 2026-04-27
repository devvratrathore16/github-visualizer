export interface Language {
  name: string;
  percentage: number;
  color: string;
}

export interface Repository {
  name: string;
  stars: number;
  language: string;
  description: string;
  url: string;
  pushedAt: string;
}

export interface DeveloperProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  totalContributions: number;
  topLanguages: Language[];
  repositories: Repository[];
  synthesis: string | null;
}