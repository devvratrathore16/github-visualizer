'use client';

import { useState } from 'react';
import { Search, Github, Loader2 } from 'lucide-react';

interface HeaderProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

export default function Header({ onSearch, loading }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) onSearch(searchValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit(e as any);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-slate-800/50"
      style={{ background: 'rgba(0, 0, 0, 0.85)' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">

          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative p-2 rounded-lg glass-effect">
              <Github className="w-6 h-6 text-cyan-400" />
              {/* Subtle pulse behind the icon */}
              <div className="absolute inset-0 rounded-lg bg-cyan-500/10 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold glow-text"
                style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}>
                GitHub Visualizer
              </h1>
              <p className="text-xs text-slate-500"
                style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}>
                Developer Activity Analytics
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-lg">
            <div className="relative group">
              {/* Glow behind input on focus */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-center glass-effect rounded-lg px-4 py-2.5 gap-3">
                {/* Search icon or spinner */}
                {loading ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                ) : (
                  <Search className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors flex-shrink-0" />
                )}

                {/* Input */}
                <input
                  type="text"
                  placeholder="Enter GitHub username..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm placeholder-slate-600 outline-none disabled:opacity-50 text-slate-100"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
                  autoComplete="off"
                  spellCheck={false}
                />

                {/* Search button — always visible */}
                <button
                  type="submit"
                  disabled={loading || !searchValue.trim()}
                  className="px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace',
                    background: loading || !searchValue.trim()
                      ? 'rgba(6, 182, 212, 0.1)'
                      : 'rgba(6, 182, 212, 0.2)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    color: '#06b6d4',
                  }}
                >
                  {loading ? 'Scanning...' : 'Search'}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </header>
  );
}