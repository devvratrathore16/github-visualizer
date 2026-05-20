'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Zap } from 'lucide-react';
import { Language } from '@/lib/types';

interface LanguageOrbitProps {
  languages: Language[];
}

export default function LanguageOrbit({ languages }: LanguageOrbitProps) {
  const chartData = languages.map(lang => ({
    name: lang.name,
    value: lang.percentage,
    color: lang.color,
  }));

  return (
    <div className="bg-black border border-white/5 rounded p-8 overflow-hidden h-full">

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
        <h3 className="text-lg font-semibold text-slate-100 tech-text">Language Orbit</h3>
      </div>

      {/* Chart */}
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                color: '#e8ecff',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value}%`, 'Usage']}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend with Percentages */}
      {/* WHY custom legend: Recharts built-in Legend doesn't support
          showing percentages next to names. We build our own so we
          can show "TypeScript  83%" in a clean two-column layout. */}
      <div className="mt-4 space-y-2">
        {chartData.map((lang) => (
          <div key={lang.name} className="flex items-center justify-between px-2">
            {/* Left side — color dot + language name */}
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: lang.color }}
              />
              <span
                className="text-sm text-slate-300"
                style={{ fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace' }}
              >
                {lang.name}
              </span>
            </div>

            {/* Right side — percentage bar + number */}
            <div className="flex items-center gap-3">
              {/* Mini progress bar */}
              <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${lang.value}%`,
                    backgroundColor: lang.color,
                  }}
                />
              </div>
              {/* Percentage number */}
              <span
                className="text-xs w-8 text-right font-semibold"
                style={{
                  color: lang.color,
                  fontFamily: 'var(--font-jetbrains-mono), JetBrains Mono, monospace',
                }}
              >
                {lang.value}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <p className="text-xs text-slate-500 text-center font-mono">
          Primary languages across {chartData.length} most-used technologies
        </p>
      </div>
    </div>
  );
}