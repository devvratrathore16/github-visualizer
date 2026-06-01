'use client';

import { useState } from 'react';
import { Search, Github, Loader2 } from 'lucide-react';

interface HeaderProps {
  onSearch: (username: string) => void;
  loading: boolean;
  hasResults: boolean;
}

export default function Header({ onSearch, loading, hasResults }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) onSearch(searchValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit(e as any);
  };

  // Hide header completely on landing page — search is in the hero instead
  if (!hasResults) return null;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-slate-800/50"
      style={{ background: 'rgba(0, 0, 0, 0.85)' }}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative p-1.5 rounded-lg glass-effect">
              <Github className="w-5 h-5 text-cyan-400" />
              <div className="absolute inset-0 rounded-lg bg-cyan-500/10 animate-pulse" />
            </div>
            <span className="text-sm font-bold glow-text hidden sm:block"
              style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}>
              GitHub Visualizer
            </span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="w-full sm:flex-1 sm:max-w-lg">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center glass-effect rounded-lg px-3 py-2 gap-2">
                {loading ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                ) : (
                  <Search className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors flex-shrink-0" />
                )}
                <input
                  type="text"
                  placeholder="Search another username..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm placeholder-slate-600 outline-none disabled:opacity-50 text-slate-100"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  disabled={loading || !searchValue.trim()}
                  className="px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
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