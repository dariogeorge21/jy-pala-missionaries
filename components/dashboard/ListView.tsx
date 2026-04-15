'use client';

import type { Missionary } from '@/types/missionary';

interface ListViewProps {
  missionaries: Missionary[];
  onEdit: (m: Missionary) => void;
  onDelete: (m: Missionary) => void;
}

export function ListView({ missionaries, onEdit, onDelete }: ListViewProps) {
  if (missionaries.length === 0) {
    return (
      <div className="card py-20 text-center">
        <p className="font-medium" style={{ color: 'var(--text-muted)' }}>No missionaries found</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden divide-y" style={{ borderColor: 'var(--border)' }}>
      {missionaries.map((m) => (
        <div
          key={m.id}
          className="flex items-center gap-4 p-4 transition-colors duration-100"
          style={{ '--tw-divide-color': 'var(--border)' } as React.CSSProperties}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.03)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {/* Serial */}
          <span
            className="text-xs font-mono w-6 text-center flex-shrink-0"
            style={{ color: 'var(--text-subtle)' }}
          >
            {m.serial_number}
          </span>

          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
            style={{ background: `hsl(${(m.name.charCodeAt(0) * 20) % 360}, 60%, 52%)` }}
          >
            {m.name.charAt(0).toUpperCase()}
          </div>

          {/* Name */}
          <div className="min-w-0 flex-[2]">
            <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{m.name}</p>
            {m.study_work && (
              <p className="text-xs truncate" style={{ color: 'var(--text-subtle)' }}>{m.study_work}</p>
            )}
          </div>

          {/* Ministry */}
          <div className="hidden sm:block flex-1 min-w-0">
            <span
              className="badge text-xs"
              style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}
            >
              {m.ministry}
            </span>
          </div>

          {/* Courses - abbreviated */}
          <div className="hidden md:flex flex-1 gap-1 min-w-0">
            {m.jy_courses.length > 0 ? (
              <>
                <span
                  className="badge text-xs"
                  style={{ backgroundColor: 'rgba(99,102,241,0.08)', color: 'var(--primary)' }}
                >
                  {m.jy_courses[0]}
                </span>
                {m.jy_courses.length > 1 && (
                  <span className="badge text-xs" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                    +{m.jy_courses.length - 1}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>No courses</span>
            )}
          </div>

          {/* Year */}
          <div className="hidden lg:block w-16 text-sm font-medium text-center flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
            {m.joined_year}
          </div>

          {/* Status dot */}
          <div className="flex-shrink-0">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: m.is_active ? '#22c55e' : '#ef4444' }}
              title={m.is_active ? 'Active' : 'Inactive'}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => onEdit(m)} className="btn-icon" title="Edit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button onClick={() => onDelete(m)} className="btn-icon" title="Delete" style={{ color: 'var(--danger)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
