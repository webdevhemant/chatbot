'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['Enter'], desc: 'Send message' },
  { keys: ['Shift', 'Enter'], desc: 'New line' },
  { keys: ['⌘', 'F'], desc: 'Search messages' },
  { keys: ['⌘', 'K'], desc: 'New conversation' },
  { keys: ['Esc'], desc: 'Close panel / cancel' },
  { keys: ['⌘', '/'], desc: 'Show shortcuts' },
];

function Kbd({ children }: { children: string }) {
  return (
    <kbd
      className="flex h-5 min-w-[20px] items-center justify-center rounded px-1.5 text-[10px] font-medium"
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#8b99b5',
        fontFamily: 'ui-monospace, monospace',
      }}
    >
      {children}
    </kbd>
  );
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              className="pointer-events-auto w-80 rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(13,18,32,0.98)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: 'rgba(108,142,255,0.12)', border: '1px solid rgba(108,142,255,0.2)' }}
                  >
                    <Keyboard className="h-3.5 w-3.5 text-[#6c8eff]" />
                  </div>
                  <span className="text-sm font-semibold text-[#c8d3e8]">Keyboard Shortcuts</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[#3d4f6e] hover:text-[#6a7d95] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col gap-1 p-3">
                {shortcuts.map(({ keys, desc }) => (
                  <div
                    key={desc}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-white/3"
                  >
                    <span className="text-sm text-[#5a6a85]">{desc}</span>
                    <div className="flex items-center gap-1">
                      {keys.map((k, i) => (
                        <span key={k} className="flex items-center gap-1">
                          <Kbd>{k}</Kbd>
                          {i < keys.length - 1 && (
                            <span className="text-[10px] text-[#2d3d55]">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="px-5 py-3 text-center text-[11px] text-[#2d3d55]"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                Press <Kbd>Esc</Kbd> to close
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
