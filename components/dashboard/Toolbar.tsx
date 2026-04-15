'use client';

import type { Missionary, ViewMode, SortField, SortDirection, FilterState } from '@/types/missionary';
import { PREDEFINED_MINISTRIES } from '@/types/missionary';

interface ToolbarProps {
  missionaries: Missionary[];
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortField: SortField;
  setSortField: (f: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (d: SortDirection) => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  allCourses: string[];
  onAddNew: () => void;
  onExportCSV: () => void;
  onPrint: () => void;
}

export function Toolbar({
  missionaries,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  filters,
  setFilters,
  allCourses,
  onAddNew,
  onExportCSV,
  onPrint,
}: ToolbarProps) {
  const joinedYears = Array.from(new Set(missionaries.map((m) => m.joined_year))).sort((a, b) => b - a);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({ ministry: '', activeStatus: 'all', joinedYear: '', course: '' });
  };

  const hasActiveFilters =
    searchQuery || filters.ministry || filters.activeStatus !== 'all' || filters.joinedYear || filters.course;

  return (
    <div className="card p-4 md:p-6 no-print space-y-4">
      {/* Row 1: Search + Add */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: 'var(--text-subtle)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ministry, study/work…"
            className="input pl-9 w-full"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          {(['table', 'card', 'list'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              id={`view-${mode}`}
              onClick={() => setViewMode(mode)}
              className="btn btn-sm transition-all duration-150 capitalize"
              style={{
                backgroundColor: viewMode === mode ? 'var(--surface)' : 'transparent',
                color: viewMode === mode ? 'var(--text)' : 'var(--text-muted)',
                boxShadow: viewMode === mode ? 'var(--shadow-sm)' : 'none',
                borderColor: viewMode === mode ? 'var(--border)' : 'transparent',
              }}
            >
              {mode === 'table' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>
                </svg>
              )}
              {mode === 'card' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="9" height="9" rx="1"/><rect x="13" y="3" width="9" height="9" rx="1"/>
                  <rect x="2" y="14" width="9" height="7" rx="1"/><rect x="13" y="14" width="9" height="7" rx="1"/>
                </svg>
              )}
              {mode === 'list' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              )}
              {mode}
            </button>
          ))}
        </div>

        {/* Add | Export | Print */}
        <div className="flex gap-2 shrink-0">
          <button id="add-missionary-btn" onClick={onAddNew} className="btn btn-primary flex-1 md:flex-none">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add
          </button>
          <button id="export-csv-btn" onClick={onExportCSV} className="btn btn-ghost flex-1 md:flex-none" title="Export CSV">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            CSV
          </button>
          <button id="print-btn" onClick={onPrint} className="btn btn-ghost flex-1 md:flex-none" title="Print">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print
          </button>
        </div>
      </div>

      {/* Row 2: Filters + Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Ministry filter */}
          <select
            id="filter-ministry"
            value={filters.ministry}
            onChange={(e) => setFilters({ ...filters, ministry: e.target.value })}
            className="input input-inline"
          >
          <option value="">All Ministries</option>
          {PREDEFINED_MINISTRIES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* Active status */}
        <select
          id="filter-status"
          value={filters.activeStatus}
          onChange={(e) => setFilters({ ...filters, activeStatus: e.target.value as FilterState['activeStatus'] })}
          className="input input-inline"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Year filter */}
        <select
          id="filter-year"
          value={filters.joinedYear}
          onChange={(e) => setFilters({ ...filters, joinedYear: e.target.value })}
          className="input input-inline"
        >
          <option value="">All Years</option>
          {joinedYears.map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>

        {/* Course filter */}
        <select
          id="filter-course"
          value={filters.course}
          onChange={(e) => setFilters({ ...filters, course: e.target.value })}
          className="input input-inline"
        >
          <option value="">All Courses</option>
          {allCourses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        </div>

        {/* Sort */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Sort:</span>
          {(['name', 'joined_year', 'ministry', 'is_active'] as SortField[]).map((field) => (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className="btn btn-ghost btn-sm flex items-center gap-1"
              style={{
                color: sortField === field ? 'var(--primary)' : 'var(--text-muted)',
                borderColor: sortField === field ? 'var(--primary)' : 'var(--border)',
                backgroundColor: sortField === field ? 'rgba(99,102,241,0.08)' : 'transparent',
              }}
            >
              {field === 'is_active' ? 'Status' : field === 'joined_year' ? 'Year' : field.charAt(0).toUpperCase() + field.slice(1)}
              {sortField === field && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none' }}>
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
              )}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              id="clear-filters-btn"
              onClick={resetFilters}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--danger)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
