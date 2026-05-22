'use client';

import { useStreamingText } from '@/lib/mock/streaming';
import type { Persona } from '@/lib/mock/personas';
import { MessageBubble } from './message-bubble';
import type { ResponseSpeed } from './settings-panel';

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
}: StreamingMessageProps) {
  const { displayText, isStreaming } = useStreamingText(
    fullText,
    onComplete,
    speedMultiplier[responseSpeed],
  );

  return (
    <MessageBubble
      id={id}
      role="assistant"
      content={displayText}
      persona={persona}
      isStreaming={isStreaming}
      timestamp={new Date()}
      showTimestamp={showTimestamp}
      fontSize={fontSize}
      compact={compact}
      searchQuery={searchQuery}
    />
  );
}
