'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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

  const COLORS = languages.map(lang => lang.color);

  return (
    <div className="bg-black border border-white/5 rounded p-8 overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
        <h3 className="text-lg font-semibold text-slate-100 tech-text">Language Orbit</h3>
      </div>

      {/* Chart */}
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
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
                borderRadius: '2px',
                color: '#e8ecff',
              }}
              formatter={(value) => `${value}%`}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                paddingTop: '20px',
              }}
              contentStyle={{
                color: '#94a3b8',
                fontSize: '12px',
              }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Info */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <p className="text-xs text-slate-500 text-center font-mono">
          Primary languages used across {chartData.length} most-used technologies
        </p>
      </div>
    </div>
  );
}
