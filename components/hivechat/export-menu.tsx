'use client';

import type { Persona } from '@/lib/mock/personas';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, FileText, X } from 'lucide-react';
import { useCallback } from 'react';

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ExportMenuProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMsg[];
  persona: Persona;
  conversationTitle: string;
}

export function ExportMenu({ isOpen, onClose, messages, persona, conversationTitle }: ExportMenuProps) {
  const exportAsText = useCallback(() => {
    const lines = [
      `# ${conversationTitle}`,
      `Persona: ${persona.name} — ${persona.tagline}`,
      `Exported: ${new Date().toLocaleString()}`,
      '',
      '---',
      '',
      ...messages.map((m) => {
        const label = m.role === 'user' ? 'You' : persona.name;
        return `**${label}**\n${m.content}\n`;
      }),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversationTitle.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  }, [messages, persona, conversationTitle, onClose]);

  const exportAsJSON = useCallback(() => {
    const data = {
      title: conversationTitle,
      persona: { id: persona.id, name: persona.name, tagline: persona.tagline },
      exportedAt: new Date().toISOString(),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversationTitle.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  }, [messages, persona, conversationTitle, onClose]);

  const options = [
    {
      icon: FileText,
      label: 'Export as Text',
      description: 'Plain text transcript',
      action: exportAsText,
    },
    {
      icon: Download,
      label: 'Export as JSON',
      description: 'Structured data format',
      action: exportAsJSON,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-4 top-14 z-50 w-56 rounded-xl overflow-hidden"
            style={{
              background: 'rgba(13,18,32,0.97)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(40px)',
            }}
          >
            <div
              className="flex items-center justify-between px-3 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-xs font-semibold text-[#6a7d95]">Export Chat</span>
              <button
                type="button"
                onClick={onClose}
                className="text-[#3d4f6e] transition-colors hover:text-[#6a7d95]"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="p-1.5 flex flex-col gap-0.5">
              {options.map(({ icon: Icon, label, description, action }) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 hover:bg-white/5"
                >
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${persona.color}15`, border: `1px solid ${persona.color}25` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: persona.color }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#c8d3e8]">{label}</div>
                    <div className="text-[10px] text-[#3d4f6e]">{description}</div>
                  </div>
                </button>
              ))}
            </div>
            {messages.length === 0 && (
              <div className="px-3 pb-3 text-center text-[11px] text-[#2d3d55]">
                No messages to export yet
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
