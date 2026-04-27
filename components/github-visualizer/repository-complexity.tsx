'use client';

import { Github, Star, ExternalLink } from 'lucide-react';
import { Repository } from '@/lib/types';

interface RepositoryComplexityProps {
  repositories: Repository[];
}

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
      <div className="flex items-center gap-2 mb-6">
        <Github className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
        <h3 className="text-lg font-semibold text-slate-100 tech-text">Top Repositories</h3>
      </div>

      <div className="flex flex-col gap-3">
        {repositories.map((repo) => (

          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-slate-950/50 border border-white/5 rounded p-4 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors font-mono truncate">
                {repo.name}
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-slate-400 fill-slate-400" />
                  <span className="text-xs text-slate-300">{repo.stars}</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
            {
              repo.description && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{repo.description}</p>
              )
            }
            < div className="flex items-center gap-3 mt-2" >
              <span className="text-xs text-slate-500 font-mono">{repo.language}</span>
              <span className="text-xs text-slate-600">pushed {timeAgo(repo.pushedAt)}</span>
            </div>
          </a>
        ))
        }
      </div >
    </div >
  );
}