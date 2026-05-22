'use client';

import { useEffect, useRef, useState } from 'react';

interface StreamingState {
  displayText: string;
  isStreaming: boolean;
  /** chars streamed so far (useful for progress indicators) */
  charIndex: number;
}

// Speed = characters per second at multiplier 1.0
// At fast (0.4×) → ~75 cps, normal (1×) → ~30 cps, slow (2.2×) → ~13 cps
const BASE_CPS = 30;

export function useStreamingText(
  text: string,
  onComplete?: () => void,
  speedMultiplier = 1,
): StreamingState {
  const [displayText, setDisplayText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  // Keep stable refs so the streaming closure always reads the latest values
  const onCompleteRef = useRef(onComplete);
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const charIndexRef = useRef(0);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      setIsStreaming(false);
      setCharIndex(0);
      charIndexRef.current = 0;
      return;
    }

    // Reset
    setDisplayText('');
    setIsStreaming(true);
    setCharIndex(0);
    charIndexRef.current = 0;
    lastTimestampRef.current = 0;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    // How many ms per character (with slight variance per char for naturalism)
    const msPerChar = () => {
      const base = (1000 / BASE_CPS) * speedMultiplier;
      // Tiny random jitter: ±15% so it doesn't feel robotic
      return base * (0.85 + Math.random() * 0.3);
    };

    // Punctuation creates a natural micro-pause (adds extra ms after the char)
    const punctuationPause = (ch: string) => {
      if ('.!?'.includes(ch)) return 280 * speedMultiplier;
      if (',;:'.includes(ch)) return 120 * speedMultiplier;
      if ('\n'.includes(ch)) return 60 * speedMultiplier;
      return 0;
    };

    let accumulated = 0; // ms debt carried forward
    let lastPause = 0;   // extra pause after last char

    const tick = (timestamp: number) => {
      if (lastTimestampRef.current === 0) {
        // First frame: small startup delay
        lastTimestampRef.current = timestamp;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const elapsed = timestamp - lastTimestampRef.current + accumulated;
      lastTimestampRef.current = timestamp;
      accumulated = 0;

      // How many characters should we emit this frame?
      let budget = elapsed - lastPause;
      lastPause = 0;
      let emitted = false;

      while (budget > 0 && charIndexRef.current < text.length) {
        const delay = msPerChar();
        if (budget < delay) {
          accumulated = -budget; // carry the shortfall forward
          break;
        }
        budget -= delay;
        const ch = text[charIndexRef.current];
        charIndexRef.current++;
        setDisplayText(text.slice(0, charIndexRef.current));
        setCharIndex(charIndexRef.current);
        lastPause = punctuationPause(ch);
        emitted = true;
      }

      if (charIndexRef.current >= text.length) {
        setIsStreaming(false);
        onCompleteRef.current?.();
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    // Short initial pause before typing starts (feels like the AI is "thinking")
    const startDelay = setTimeout(
      () => { rafRef.current = requestAnimationFrame(tick); },
      80 * speedMultiplier,
    );

    return () => {
      clearTimeout(startDelay);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [text, speedMultiplier]);

  return { displayText, isStreaming, charIndex };
}
