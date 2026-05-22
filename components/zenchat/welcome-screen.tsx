'use client';

import type { Persona } from '@/lib/mock/personas';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  persona: Persona;
  onPromptSelect: (prompt: string) => void;
}

export function WelcomeScreen({ persona, onPromptSelect }: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 relative">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 30%, ${persona.color}08 0%, transparent 70%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center relative z-10"
      >
        <div className="relative mb-6">
          <div
            className="absolute inset-0 rounded-3xl blur-2xl"
            style={{
              background: `${persona.color}20`,
              transform: 'scale(1.5)',
            }}
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex h-24 w-24 items-center justify-center rounded-3xl text-5xl"
            style={{
              background: `linear-gradient(135deg, ${persona.color}20 0%, ${persona.color}10 100%)`,
              border: `1px solid ${persona.color}30`,
              boxShadow: `0 0 40px ${persona.color}30, 0 0 80px ${persona.color}10, inset 0 1px 0 ${persona.color}20`,
            }}
          >
            {persona.avatar}
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-2 text-3xl font-bold tracking-tight"
          style={{
            background: `linear-gradient(135deg, #ffffff 0%, ${persona.color} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {persona.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-2 text-base text-[#5a6a85]"
        >
          {persona.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-10 flex items-center gap-2"
        >
          {persona.traits.map((trait) => (
            <span
              key={trait}
              className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{
                background: `${persona.color}12`,
                border: `1px solid ${persona.color}25`,
                color: `${persona.color}cc`,
              }}
            >
              {trait}
            </span>
          ))}
        </motion.div>

        <div className="grid w-full max-w-lg grid-cols-2 gap-2">
          {persona.suggestedPrompts.map((prompt, i) => (
            <motion.button
              key={prompt}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onPromptSelect(prompt)}
              className="suggested-chip group rounded-xl px-4 py-3 text-left text-sm"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#6a7d95',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = `${persona.color}0c`;
                el.style.borderColor = `${persona.color}30`;
                el.style.color = '#c8d3e8';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = 'rgba(255,255,255,0.03)';
                el.style.borderColor = 'rgba(255,255,255,0.07)';
                el.style.color = '#6a7d95';
              }}
            >
              <span className="leading-snug">{prompt}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
