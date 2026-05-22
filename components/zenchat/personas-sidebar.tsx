'use client';

import { formatRelativeTime, getAllConversations } from '@/lib/mock/conversations';
import { type Persona, personas } from '@/lib/mock/personas';
import { motion } from 'framer-motion';
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
      {/* Brand */}
      <div className="flex-shrink-0 px-4 pt-6 pb-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              className="relative flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #6c8eff 0%, #a78bfa 100%)',
                boxShadow: '0 0 20px rgba(108,142,255,0.4), 0 0 40px rgba(108,142,255,0.15)',
              }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-white">ZenChat</div>
              <div className="text-[10px] text-[#3d4f6e] tracking-widest uppercase">AI UI Kit</div>
            </div>
          </div>

          {/* New chat button */}
          {onNewChat && (
            <button
              type="button"
              onClick={onNewChat}
              title="New conversation"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#3d4f6e] transition-all duration-150 hover:bg-white/5 hover:text-[#6c8eff]"
            >
              <PenSquare className="h-3.5 w-3.5" />
            </button>
          )}
        </motion.div>
      </div>

      <div className="mx-3 mb-3 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Personas */}
      <div className="flex-shrink-0 px-3 pb-2">
        <div className="mb-2 px-1 text-[10px] font-semibold tracking-widest text-[#2d3d55] uppercase">
          Personas
        </div>
        <div className="flex flex-col gap-0.5">
          {personas.map((persona, i) => {
            const isActive = persona.id === activePersonaId;
            return (
              <motion.button
                key={persona.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onPersonaSelect(persona)}
                className="persona-card group relative w-full text-left"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${persona.color}14 0%, ${persona.color}08 100%)`
                    : 'transparent',
                  border: isActive
                    ? `1px solid ${persona.color}30`
                    : '1px solid transparent',
                  boxShadow: isActive
                    ? `0 0 16px ${persona.color}18, inset 0 1px 0 ${persona.color}20`
                    : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: `${persona.color}15`,
                      border: `1px solid ${persona.color}25`,
                    }}
                  >
                    {persona.avatar}
                    {isActive && (
                      <div
                        className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#060a11]"
                        style={{ background: persona.color }}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className="text-sm font-medium leading-tight"
                      style={{ color: isActive ? persona.color : '#c8d3e8' }}
                    >
                      {persona.name}
                    </div>
                    <div className="truncate text-[11px] text-[#3d4f6e] leading-tight mt-0.5">
                      {persona.tagline}
                    </div>
                  </div>
                  {isActive && (
                    <div
                      className="flex-shrink-0 h-1.5 w-1.5 rounded-full"
                      style={{ background: persona.color, boxShadow: `0 0 6px ${persona.color}` }}
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mx-3 mb-3 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Recent conversations */}
      <div className="min-h-0 flex-1 px-3 overflow-y-auto no-scrollbar">
        <div className="mb-2 flex items-center gap-1.5 px-1">
          <MessageCircle className="h-3 w-3 text-[#2d3d55]" />
          <span className="text-[10px] font-semibold tracking-widest text-[#2d3d55] uppercase">
            Recent
          </span>
          <span className="ml-auto text-[10px] text-[#1e2d42]">{conversations.length}</span>
        </div>

        {conversations.length === 0 && (
          <div className="px-2 py-4 text-center text-[11px] text-[#1e2d42]">
            No conversations yet
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          {conversations.map((conv, i) => {
            const persona = personas.find((p) => p.id === conv.personaId);
            const isActive = conv.id === activeConversationId;
            if (!persona) return null;
            return (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className="group relative"
              >
                <button
                  type="button"
                  onClick={() => onConversationSelect(conv.id, conv.personaId)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150 hover:bg-white/4"
                  style={{
                    background: isActive ? `${persona.color}0a` : 'transparent',
                    border: isActive ? `1px solid ${persona.color}20` : '1px solid transparent',
                  }}
                >
                  <div
                    className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ background: persona.color, boxShadow: `0 0 4px ${persona.color}80` }}
                  />
                  <div className="min-w-0 flex-1">
                    <span
                      className="block truncate text-xs transition-colors duration-150"
                      style={{ color: isActive ? '#c8d3e8' : '#4a5c78' }}
                    >
                      {conv.title}
                    </span>
                    <span className="text-[10px] text-[#2a3549]">
                      {persona.name} · {formatRelativeTime(conv.updatedAt)}
                    </span>
                  </div>
                </button>

                {/* Delete on hover */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, conv.id)}
                  title="Delete conversation"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-md text-[#2d3d55] opacity-0 transition-all duration-150 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-3 py-4">
        <div className="mx-0 mb-3 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: '#4ade80',
                boxShadow: '0 0 6px rgba(74,222,128,0.8)',
                animation: 'glow-pulse 2s ease-in-out infinite',
              }}
            />
            <span className="text-[10px] text-[#2d3d55]">All systems live</span>
          </div>
          <div
            className="rounded-full px-2.5 py-1 text-[10px] font-medium"
            style={{
              background: 'rgba(108,142,255,0.08)',
              border: '1px solid rgba(108,142,255,0.15)',
              color: '#4a6080',
            }}
          >
            v2.0
          </div>
        </div>
      </div>
    </div>
  );
}
