'use client';

import type { Missionary } from '@/types/missionary';

interface CardViewProps {
  missionaries: Missionary[];
  onEdit: (m: Missionary) => void;
  onDelete: (m: Missionary) => void;
}

function AvatarBg(name: string): string {
  const hue = (name.charCodeAt(0) * 20 + name.charCodeAt(1) * 7) % 360;
  return `hsl(${hue}, 60%, 50%)`;
}

export function CardView({ missionaries, onEdit, onDelete }: CardViewProps) {
  if (missionaries.length === 0) {
    return (
      <div className="card py-20 text-center">
        <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-subtle)' }}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
        <p className="font-medium" style={{ color: 'var(--text-muted)' }}>No missionaries found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {missionaries.map((m) => (
        <div
          key={m.id}
          className="card p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
                style={{ background: AvatarBg(m.name) }}
              >
                {m.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>
                  {m.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                  #{m.serial_number}
                </p>
              </div>
            </div>
            <span
              className="badge flex-shrink-0 text-xs"
              style={{
                backgroundColor: m.is_active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                color: m.is_active ? '#22c55e' : '#ef4444',
              }}
            >
              {m.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Ministry */}
          <div>
            <span
              className="badge"
              style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', fontSize: '0.75rem' }}
            >
              {m.ministry}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            {m.study_work && (
              <div className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <span className="truncate">{m.study_work}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>Joined {m.joined_year}</span>
            </div>
          </div>

          {/* Courses */}
          {m.jy_courses.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {m.jy_courses.map((c) => (
                <span
                  key={c}
                  className="badge"
                  style={{ backgroundColor: 'rgba(99,102,241,0.08)', color: 'var(--primary)', fontSize: '0.7rem', padding: '2px 6px' }}
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-auto pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => onEdit(m)}
              className="flex-1 btn btn-ghost btn-sm"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(m)}
              className="flex-1 btn btn-ghost btn-sm"
              style={{ color: 'var(--danger)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
