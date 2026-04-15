'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Missionary, MissionaryFormData } from '@/types/missionary';
import { PREDEFINED_COURSES, PREDEFINED_MINISTRIES } from '@/types/missionary';

interface MissionaryModalProps {
  missionary?: Missionary | null;
  customCourses: string[];
  onSave: (data: MissionaryFormData) => Promise<void>;
  onClose: () => void;
  onCourseAdded: (course: string) => void;
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>{label}</label>
      {children}
      {error && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  );
}

const EMPTY_FORM: MissionaryFormData = {
  name: '',
  ministry: '',
  study_work: '',
  jy_courses: [],
  joined_year: new Date().getFullYear(),
  is_active: true,
};

export function MissionaryModal({ missionary, customCourses, onSave, onClose, onCourseAdded }: MissionaryModalProps) {
  const [form, setForm] = useState<MissionaryFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof MissionaryFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [newCourse, setNewCourse] = useState('');
  const [addingCourse, setAddingCourse] = useState(false);
  const [courseError, setCourseError] = useState('');

  const isEdit = Boolean(missionary);
  const allCourses = [...PREDEFINED_COURSES, ...customCourses];

  // Prefill form when editing
  useEffect(() => {
    if (missionary) {
      setForm({
        name: missionary.name,
        ministry: missionary.ministry,
        study_work: missionary.study_work,
        jy_courses: missionary.jy_courses,
        joined_year: missionary.joined_year,
        is_active: missionary.is_active,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [missionary]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof MissionaryFormData, string>> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.ministry) errs.ministry = 'Ministry is required';
    if (!form.joined_year || form.joined_year < 2000 || form.joined_year > new Date().getFullYear() + 1) {
      errs.joined_year = 'Enter a valid year';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const toggleCourse = useCallback((course: string) => {
    setForm((prev) => ({
      ...prev,
      jy_courses: prev.jy_courses.includes(course)
        ? prev.jy_courses.filter((c) => c !== course)
        : [...prev.jy_courses, course],
    }));
  }, []);

  const handleAddCourse = async () => {
    const trimmed = newCourse.trim();
    if (!trimmed) { setCourseError('Enter a course name'); return; }
    if (allCourses.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setCourseError('Course already exists');
      return;
    }
    setAddingCourse(true);
    setCourseError('');
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        onCourseAdded(trimmed);
        setNewCourse('');
        // Auto-select the new course
        setForm((prev) => ({ ...prev, jy_courses: [...prev.jy_courses, trimmed] }));
      }
    } catch {
      setCourseError('Failed to add course');
    } finally {
      setAddingCourse(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
            {isEdit ? 'Edit Missionary' : 'Add New Missionary'}
          </h2>
          <button onClick={onClose} className="btn-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 space-y-4">
            {/* Name */}
            <Field label="Full Name *" error={errors.name}>
              <input
                id="form-name"
                type="text"
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                placeholder="Enter full name"
                className="input"
                style={{ borderColor: errors.name ? 'var(--danger)' : undefined }}
              />
            </Field>

            {/* Ministry */}
            <Field label="Ministry *" error={errors.ministry}>
              <select
                id="form-ministry"
                value={form.ministry}
                onChange={(e) => { setForm({ ...form, ministry: e.target.value }); setErrors({ ...errors, ministry: '' }); }}
                className="input"
                style={{ borderColor: errors.ministry ? 'var(--danger)' : undefined }}
              >
                <option value="">Select ministry…</option>
                {PREDEFINED_MINISTRIES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>

            {/* Study / Work */}
            <Field label="Study / Work">
              <input
                id="form-study-work"
                type="text"
                value={form.study_work}
                onChange={(e) => setForm({ ...form, study_work: e.target.value })}
                placeholder="e.g. B.Tech CSE, Software Engineer…"
                className="input"
              />
            </Field>

            {/* Joined Year + Active */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Field label="Joined Year *" error={errors.joined_year}>
                  <input
                    id="form-year"
                    type="number"
                    value={form.joined_year}
                    onChange={(e) => { setForm({ ...form, joined_year: Number(e.target.value) }); setErrors({ ...errors, joined_year: '' }); }}
                    min={2000}
                    max={new Date().getFullYear() + 1}
                    className="input"
                    style={{ borderColor: errors.joined_year ? 'var(--danger)' : undefined }}
                  />
                </Field>
              </div>
              <div className="flex-1">
                <Field label="Status">
                  <div className="flex items-center gap-3 h-10 mt-1">
                    <button
                      type="button"
                      id="form-active-toggle"
                      onClick={() => setForm({ ...form, is_active: !form.is_active })}
                      className="relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
                      style={{ backgroundColor: form.is_active ? 'var(--primary)' : 'var(--border)' }}
                      role="switch"
                      aria-checked={form.is_active}
                    >
                      <span
                        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                        style={{ transform: form.is_active ? 'translateX(20px)' : 'translateX(0)' }}
                      />
                    </button>
                    <span className="text-sm font-medium" style={{ color: form.is_active ? '#22c55e' : 'var(--text-muted)' }}>
                      {form.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </Field>
              </div>
            </div>

            {/* JY Courses */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                JY Courses Attended
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {allCourses.map((course) => {
                  const selected = form.jy_courses.includes(course);
                  return (
                    <button
                      key={course}
                      type="button"
                      onClick={() => toggleCourse(course)}
                      className="badge cursor-pointer transition-all duration-150"
                      style={{
                        backgroundColor: selected ? 'var(--primary)' : 'var(--surface-2)',
                        color: selected ? '#fff' : 'var(--text-muted)',
                        border: selected ? '1px solid var(--primary)' : '1px solid var(--border)',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.8125rem',
                      }}
                    >
                      {selected && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-1">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                      {course}
                    </button>
                  );
                })}
              </div>

              {/* Add custom course */}
              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
              >
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Add Custom Course</p>
                <div className="flex gap-2">
                  <input
                    id="custom-course-input"
                    type="text"
                    value={newCourse}
                    onChange={(e) => { setNewCourse(e.target.value); setCourseError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCourse(); } }}
                    placeholder="Course name…"
                    className="input flex-1"
                    style={{ fontSize: '0.8125rem' }}
                  />
                  <button
                    type="button"
                    id="add-course-btn"
                    onClick={handleAddCourse}
                    disabled={addingCourse}
                    className="btn btn-ghost btn-sm shrink-0"
                  >
                    {addingCourse ? '…' : '+ Add'}
                  </button>
                </div>
                {courseError && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{courseError}</p>}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex gap-3 p-6"
            style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface-2)', borderRadius: '0 0 1.5rem 1.5rem' }}
          >
            <button type="button" onClick={onClose} disabled={saving} className="btn btn-ghost flex-1">
              Cancel
            </button>
            <button
              id="save-missionary-btn"
              type="submit"
              disabled={saving}
              className="btn btn-primary flex-1"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Saving…
                </span>
              ) : isEdit ? 'Save Changes' : 'Add Missionary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
