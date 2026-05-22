'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface StreamingState {
  displayText: string;
  isStreaming: boolean;
}

export function useStreamingText(
  text: string,
  onComplete?: () => void,
  speedMultiplier = 1,
): StreamingState {
  const [displayText, setDisplayText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);
  const textRef = useRef(text);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearPending = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      setIsStreaming(false);
      return;
    }

    textRef.current = text;
    setDisplayText('');
    setIsStreaming(true);
    clearPending();

    const words = text.split(' ');
    let wordIndex = 0;

    const streamNext = () => {
      if (wordIndex >= words.length) {
        setIsStreaming(false);
        onCompleteRef.current?.();
        return;
      }

      const chunk = wordIndex === 0 ? words[0] : ` ${words[wordIndex]}`;
      setDisplayText((prev) => prev + chunk);
      wordIndex++;

      const baseDelay = 35 * speedMultiplier;
      const randomVariance = Math.random() * 30 * speedMultiplier;
      const punctuationPause = words[wordIndex - 1]?.match(/[.!?,;:]$/) ? 80 * speedMultiplier : 0;
      const delay = baseDelay + randomVariance + punctuationPause;

      timeoutRef.current = setTimeout(streamNext, delay);
    };

    const initialDelay = setTimeout(streamNext, 120 * speedMultiplier);

    return () => {
      clearTimeout(initialDelay);
      clearPending();
    };
  }, [text, clearPending, speedMultiplier]);

  return { displayText, isStreaming };
}
