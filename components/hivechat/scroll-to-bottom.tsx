'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface ScrollToBottomProps {
  visible: boolean;
  onClick: () => void;
  personaColor: string;
  unreadCount?: number;
}

export function ScrollToBottom({ visible, onClick, personaColor, unreadCount = 0 }: ScrollToBottomProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={onClick}
          initial={{ opacity: 0, y: 12, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.85 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-28 right-6 z-20 flex items-center gap-1.5 rounded-full px-3 py-2 shadow-lg"
          style={{
            background: 'rgba(13,18,32,0.95)',
            border: `1px solid ${personaColor}40`,
            color: personaColor,
            boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 12px ${personaColor}20`,
            backdropFilter: 'blur(20px)',
          }}
        >
          {unreadCount > 0 && (
            <span
              className="text-[10px] font-bold"
              style={{ color: personaColor }}
            >
              {unreadCount} new
            </span>
          )}
          <ArrowDown className="h-3.5 w-3.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
