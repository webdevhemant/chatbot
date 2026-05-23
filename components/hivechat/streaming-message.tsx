'use client';

import { useStreamingText } from '@/lib/mock/streaming';
import type { Persona } from '@/lib/mock/personas';
import { MessageBubble } from './message-bubble';
import type { ResponseSpeed } from './settings-panel';
import { useRef } from 'react';
import { TypingIndicator } from './typing-indicator';

interface StreamingMessageProps {
  id: string;
  fullText: string;
  persona: Persona;
  onComplete?: () => void;
  showTimestamp?: boolean;
  fontSize?: 'sm' | 'md' | 'lg';
  compact?: boolean;
  responseSpeed?: ResponseSpeed;
  searchQuery?: string;
  showReadTime?: boolean;
}

const speedMultiplier: Record<ResponseSpeed, number> = {
  fast: 0.4,
  normal: 1,
  slow: 2.2,
};

export function StreamingMessage({
  id,
  fullText,
  persona,
  onComplete,
  showTimestamp,
  fontSize,
  compact,
  responseSpeed = 'normal',
  searchQuery,
  showReadTime,
}: StreamingMessageProps) {
  // Stable timestamp — don't create new Date() on every render
  const timestampRef = useRef(new Date());

  const { displayText, isStreaming, charIndex } = useStreamingText(
    fullText,
    onComplete,
    speedMultiplier[responseSpeed],
  );

  // While no characters have been emitted yet, show the typing indicator
  // so there's no empty-bubble flash between the indicator disappearing and
  // the first character arriving.
  if (charIndex === 0) {
    return <TypingIndicator persona={persona} />;
  }

  return (
    <MessageBubble
      id={id}
      role="assistant"
      content={displayText}
      persona={persona}
      isStreaming={isStreaming}
      timestamp={timestampRef.current}
      showTimestamp={showTimestamp}
      fontSize={fontSize}
      compact={compact}
      searchQuery={searchQuery}
      showReadTime={showReadTime}
    />
  );
}
