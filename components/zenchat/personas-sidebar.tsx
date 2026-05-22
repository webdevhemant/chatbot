'use client';

import { formatRelativeTime, getAllConversations } from '@/lib/mock/conversations';
import { type Persona, personas } from '@/lib/mock/personas';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, PenSquare, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PersonasSidebarProps {
  activePersonaId: string;
  onPersonaSelect: (persona: Persona) => void;
  onConversationSelect: (conversationId: string, personaId: string) => void;
  activeConversationId?: string;
  onNewChat?: () => void;
}

export function PersonasSidebar({
  activePersonaId,
  onPersonaSelect,
  onConversationSelect,
  activeConversationId,
  onNewChat,
}: PersonasSidebarProps) {
  const [conversations, setConversations] = useState(() => getAllConversations().slice(0, 8));

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="zenchat-sidebar flex h-full w-full flex-col overflow-hidden">
      {/* Brand header */}
      <div className="flex-shrink-0 px-4 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="relative flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6c8eff 0%, #a78bfa 100%)',
                boxShadow: '0 0 16px rgba(108,142,255,0.35), 0 0 32px rgba(108,142,255,0.12)',
              }}
            >
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-white">ZenChat</div>
              <div className="text-[10px] tracking-widest uppercase" style={{ color: '#3d4f6e' }}>AI Personas</div>
            </div>
          </div>
          {onNewChat && (
            <button
              type="button"
              onClick={onNewChat}
              title="New conversation (⌘K)"
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150"
              style={{ color: '#3d4f6e' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#6c8eff';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#3d4f6e';
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <PenSquare className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mx-3 mb-2 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)' }} />

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-0">

        {/* Personas section */}
        <div className="flex-shrink-0 pb-2">
          <div className="mb-1.5 px-1 text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#2d3d55' }}>
            Personas
          </div>
          <div className="flex flex-col gap-0.5">
            {personas.map((persona) => {
              const isActive = persona.id === activePersonaId;
              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => onPersonaSelect(persona)}
                  className="persona-card group relative w-full text-left"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${persona.color}14 0%, ${persona.color}08 100%)`
                      : 'transparent',
                    border: isActive ? `1px solid ${persona.color}30` : '1px solid transparent',
                    boxShadow: isActive ? `0 0 16px ${persona.color}18, inset 0 1px 0 ${persona.color}20` : 'none',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div
                      className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-base transition-transform duration-200 group-hover:scale-110"
                      style={{ background: `${persona.color}15`, border: `1px solid ${persona.color}25` }}
                    >
                      {persona.avatar}
                      {isActive && (
                        <div
                          className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full"
                          style={{ background: persona.color, border: '2px solid #060a11' }}
                        />
                      )}
                    </div>
                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-[13px] font-medium leading-tight"
                        style={{ color: isActive ? persona.color : '#c8d3e8' }}
                      >
                        {persona.name}
                      </div>
                      <div className="truncate text-[10px] leading-tight mt-0.5" style={{ color: '#3d4f6e' }}>
                        {persona.tagline}
                      </div>
                    </div>
                    {/* Active dot */}
                    {isActive && (
                      <div
                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ background: persona.color, boxShadow: `0 0 5px ${persona.color}` }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px mb-2 flex-shrink-0" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)' }} />

        {/* Recent conversations */}
        <div className="flex-1">
          <div className="mb-1.5 flex items-center gap-1.5 px-1">
            <MessageCircle className="h-3 w-3" style={{ color: '#2d3d55' }} />
            <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#2d3d55' }}>Recent</span>
            <span className="ml-auto text-[10px]" style={{ color: '#1e2d42' }}>{conversations.length}</span>
          </div>

          {conversations.length === 0 ? (
            <div className="py-6 text-center text-[11px]" style={{ color: '#1e2d42' }}>
              Start a conversation above
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
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
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="group relative overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => onConversationSelect(conv.id, conv.personaId)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150"
                        style={{
                          background: isActive ? `${persona.color}0a` : 'transparent',
                          border: isActive ? `1px solid ${persona.color}20` : '1px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        }}
                      >
                        <div
                          className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{ background: persona.color, boxShadow: `0 0 4px ${persona.color}80` }}
                        />
                        <div className="min-w-0 flex-1 pr-5">
                          <span
                            className="block truncate text-[12px] leading-tight"
                            style={{ color: isActive ? '#c8d3e8' : '#4a5c78' }}
                          >
                            {conv.title}
                          </span>
                          <span className="text-[10px]" style={{ color: '#2a3549' }}>
                            {persona.name} · {formatRelativeTime(conv.updatedAt)}
                          </span>
                        </div>
                      </button>
                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, conv.id)}
                        title="Delete"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-md opacity-0 transition-all duration-150 group-hover:opacity-100"
                        style={{ color: '#2d3d55' }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
                          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = '#2d3d55';
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
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

      {/* Footer */}
      <div className="flex-shrink-0 px-3 py-3">
        <div className="mb-2 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)' }} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: '#4ade80', boxShadow: '0 0 5px rgba(74,222,128,0.8)', animation: 'glow-pulse 2s ease-in-out infinite' }}
            />
            <span className="text-[10px]" style={{ color: '#2d3d55' }}>All systems live</span>
          </div>
          <div
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ background: 'rgba(108,142,255,0.08)', border: '1px solid rgba(108,142,255,0.15)', color: '#4a6080' }}
          >
            v2.0
          </div>
        </div>
      </div>
    </div>
  );
}
