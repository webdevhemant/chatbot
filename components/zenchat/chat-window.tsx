'use client';

import type { MockMessage } from '@/lib/mock/conversations';
import type { Persona } from '@/lib/mock/personas';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { MessageBubble } from './message-bubble';
import { SearchBar } from './search-bar';
import { StreamingMessage } from './streaming-message';
import { TypingIndicator } from './typing-indicator';
import { WelcomeScreen } from './welcome-screen';
import { defaultSettings, type ChatSettings } from './settings-panel';

interface ChatWindowProps {
  persona: Persona;
  initialMessages?: MockMessage[];
  initialTitle?: string;
  onNewChat: () => void;
}

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  timestamp: Date;
}

let msgCounter = 0;
const newId = () => `msg-${++msgCounter}-${Date.now()}`;

export function ChatWindow({
  persona,
  initialMessages = [],
  initialTitle = 'New conversation',
  onNewChat,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMsg[]>(() =>
    initialMessages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
    })),
  );
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [showTyping, setShowTyping] = useState(false);
  const [conversationTitle, setConversationTitle] = useState(initialTitle);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0);
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(
      initialMessages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })),
    );
    setStreamingId(null);
    setShowTyping(false);
    setConversationTitle(initialTitle);
    setSearchOpen(false);
    setSearchQuery('');
  }, [initialMessages, initialTitle]);

  // Scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, showTyping]);

  // Keyboard shortcut: Cmd+F for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setSearchOpen((o) => !o);
        if (searchOpen) setSearchQuery('');
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen]);

  // Search matches
  const matchingIds = searchQuery.trim()
    ? messages
        .filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((m) => m.id)
    : [];

  const pickResponse = useCallback((): string => {
    const responses = persona.responses;
    return responses[Math.floor(Math.random() * responses.length)];
  }, [persona.responses]);

  const handleSend = useCallback(
    (text: string) => {
      if (streamingId || showTyping) return;

      const userMsgId = newId();
      const aiMsgId = newId();
      const now = new Date();

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: 'user', content: text, timestamp: now },
      ]);

      if (messages.length === 0 && conversationTitle === 'New conversation') {
        setConversationTitle(text.length > 40 ? `${text.slice(0, 37)}...` : text);
      }

      // Show typing indicator first
      setShowTyping(true);

      const typingDelay = 600 + Math.random() * 600;
      setTimeout(() => {
        const response = pickResponse();
        setShowTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: aiMsgId, role: 'assistant', content: response, isStreaming: true, timestamp: new Date() },
        ]);
        setStreamingId(aiMsgId);
      }, typingDelay);
    },
    [streamingId, showTyping, messages.length, conversationTitle, pickResponse],
  );

  const handleStop = useCallback(() => {
    if (!streamingId) return;
    setMessages((prev) =>
      prev.map((m) => (m.id === streamingId ? { ...m, isStreaming: false } : m)),
    );
    setStreamingId(null);
    setShowTyping(false);
  }, [streamingId]);

  const handleStreamComplete = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isStreaming: false } : m)),
    );
    setStreamingId(null);
  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setStreamingId(null);
    setShowTyping(false);
    setConversationTitle('New conversation');
    setSearchOpen(false);
    setSearchQuery('');
    onNewChat();
  }, [onNewChat]);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentMatchIdx(0);
  }, []);

  const isEmpty = messages.length === 0;

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{ background: '#080c14' }}
    >
      {/* Ambient glow per persona */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${persona.color}06 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <ChatHeader
          persona={persona}
          conversationTitle={conversationTitle}
          onNewChat={handleNewChat}
          onTitleChange={setConversationTitle}
          onToggleSearch={() => { setSearchOpen((o) => !o); if (searchOpen) setSearchQuery(''); }}
          settings={settings}
          onSettingsChange={setSettings}
          messages={messages}
        />

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <SearchBar
              onSearch={handleSearch}
              onClose={() => { setSearchOpen(false); setSearchQuery(''); }}
              matchCount={matchingIds.length}
              currentMatch={currentMatchIdx}
            />
          )}
        </AnimatePresence>

        {/* Search result count banner */}
        {searchQuery && matchingIds.length > 0 && (
          <div
            className="px-4 py-1 text-[11px] text-center"
            style={{ color: persona.color, background: `${persona.color}08` }}
          >
            {matchingIds.length} message{matchingIds.length !== 1 ? 's' : ''} match "{searchQuery}"
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto no-scrollbar"
          style={{ overscrollBehavior: 'contain' }}
        >
          {isEmpty && !showTyping ? (
            <WelcomeScreen persona={persona} onPromptSelect={handleSend} />
          ) : (
            <div
              className="flex flex-col px-4 py-6"
              style={{ gap: settings.compactMode ? '8px' : '16px' }}
            >
              {messages.map((msg, index) => {
                const isHighlighted =
                  searchQuery.trim() !== '' &&
                  msg.content.toLowerCase().includes(searchQuery.toLowerCase());

                if (msg.role === 'assistant' && msg.isStreaming) {
                  return (
                    <StreamingMessage
                      key={msg.id}
                      id={msg.id}
                      fullText={msg.content}
                      persona={persona}
                      onComplete={() => handleStreamComplete(msg.id)}
                      showTimestamp={settings.showTimestamps}
                      fontSize={settings.fontSize}
                      compact={settings.compactMode}
                      responseSpeed={settings.responseSpeed}
                      searchQuery={searchQuery}
                    />
                  );
                }
                return (
                  <div
                    key={msg.id}
                    id={`msg-${msg.id}`}
                    style={
                      isHighlighted
                        ? {
                            borderRadius: '12px',
                            outline: `1px solid ${persona.color}40`,
                            background: `${persona.color}06`,
                          }
                        : undefined
                    }
                  >
                    <MessageBubble
                      id={msg.id}
                      role={msg.role}
                      content={msg.content}
                      persona={persona}
                      animationDelay={index < 3 ? 0 : 0}
                      timestamp={msg.timestamp}
                      showTimestamp={settings.showTimestamps}
                      fontSize={settings.fontSize}
                      compact={settings.compactMode}
                      searchQuery={searchQuery}
                    />
                  </div>
                );
              })}

              {/* Typing indicator */}
              <AnimatePresence>
                {showTyping && <TypingIndicator persona={persona} />}
              </AnimatePresence>
            </div>
          )}
        </div>

        <ChatInput
          persona={persona}
          onSend={handleSend}
          onStop={handleStop}
          isStreaming={streamingId !== null || showTyping}
          fontSize={settings.fontSize}
        />
      </div>
    </div>
  );
}
