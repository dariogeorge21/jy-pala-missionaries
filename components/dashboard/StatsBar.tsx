'use client';

import type { Missionary } from '@/types/missionary';

interface StatsBarProps {
  missionaries: Missionary[];
}

export function StatsBar({ missionaries }: StatsBarProps) {
  const total = missionaries.length;
  const campusCount = missionaries.filter((m) => m.ministry.toLowerCase().includes('campus')).length;
  const parishCount = missionaries.filter((m) => m.ministry.toLowerCase().includes('parish')).length;
  const teensCount = missionaries.filter((m) => m.ministry.toLowerCase().includes('teens')).length;
  const otherCount = Math.max(total - campusCount - parishCount - teensCount, 0);

  const stats = [
    {
      label: 'Total Members',
      value: total,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.1)',
    },
    {
      label: 'Campus Missionaries',
      value: campusCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16"/>
          <path d="M6 18V8"/>
          <path d="M10 18V8"/>
          <path d="M14 18V8"/>
          <path d="M18 18V8"/>
          <path d="M3 8l9-6 9 6"/>
        </svg>
      ),
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
    },
    {
      label: 'Parish Missionaries',
      value: parishCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18"/>
          <path d="M7 8h10"/>
          <path d="M5 21h14"/>
          <path d="M8 21V11h8v10"/>
        </svg>
      ),
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
    },
    {
      label: 'Teens Missionaries',
      value: teensCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5 1.34 3.5 3 3.5z"/>
          <path d="M8 12c2.21 0 4-2.02 4-4.5S10.21 3 8 3 4 5.02 4 7.5 5.79 12 8 12z"/>
          <path d="M4 21v-1c0-2.21 1.79-4 4-4h2"/>
          <path d="M14 21v-1c0-1.66 1.34-3 3-3h1c1.1 0 2 .9 2 2v2"/>
        </svg>
      ),
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
    },
    {
      label: 'Other',
      value: otherCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12h8"/>
          <path d="M12 8v8"/>
        </svg>
      ),
      color: '#6b7280',
      bg: 'rgba(107,114,128,0.1)',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card p-5 flex items-center gap-4 group relative overflow-hidden"
        >
          {/* Ambient Glow effect on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: `radial-gradient(circle at center, ${stat.color}15 0%, transparent 60%)` }}
          />

          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg relative z-10 transition-transform group-hover:scale-110 duration-300"
            style={{ background: stat.bg, color: stat.color, border: `1px solid ${stat.color}30` }}
          >
            {stat.icon}
          </div>
          <div className="min-w-0 relative z-10">
            <p className="text-2xl font-extrabold leading-none tracking-tight mb-1 transition-all duration-300" style={{ color: 'var(--text)', textShadow: `0 2px 10px ${stat.color}40` }}>
              {stat.value}
            </p>
            <p className="text-xs uppercase tracking-wider font-semibold truncate" style={{ color: 'var(--text-subtle)' }}>
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
