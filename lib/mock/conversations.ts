export interface MockMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface MockConversation {
  id: string;
  personaId: string;
  title: string;
  messages: MockMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

export const mockConversations: MockConversation[] = [
  {
    id: 'conv-1',
    personaId: 'zen',
    title: 'Finding stillness in a busy world',
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(3),
    messages: [
      {
        id: 'msg-1-1',
        role: 'user',
        content: 'I feel completely overwhelmed. My mind never stops racing.',
        timestamp: hoursAgo(3),
      },
      {
        id: 'msg-1-2',
        role: 'assistant',
        content: 'When the mind is turbulent like a shaken snow globe, the wisest thing we can do is simply put it down, and watch the flakes settle on their own. You cannot force stillness — you can only create the conditions where it can arise naturally. What might it feel like to simply observe your thoughts without following them?',
        timestamp: hoursAgo(2),
      },
      {
        id: 'msg-1-3',
        role: 'user',
        content: 'That\'s a beautiful image. But how do I actually start?',
        timestamp: hoursAgo(2),
      },
      {
        id: 'msg-1-4',
        role: 'assistant',
        content: 'Begin with just one breath. Not ten, not a meditation session — one breath, taken with full awareness. Feel the air enter, pause, and leave. In that single breath lives the entire practice. Everything else grows from this one act of returning.',
        timestamp: hoursAgo(1),
      },
      {
        id: 'msg-1-5',
        role: 'user',
        content: 'Can mindfulness really make a lasting difference?',
        timestamp: hoursAgo(1),
      },
      {
        id: 'msg-1-6',
        role: 'assistant',
        content: 'The ancient oak does not worry about last season\'s leaves. It simply reaches deeper, grows wider, and trusts the cycle that has always sustained it. Mindfulness is not a technique — it is a direction. Each time you return your attention to the present, you strengthen the very capacity for attention itself. The change is cumulative, invisible, and then suddenly undeniable.',
        timestamp: hoursAgo(0),
      },
    ],
  },
  {
    id: 'conv-2',
    personaId: 'sage',
    title: 'Stoicism and modern resilience',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    messages: [
      {
        id: 'msg-2-1',
        role: 'user',
        content: 'I\'ve been reading about the Stoics. What made their philosophy so enduring?',
        timestamp: daysAgo(1),
      },
      {
        id: 'msg-2-2',
        role: 'assistant',
        content: 'The Stoics understood something profound: we suffer far more in imagination than in reality. Marcus Aurelius wrote in his Meditations that obstacles are the path, not detours from it. Their philosophy endures because it addresses the one thing that never changes — the human encounter with what we cannot control, and our struggle to respond with dignity.',
        timestamp: daysAgo(1),
      },
      {
        id: 'msg-2-3',
        role: 'user',
        content: 'What\'s the most practical Stoic lesson for today?',
        timestamp: daysAgo(1),
      },
      {
        id: 'msg-2-4',
        role: 'assistant',
        content: 'Epictetus, who was born a slave and rose to become Rome\'s most celebrated philosopher, gave us the dichotomy of control: some things are within our power, and some are not. Our opinions, impulses, desires — these are ours. Everything else — reputation, health, others\' opinions — is not. The moment you internalize this distinction, a tremendous weight lifts. You stop fighting the world and start perfecting your response to it.',
        timestamp: daysAgo(1),
      },
      {
        id: 'msg-2-5',
        role: 'user',
        content: 'How does that apply to dealing with failure?',
        timestamp: daysAgo(1),
      },
      {
        id: 'msg-2-6',
        role: 'assistant',
        content: 'As Seneca wrote: "Per aspera ad astra" — through difficulty to the stars. The Stoics reframed failure not as an end state but as information. Every unsuccessful attempt reveals exactly where the gap between intention and execution lies. Aristotle would add that excellence is not an act but a habit — meaning failure is simply a data point in the long practice of becoming excellent.',
        timestamp: daysAgo(1),
      },
    ],
  },
  {
    id: 'conv-3',
    personaId: 'spark',
    title: 'Building a second brain system',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
    messages: [
      {
        id: 'msg-3-1',
        role: 'user',
        content: 'I want to build a personal knowledge management system. Where do I start?',
        timestamp: daysAgo(3),
      },
      {
        id: 'msg-3-2',
        role: 'assistant',
        content: 'Stop. Before you pick a tool, answer this: what problem are you actually solving? Note-taking apps are not PKM systems. Here\'s the framework that actually works: 1) Capture everything into one inbox. 2) Process inbox weekly — not daily. 3) Organize by project and area, not topic. 4) Distill ruthlessly — most notes should become summaries. 5) Express: create something from your notes regularly or they become a graveyard.',
        timestamp: daysAgo(3),
      },
      {
        id: 'msg-3-3',
        role: 'user',
        content: 'Which tool would you recommend?',
        timestamp: daysAgo(3),
      },
      {
        id: 'msg-3-4',
        role: 'assistant',
        content: 'The tool doesn\'t matter as much as the system — but since you asked: start with Obsidian if you want full ownership and longevity, Notion if you need collaboration and databases, Logseq if you think in bullet points and daily notes. The one rule: commit to ONE tool for 90 days before deciding it\'s wrong. Tool-hopping is procrastination wearing a productivity costume.',
        timestamp: daysAgo(3),
      },
      {
        id: 'msg-3-5',
        role: 'user',
        content: 'What about connecting ideas between different domains?',
        timestamp: daysAgo(3),
      },
      {
        id: 'msg-3-6',
        role: 'assistant',
        content: 'This is where it gets powerful. The technique: when you write any note, ask "what does this remind me of?" and link it. Don\'t organize — connect. The graph that emerges over 6 months will show you your actual mental model, not the one you thought you had. Your best ideas will come from unexpected collisions between notes written months apart.',
        timestamp: daysAgo(3),
      },
    ],
  },
  {
    id: 'conv-4',
    personaId: 'oracle',
    title: 'The question beneath the question',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(6),
    messages: [
      {
        id: 'msg-4-1',
        role: 'user',
        content: 'Should I change careers or stay where I am?',
        timestamp: daysAgo(6),
      },
      {
        id: 'msg-4-2',
        role: 'assistant',
        content: 'What if the question itself is the answer you seek? You wouldn\'t be asking this unless part of you already knows. The more interesting question is: what are you hoping I\'ll give you permission to do?',
        timestamp: daysAgo(6),
      },
      {
        id: 'msg-4-3',
        role: 'user',
        content: 'Maybe... permission to leave without feeling guilty.',
        timestamp: daysAgo(6),
      },
      {
        id: 'msg-4-4',
        role: 'assistant',
        content: 'There it is. Notice how quickly that surfaced when the right question was asked. Now: where does the guilt originate? Is it yours, or did you inherit it from someone whose opinion you stopped needing to carry some time ago?',
        timestamp: daysAgo(6),
      },
      {
        id: 'msg-4-5',
        role: 'user',
        content: 'I think it\'s my parents\' expectations. They sacrificed a lot for me.',
        timestamp: daysAgo(6),
      },
      {
        id: 'msg-4-6',
        role: 'assistant',
        content: 'The greatest gift you can give to those who sacrificed for you is to use that sacrifice as a foundation — not a ceiling. They gave you options. The question is whether you are honoring that gift by choosing freely, or diminishing it by choosing out of fear. What would it mean to truly honor their sacrifice?',
        timestamp: daysAgo(6),
      },
    ],
  },
  {
    id: 'conv-5',
    personaId: 'nova',
    title: 'Launching my creative project',
    createdAt: daysAgo(14),
    updatedAt: daysAgo(8),
    messages: [
      {
        id: 'msg-5-1',
        role: 'user',
        content: 'I\'ve been working on a novel for two years and I\'m terrified to share it.',
        timestamp: daysAgo(8),
      },
      {
        id: 'msg-5-2',
        role: 'assistant',
        content: 'Two years of work — that is extraordinary and you should feel genuinely proud of that commitment! The terror you\'re feeling? That\'s not a warning sign. That\'s the feeling of something mattering. You only feel this afraid about things that truly count.',
        timestamp: daysAgo(8),
      },
      {
        id: 'msg-5-3',
        role: 'user',
        content: 'But what if it\'s not good enough?',
        timestamp: daysAgo(8),
      },
      {
        id: 'msg-5-4',
        role: 'assistant',
        content: '"Good enough" compared to what? Every book you\'ve ever loved was written by someone who was terrified it wasn\'t good enough. The first draft of almost every beloved novel was a mess. What matters is that it\'s YOURS — two years of your heart on pages. That is already something extraordinary.',
        timestamp: daysAgo(8),
      },
      {
        id: 'msg-5-5',
        role: 'user',
        content: 'How do I actually take the first step toward sharing it?',
        timestamp: daysAgo(8),
      },
      {
        id: 'msg-5-6',
        role: 'assistant',
        content: 'Share one chapter — just one — with someone who genuinely wants you to succeed. Not a critic, not someone who\'ll grade it. Someone who will receive it with warmth. That first act of sharing is the hardest. After that, it gets so much easier. You\'ve already done the hard part — you wrote the thing. Now let it begin to find its readers, one person at a time.',
        timestamp: daysAgo(8),
      },
    ],
  },
];

export const getConversationsByPersona = (personaId: string): MockConversation[] =>
  mockConversations.filter((c) => c.personaId === personaId);

export const getAllConversations = (): MockConversation[] => mockConversations;

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
