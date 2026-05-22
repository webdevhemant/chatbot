'use client';

import type { Persona } from '@/lib/mock/personas';
import { motion } from 'framer-motion';
import { MarkdownMessage } from './markdown-message';
import { MessageActions } from './message-actions';
import { MessageTimestamp } from './message-timestamp';

interface MessageBubbleProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  persona: Persona;
  isStreaming?: boolean;
  animationDelay?: number;
  timestamp?: Date;
  showTimestamp?: boolean;
  fontSize?: 'sm' | 'md' | 'lg';
  compact?: boolean;
  searchQuery?: string;
}

const fontSizeMap = { sm: '12px', md: '14px', lg: '16px' } as const;

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function readTime(words: number) {
  const mins = Math.ceil(words / 200);
  return mins <= 1 ? null : `${mins} min read`;
}

export function MessageBubble({
  id,
  role,
  content,
  persona,
  isStreaming = false,
  animationDelay = 0,
  timestamp,
  showTimestamp = false,
  fontSize = 'md',
  compact = false,
  searchQuery = '',
}: MessageBubbleProps) {
  const isUser = role === 'user';
  const words = wordCount(content);
  const rt = !isStreaming && !isUser ? readTime(words) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: animationDelay, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex w-full ${isUser ? 'flex-row-reverse' : 'flex-row'} ${compact ? 'gap-2' : 'gap-3'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 pt-0.5">
          <div
            className="flex items-center justify-center rounded-xl text-base transition-transform duration-300 hover:scale-110"
            style={{
              width: compact ? '28px' : '32px',
              height: compact ? '28px' : '32px',
              background: `${persona.color}18`,
              border: `1px solid ${persona.color}30`,
              boxShadow: `0 0 12px ${persona.color}15`,
            }}
          >
            {persona.avatar}
          </div>
        </div>
      )}

      <div className={`flex flex-col gap-0.5 ${isUser ? 'items-end' : 'items-start'}`} style={{ maxWidth: '75%' }}>
        {/* Name row */}
        {!isUser && !compact && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-semibold tracking-tight" style={{ color: persona.color }}>
              {persona.name}
            </span>
            {isStreaming ? (
              <div className="flex items-center gap-0.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-1 w-1 rounded-full"
                    style={{ background: persona.color, animation: `dot-pulse 1.4s ease-in-out ${i * 0.16}s infinite` }}
                  />
                ))}
              </div>
            ) : rt ? (
              <span className="text-[10px] text-[#2a3549]">{rt}</span>
            ) : null}
          </div>
        )}

        {/* Bubble */}
        <div
          className={`relative rounded-2xl ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
          style={{
            padding: compact ? '8px 14px' : '12px 16px',
            ...(isUser
              ? {
                  background: persona.gradient,
                  color: 'rgba(255,255,255,0.95)',
                  boxShadow: `0 4px 20px ${persona.color}25, 0 1px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
                  fontSize: fontSizeMap[fontSize],
                }
              : {
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#c8d3e8',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                }),
          }}
        >
          {isUser ? (
            <span style={{ fontSize: fontSizeMap[fontSize], lineHeight: '1.6' }}>
              {content}
            </span>
          ) : (
            <>
              <MarkdownMessage
                content={content}
                personaColor={persona.color}
                searchQuery={searchQuery}
                fontSize={fontSize}
              />
              {isStreaming && (
                <span
                  className="inline-block ml-0.5 w-0.5 h-4 rounded-full align-middle"
                  style={{
                    background: persona.color,
                    animation: 'cursor-blink 0.8s ease-in-out infinite',
                    verticalAlign: 'text-bottom',
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Timestamp */}
        {showTimestamp && timestamp && (
          <MessageTimestamp timestamp={timestamp} role={role} />
        )}

        {/* Hover actions */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <MessageActions content={content} role={role} persona={persona} messageId={id} />
        </div>
      </div>
    </motion.div>
  );
}
