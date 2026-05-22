'use client';

import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClose: () => void;
  matchCount?: number;
  currentMatch?: number;
}

export function SearchBar({ onSearch, onClose, matchCount = 0, currentMatch = 0 }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <div
      className="flex items-center gap-2 px-4 py-2"
      style={{
        background: 'rgba(8,12,20,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <Search className="h-3.5 w-3.5 flex-shrink-0 text-[#3d4f6e]" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search messages..."
        className="min-w-0 flex-1 bg-transparent text-sm text-[#c8d3e8] placeholder-[#2d3d55] outline-none"
      />
      {query.length > 0 && (
        <span className="flex-shrink-0 text-[11px] text-[#3d4f6e]">
          {matchCount === 0 ? 'No results' : `${currentMatch + 1} / ${matchCount}`}
        </span>
      )}
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 text-[#3d4f6e] transition-colors duration-150 hover:text-[#6a7d95]"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
