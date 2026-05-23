'use client';

import type { Persona } from '@/lib/mock/personas';
import { getInitials, useUserProfile } from '@/lib/user-profile-context';
import { motion } from 'framer-motion';
import {
  Download,
  Keyboard,
  PenLine,
  Search,
  Settings,
  FileText,
  X,
  Type,
  Zap,
  Check,
  CornerDownLeft,
  LayoutList,
  ArrowDownToLine,
  Clock3,
  Minimize2,
  Wand2,
} from 'lucide-react';
import { useCallback, useRef, useState, useEffect } from 'react';
import type { ChatSettings, FontSize, ResponseSpeed } from './settings-panel';
import { ProfileDropdown } from './profile-dropdown';

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHeaderProps {
  persona: Persona;
  conversationTitle: string;
  onNewChat: () => void;
  onTitleChange: (title: string) => void;
  onToggleSearch: () => void;
  settings: ChatSettings;
  onSettingsChange: (s: ChatSettings) => void;
  messages: ChatMsg[];
  onShowShortcuts?: () => void;
}

// ── Inline Settings panel (fixed portal) ─────────────────────────────────────
function SettingsDropdown({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  persona,
  anchorRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSettingsChange: (s: ChatSettings) => void;
  persona: Persona;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
  }, [isOpen, anchorRef]);

  const update = <K extends keyof ChatSettings>(key: K, val: ChatSettings[K]) =>
    onSettingsChange({ ...settings, [key]: val });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div
        className="fixed z-[61] w-72 rounded-xl overflow-hidden"
        style={{
          top: pos.top,
          right: pos.right,
          background: '#0d1220',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-2">
            <Settings className="h-3.5 w-3.5" style={{ color: '#3d4f6e' }} />
            <span className="text-[13px] font-semibold" style={{ color: '#c8d3e8' }}>
              Preferences
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-150"
            style={{ color: '#3d4f6e' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#8b99b5')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#3d4f6e')}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-5">
          {/* Font size */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Type className="h-3 w-3" style={{ color: '#3d4f6e' }} />
              <span className="text-[11px] font-medium uppercase tracking-[0.07em]" style={{ color: '#3d4f6e' }}>
                Text size
              </span>
            </div>
            <div
              className="flex rounded-lg overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {(['sm', 'md', 'lg'] as FontSize[]).map((v, i) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => update('fontSize', v)}
                  className="flex-1 py-1.5 text-xs font-medium transition-all duration-150"
                  style={
                    settings.fontSize === v
                      ? { background: persona.color, color: '#fff' }
                      : { color: '#3d4f6e' }
                  }
                >
                  {['Small', 'Medium', 'Large'][i]}
                </button>
              ))}
            </div>
          </div>

          {/* Streaming speed */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3" style={{ color: '#3d4f6e' }} />
              <span className="text-[11px] font-medium uppercase tracking-[0.07em]" style={{ color: '#3d4f6e' }}>
                Response speed
              </span>
            </div>
            <div
              className="flex rounded-lg overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {(['fast', 'normal', 'slow'] as ResponseSpeed[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => update('responseSpeed', v)}
                  className="flex-1 py-1.5 text-xs font-medium capitalize transition-all duration-150"
                  style={
                    settings.responseSpeed === v
                      ? { background: persona.color, color: '#fff' }
                      : { color: '#3d4f6e' }
                  }
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Send key */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <CornerDownLeft className="h-3 w-3" style={{ color: '#3d4f6e' }} />
              <span className="text-[11px] font-medium uppercase tracking-[0.07em]" style={{ color: '#3d4f6e' }}>
                Send message
              </span>
            </div>
            <div
              className="flex rounded-lg overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {([
                { value: 'enter', label: 'Enter' },
                { value: 'cmd-enter', label: '⌘ Enter' },
              ] as { value: import('./settings-panel').SendKey; label: string }[]).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update('sendKey', value)}
                  className="flex-1 py-1.5 text-xs font-medium transition-all duration-150"
                  style={
                    settings.sendKey === value
                      ? { background: persona.color, color: '#fff' }
                      : { color: '#3d4f6e' }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Display toggles */}
          <div className="flex flex-col gap-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.07em]" style={{ color: '#2d3d55' }}>
              Display
            </p>
            {([
              { key: 'showTimestamps' as const, label: 'Message timestamps', icon: Clock3 },
              { key: 'compactMode' as const, label: 'Compact density', icon: Minimize2 },
              { key: 'showReadTime' as const, label: 'Read time on long messages', icon: Wand2 },
              { key: 'autoScroll' as const, label: 'Auto-scroll during streaming', icon: ArrowDownToLine },
              { key: 'reduceMotion' as const, label: 'Reduce motion', icon: LayoutList },
            ]).map(({ key, label, icon: Icon }) => (
              <div
                key={key}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-3 w-3 flex-shrink-0" style={{ color: '#2d3d55' }} />
                  <span className="text-[12px]" style={{ color: '#5a6a85' }}>{label}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings[key] as boolean}
                  onClick={() => update(key, !(settings[key] as boolean))}
                  className="relative h-5 w-9 flex-shrink-0 rounded-full transition-all duration-200"
                  style={{
                    background: (settings[key] as boolean) ? persona.color : 'rgba(255,255,255,0.08)',
                    border: `1px solid ${(settings[key] as boolean) ? persona.color : 'rgba(255,255,255,0.12)'}`,
                    boxShadow: (settings[key] as boolean) ? `0 0 6px ${persona.color}40` : 'none',
                  }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200"
                    style={{ transform: (settings[key] as boolean) ? 'translateX(16px)' : 'translateX(0)' }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Export dropdown (fixed portal) ───────────────────────────────────────────
function ExportDropdown({
  isOpen,
  onClose,
  messages,
  persona,
  conversationTitle,
  anchorRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMsg[];
  persona: Persona;
  conversationTitle: string;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const [exported, setExported] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
  }, [isOpen, anchorRef]);

  const doExport = (type: 'txt' | 'json') => {
    let blob: Blob;
    let filename: string;
    const slug = conversationTitle.replace(/\s+/g, '-').toLowerCase();

    if (type === 'txt') {
      const lines = [
        `# ${conversationTitle}`,
        `Persona: ${persona.name} — ${persona.tagline}`,
        `Exported: ${new Date().toLocaleString()}`,
        '', '---', '',
        ...messages.map((m) => `**${m.role === 'user' ? 'You' : persona.name}**\n${m.content}\n`),
      ];
      blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      filename = `${slug}.txt`;
    } else {
      const data = {
        title: conversationTitle,
        persona: { id: persona.id, name: persona.name },
        exportedAt: new Date().toISOString(),
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      };
      blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      filename = `${slug}.json`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExported(type);
    setTimeout(() => { setExported(null); onClose(); }, 1200);
  };

  if (!isOpen) return null;

  const opts = [
    { type: 'txt' as const, icon: FileText, label: 'Plain text', desc: '.txt — readable transcript' },
    { type: 'json' as const, icon: Download, label: 'JSON data', desc: '.json — structured format' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div
        className="fixed z-[61] w-52 rounded-xl overflow-hidden"
        style={{
          top: pos.top,
          right: pos.right,
          background: '#0d1220',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 20px 56px rgba(0,0,0,0.65)',
        }}
      >
        <div
          className="px-3 py-2.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.07em]" style={{ color: '#3d4f6e' }}>
            Export chat
          </span>
        </div>
        {messages.length === 0 ? (
          <p className="px-4 py-4 text-center text-[12px]" style={{ color: '#2d3d55' }}>
            No messages to export yet
          </p>
        ) : (
          <div className="p-1.5 flex flex-col gap-0.5">
            {opts.map(({ type, icon: Icon, label, desc }) => (
              <button
                key={type}
                type="button"
                onClick={() => doExport(type)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150"
                style={{ color: exported === type ? persona.color : '#c8d3e8' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
              >
                {exported === type
                  ? <Check className="h-4 w-4 flex-shrink-0" style={{ color: persona.color }} />
                  : <Icon className="h-4 w-4 flex-shrink-0" style={{ color: '#3d4f6e' }} />
                }
                <div>
                  <p className="text-[12px] font-medium">{label}</p>
                  <p className="text-[10px]" style={{ color: '#2d3d55' }}>{desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── Main header ───────────────────────────────────────────────────────────────
export function ChatHeader({
  persona,
  conversationTitle,
  onNewChat: _onNewChat,
  onTitleChange,
  onToggleSearch,
  settings,
  onSettingsChange,
  messages,
  onShowShortcuts,
}: ChatHeaderProps) {
  const { profile, currentTheme } = useUserProfile();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editValue, setEditValue] = useState(conversationTitle);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);

  const commitEdit = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed) onTitleChange(trimmed);
    else setEditValue(conversationTitle);
    setIsEditingTitle(false);
  }, [editValue, conversationTitle, onTitleChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') commitEdit();
      if (e.key === 'Escape') { setEditValue(conversationTitle); setIsEditingTitle(false); }
    },
    [commitEdit, conversationTitle],
  );

  return (
    <>
      <div
        className="relative z-10 flex flex-shrink-0 items-center gap-3 px-4 py-3"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(7,9,15,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Persona chip */}
        <motion.div
          key={persona.id}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-base"
          style={{
            background: `${persona.color}14`,
            border: `1px solid ${persona.color}28`,
          }}
        >
          {persona.avatar}
        </motion.div>

        {/* Title block */}
        <div className="min-w-0 flex-1">
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-baseline gap-1.5"
          >
            <span className="text-[13px] font-semibold" style={{ color: persona.color }}>
              {persona.name}
            </span>
            <span className="text-[11px]" style={{ color: '#1e2d42' }}>·</span>
            <span className="truncate text-[11px]" style={{ color: '#2d3d55' }}>{persona.tagline}</span>
          </motion.div>

          {/* Editable conversation title */}
          {isEditingTitle ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              className="mt-0.5 w-full max-w-xs bg-transparent text-[12px] outline-none"
              style={{
                color: '#c8d3e8',
                borderBottom: `1px solid ${persona.color}50`,
                paddingBottom: '1px',
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => { setEditValue(conversationTitle); setIsEditingTitle(true); }}
              className="group mt-0.5 flex items-center gap-1 text-left"
            >
              <span
                className="truncate max-w-[220px] text-[12px] transition-colors duration-100"
                style={{ color: '#2d3d55' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = '#4a5c78')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = '#2d3d55')}
              >
                {conversationTitle}
              </span>
              <PenLine
                className="h-2.5 w-2.5 opacity-0 transition-opacity duration-100 group-hover:opacity-100"
                style={{ color: '#2d3d55' }}
              />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-0.5">
          <HdrBtn title="Search  ⌘F" onClick={onToggleSearch}>
            <Search className="h-3.5 w-3.5" />
          </HdrBtn>

          {onShowShortcuts && (
            <HdrBtn title="Shortcuts  ⌘/" onClick={onShowShortcuts}>
              <Keyboard className="h-3.5 w-3.5" />
            </HdrBtn>
          )}

          <HdrBtn
            title="Export"
            onClick={() => { setExportOpen((o) => !o); setSettingsOpen(false); }}
            active={exportOpen}
            ref={exportBtnRef}
          >
            <Download className="h-3.5 w-3.5" />
          </HdrBtn>

          <HdrBtn
            title="Settings"
            onClick={() => { setSettingsOpen((o) => !o); setExportOpen(false); }}
            active={settingsOpen}
            ref={settingsBtnRef}
          >
            <Settings className="h-3.5 w-3.5" />
          </HdrBtn>

          {/* Divider */}
          <div className="mx-1 h-4 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Profile avatar button */}
          <button
            ref={profileBtnRef}
            type="button"
            title={`${profile.name} — account & appearance`}
            onClick={() => { setProfileOpen((o) => !o); setSettingsOpen(false); setExportOpen(false); }}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-150"
            style={{
              background: profileOpen
                ? `${currentTheme.accent}30`
                : `${currentTheme.accent}18`,
              border: profileOpen
                ? `1.5px solid ${currentTheme.accent}60`
                : `1.5px solid ${currentTheme.accent}35`,
              color: currentTheme.accent,
              letterSpacing: '-0.02em',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = `${currentTheme.accent}2a`;
              el.style.borderColor = `${currentTheme.accent}55`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = profileOpen ? `${currentTheme.accent}30` : `${currentTheme.accent}18`;
              el.style.borderColor = profileOpen ? `${currentTheme.accent}60` : `${currentTheme.accent}35`;
            }}
          >
            {getInitials(profile.name)}
          </button>
        </div>
      </div>

      {/* Fixed-position panels (won't clip under chat area) */}
      <SettingsDropdown
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
        persona={persona}
        anchorRef={settingsBtnRef}
      />
      <ExportDropdown
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        messages={messages}
        persona={persona}
        conversationTitle={conversationTitle}
        anchorRef={exportBtnRef}
      />
      <ProfileDropdown
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        anchorRef={profileBtnRef}
      />
    </>
  );
}

// ── Small icon button ─────────────────────────────────────────────────────────
const HdrBtn = ({
  children,
  title,
  onClick,
  active = false,
  ref,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  active?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}) => (
  <button
    ref={ref}
    type="button"
    title={title}
    onClick={onClick}
    className="flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150"
    style={{
      color: active ? '#c8d3e8' : '#3d4f6e',
      background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLButtonElement).style.color = '#8b99b5';
      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.color = active ? '#c8d3e8' : '#3d4f6e';
      (e.currentTarget as HTMLButtonElement).style.background = active ? 'rgba(255,255,255,0.08)' : 'transparent';
    }}
  >
    {children}
  </button>
);
