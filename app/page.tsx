'use client';

import { useState } from 'react';
import { Github, Zap, Code2, Activity } from 'lucide-react';
import Header from '@/components/github-visualizer/header';
import HeroCard from '@/components/github-visualizer/hero-card';
import DataGrid from '@/components/github-visualizer/data-grid';
import { DeveloperProfile } from '@/lib/types';
import { fetchDeveloperProfile } from '@/lib/github';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [developerData, setDeveloperData] = useState<DeveloperProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (username: string) => {
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setDeveloperData(null);

    try {
      const { profile } = await fetchDeveloperProfile(username);
      setDeveloperData(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black tech-grid hexagon-pattern">
      <div className="relative z-10">
        <Header onSearch={handleSearch} loading={loading} />

        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex items-center justify-center min-h-96">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 border-r-purple-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-cyan-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-96 text-center">
              <p className="text-red-400 text-xl font-semibold mb-2">Failed to load profile</p>
              <p className="text-slate-500 text-sm">{error}</p>
            </div>
          ) : developerData ? (
            <>
              <HeroCard data={developerData} />
              <DataGrid data={developerData} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-24 h-24 mb-8 relative glass-effect rounded-2xl flex items-center justify-center border border-white/5 p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                <Github className="w-12 h-12 text-slate-400" />
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-2xl"></div>
              </div>
              <h2 className="text-3xl font-bold text-slate-100 mb-4 glow-text">Developer Synthesis Engine</h2>
              <p className="text-slate-400 max-w-lg mb-8" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                Enter a GitHub username above to initialize the neural analysis. We'll aggregate repository metrics, language patterns, and commit rhythms to build a comprehensive developer profile.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-8">
                <div className="bg-black/40 border border-white/5 rounded-xl p-6 glass-effect group hover:border-cyan-500/30 transition-colors">
                  <Code2 className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-semibold text-slate-200 mb-2">Language Orbit</h3>
                  <p className="text-xs text-slate-500">Analyze primary technologies and ecosystem expertise.</p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-6 glass-effect group hover:border-purple-500/30 transition-colors">
                  <Activity className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-semibold text-slate-200 mb-2">Developer Rhythm</h3>
                  <p className="text-xs text-slate-500">Map productivity patterns and temporal commit distributions.</p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-6 glass-effect group hover:border-emerald-500/30 transition-colors">
                  <Zap className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-semibold text-slate-200 mb-2">Complexity Matrix</h3>
                  <p className="text-xs text-slate-500">Evaluate repository impact, complexity, and issue resolution.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}