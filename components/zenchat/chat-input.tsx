'use client';

import type { Persona } from '@/lib/mock/personas';
import { ArrowUp, Square } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_CHARS = 4000;

interface ChatInputProps {
  persona: Persona;
  onSend: (message: string) => void;
  onStop?: () => void;
  isStreaming: boolean;
  fontSize?: 'sm' | 'md' | 'lg';
}

const fontSizeMap = { sm: '12px', md: '14px', lg: '16px' } as const;

export function ChatInput({ persona, onSend, onStop, isStreaming, fontSize = 'md' }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  // Auto-focus when not streaming
  useEffect(() => {
    if (!isStreaming) {
      textareaRef.current?.focus();
    }
  }, [isStreaming]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, isStreaming, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Cmd/Ctrl+F — handled by parent via keyboard shortcut
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const canSend = value.trim().length > 0 && !isStreaming;
  const charCount = value.length;
  const nearLimit = charCount > MAX_CHARS * 0.85;
  const overLimit = charCount > MAX_CHARS;

  return (
    <div className="flex-shrink-0 px-4 pb-5 pt-2">
      <div
        className="relative rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: isFocused
            ? `1px solid ${persona.color}50`
            : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: isFocused
            ? `0 0 0 3px ${persona.color}12, 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`
            : '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS + 50))}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isStreaming}
          placeholder={
            isStreaming
              ? `${persona.name} is thinking...`
              : `Message ${persona.name}… (Enter to send, Shift+Enter for new line)`
          }
          rows={1}
          className="w-full resize-none bg-transparent px-4 py-3.5 pr-14 placeholder-[#2d3d55] outline-none transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            minHeight: '52px',
            maxHeight: '160px',
            fontSize: fontSizeMap[fontSize],
            color: overLimit ? '#f87171' : '#c8d3e8',
          }}
        />

        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {/* Char counter — only shows when near limit */}
          {nearLimit && (
            <span
              className="text-[10px] font-medium tabular-nums"
              style={{ color: overLimit ? '#f87171' : '#4a5c78' }}
            >
              {charCount}/{MAX_CHARS}
            </span>
          )}

          {/* Send / Stop button */}
          <button
            type="button"
            onClick={isStreaming ? onStop : handleSend}
            disabled={!isStreaming && !canSend}
            title={isStreaming ? 'Stop generation' : 'Send (Enter)'}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
            style={
              isStreaming
                ? {
                    background: 'rgba(248,113,113,0.15)',
                    border: '1px solid rgba(248,113,113,0.3)',
                  }
                : canSend
                ? {
                    background: persona.gradient,
                    boxShadow: `0 0 16px ${persona.color}40, 0 2px 8px rgba(0,0,0,0.3)`,
                  }
                : {
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }
            }
          >
            {isStreaming ? (
              <Square className="h-3.5 w-3.5 text-[#f87171]" />
            ) : (
              <ArrowUp
                className="h-4 w-4"
                style={{ color: canSend ? 'white' : '#3d4f6e' }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Hint row */}
      <div className="mt-1.5 flex items-center justify-between px-1">
        <span className="text-[10px] text-[#1e2d42]">
          Enter to send · Shift+Enter for new line
        </span>
        {isStreaming && (
          <span className="text-[10px] text-[#2d3d55] animate-pulse">
            {persona.name} is responding…
          </span>
        )}
      </div>
    </div>
  );
}
