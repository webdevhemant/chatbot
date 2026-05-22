'use client';

import { Check, Copy } from 'lucide-react';
import { useState, useCallback } from 'react';

interface MarkdownMessageProps {
  content: string;
  personaColor: string;
  searchQuery?: string;
  fontSize?: 'sm' | 'md' | 'lg';
}

const fontSizeMap = { sm: '12px', md: '14px', lg: '16px' } as const;

function CodeBlock({ code, lang, personaColor }: { code: string; lang: string; personaColor: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div
      className="my-3 overflow-hidden rounded-xl"
      style={{
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}
      >
        <span className="text-[10px] font-mono font-medium text-[#3d4f6e] uppercase tracking-wider">
          {lang || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium transition-all duration-150"
          style={{
            color: copied ? personaColor : '#3d4f6e',
            background: copied ? `${personaColor}15` : 'transparent',
          }}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre
        className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed"
        style={{ fontFamily: '"SF Mono", "Cascadia Code", "Fira Code", ui-monospace, monospace', color: '#c8d3e8' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code
      className="rounded px-1.5 py-0.5 text-[0.85em] font-mono"
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#c8d3e8',
      }}
    >
      {children}
    </code>
  );
}

function applyInlineMarkdown(text: string, searchQuery: string): React.ReactNode[] {
  // Split on inline code, bold, italic
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // biome-ignore lint/suspicious/noAssignInExpressions: regex loop
  while ((match = regex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) parts.push(highlightSegment(before, searchQuery, `plain-${lastIndex}`));

    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(<InlineCode key={match.index}>{token.slice(1, -1)}</InlineCode>);
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index} className="font-semibold text-white/90">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={match.index} className="italic opacity-90">{token.slice(1, -1)}</em>);
    }
    lastIndex = match.index + token.length;
  }

  const remaining = text.slice(lastIndex);
  if (remaining) parts.push(highlightSegment(remaining, searchQuery, `tail-${lastIndex}`));

  return parts;
}

function highlightSegment(text: string, query: string, key: string): React.ReactNode {
  if (!query.trim()) return <span key={key}>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span key={key}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            style={{ background: 'rgba(251,191,36,0.35)', color: '#fde68a', borderRadius: '2px', padding: '0 2px' }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}

export function MarkdownMessage({ content, personaColor, searchQuery = '', fontSize = 'md' }: MarkdownMessageProps) {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trimStart().startsWith('```')) {
      const lang = line.trimStart().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push(<CodeBlock key={`code-${i}`} code={codeLines.join('\n')} lang={lang} personaColor={personaColor} />);
      i++;
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const sizes = ['text-lg', 'text-base', 'text-sm'];
      nodes.push(
        <div key={`h-${i}`} className={`font-bold ${sizes[level - 1]} text-white/90 mt-3 mb-1`}>
          {applyInlineMarkdown(text, searchQuery)}
        </div>,
      );
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^[-*•]\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*•]\s+/)) {
        items.push(lines[i].replace(/^[-*•]\s+/, ''));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="my-2 flex flex-col gap-1 pl-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full" style={{ background: personaColor }} />
              <span>{applyInlineMarkdown(item, searchQuery)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s+/)) {
      const items: { num: string; text: string }[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        const m = lines[i].match(/^(\d+)\.\s+(.+)/);
        if (m) items.push({ num: m[1], text: m[2] });
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="my-2 flex flex-col gap-1 pl-1">
          {items.map(({ num, text }, idx) => (
            <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                style={{ background: `${personaColor}20`, color: personaColor }}
              >
                {num}
              </span>
              <span>{applyInlineMarkdown(text, searchQuery)}</span>
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      nodes.push(
        <hr key={`hr-${i}`} className="my-3 border-0" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />,
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <blockquote
          key={`bq-${i}`}
          className="my-2 pl-3 italic opacity-80"
          style={{ borderLeft: `2px solid ${personaColor}60` }}
        >
          {quoteLines.map((l, idx) => (
            <p key={idx}>{applyInlineMarkdown(l, searchQuery)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    // Empty line — spacer
    if (line.trim() === '') {
      nodes.push(<div key={`sp-${i}`} className="h-2" />);
      i++;
      continue;
    }

    // Regular paragraph
    nodes.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {applyInlineMarkdown(line, searchQuery)}
      </p>,
    );
    i++;
  }

  return (
    <div
      className="flex flex-col gap-0.5"
      style={{ fontSize: fontSizeMap[fontSize] }}
    >
      {nodes}
    </div>
  );
}
