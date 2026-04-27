'use client';

import { useState } from 'react';
import { Search, Github } from 'lucide-react';

interface HeaderProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

export default function Header({ onSearch, loading }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-slate-800/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-lg glass-effect">
              <Github className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold glow-text">GitHub Visualizer</h1>
              <p className="text-xs text-slate-400">Developer Activity Analytics</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-md">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative flex items-center glass-effect rounded-lg px-4 py-3">
                <Search className="w-5 h-5 text-slate-400 transition-colors group-focus-within:text-cyan-400" />
                <input
                  type="text"
                  placeholder="Search GitHub username..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  disabled={loading}
                  className="ml-3 flex-1 bg-transparent text-sm placeholder-slate-500 outline-none disabled:opacity-50 transition-colors text-slate-100"
                />
                {searchValue && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-2 px-3 py-1 text-xs font-semibold rounded bg-cyan-600/80 hover:bg-cyan-600 disabled:opacity-50 text-white transition-colors"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
