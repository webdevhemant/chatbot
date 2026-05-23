'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = true,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none px-4"
          >
            <div
              className="pointer-events-auto w-full max-w-sm rounded-2xl overflow-hidden"
              style={{
                background: '#0d1220',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
            >
              {/* Body */}
              <div className="px-6 pt-6 pb-5">
                <div className="flex items-start gap-4">
                  {danger && (
                    <div
                      className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl mt-0.5"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                      <AlertTriangle className="h-4 w-4" style={{ color: '#ef4444' }} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold leading-snug" style={{ color: '#e8edf5' }}>
                      {title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: '#4a5c78' }}>
                      {description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div
                className="flex items-center justify-end gap-2 px-6 py-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <button
                  type="button"
                  onClick={onCancel}
                  className="h-8 rounded-lg px-4 text-xs font-medium transition-all duration-150"
                  style={{
                    color: '#5a6a85',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#c8d3e8';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#5a6a85';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                  }}
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="h-8 rounded-lg px-4 text-xs font-semibold transition-all duration-150"
                  style={
                    danger
                      ? { background: '#ef4444', color: '#fff', border: '1px solid #dc2626' }
                      : { background: '#6c8eff', color: '#fff', border: '1px solid #5a7aee' }
                  }
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '0.88';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = danger
                      ? '0 0 16px rgba(239,68,68,0.35)'
                      : '0 0 16px rgba(108,142,255,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                  }}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
