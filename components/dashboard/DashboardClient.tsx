'use client';

import { useState, useMemo, useCallback } from 'react';
import type {
  Missionary,
  MissionaryFormData,
  ViewMode,
  SortField,
  SortDirection,
  FilterState,
} from '@/types/missionary';
import { PREDEFINED_COURSES } from '@/types/missionary';
import { StatsBar } from './StatsBar';
import { Toolbar } from './Toolbar';
import { TableView } from './TableView';
import { CardView } from './CardView';
import { ListView } from './ListView';
import { MissionaryModal } from './MissionaryModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface DashboardClientProps {
  initialMissionaries: Missionary[];
  initialCustomCourses: string[];
}

export function DashboardClient({ initialMissionaries, initialCustomCourses }: DashboardClientProps) {
  const [missionaries, setMissionaries] = useState<Missionary[]>(initialMissionaries);
  const [customCourses, setCustomCourses] = useState<string[]>(initialCustomCourses);

  // View & sort state
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<SortField>('serial_number');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    ministry: '',
    activeStatus: 'all',
    joinedYear: '',
    course: '',
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingMissionary, setEditingMissionary] = useState<Missionary | null>(null);
  const [deletingMissionary, setDeletingMissionary] = useState<Missionary | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const allCourses = useMemo(() => [...PREDEFINED_COURSES, ...customCourses], [customCourses]);

  // ── Computed / filtered list ──────────────────────────────────────────
  const displayedMissionaries = useMemo(() => {
    let list = [...missionaries];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.ministry.toLowerCase().includes(q) ||
          m.study_work.toLowerCase().includes(q) ||
          m.jy_courses.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Filters
    if (filters.ministry) list = list.filter((m) => m.ministry === filters.ministry);
    if (filters.activeStatus === 'active') list = list.filter((m) => m.is_active);
    if (filters.activeStatus === 'inactive') list = list.filter((m) => !m.is_active);
    if (filters.joinedYear) list = list.filter((m) => String(m.joined_year) === filters.joinedYear);
    if (filters.course) list = list.filter((m) => m.jy_courses.includes(filters.course));

    // Sort
    list.sort((a, b) => {
      let valA: string | number | boolean = a[sortField];
      let valB: string | number | boolean = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [missionaries, searchQuery, filters, sortField, sortDirection]);

  // ── Toast helper ──────────────────────────────────────────────────────
  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── CRUD handlers ─────────────────────────────────────────────────────
  const handleSave = async (data: MissionaryFormData) => {
    if (editingMissionary) {
      const res = await fetch(`/api/missionaries/${editingMissionary.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setMissionaries((prev) => prev.map((m) => (m.id === editingMissionary.id ? json.data : m)));
      showToast(`${data.name} updated successfully`);
    } else {
      const res = await fetch('/api/missionaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setMissionaries((prev) => [...prev, json.data]);
      showToast(`${data.name} added successfully`);
    }
  };

  const handleDelete = async () => {
    if (!deletingMissionary) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/missionaries/${deletingMissionary.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setMissionaries((prev) => prev.filter((m) => m.id !== deletingMissionary.id));
      showToast(`${deletingMissionary.name} deleted`);
      setDeletingMissionary(null);
    } catch {
      showToast('Failed to delete missionary', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = useCallback((m: Missionary) => {
    setEditingMissionary(m);
    setShowModal(true);
  }, []);

  const handleDeleteClick = useCallback((m: Missionary) => {
    setDeletingMissionary(m);
  }, []);

  const handleAddNew = () => {
    setEditingMissionary(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingMissionary(null);
  };

  const handleCourseAdded = useCallback((course: string) => {
    setCustomCourses((prev) => [...prev, course]);
  }, []);

  // ── Export CSV ────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['#', 'Name', 'Ministry', 'Study/Work', 'JY Courses', 'Joined Year', 'Status'];
    const rows = displayedMissionaries.map((m) => [
      m.serial_number,
      `"${m.name}"`,
      `"${m.ministry}"`,
      `"${m.study_work}"`,
      `"${m.jy_courses.join('; ')}"`,
      m.joined_year,
      m.is_active ? 'Active' : 'Inactive',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jyp-missionaries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully');
  };

  // ── Print ─────────────────────────────────────────────────────────────
  const handlePrint = () => {
    window.print();
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Missionaries
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {displayedMissionaries.length} of {missionaries.length} records
            {searchQuery || filters.ministry || filters.activeStatus !== 'all' || filters.joinedYear || filters.course
              ? ' (filtered)'
              : ''}
          </p>
        </div>
      </div>

      {/* Stats */}
      <StatsBar missionaries={missionaries} />

      {/* Toolbar */}
      <Toolbar
        missionaries={missionaries}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        filters={filters}
        setFilters={setFilters}
        allCourses={allCourses}
        onAddNew={handleAddNew}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
      />

      {/* Data view — animates on mount */}
      <div
        key={viewMode}
        style={{ animation: 'fadeIn 0.15s ease' }}
      >
        {viewMode === 'table' && (
          <TableView
            missionaries={displayedMissionaries}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}
        {viewMode === 'card' && (
          <CardView
            missionaries={displayedMissionaries}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}
        {viewMode === 'list' && (
          <ListView
            missionaries={displayedMissionaries}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      {/* Print-only header */}
      <div className="print-header hidden">
        <h1>Jesus Youth Pala Missionaries</h1>
        <p>Printed on {new Date().toLocaleDateString()} · Total: {displayedMissionaries.length}</p>
      </div>

      {/* Modals */}
      {showModal && (
        <MissionaryModal
          missionary={editingMissionary}
          customCourses={customCourses}
          onSave={handleSave}
          onClose={handleModalClose}
          onCourseAdded={handleCourseAdded}
        />
      )}

      {deletingMissionary && (
        <DeleteConfirmModal
          missionary={deletingMissionary}
          onConfirm={handleDelete}
          onCancel={() => setDeletingMissionary(null)}
          loading={deleteLoading}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 100,
            padding: '0.75rem 1.25rem',
            borderRadius: '0.75rem',
            backgroundColor: toast.type === 'success' ? '#22c55e' : '#ef4444',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 500,
            boxShadow: '0 10px 25px rgb(0 0 0 / 0.2)',
            animation: 'slideUp 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            maxWidth: '320px',
          }}
        >
          {toast.type === 'success' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
