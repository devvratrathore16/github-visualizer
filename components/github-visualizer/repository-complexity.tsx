'use client';

import { Github, Star, ExternalLink, GitCommit } from 'lucide-react';
import { Repository } from '@/lib/types';

interface RepositoryComplexityProps {
  repositories: Repository[];
}

// Language color map — matches the colors in lib/github.ts
const languageColors: Record<string, string> = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f1e05a',
  'Python': '#3572A5',
  'Java': '#b07219',
  'Go': '#00ADD8',
  'C++': '#f34b7d',
  'Ruby': '#701516',
  'PHP': '#4F5D95',
  'C#': '#178600',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Rust': '#dea584',
  'Swift': '#F05138',
  'Kotlin': '#7F52FF',
  'Dart': '#00B4AB',
  'Shell': '#89e051',
  'Vue': '#41b883',
  'Svelte': '#ff3e00',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function RepositoryComplexity({ repositories }: RepositoryComplexityProps) {
  return (
    <div className="bg-black border border-white/5 rounded p-8 overflow-hidden h-full">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Github className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
        <h3 className="text-lg font-semibold text-slate-100 tech-text">Top Repositories</h3>
      </div>

      {/* Repository Cards */}
      <div className="flex flex-col gap-3">
        {repositories.map((repo) => {
          const langColor = languageColors[repo.language] ?? '#64748b';

          return (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-slate-950/50 border border-white/5 rounded-lg p-4 transition-all duration-200 hover:border-cyan-500/40 hover:bg-slate-900/40"
              style={{
                boxShadow: 'none',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px rgba(6, 182, 212, 0.08)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Top row — repo name + stars + link icon */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <GitCommit
                    className="w-3.5 h-3.5 flex-shrink-0 text-slate-500 group-hover:text-cyan-400 transition-colors"
                    strokeWidth={2}
                  />
                  <p
                    className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors truncate"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
                  >
                    {repo.name}
                  </p>
                </div>

                {/* Stars + External Link */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Star
                      className="w-3 h-3 text-amber-400"
                      fill="#fbbf24"
                      strokeWidth={1}
                    />
                    <span
                      className="text-xs text-slate-300"
                      style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
                    >
                      {repo.stars}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span
                      className="text-xs text-cyan-400"
                      style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
                    >
                      Open
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {repo.description && (
                <p className="text-xs text-slate-500 mb-3 line-clamp-1 pl-5">
                  {repo.description}
                </p>
              )}

              {/* Bottom row — language dot + name + push time */}
              <div className="flex items-center justify-between pl-5">
                <div className="flex items-center gap-2">
                  {/* Language color dot */}
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: langColor,
                      boxShadow: `0 0 6px ${langColor}80`,
                    }}
                  />
                  <span
                    className="text-xs text-slate-400"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
                  >
                    {repo.language}
                  </span>
                </div>

                {/* Push time */}
                <span className="text-xs text-slate-600">
                  pushed {timeAgo(repo.pushedAt)}
                </span>
              </div>

              {/* Hover accent line at the bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg"
                style={{ background: `linear-gradient(90deg, transparent, ${langColor}60, transparent)` }}
              />
            </a>
          );
        })}
      </div>
    </div >
  );
}