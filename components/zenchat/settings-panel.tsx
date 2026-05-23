'use client';

import type { Persona } from '@/lib/mock/personas';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type, Zap, Moon } from 'lucide-react';

export type FontSize = 'sm' | 'md' | 'lg';
export type ResponseSpeed = 'fast' | 'normal' | 'slow';
export type SendKey = 'enter' | 'cmd-enter';
export type MessageGrouping = 'grouped' | 'individual';

export interface ChatSettings {
  fontSize: FontSize;
  responseSpeed: ResponseSpeed;
  showTimestamps: boolean;
  soundEnabled: boolean;
  compactMode: boolean;
  /** Whether Enter sends or Cmd+Enter sends */
  sendKey: SendKey;
  /** Group consecutive messages from same sender */
  messageGrouping: MessageGrouping;
  /** Auto-scroll to bottom during streaming */
  autoScroll: boolean;
  /** Show word count and read time on assistant messages */
  showReadTime: boolean;
  /** Reduce motion (disables framer-motion animations) */
  reduceMotion: boolean;
}

export const defaultSettings: ChatSettings = {
  fontSize: 'md',
  responseSpeed: 'normal',
  showTimestamps: false,
  soundEnabled: false,
  compactMode: false,
  sendKey: 'enter',
  messageGrouping: 'grouped',
  autoScroll: true,
  showReadTime: true,
  reduceMotion: false,
};

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
  persona: Persona;
}

function Toggle({
  checked,
  onChange,
  color,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  color: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 h-5 w-9 rounded-full transition-all duration-200"
      style={{
        background: checked ? color : 'rgba(255,255,255,0.08)',
        border: `1px solid ${checked ? color : 'rgba(255,255,255,0.12)'}`,
        boxShadow: checked ? `0 0 8px ${color}40` : 'none',
      }}
    >
      <span
        className="absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200"
        style={{ transform: checked ? 'translateX(16px)' : 'translateX(0)' }}
      />
    </button>
  );
}

function SegmentControl<T extends string>({
  value,
  options,
  onChange,
  color,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  color: string;
}) {
  return (
    <div
      className="flex rounded-lg overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="flex-1 px-3 py-1.5 text-xs font-medium transition-all duration-150"
          style={
            value === opt.value
              ? { background: color, color: 'white' }
              : { color: '#4a5c78' }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  persona,
}: SettingsPanelProps) {
  const update = <K extends keyof ChatSettings>(key: K, value: ChatSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-4 top-14 z-50 w-72 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(13,18,32,0.97)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
              backdropFilter: 'blur(40px)',
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-sm font-semibold text-[#c8d3e8]">Chat Settings</span>
              <button
                type="button"
                onClick={onClose}
                className="flex h-6 w-6 items-center justify-center rounded-lg text-[#3d4f6e] transition-colors duration-150 hover:text-[#6a7d95]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-5 p-4">
              {/* Font Size */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Type className="h-3.5 w-3.5 text-[#3d4f6e]" />
                  <span className="text-xs font-medium text-[#6a7d95]">Font Size</span>
                </div>
                <SegmentControl
                  value={settings.fontSize}
                  options={[
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                  ]}
                  onChange={(v) => update('fontSize', v)}
                  color={persona.color}
                />
              </div>

              {/* Response Speed */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-[#3d4f6e]" />
                  <span className="text-xs font-medium text-[#6a7d95]">Streaming Speed</span>
                </div>
                <SegmentControl
                  value={settings.responseSpeed}
                  options={[
                    { value: 'fast', label: 'Fast' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'slow', label: 'Slow' },
                  ]}
                  onChange={(v) => update('responseSpeed', v)}
                  color={persona.color}
                />
              </div>

              {/* Toggles */}
              <div
                className="flex flex-col gap-3 pt-1"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                {[
                  { key: 'showTimestamps' as const, label: 'Show timestamps' },
                  { key: 'compactMode' as const, label: 'Compact messages' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-[#4a5c78]">{label}</span>
                    <Toggle
                      checked={settings[key] as boolean}
                      onChange={(v) => update(key, v)}
                      color={persona.color}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
