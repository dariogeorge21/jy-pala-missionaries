'use client';

import type { Missionary } from '@/types/missionary';

interface DeleteConfirmModalProps {
  missionary: Missionary;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function DeleteConfirmModal({ missionary, onConfirm, onCancel, loading }: DeleteConfirmModalProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-box max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-center mb-1" style={{ color: 'var(--text)' }}>
            Delete Missionary
          </h2>
          <p className="text-sm text-center mb-6" style={{ color: 'var(--text-muted)' }}>
            Are you sure you want to delete{' '}
            <span className="font-semibold" style={{ color: 'var(--text)' }}>
              {missionary.name}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex gap-3 mt-8">
            <button
              id="cancel-delete-btn"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              id="confirm-delete-btn"
              onClick={onConfirm}
              disabled={loading}
              className="btn btn-danger flex-1"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Deleting…
                </span>
              ) : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
