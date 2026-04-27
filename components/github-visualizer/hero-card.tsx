'use client';

import Image from 'next/image';
import { Database } from 'lucide-react';
import { DeveloperProfile } from '@/lib/types';

interface HeroCardProps {
  data: DeveloperProfile;
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

      {/* Central node */}
      <circle cx="14" cy="14" r="3" fill="url(#neuralGradient)" filter="url(#glow)" />

      {/* Connecting lines */}
      <line x1="14" y1="14" x2="5" y2="5" stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.6" />
      <line x1="14" y1="14" x2="23" y2="5" stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.6" />
      <line x1="14" y1="14" x2="5" y2="23" stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.6" />
      <line x1="14" y1="14" x2="23" y2="23" stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.6" />
      <line x1="14" y1="14" x2="14" y2="4" stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.5" />
      <line x1="14" y1="14" x2="24" y2="14" stroke="url(#neuralGradient)" strokeWidth="1" opacity="0.5" />

      {/* Peripheral nodes */}
      <circle cx="5" cy="5" r="1.5" fill="#a855f7" opacity="0.8" />
      <circle cx="23" cy="5" r="1.5" fill="#06b6d4" opacity="0.8" />
      <circle cx="5" cy="23" r="1.5" fill="#06b6d4" opacity="0.8" />
      <circle cx="23" cy="23" r="1.5" fill="#a855f7" opacity="0.8" />
      <circle cx="14" cy="4" r="1.5" fill="#a855f7" opacity="0.7" />
      <circle cx="24" cy="14" r="1.5" fill="#06b6d4" opacity="0.7" />
    </svg>
  );
}

export default function HeroCard({ data }: HeroCardProps) {
  return (
    <div className="relative mb-12">
      {/* Card */}
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
          <div className="flex-shrink-0">
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

            {/* Name */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-50"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                {data.name}
              </h2>
              <div className="opacity-80 hover:opacity-100 transition-opacity">
                <NeuralNetworkIcon />
              </div>
            </div>

            {/* Username */}
            <p className="text-sm text-slate-400 mb-6"
              style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace', letterSpacing: '0.05em' }}>
              @{data.username}
            </p>

            {/* AI Synthesis Section */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}>
                <Database className="w-4 h-4 text-purple-400" strokeWidth={1.5}
                  style={{ filter: 'drop-shadow(0 0 4px #a855f7)' }} />
                AI Developer Synthesis
              </h3>

              {/* 
                Show AI synthesis if available.
                Fall back to GitHub bio if AI returned null.
              */}
              <p className="text-slate-300 leading-relaxed text-sm md:text-base font-light"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                {data.synthesis ?? data.bio}
              </p>
            </div>

            {/* Contributions KPI */}
            <div className="flex">
              <div className="kpi-gradient-border">
                <div className="kpi-content">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-cyan-400" strokeWidth={2}
                      style={{ filter: 'drop-shadow(0 0 3px #06b6d4)' }} />
                    <p className="text-xs text-slate-400 uppercase"
                      style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace', letterSpacing: '0.05em', fontSize: '10px' }}>
                      Contributions
                    </p>
                  </div>
                  <p className="text-3xl font-bold neon-number"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace', color: '#06b6d4' }}>
                    {data.totalContributions}
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