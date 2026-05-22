'use client';

import type { Persona } from '@/lib/mock/personas';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  persona: Persona;
  onPromptSelect: (prompt: string) => void;
}

export function WelcomeScreen({ persona, onPromptSelect }: WelcomeScreenProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 30%, ${persona.color}0a 0%, transparent 65%)`,
        }}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        {/* Floating avatar */}
        <div className="relative mb-5">
          <div
            className="absolute inset-0 rounded-3xl opacity-60"
            style={{ background: persona.color, transform: 'scale(1.6)', filter: 'blur(16px)' }}
          />
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex h-20 w-20 items-center justify-center rounded-3xl text-4xl"
            style={{
              background: `linear-gradient(135deg, ${persona.color}22 0%, ${persona.color}0e 100%)`,
              border: `1px solid ${persona.color}35`,
              boxShadow: `0 0 32px ${persona.color}28, 0 0 64px ${persona.color}0e, inset 0 1px 0 ${persona.color}20`,
            }}
          >
            {persona.avatar}
          </motion.div>
        </div>

        {/* Name */}
        <h1
          className="mb-1 text-2xl font-bold tracking-tight"
          style={{
            background: `linear-gradient(135deg, #ffffff 0%, ${persona.color} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {persona.name}
        </h1>

        {/* Tagline */}
        <p className="mb-4 text-sm" style={{ color: '#5a6a85' }}>
          {persona.tagline}
        </p>

        {/* Trait chips */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5">
          {persona.traits.map((trait) => (
            <span
              key={trait}
              className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{
                background: `${persona.color}10`,
                border: `1px solid ${persona.color}22`,
                color: `${persona.color}cc`,
              }}
            >
              {trait}
            </span>
          ))}
        </div>

        {/* Suggested prompts */}
        <div className="grid w-full grid-cols-2 gap-2">
          {persona.suggestedPrompts.map((prompt, i) => (
            <motion.button
              key={prompt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onPromptSelect(prompt)}
              className="suggested-chip group rounded-xl px-3.5 py-2.5 text-left text-[13px]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#5a6a85',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = `${persona.color}0c`;
                el.style.borderColor = `${persona.color}28`;
                el.style.color = '#c8d3e8';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = 'rgba(255,255,255,0.03)';
                el.style.borderColor = 'rgba(255,255,255,0.06)';
                el.style.color = '#5a6a85';
              }}
            >
              <span className="leading-snug">{prompt}</span>
            </motion.button>
          ))}
        </div>

        {/* Subtle hint */}
        <p className="mt-6 text-[11px]" style={{ color: '#2a3d5a' }}>
          Press Enter to send · ⌘/ for shortcuts
        </p>
      </div>
    </div>
  );
}
