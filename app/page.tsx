'use client';

import { useState } from 'react';
import { Github, Zap, Code2, GitBranch, AlertCircle, TrendingUp, Search, Loader2 } from 'lucide-react';
import Header from '@/components/github-visualizer/header';
import HeroCard from '@/components/github-visualizer/hero-card';
import DataGrid from '@/components/github-visualizer/data-grid';
import { DeveloperProfile } from '@/lib/types';
import { fetchDeveloperProfile, fetchSynthesis } from '@/lib/github';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [developerData, setDeveloperData] = useState<DeveloperProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [synthesisLoading, setSynthesisLoading] = useState(false);
  const [heroSearch, setHeroSearch] = useState('');

  const handleSearch = async (username: string) => {
    if (!username.trim()) return;

    const validUsername = /^[a-zA-Z0-9\-]{1,39}$/.test(username.trim());
    if (!validUsername) {
      setError('Please enter a valid GitHub username. Usernames can only contain letters, numbers, and hyphens.');
      return;
    }

    setLoading(true);
    setError(null);
    setDeveloperData(null);
    setSynthesisLoading(false);

    try {
      const { profile, sanitizedData } = await fetchDeveloperProfile(username);
      setDeveloperData(profile);
      setLoading(false);

      setSynthesisLoading(true);
      const synthesis = await fetchSynthesis(sanitizedData);
      setDeveloperData(prev =>
        prev ? { ...prev, synthesis } : prev
      );

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    } finally {
      setSynthesisLoading(false);
    }
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) handleSearch(heroSearch.trim());
  };

  const hasResults = !!developerData || loading || !!error;

  return (
    <main className="min-h-screen bg-black tech-grid hexagon-pattern">
      <div className="relative z-10">

        {/* Sticky header — only shows when results are visible */}
        <Header
          onSearch={handleSearch}
          loading={loading}
          hasResults={hasResults}
        />

        <div className="container mx-auto px-4 py-12">
          {loading ? (
            // --- Loading State ---
            <div className="flex flex-col items-center justify-center min-h-96 gap-4">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 border-r-purple-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-cyan-300 animate-spin"
                  style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <p className="text-slate-500 text-sm font-mono animate-pulse">
                Analyzing profile...
              </p>
            </div>

          ) : error ? (
            // --- Error State ---
            <div className="flex flex-col items-center justify-center min-h-96 text-center">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-400 text-lg font-semibold mb-3"
                style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}>
                Search Failed
              </p>
              <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-6">
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
              >
                Try Again
              </button>
            </div>

          ) : developerData ? (
            // --- Results State ---
            <>
              <HeroCard data={developerData} synthesisLoading={synthesisLoading} />
              <DataGrid data={developerData} />
            </>

          ) : (
            // --- Landing / Hero State ---
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">

              {/* Logo Icon */}
              <div className="w-20 h-20 mb-8 relative glass-effect rounded-2xl flex items-center justify-center border border-white/5 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                <Github className="w-10 h-10 text-cyan-400" />
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-2xl"></div>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-100 mb-4 glow-text leading-tight">
                Developer Synthesis
                <span className="block text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #a855f7)' }}>
                  Engine
                </span>
              </h1>

              <p className="text-slate-400 max-w-md mb-10 text-sm sm:text-base leading-relaxed"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                Enter any GitHub username to generate an AI-powered developer profile with language analytics, repository insights, and identity synthesis.
              </p>

              {/* BIG CENTERED SEARCH BAR */}
              <form onSubmit={handleHeroSubmit} className="w-full max-w-xl mb-4">
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

                  <div className="relative flex items-center bg-slate-950 border border-slate-700 group-focus-within:border-cyan-500/50 rounded-xl px-5 py-4 gap-4 transition-colors duration-300">
                    {loading ? (
                      <Loader2 className="w-5 h-5 text-cyan-400 animate-spin flex-shrink-0" />
                    ) : (
                      <Search className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors flex-shrink-0" />
                    )}

                    <input
                      type="text"
                      placeholder="Enter GitHub username..."
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      disabled={loading}
                      className="flex-1 bg-transparent text-base placeholder-slate-600 outline-none disabled:opacity-50 text-slate-100"
                      style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
                      autoComplete="off"
                      spellCheck={false}
                      autoFocus
                    />

                    <button
                      type="submit"
                      disabled={loading || !heroSearch.trim()}
                      className="px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace',
                        background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(168,85,247,0.3))',
                        border: '1px solid rgba(6, 182, 212, 0.4)',
                        color: '#e2e8f0',
                      }}
                    >
                      {loading ? 'Scanning...' : 'Analyze →'}
                    </button>
                  </div>
                </div>
              </form>

              {/* Hint text */}
              <p className="text-slate-600 text-xs mb-16 font-mono">
                Try: torvalds, gaearon, sindresorhus
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
                <div className="bg-black/40 border border-white/5 rounded-xl p-5 glass-effect group hover:border-cyan-500/30 transition-all duration-300 text-left">
                  <Code2 className="w-7 h-7 text-cyan-400 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">Language Orbit</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Visual breakdown of top languages by code volume.</p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-5 glass-effect group hover:border-purple-500/30 transition-all duration-300 text-left">
                  <TrendingUp className="w-7 h-7 text-purple-400 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">Contribution Activity</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Track yearly contributions and active repositories.</p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-5 glass-effect group hover:border-emerald-500/30 transition-all duration-300 text-left">
                  <GitBranch className="w-7 h-7 text-emerald-400 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">Repository Showcase</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Top repositories with language tags and GitHub links.</p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  );
}