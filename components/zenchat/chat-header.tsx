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
  Check,
} from 'lucide-react';
import { useCallback, useRef, useState, useEffect } from 'react';
import type { ChatSettings } from './settings-panel';
import { SettingsModal } from './settings-modal';

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
  const [exportOpen, setExportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsInitialSection, setSettingsInitialSection] = useState<'profile' | 'appearance' | 'chat' | 'plan' | 'about'>('profile');

  const exportBtnRef = useRef<HTMLButtonElement>(null);

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

  const openSettings = (section: 'profile' | 'appearance' | 'chat' | 'plan' | 'about' = 'profile') => {
    setSettingsInitialSection(section);
    setSettingsOpen(true);
    setExportOpen(false);
  };

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
            onClick={() => setExportOpen((o) => !o)}
            active={exportOpen}
            ref={exportBtnRef}
          >
            <Download className="h-3.5 w-3.5" />
          </HdrBtn>

          <HdrBtn
            title="Chat settings"
            onClick={() => openSettings('chat')}
            active={settingsOpen && settingsInitialSection === 'chat'}
          >
            <Settings className="h-3.5 w-3.5" />
          </HdrBtn>

          {/* Divider */}
          <div className="mx-1 h-4 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Profile avatar button — opens full settings modal */}
          <button
            type="button"
            title={`${profile.name} — settings & profile`}
            onClick={() => openSettings('profile')}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-150"
            style={{
              background: settingsOpen && settingsInitialSection === 'profile'
                ? `${currentTheme.accent}30`
                : `${currentTheme.accent}18`,
              border: settingsOpen && settingsInitialSection === 'profile'
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
              const active = settingsOpen && settingsInitialSection === 'profile';
              el.style.background = active ? `${currentTheme.accent}30` : `${currentTheme.accent}18`;
              el.style.borderColor = active ? `${currentTheme.accent}60` : `${currentTheme.accent}35`;
            }}
          >
            {getInitials(profile.name)}
          </button>
        </div>
      </div>

      {/* Export dropdown (small portal) */}
      <ExportDropdown
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        messages={messages}
        persona={persona}
        conversationTitle={conversationTitle}
        anchorRef={exportBtnRef}
      />

      {/* Full-page settings modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
        initialSection={settingsInitialSection}
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
