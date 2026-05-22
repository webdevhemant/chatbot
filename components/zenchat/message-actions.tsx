'use client';

import type { Persona } from '@/lib/mock/personas';
import { Check, Copy, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useCallback, useState } from 'react';

interface MessageActionsProps {
  content: string;
  role: 'user' | 'assistant';
  persona: Persona;
  messageId: string;
}

type Reaction = 'up' | 'down' | null;

export function MessageActions({ content, role, persona, messageId }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<Reaction>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [content]);

  const handleReaction = useCallback((r: 'up' | 'down') => {
    setReaction((prev) => (prev === r ? null : r));
  }, []);

  const isUser = role === 'user';

  return (
    <div
      className={`flex items-center gap-0.5 mt-1 transition-opacity duration-150 ${
        isUser ? 'flex-row-reverse mr-1' : 'ml-1'
      }`}
    >
      <button
        type="button"
        onClick={handleCopy}
        title="Copy message"
        className="flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-150"
        style={{
          color: copied ? persona.color : '#3d4f6e',
          background: copied ? `${persona.color}15` : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!copied) (e.currentTarget as HTMLButtonElement).style.color = '#6a7d95';
        }}
        onMouseLeave={(e) => {
          if (!copied) (e.currentTarget as HTMLButtonElement).style.color = '#3d4f6e';
        }}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </button>

      {!isUser && (
        <>
          <button
            type="button"
            onClick={() => handleReaction('up')}
            title="Helpful"
            className="flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-150"
            style={{
              color: reaction === 'up' ? '#4ade80' : '#3d4f6e',
              background: reaction === 'up' ? 'rgba(74,222,128,0.12)' : 'transparent',
            }}
          >
            <ThumbsUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => handleReaction('down')}
            title="Not helpful"
            className="flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-150"
            style={{
              color: reaction === 'down' ? '#f87171' : '#3d4f6e',
              background: reaction === 'down' ? 'rgba(248,113,113,0.12)' : 'transparent',
            }}
          >
            <ThumbsDown className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
}
