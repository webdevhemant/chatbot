'use client';

import { PersonasSidebar } from '@/components/zenchat/personas-sidebar';
import { ChatWindow } from '@/components/zenchat/chat-window';
import { mockConversations } from '@/lib/mock/conversations';
import { type Persona, getPersonaById, personas } from '@/lib/mock/personas';
import { useState } from 'react';

export default function ZenChatPage() {
  const [activePersona, setActivePersona] = useState<Persona>(personas[0]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const [chatKey, setChatKey] = useState(0);
  const [initialMessages, setInitialMessages] = useState<
    { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date }[]
  >([]);
  const [initialTitle, setInitialTitle] = useState('New conversation');

  const handlePersonaSelect = (persona: Persona) => {
    setActivePersona(persona);
    setActiveConversationId(undefined);
    setInitialMessages([]);
    setInitialTitle('New conversation');
    setChatKey((k) => k + 1);
  };

  const handleConversationSelect = (conversationId: string, personaId: string) => {
    const conv = mockConversations.find((c) => c.id === conversationId);
    if (!conv) return;
    const persona = getPersonaById(personaId);
    setActivePersona(persona);
    setActiveConversationId(conversationId);
    setInitialMessages(conv.messages);
    setInitialTitle(conv.title);
    setChatKey((k) => k + 1);
  };

  const handleNewChat = () => {
    setActiveConversationId(undefined);
    setInitialMessages([]);
    setInitialTitle('New conversation');
    setChatKey((k) => k + 1);
  };

  return (
    <div
      className="flex h-dvh w-full overflow-hidden"
      style={{ background: '#080c14' }}
    >
      <div
        className="flex-shrink-0"
        style={{
          width: '280px',
          minWidth: '280px',
        }}
      >
        <PersonasSidebar
          activePersonaId={activePersona.id}
          onPersonaSelect={handlePersonaSelect}
          onConversationSelect={handleConversationSelect}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
        />
      </div>

      <div className="relative min-w-0 flex-1">
        <ChatWindow
          key={chatKey}
          persona={activePersona}
          initialMessages={initialMessages}
          initialTitle={initialTitle}
          onNewChat={handleNewChat}
        />
      </div>
    </div>
  );
}
