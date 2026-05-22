'use client';

import type { Persona } from '@/lib/mock/personas';
import { motion } from 'framer-motion';
import { Download, Keyboard, PenLine, Plus, Search, Settings } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { ChatSettings } from './settings-panel';
import { SettingsPanel } from './settings-panel';
import { ExportMenu } from './export-menu';

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

export function ChatHeader({
  persona,
  conversationTitle,
  onNewChat,
  onTitleChange,
  onToggleSearch,
  settings,
  onSettingsChange,
  messages,
  onShowShortcuts,
}: ChatHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editValue, setEditValue] = useState(conversationTitle);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const commitEdit = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed) {
      onTitleChange(trimmed);
    } else {
      setEditValue(conversationTitle);
    }
    setIsEditingTitle(false);
  }, [editValue, conversationTitle, onTitleChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') commitEdit();
      if (e.key === 'Escape') {
        setEditValue(conversationTitle);
        setIsEditingTitle(false);
      }
    },
    [commitEdit, conversationTitle],
  );

  return (
    <div
      className="relative flex flex-shrink-0 items-center justify-between px-5 py-3.5"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(8, 12, 20, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* Left: persona + title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <motion.div
          key={persona.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg"
          style={{
            background: `${persona.color}18`,
            border: `1px solid ${persona.color}30`,
            boxShadow: `0 0 16px ${persona.color}20`,
          }}
        >
          {persona.avatar}
        </motion.div>

        <div className="min-w-0 flex-1">
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-1.5"
          >
            <span className="text-sm font-semibold" style={{ color: persona.color }}>
              {persona.name}
            </span>
            <span className="text-[#2d3d55] text-xs">·</span>
            <span className="text-xs text-[#3d4f6e] truncate">{persona.tagline}</span>
          </motion.div>

          <div className="flex items-center gap-1 mt-0.5">
            {isEditingTitle ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={handleKeyDown}
                className="min-w-0 flex-1 bg-transparent text-xs text-[#c8d3e8] outline-none"
                style={{ borderBottom: `1px solid ${persona.color}50`, paddingBottom: '1px' }}
              />
            ) : (
              <button
                type="button"
                onClick={() => { setEditValue(conversationTitle); setIsEditingTitle(true); }}
                className="group flex items-center gap-1 text-left"
              >
                <span className="truncate text-xs text-[#2d3d55] group-hover:text-[#4a5c78] transition-colors duration-150">
                  {conversationTitle}
                </span>
                <PenLine className="h-2.5 w-2.5 text-[#2d3d55] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="relative flex items-center gap-1 flex-shrink-0">
        <IconBtn title="Search (⌘F)" onClick={onToggleSearch} persona={persona}>
          <Search className="h-3.5 w-3.5" />
        </IconBtn>

        {onShowShortcuts && (
          <IconBtn title="Keyboard shortcuts (⌘/)" onClick={onShowShortcuts} persona={persona}>
            <Keyboard className="h-3.5 w-3.5" />
          </IconBtn>
        )}

        <IconBtn
          title="Export"
          onClick={() => { setExportOpen((o) => !o); setSettingsOpen(false); }}
          persona={persona}
          active={exportOpen}
        >
          <Download className="h-3.5 w-3.5" />
        </IconBtn>

        <IconBtn
          title="Settings"
          onClick={() => { setSettingsOpen((o) => !o); setExportOpen(false); }}
          persona={persona}
          active={settingsOpen}
        >
          <Settings className="h-3.5 w-3.5" />
        </IconBtn>

        <button
          type="button"
          onClick={onNewChat}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150 ml-1"
          style={{
            background: `${persona.color}12`,
            border: `1px solid ${persona.color}25`,
            color: persona.color,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = `${persona.color}20`;
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 12px ${persona.color}20`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = `${persona.color}12`;
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </button>

        {/* Panels */}
        <SettingsPanel
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          onSettingsChange={onSettingsChange}
          persona={persona}
        />
        <ExportMenu
          isOpen={exportOpen}
          onClose={() => setExportOpen(false)}
          messages={messages}
          persona={persona}
          conversationTitle={conversationTitle}
        />
      </div>
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  persona,
  active = false,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  persona: Persona;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150"
      style={{
        color: active ? persona.color : '#3d4f6e',
        background: active ? `${persona.color}15` : 'transparent',
        border: active ? `1px solid ${persona.color}30` : '1px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#6a7d95';
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = active ? persona.color : '#3d4f6e';
        (e.currentTarget as HTMLButtonElement).style.background = active ? `${persona.color}15` : 'transparent';
      }}
    >
      {children}
    </button>
  );
}
