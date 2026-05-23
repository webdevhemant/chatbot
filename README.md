<div align="center">
  <h1>APPNAME</h1>
  <p>A premium, frontend-only AI chat UI built with Next.js 16 and Tailwind CSS v4.<br/>Five distinct AI personas, real-time streaming simulation, and a polished dark-mode design system.</p>
  <p>
    <a href="https://APPURL.vercel.app"><strong>APPURL.vercel.app</strong></a>
  </p>
</div>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#personas"><strong>Personas</strong></a> ·
  <a href="#project-structure"><strong>Project Structure</strong></a> ·
  <a href="#running-locally"><strong>Running Locally</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a>
</p>

---

## Features

### Chat Experience
- **Streaming simulation** — character-by-character text streaming via `requestAnimationFrame` with configurable speed (fast / normal / slow)
- **Inline cursor** — blinking cursor rendered inline at the end of the last text node during streaming
- **Typing indicator** — animated 3-dot indicator shown while the response loads
- **Stop generation** — cancels an in-progress response
- **Date dividers** — messages grouped by Today / Yesterday / formatted date
- **Scroll-to-bottom** — floating button with unread message count badge
- **Auto-scroll** — follows streaming output, respects the user's preference toggle

### Settings — Full-Page Modal
Five sections accessible via the profile avatar:
- **Profile** — editable name (validated) + optional email, live initials avatar, token usage bar with breakdown
- **Appearance** — 6 accent themes (Midnight, Obsidian, Emerald, Rose, Amber, Slate) that apply instantly across the whole app via CSS custom properties
- **Chat settings** — font size, streaming speed, send shortcut, and 5 display toggles
- **Plan & billing** — current plan status, token usage, upgrade link, billing details
- **About** — version, framework, and project description

### Plans & Upgrade
Dedicated `/upgrade` page with:
- Free / Pro / Team plan cards with pricing (monthly / annual toggle, 22% discount)
- Full feature comparison table
- Animated plan cards with hover states

### Markdown Rendering
Custom renderer supporting:
- Fenced code blocks with language label and one-click copy
- Inline code, `**bold**`, `*italic*`
- H1 – H3 headings
- Unordered and ordered lists with persona-colored bullets
- Blockquotes with persona-colored left border

### Message Actions
- **Copy** — clipboard copy with checkmark feedback (2 s)
- **Reactions** — thumbs up / down toggle per message
- **Read time** — estimated read time shown on long assistant responses (toggleable)

### Search
- `Cmd+F` opens an inline search bar
- Real-time query highlighting across all messages
- Match counter with no-results state

### Export
- **Export as .txt** — markdown-formatted transcript
- **Export as .json** — structured data with persona metadata

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Send message |
| `Shift + Enter` | New line in input |
| `Cmd + F` | Search messages |
| `Cmd + K` | New conversation |
| `Cmd + /` | Show shortcuts modal |
| `Esc` | Close panel / cancel |

### Mobile
- Hamburger menu reveals persona sidebar as a full-screen overlay
- Top bar shows active persona avatar + name on small screens

### Toast Notifications
- Success / error / info variants with auto-dismiss (3.5 s)

---

## Personas

| Persona | Color | Personality |
|---|---|---|
| **Zen** | Blue `#60a5fa` | Calm, mindful, poetic — uses nature metaphors |
| **Sage** | Purple `#a78bfa` | Philosophical, scholarly, references history |
| **Spark** | Yellow `#fbbf24` | Direct, energetic, uses code examples and lists |
| **Oracle** | Teal `#2dd4bf` | Mysterious, Socratic — answers questions with questions |
| **Nova** | Amber `#f59e0b` | Warm, encouraging, emotionally supportive |

Each persona has its own color system, gradient, avatar, tagline, trait chips, and set of suggested prompts.

---

## Project Structure

```
chatbot/
├── app/
│   ├── (chat)/
│   │   ├── page.tsx          # Main chat page (mobile sidebar, layout)
│   │   ├── upgrade/
│   │   │   └── page.tsx      # Plan comparison & upgrade page
│   │   └── layout.tsx        # Passthrough layout
│   ├── globals.css           # Tailwind v4 theme, design tokens, animations
│   ├── icon.svg              # APPNAME branded favicon
│   └── layout.tsx            # Root layout (fonts, metadata, providers)
│
├── components/
│   └── zenchat/
│       ├── chat-window.tsx       # Core chat logic, scroll tracking, keyboard shortcuts
│       ├── chat-header.tsx       # Persona info, title edit, settings/export/search buttons
│       ├── chat-input.tsx        # Textarea, char counter, send/stop button
│       ├── personas-sidebar.tsx  # Persona selector + recent conversations list
│       ├── settings-modal.tsx    # Full-page settings modal (5 sections)
│       ├── confirm-dialog.tsx    # Accessible danger confirmation modal
│       ├── welcome-screen.tsx    # Empty state with avatar, traits, suggested prompts
│       ├── message-bubble.tsx    # Individual message (user + assistant)
│       ├── streaming-message.tsx # Wraps MessageBubble with streaming hook
│       ├── markdown-message.tsx  # Custom markdown renderer with inline cursor
│       ├── message-actions.tsx   # Copy + reaction buttons (hover-revealed)
│       ├── message-timestamp.tsx # Formatted time display
│       ├── date-divider.tsx      # Today / Yesterday / date label between messages
│       ├── search-bar.tsx        # Inline search input with match count
│       ├── scroll-to-bottom.tsx  # Floating button with unread badge
│       ├── typing-indicator.tsx  # Animated 3-dot indicator
│       ├── settings-panel.tsx    # Settings types and defaults
│       ├── keyboard-shortcuts.tsx # Shortcuts modal (Cmd+/)
│       └── toast.tsx             # ToastProvider + useToast hook
│
└── lib/
    ├── mock/
    │   ├── personas.ts           # 5 persona definitions (avatar, color, traits, prompts)
    │   ├── conversations.ts      # Mock conversation history + formatRelativeTime
    │   └── streaming.ts          # useStreamingText hook (RAF char-by-char + speed control)
    ├── user-profile-context.tsx  # UserProfileProvider, theme system, localStorage persistence
    └── ai/
        └── models.ts             # Model type definition
```

---

## Running Locally

**Requirements:** Node.js 18+ (tested on v22), pnpm

```bash
# 1. Clone
git clone https://github.com/webdevhemant/chatbot.git
cd chatbot

# 2. Install dependencies
pnpm install

# 3. Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables, no database, no API keys required. Everything runs entirely in the browser.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 with custom CSS variables |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Geist + Geist Mono (Google Fonts) |
| Type checking | TypeScript 5 (strict) |
| Package manager | pnpm |

---

## Design System

Custom dark-mode design system in `app/globals.css`:

- **6 switchable accent themes** — each mutates CSS custom properties on `:root` at runtime
- **Default background:** `#080c14` (deep navy)
- **Glassmorphism** utilities: `.glass`, `.glass-heavy`
- **Aurora background** animations per persona
- **Glow effects** per persona color
- **Text gradients** per persona
- CSS custom properties for all persona colors, shadows, easing curves

---

> Pure frontend project — no backend, no database, no authentication, no API calls. All responses are mock data rendered locally.
