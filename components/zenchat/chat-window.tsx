'use client';

import type { MockMessage } from '@/lib/mock/conversations';
import type { Persona } from '@/lib/mock/personas';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { DateDivider } from './date-divider';
import { KeyboardShortcuts } from './keyboard-shortcuts';
import { MessageBubble } from './message-bubble';
import { ScrollToBottom } from './scroll-to-bottom';
import { SearchBar } from './search-bar';
import { StreamingMessage } from './streaming-message';
import { ToastProvider, useToast } from './toast';
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

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function ChatWindowInner({
  persona,
  initialMessages = [],
  initialTitle = 'New conversation',
  onNewChat,
}: ChatWindowProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMsg[]>(() =>
    initialMessages.map((m) => ({ id: m.id, role: m.role, content: m.content, timestamp: m.timestamp })),
  );
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [showTyping, setShowTyping] = useState(false);
  const [conversationTitle, setConversationTitle] = useState(initialTitle);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  // Reset when conversation changes
  useEffect(() => {
    setMessages(
      initialMessages.map((m) => ({ id: m.id, role: m.role, content: m.content, timestamp: m.timestamp })),
    );
    setStreamingId(null);
    setShowTyping(false);
    setConversationTitle(initialTitle);
    setSearchOpen(false);
    setSearchQuery('');
    setUnreadCount(0);
    setShowScrollBtn(false);
  }, [initialMessages, initialTitle]);

  // Track scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      isAtBottomRef.current = distFromBottom < 80;
      setShowScrollBtn(distFromBottom > 200);
      if (isAtBottomRef.current) setUnreadCount(0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-scroll or show button
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (isAtBottomRef.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      setUnreadCount((n) => n + 1);
    }
  }, [messages, showTyping]);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    setUnreadCount(0);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === 'f') { e.preventDefault(); setSearchOpen((o) => !o); if (searchOpen) setSearchQuery(''); }
      if (meta && e.key === 'k') { e.preventDefault(); handleNewChat(); }
      if (meta && e.key === '/') { e.preventDefault(); setShortcutsOpen((o) => !o); }
      if (e.key === 'Escape') {
        if (shortcutsOpen) { setShortcutsOpen(false); return; }
        if (searchOpen) { setSearchOpen(false); setSearchQuery(''); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOpen, shortcutsOpen]);

  const matchingIds = searchQuery.trim()
    ? messages.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase())).map((m) => m.id)
    : [];

  const pickResponse = useCallback(() => {
    const r = persona.responses;
    return r[Math.floor(Math.random() * r.length)];
  }, [persona.responses]);

  const handleSend = useCallback(
    (text: string) => {
      if (streamingId || showTyping) return;
      const userMsgId = newId();
      const aiMsgId = newId();
      const now = new Date();

      setMessages((prev) => [...prev, { id: userMsgId, role: 'user', content: text, timestamp: now }]);

      if (messages.length === 0 && conversationTitle === 'New conversation') {
        setConversationTitle(text.length > 40 ? `${text.slice(0, 37)}...` : text);
      }

      setShowTyping(true);
      const delay = 600 + Math.random() * 700;
      setTimeout(() => {
        const response = pickResponse();
        setShowTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: aiMsgId, role: 'assistant', content: response, isStreaming: true, timestamp: new Date() },
        ]);
        setStreamingId(aiMsgId);
      }, delay);
    },
    [streamingId, showTyping, messages.length, conversationTitle, pickResponse],
  );

  const handleStop = useCallback(() => {
    if (!streamingId) return;
    setMessages((prev) => prev.map((m) => (m.id === streamingId ? { ...m, isStreaming: false } : m)));
    setStreamingId(null);
    setShowTyping(false);
    toast('info', 'Response stopped');
  }, [streamingId, toast]);

  const handleStreamComplete = useCallback((id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isStreaming: false } : m)));
    setStreamingId(null);
  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setStreamingId(null);
    setShowTyping(false);
    setConversationTitle('New conversation');
    setSearchOpen(false);
    setSearchQuery('');
    setUnreadCount(0);
    onNewChat();
  }, [onNewChat]);

  // Build message list with date dividers
  const messageNodes: React.ReactNode[] = [];
  let lastDate: Date | null = null;

  messages.forEach((msg, index) => {
    const msgDate = msg.timestamp;
    if (!lastDate || !isSameDay(lastDate, msgDate)) {
      messageNodes.push(<DateDivider key={`date-${msg.id}`} date={msgDate} />);
      lastDate = msgDate;
    }

    const isHighlighted =
      searchQuery.trim() !== '' && msg.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (msg.role === 'assistant' && msg.isStreaming) {
      messageNodes.push(
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
        />,
      );
    } else {
      messageNodes.push(
        <div
          key={msg.id}
          id={`msg-${msg.id}`}
          style={
            isHighlighted
              ? { borderRadius: '12px', outline: `1px solid ${persona.color}40`, background: `${persona.color}06`, padding: '4px' }
              : undefined
          }
        >
          <MessageBubble
            id={msg.id}
            role={msg.role}
            content={msg.content}
            persona={persona}
            animationDelay={index < 3 ? index * 0.05 : 0}
            timestamp={msg.timestamp}
            showTimestamp={settings.showTimestamps}
            fontSize={settings.fontSize}
            compact={settings.compactMode}
            searchQuery={searchQuery}
          />
        </div>,
      );
    }
  });

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex h-full flex-col overflow-hidden" style={{ background: '#080c14' }}>
      {/* Persona ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${persona.color}06 0%, transparent 60%)` }}
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
          onShowShortcuts={() => setShortcutsOpen(true)}
        />

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <SearchBar
              onSearch={(q) => { setSearchQuery(q); }}
              onClose={() => { setSearchOpen(false); setSearchQuery(''); }}
              matchCount={matchingIds.length}
              currentMatch={0}
            />
          )}
        </AnimatePresence>

        {/* Search no-results */}
        {searchOpen && searchQuery && matchingIds.length === 0 && (
          <div className="px-4 py-1.5 text-center text-[11px]" style={{ color: '#3d4f6e', background: 'rgba(255,255,255,0.02)' }}>
            No messages match "{searchQuery}"
          </div>
        )}
        {searchOpen && searchQuery && matchingIds.length > 0 && (
          <div className="px-4 py-1 text-center text-[11px]" style={{ color: persona.color, background: `${persona.color}08` }}>
            {matchingIds.length} match{matchingIds.length !== 1 ? 'es' : ''} for "{searchQuery}"
          </div>
        )}

        {/* Message list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto no-scrollbar"
          style={{ overscrollBehavior: 'contain' }}
        >
          {isEmpty && !showTyping ? (
            <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <WelcomeScreen persona={persona} onPromptSelect={handleSend} />
            </div>
          ) : (
            <div className="flex flex-col px-4 py-6" style={{ gap: settings.compactMode ? '6px' : '14px' }}>
              {messageNodes}
              <AnimatePresence>
                {showTyping && <TypingIndicator persona={persona} />}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Scroll to bottom */}
        <ScrollToBottom
          visible={showScrollBtn}
          onClick={scrollToBottom}
          personaColor={persona.color}
          unreadCount={unreadCount}
        />

        <ChatInput
          persona={persona}
          onSend={handleSend}
          onStop={handleStop}
          isStreaming={streamingId !== null || showTyping}
          fontSize={settings.fontSize}
        />
      </div>

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcuts isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}

export function ChatWindow(props: ChatWindowProps) {
  return (
    <ToastProvider>
      <ChatWindowInner {...props} />
    </ToastProvider>
  );
}
