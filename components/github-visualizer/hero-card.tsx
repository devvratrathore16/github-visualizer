'use client';

import Image from 'next/image';
import { Database, Code2, GitBranch, Zap } from 'lucide-react';
import { DeveloperProfile } from '@/lib/types';

interface HeroCardProps {
  data: DeveloperProfile;
  synthesisLoading: boolean;
}

// Neural Network Icon Component
function NeuralNetworkIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="3" fill="url(#neuralGradient)" filter="url(#glow)" />
      <line x1="14" y1="14" x2="5" y2="5" stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.6" />
      <line x1="14" y1="14" x2="23" y2="5" stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.6" />
      <line x1="14" y1="14" x2="5" y2="23" stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.6" />
      <line x1="14" y1="14" x2="23" y2="23" stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.6" />
      <line x1="14" y1="14" x2="14" y2="4" stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="14" x2="24" y2="14" stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.5" />
      <circle cx="5" cy="5" r="1.5" fill="#a855f7" opacity="0.8" />
      <circle cx="23" cy="5" r="1.5" fill="#06b6d4" opacity="0.8" />
      <circle cx="5" cy="23" r="1.5" fill="#06b6d4" opacity="0.8" />
      <circle cx="23" cy="23" r="1.5" fill="#a855f7" opacity="0.8" />
      <circle cx="14" cy="4" r="1.5" fill="#a855f7" opacity="0.7" />
      <circle cx="24" cy="14" r="1.5" fill="#06b6d4" opacity="0.7" />
    </svg>
  );
}

function extractArchetype(synthesis: string | null): string | null {
  if (!synthesis) return null;
  const match = synthesis.match(/(?:Developer\s+)?Archetype:\s*(.+?)(?:\n|$)/i);
  return match ? match[1].trim() : null;
}

function extractMainSynthesis(synthesis: string | null): string | null {
  if (!synthesis) return null;
  return synthesis
    .replace(/(?:Developer\s+)?Archetype:\s*.+?(?:\n|$)/gi, '')
    .trim();
}

export default function HeroCard({ data, synthesisLoading }: HeroCardProps) {
  const archetype = extractArchetype(data.synthesis);
  const mainSynthesis = extractMainSynthesis(data.synthesis);
  const topLanguage = data.topLanguages[0]?.name ?? 'N/A';
  const topLanguageColor = data.topLanguages[0]?.color ?? '#06b6d4';

  return (
    <div className="relative mb-12">
      <div className="relative bg-black border border-white/10 micro-sharp p-8 md:p-12 overflow-hidden">

        {/* Tech Grid Background Pattern */}
        <div className="absolute inset-0 tech-grid hexagon-pattern opacity-50 pointer-events-none"></div>

        {/* Matte texture overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.01) 1px, rgba(255,255,255,0.01) 2px)',
          }}></div>
        </div>

        {/* Content */}
        <div className="relative flex flex-col md:flex-row items-start gap-8">

          {/* Avatar */}
          <div className="shrink-0">
            <div className="kpi-gradient-border w-36 h-36" style={{ borderRadius: '50%' }}>
              <div className="relative w-full h-full overflow-hidden kpi-content flex items-center justify-center" style={{ borderRadius: '50%' }}>
                <Image
                  src={data.avatar}
                  alt={data.name}
                  width={140}
                  height={140}
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">

            {/* Name + Neural Icon */}
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-50"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                {data.name}
              </h2>
              <div className="opacity-80 hover:opacity-100 transition-opacity">
                <NeuralNetworkIcon />
              </div>
            </div>

            {/* Username */}
            <p className="text-sm text-slate-400 mb-4"
              style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace', letterSpacing: '0.05em' }}>
              @{data.username}
            </p>

            {/* Archetype Badge — only shows once AI has loaded */}
            {archetype && (
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/40 bg-purple-500/10"
                style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)' }}>
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-widest"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}>
                  {archetype}
                </span>
              </div>
            )}

            {/* AI Synthesis Section */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}>
                <Database className="w-4 h-4 text-purple-400" strokeWidth={1.5}
                  style={{ filter: 'drop-shadow(0 0 4px #a855f7)' }} />
                AI Developer Synthesis
              </h3>

              {synthesisLoading && !data.synthesis ? (
                // Fix 4 — Loading message + skeleton while AI runs in background
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-xs text-slate-500"
                      style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}>
                      AI is analyzing your profile...
                    </span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded animate-pulse w-full" />
                  <div className="h-3 bg-slate-800 rounded animate-pulse w-5/6" />
                  <div className="h-3 bg-slate-800 rounded animate-pulse w-4/6" />
                </div>
              ) : (
                <p className="text-slate-300 leading-relaxed text-sm md:text-base font-light"
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                  {mainSynthesis ?? data.bio}
                </p>
              )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Contributions */}
              <div className="kpi-gradient-border">
                <div className="kpi-content">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-cyan-400" strokeWidth={2}
                      style={{ filter: 'drop-shadow(0 0 3px #06b6d4)' }} />
                    <p className="text-slate-400 uppercase"
                      style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace', letterSpacing: '0.05em', fontSize: '10px' }}>
                      Contributions
                    </p>
                  </div>
                  <p className="text-3xl font-bold"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace', color: '#06b6d4' }}>
                    {data.totalContributions}
                  </p>
                </div>
              </div>

              {/* Top Language */}
              <div className="kpi-gradient-border">
                <div className="kpi-content">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4" strokeWidth={2}
                      style={{ color: topLanguageColor, filter: `drop-shadow(0 0 3px ${topLanguageColor})` }} />
                    <p className="text-slate-400 uppercase"
                      style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace', letterSpacing: '0.05em', fontSize: '10px' }}>
                      Top Language
                    </p>
                  </div>
                  <p className="text-xl font-bold truncate"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace', color: topLanguageColor }}>
                    {topLanguage}
                  </p>
                </div>
              </div>

              {/* Total Repos */}
              <div className="kpi-gradient-border">
                <div className="kpi-content">
                  <div className="flex items-center gap-2 mb-3">
                    <GitBranch className="w-4 h-4 text-emerald-400" strokeWidth={2}
                      style={{ filter: 'drop-shadow(0 0 3px #10b981)' }} />
                    <p className="text-slate-400 uppercase"
                      style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace', letterSpacing: '0.05em', fontSize: '10px' }}>
                      Repositories
                    </p>
                  </div>
                  <p className="text-3xl font-bold"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace', color: '#10b981' }}>
                    {data.repositories.length}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}