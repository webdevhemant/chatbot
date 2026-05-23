'use client';

import { PersonasSidebar } from '@/components/zenchat/personas-sidebar';
import { ChatWindow } from '@/components/zenchat/chat-window';
import { mockConversations } from '@/lib/mock/conversations';
import { type Persona, getPersonaById, personas } from '@/lib/mock/personas';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useCallback, useState } from 'react';

interface LiveConversation {
  id: string;
  personaId: string;
  title: string;
  updatedAt: Date;
}

export default function HaloPage() {
  const [activePersona, setActivePersona] = useState<Persona>(personas[0]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const [chatKey, setChatKey] = useState(0);
  const [initialMessages, setInitialMessages] = useState<
    { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date }[]
  >([]);
  const [initialTitle, setInitialTitle] = useState('New conversation');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Live conversations created during this session (prepended to sidebar recent list)
  const [liveConversations, setLiveConversations] = useState<LiveConversation[]>([]);

  const handlePersonaSelect = (persona: Persona) => {
    setActivePersona(persona);
    setActiveConversationId(undefined);
    setInitialMessages([]);
    setInitialTitle('New conversation');
    setChatKey((k) => k + 1);
    setSidebarOpen(false);
  };

  const handleConversationSelect = (conversationId: string, personaId: string) => {
    // Check live conversations first
    const live = liveConversations.find((c) => c.id === conversationId);
    if (live) {
      const persona = getPersonaById(personaId);
      setActivePersona(persona);
      setActiveConversationId(conversationId);
      setInitialMessages([]);
      setInitialTitle(live.title);
      setChatKey((k) => k + 1);
      setSidebarOpen(false);
      return;
    }
    // Fall back to mock conversations
    const conv = mockConversations.find((c) => c.id === conversationId);
    if (!conv) return;
    const persona = getPersonaById(personaId);
    setActivePersona(persona);
    setActiveConversationId(conversationId);
    setInitialMessages(conv.messages);
    setInitialTitle(conv.title);
    setChatKey((k) => k + 1);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setActiveConversationId(undefined);
    setInitialMessages([]);
    setInitialTitle('New conversation');
    setChatKey((k) => k + 1);
  };

  const handleConversationCreated = useCallback((conv: LiveConversation) => {
    setLiveConversations((prev) => {
      // Avoid duplicates
      if (prev.some((c) => c.id === conv.id)) return prev;
      return [conv, ...prev];
    });
    setActiveConversationId(conv.id);
  }, []);

  return (
    <div className="flex h-dvh w-full overflow-hidden" style={{ background: 'var(--background)' }}>

      {/* ── Desktop sidebar ── */}
      <div
        className="hidden md:flex flex-shrink-0 h-full"
        style={{ width: '272px', minWidth: '272px' }}
      >
        <PersonasSidebar
          activePersonaId={activePersona.id}
          onPersonaSelect={handlePersonaSelect}
          onConversationSelect={handleConversationSelect}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
          liveConversations={liveConversations}
        />
      </div>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
              style={{ width: '272px' }}
            >
              <PersonasSidebar
                activePersonaId={activePersona.id}
                onPersonaSelect={handlePersonaSelect}
                onConversationSelect={handleConversationSelect}
                activeConversationId={activeConversationId}
                onNewChat={handleNewChat}
                liveConversations={liveConversations}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Chat area ── */}
      <div className="relative min-w-0 flex-1 flex flex-col">

        {/* Mobile top bar */}
        <div
          className="flex md:hidden items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(8,12,20,0.9)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4a5c78] hover:text-[#c8d3e8] transition-colors"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base">{activePersona.avatar}</span>
            <div>
              <div className="text-sm font-semibold text-white leading-tight">{activePersona.name}</div>
              <div className="text-[10px] text-[#3d4f6e] truncate">{activePersona.tagline}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ChatWindow
            key={chatKey}
            persona={activePersona}
            initialMessages={initialMessages}
            initialTitle={initialTitle}
            onNewChat={handleNewChat}
            onConversationCreated={handleConversationCreated}
          />
        </div>
      </div>
    </div>
  );
}
