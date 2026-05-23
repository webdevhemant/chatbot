'use client';

import { formatRelativeTime, getAllConversations } from '@/lib/mock/conversations';
import { type Persona, personas } from '@/lib/mock/personas';
import { getInitials, useUserProfile } from '@/lib/user-profile-context';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from './confirm-dialog';

interface LiveConversation {
  id: string;
  personaId: string;
  title: string;
  updatedAt: Date;
}

interface PersonasSidebarProps {
  activePersonaId: string;
  onPersonaSelect: (persona: Persona) => void;
  onConversationSelect: (conversationId: string, personaId: string) => void;
  activeConversationId?: string;
  onNewChat?: () => void;
  liveConversations?: LiveConversation[];
}

export function PersonasSidebar({
  activePersonaId,
  onPersonaSelect,
  onConversationSelect,
  activeConversationId,
  onNewChat,
  liveConversations = [],
}: PersonasSidebarProps) {
  const { profile, currentTheme } = useUserProfile();
  const [mockConvs] = useState(() => getAllConversations().slice(0, 8));
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const liveIds = new Set(liveConversations.map((c) => c.id));
  const conversations = [
    ...liveConversations.map((c) => ({ ...c, isLive: true })),
    ...mockConvs
      .filter((c) => !liveIds.has(c.id))
      .map((c) => ({ id: c.id, personaId: c.personaId, title: c.title, updatedAt: c.updatedAt, isLive: false })),
  ].filter((c) => !hiddenIds.has(c.id));

  const pendingConv = conversations.find((c) => c.id === pendingDeleteId);
  const pendingPersona = pendingConv ? personas.find((p) => p.id === pendingConv.personaId) : null;

  const confirmDelete = () => {
    if (pendingDeleteId) {
      setHiddenIds((prev) => new Set([...prev, pendingDeleteId]));
      setPendingDeleteId(null);
    }
  };

  return (
    <>
      <div
        className="flex h-full w-full flex-col overflow-hidden"
        style={{
          background: 'var(--sidebar, #07090f)',
          borderRight: '1px solid rgba(255,255,255,0.055)',
        }}
      >
        {/* ── Brand header ─────────────────────────────────── */}
        <div className="flex-shrink-0 px-4 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Wordmark — hexagon logo */}
              <div
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0f1624 0%, #07090f 100%)',
                  boxShadow: `0 2px 8px ${currentTheme.accent}40`,
                  border: `1px solid ${currentTheme.accent}25`,
                }}
              >
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden>
                  <defs>
                    <linearGradient id="sb-hex" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor={currentTheme.accent} stopOpacity="1"/>
                      <stop offset="100%" stopColor={currentTheme.accent} stopOpacity="0.6"/>
                    </linearGradient>
                    <linearGradient id="sb-inner" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#1e3a6e"/>
                      <stop offset="100%" stopColor="#07090f"/>
                    </linearGradient>
                  </defs>
                  <path d="M16 4 L26.4 10 L26.4 22 L16 28 L5.6 22 L5.6 10 Z" fill="url(#sb-hex)"/>
                  <path d="M16 9 L22.2 12.5 L22.2 19.5 L16 23 L9.8 19.5 L9.8 12.5 Z" fill="url(#sb-inner)"/>
                  <circle cx="16" cy="16" r="2" fill="url(#sb-hex)"/>
                </svg>
              </div>
              <span
                className="text-[13px] font-semibold tracking-tight"
                style={{ color: '#dde4f0', letterSpacing: '-0.01em' }}
              >
                HaxonChat
              </span>
            </div>

            {onNewChat && (
              <button
                type="button"
                onClick={onNewChat}
                title="New chat  ⌘K"
                className="flex h-6 w-6 items-center justify-center rounded-md transition-all duration-150"
                style={{ color: '#3d4f6e' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.color = '#c8d3e8';
                  el.style.background = 'rgba(255,255,255,0.07)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.color = '#3d4f6e';
                  el.style.background = 'transparent';
                }}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Scrollable body ───────────────────────────────── */}
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-2">

          {/* Personas */}
          <div className="mb-5">
            <p
              className="mb-1.5 px-1 text-[10px] font-medium uppercase tracking-[0.08em]"
              style={{ color: '#2d3d55' }}
            >
              Personas
            </p>
            <div className="flex flex-col gap-px">
              {personas.map((persona) => {
                const isActive = persona.id === activePersonaId;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => onPersonaSelect(persona)}
                    className="group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-all duration-150"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.055)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.035)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r-full"
                        style={{ height: '60%', background: persona.color }}
                      />
                    )}

                    {/* Avatar */}
                    <div
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-sm"
                      style={{
                        background: isActive ? `${persona.color}1a` : 'rgba(255,255,255,0.05)',
                        border: isActive ? `1px solid ${persona.color}30` : '1px solid rgba(255,255,255,0.07)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {persona.avatar}
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-[13px] font-medium leading-tight"
                        style={{ color: isActive ? '#e8edf5' : '#6a7d95' }}
                      >
                        {persona.name}
                      </div>
                      <div
                        className="truncate text-[11px] leading-tight"
                        style={{ color: isActive ? '#3d5070' : '#2a3a52' }}
                      >
                        {persona.tagline}
                      </div>
                    </div>

                    {/* Online dot when active */}
                    {isActive && (
                      <div
                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ background: persona.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="mb-4 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

          {/* Recent conversations */}
          <div>
            <div className="mb-1.5 flex items-center justify-between px-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.08em]" style={{ color: '#2d3d55' }}>
                Recent
              </p>
              {conversations.length > 0 && (
                <span className="text-[10px] tabular-nums" style={{ color: '#1e2d42' }}>
                  {conversations.length}
                </span>
              )}
            </div>

            {conversations.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 px-2">
                <MessageSquare className="h-5 w-5" style={{ color: '#1e2d42' }} />
                <p className="text-center text-[11px] leading-relaxed" style={{ color: '#1e2d42' }}>
                  No conversations yet.
                  <br />Start one above.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-px">
                <AnimatePresence initial={false}>
                  {conversations.map((conv) => {
                    const persona = personas.find((p) => p.id === conv.personaId);
                    const isActive = conv.id === activeConversationId;
                    if (!persona) return null;

                    return (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.16, ease: 'easeInOut' }}
                        className="group relative overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => onConversationSelect(conv.id, conv.personaId)}
                          className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150"
                          style={{
                            background: isActive ? 'rgba(255,255,255,0.055)' : 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.035)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                          }}
                        >
                          {/* Persona dot */}
                          <div
                            className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full"
                            style={{ background: persona.color, opacity: isActive ? 1 : 0.5 }}
                          />
                          <div className="min-w-0 flex-1 pr-4">
                            <p
                              className="truncate text-[12px] font-medium leading-snug"
                              style={{ color: isActive ? '#dde4f0' : '#4a5c78' }}
                            >
                              {conv.title}
                            </p>
                            <p
                              className="mt-0.5 text-[10px]"
                              style={{ color: '#22303f' }}
                              suppressHydrationWarning
                            >
                              {persona.name} · {formatRelativeTime(conv.updatedAt)}
                            </p>
                          </div>
                        </button>

                        {/* Delete button — only visible on hover */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPendingDeleteId(conv.id);
                          }}
                          title="Delete conversation"
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-md opacity-0 transition-all duration-150 group-hover:opacity-100"
                          style={{ color: '#2d3d55' }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.color = '#ef4444';
                            el.style.background = 'rgba(239,68,68,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.color = '#2d3d55';
                            el.style.background = 'transparent';
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* ── User profile footer ───────────────────────────── */}
        <div
          className="flex-shrink-0 px-3 py-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2"
            style={{ background: 'rgba(255,255,255,0.025)' }}
          >
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
              style={{
                background: `${currentTheme.accent}1a`,
                border: `1.5px solid ${currentTheme.accent}35`,
                color: currentTheme.accent,
                letterSpacing: '-0.02em',
              }}
            >
              {getInitials(profile.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-[12px] font-medium leading-tight"
                style={{ color: '#8b99b5' }}
              >
                {profile.name}
              </p>
              {profile.email && (
                <p
                  className="truncate text-[10px] leading-tight"
                  style={{ color: '#2a3a52' }}
                >
                  {profile.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        title="Delete conversation?"
        description={
          pendingConv
            ? `"${pendingConv.title}" will be permanently removed. This cannot be undone.`
            : 'This conversation will be permanently removed.'
        }
        confirmLabel="Delete"
        cancelLabel="Keep it"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        danger
      />
    </>
  );
}
