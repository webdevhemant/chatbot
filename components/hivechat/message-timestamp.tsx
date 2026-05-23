'use client';

interface MessageTimestampProps {
  timestamp: Date;
  role: 'user' | 'assistant';
}

export function MessageTimestamp({ timestamp, role }: MessageTimestampProps) {
  const formatted = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`text-[10px] text-[#2a3549] mt-0.5 px-1 ${
        role === 'user' ? 'text-right' : 'text-left'
      }`}
    >
      {formatted}
    </div>
  );
}
