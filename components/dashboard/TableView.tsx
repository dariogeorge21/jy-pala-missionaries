'use client';

import type { Missionary } from '@/types/missionary';

interface TableViewProps {
  missionaries: Missionary[];
  onEdit: (m: Missionary) => void;
  onDelete: (m: Missionary) => void;
}

function CoursePills({ courses }: { courses: string[] }) {
  if (!courses.length) return <span style={{ color: 'var(--text-subtle)', fontSize: '0.8125rem' }}>—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {courses.map((c) => (
        <span
          key={c}
          className="badge"
          style={{ backgroundColor: 'rgba(99,102,241,0.1)', color: 'var(--primary)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export function TableView({ missionaries, onEdit, onDelete }: TableViewProps) {
  if (missionaries.length === 0) {
    return (
      <div className="card py-20 text-center">
        <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-subtle)' }}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
        <p className="font-medium" style={{ color: 'var(--text-muted)' }}>No missionaries found</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-subtle)' }}>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full print-table">
          <thead>
            <tr style={{ backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              {['#', 'Name', 'Ministry', 'Study / Work', 'JY Courses', 'Year', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider no-print-last"
                  style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {missionaries.map((m, idx) => (
              <tr
                key={m.id}
                className="transition-colors duration-100"
                style={{
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: idx % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)')}
              >
                <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--text-subtle)', width: '50px' }}>
                  {m.serial_number}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: `hsl(${(m.name.charCodeAt(0) * 20) % 360}, 65%, 55%)`,
                        color: '#fff',
                      }}
                    >
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{m.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span
                    className="badge"
                    style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    {m.ministry}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span className="truncate block">{m.study_work || '—'}</span>
                </td>
                <td className="px-4 py-3">
                  <CoursePills courses={m.jy_courses} />
                </td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {m.joined_year}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="badge"
                    style={{
                      backgroundColor: m.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      color: m.is_active ? '#22c55e' : '#ef4444',
                      border: `1px solid ${m.is_active ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    }}
                  >
                    {m.is_active ? '● Active' : '○ Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 no-print">
                  <div className="flex items-center gap-1">
                    <button
                      id={`edit-${m.id}`}
                      onClick={() => onEdit(m)}
                      className="btn-icon"
                      title="Edit"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      id={`delete-${m.id}`}
                      onClick={() => onDelete(m)}
                      className="btn-icon"
                      title="Delete"
                      style={{ color: 'var(--danger)' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Print-only table footer */}
      <div className="hidden print-show p-4 text-xs" style={{ color: '#555', borderTop: '1px solid #ccc' }}>
        Total: {missionaries.length} missionaries · Printed on {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}
