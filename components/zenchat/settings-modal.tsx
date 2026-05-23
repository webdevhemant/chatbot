'use client';

import {
  APP_THEMES,
  getInitials,
  useUserProfile,
} from '@/lib/user-profile-context';
import type { ChatSettings, FontSize, ResponseSpeed, SendKey } from './settings-panel';
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowRight,
  Check,
  Clock3,
  CornerDownLeft,
  Cpu,
  Crown,
  Info,
  LayoutList,
  MessageSquare,
  Minimize2,
  Palette,
  Sparkles,
  Type,
  User,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

// ─── Validation ───────────────────────────────────────────────────────────────

function validateName(v: string): string | null {
  const t = v.trim();
  if (!t) return 'Name is required';
  if (t.length < 2) return 'At least 2 characters';
  if (t.length > 40) return '40 characters max';
  if (!/^[a-zA-Z\s'\-]+$/.test(t)) return 'Letters, spaces, hyphens, apostrophes only';
  return null;
}

function validateEmail(v: string): string | null {
  const t = v.trim();
  if (!t) return null; // Email is optional
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return 'Enter a valid email';
  if (t.length > 80) return 'Too long';
  return null;
}

// ─── Nav sections ─────────────────────────────────────────────────────────────

type Section = 'profile' | 'appearance' | 'chat' | 'plan' | 'about';

const NAV: { id: Section; label: string; icon: React.FC<{ className?: string; style?: React.CSSProperties }> }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'chat', label: 'Chat settings', icon: MessageSquare },
  { id: 'plan', label: 'Plan & billing', icon: Crown },
  { id: 'about', label: 'About', icon: Info },
];

// ─── Reusable micro-components ────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-3"
      style={{ color: '#2d3d55' }}
    >
      {children}
    </p>
  );
}

function Field({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5">
        <Icon className="h-3 w-3" style={{ color: '#2d3d55' }} />
        <span className="text-[11px] font-medium" style={{ color: '#3d4f6e' }}>{label}</span>
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3 flex-shrink-0" style={{ color: '#ef4444' }} />
          <span className="text-[11px]" style={{ color: '#ef4444' }}>{error}</span>
        </div>
      )}
    </div>
  );
}

function InputField({
  value,
  onChange,
  onKeyDown,
  placeholder,
  type = 'text',
  maxLength,
  autoFocus,
  error,
  accent,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  autoFocus?: boolean;
  error?: string | null;
  accent: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      maxLength={maxLength}
      autoFocus={autoFocus}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none transition-all duration-150"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: error
          ? '1px solid rgba(239,68,68,0.5)'
          : focused
          ? `1px solid ${accent}55`
          : '1px solid rgba(255,255,255,0.08)',
        color: '#c8d3e8',
      }}
    />
  );
}

function Toggle({
  checked,
  onChange,
  accent,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  accent: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative h-5 w-9 flex-shrink-0 rounded-full transition-all duration-200"
      style={{
        background: checked ? accent : 'rgba(255,255,255,0.08)',
        border: `1px solid ${checked ? accent : 'rgba(255,255,255,0.1)'}`,
        boxShadow: checked ? `0 0 8px ${accent}40` : 'none',
      }}
    >
      <span
        className="absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200"
        style={{ transform: checked ? 'translateX(16px)' : 'none' }}
      />
    </button>
  );
}

function ToggleRow({
  label,
  description,
  icon: Icon,
  checked,
  onChange,
  accent,
}: {
  label: string;
  description?: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  checked: boolean;
  onChange: (v: boolean) => void;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Icon className="h-3.5 w-3.5" style={{ color: '#3d4f6e' }} />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium leading-tight" style={{ color: '#8b99b5' }}>{label}</p>
          {description && <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: '#2d3d55' }}>{description}</p>}
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">
        <Toggle checked={checked} onChange={onChange} accent={accent} />
      </div>
    </div>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  accent,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  accent: string;
}) {
  return (
    <div
      className="flex rounded-xl overflow-hidden p-0.5"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="flex-1 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-150"
          style={
            value === opt.value
              ? { background: accent, color: '#fff', boxShadow: `0 2px 8px ${accent}50` }
              : { color: '#3d4f6e' }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Token usage mock ─────────────────────────────────────────────────────────

const TOKEN_PLAN = {
  label: 'Pro',
  used: 847_320,
  total: 2_000_000,
  resetDate: 'Jun 1, 2026',
};

function TokenUsage({ accent }: { accent: string }) {
  const pct = Math.min(TOKEN_PLAN.used / TOKEN_PLAN.total, 1);
  const usedK = (TOKEN_PLAN.used / 1000).toFixed(0);
  const totalK = (TOKEN_PLAN.total / 1000).toFixed(0);
  const color = pct > 0.85 ? '#ef4444' : pct > 0.65 ? '#f59e0b' : accent;

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5" style={{ color: '#3d4f6e' }} />
          <span className="text-[12px] font-semibold" style={{ color: '#8b99b5' }}>Token usage</span>
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}
        >
          {TOKEN_PLAN.label}
        </span>
      </div>

      {/* Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct * 100}%`,
              background: `linear-gradient(90deg, ${color}cc, ${color})`,
              boxShadow: `0 0 8px ${color}60`,
            }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[11px]" style={{ color: '#3d4f6e' }}>
            <span style={{ color: color, fontVariantNumeric: 'tabular-nums' }}>{Number(usedK).toLocaleString()}k</span> of {Number(totalK).toLocaleString()}k tokens
          </span>
          <span className="text-[11px]" style={{ color: '#2d3d55' }}>Resets {TOKEN_PLAN.resetDate}</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {[
          { label: 'Input', value: '612k' },
          { label: 'Output', value: '235k' },
          { label: 'Remaining', value: `${Number((TOKEN_PLAN.total - TOKEN_PLAN.used) / 1000).toFixed(0)}k` },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <span className="text-[10px]" style={{ color: '#2d3d55' }}>{item.label}</span>
            <span className="text-[13px] font-semibold tabular-nums" style={{ color: '#5a6a85' }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Upgrade nudge */}
      <Link
        href="/upgrade"
        className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-150"
        style={{
          background: `${accent}10`,
          border: `1px solid ${accent}25`,
          marginTop: '4px',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = `${accent}18`)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = `${accent}10`)}
      >
        <div className="flex items-center gap-2">
          <Crown className="h-3.5 w-3.5" style={{ color: accent }} />
          <span className="text-[12px] font-medium" style={{ color: accent }}>View plans & upgrade</span>
        </div>
        <ArrowRight className="h-3.5 w-3.5" style={{ color: accent }} />
      </Link>
    </div>
  );
}

// ─── Section panels ───────────────────────────────────────────────────────────

function ProfileSection({ accent }: { accent: string }) {
  const { profile, updateProfile } = useUserProfile();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
  }, [profile.name, profile.email]);

  const isDirty = name.trim() !== profile.name || email.trim() !== profile.email;

  const handleSave = useCallback(() => {
    const ne = validateName(name);
    const ee = validateEmail(email);
    setNameErr(ne);
    setEmailErr(ee);
    if (ne || ee) return;
    updateProfile({ name: name.trim(), email: email.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [name, email, updateProfile]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSave();
    },
    [handleSave],
  );

  const initials = getInitials(name || profile.name);

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-[20px] font-bold"
          style={{
            background: `linear-gradient(135deg, ${accent}25, ${accent}12)`,
            border: `2px solid ${accent}35`,
            color: accent,
            letterSpacing: '-0.03em',
          }}
        >
          {initials}
        </div>
        <div>
          <p className="text-[15px] font-semibold" style={{ color: '#dde4f0' }}>{profile.name}</p>
          <p className="text-[12px]" style={{ color: '#2d3d55' }}>{profile.email}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#34d399' }} />
            <span className="text-[11px]" style={{ color: '#34d39980' }}>Active session</span>
          </div>
        </div>
      </div>

      {/* Token usage */}
      <TokenUsage accent={accent} />

      {/* Edit fields */}
      <div className="flex flex-col gap-4">
        <SectionHeading>Account details</SectionHeading>

        <Field label="Display name" icon={User} error={nameErr}>
          <InputField
            value={name}
            onChange={(v) => { setName(v); if (nameErr) setNameErr(validateName(v)); }}
            onKeyDown={handleKeyDown}
            placeholder="Your name"
            maxLength={40}
            error={nameErr}
            accent={accent}
          />
        </Field>

        <Field label="Email address" icon={({ className, style }) => (
          <svg className={className} style={style} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
            <path d="m1.5 5 6 4.5 6-4.5" />
          </svg>
        )} error={emailErr}>
          <InputField
            value={email}
            onChange={(v) => { setEmail(v); if (emailErr) setEmailErr(validateEmail(v)); }}
            onKeyDown={handleKeyDown}
            placeholder="you@example.com"
            type="email"
            maxLength={80}
            error={emailErr}
            accent={accent}
          />
        </Field>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty && !saved}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium transition-all duration-150"
          style={{
            background: saved
              ? `${accent}20`
              : isDirty
              ? accent
              : 'rgba(255,255,255,0.05)',
            color: saved
              ? accent
              : isDirty
              ? '#fff'
              : '#2d3d55',
            border: saved ? `1px solid ${accent}40` : 'none',
            boxShadow: isDirty && !saved ? `0 4px 16px ${accent}40` : 'none',
          }}
        >
          {saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saved ? 'Saved' : 'Save changes'}
        </button>
        {isDirty && !saved && (
          <button
            type="button"
            onClick={() => { setName(profile.name); setEmail(profile.email); setNameErr(null); setEmailErr(null); }}
            className="text-[12px] transition-colors duration-150"
            style={{ color: '#2d3d55' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#4a5c78')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#2d3d55')}
          >
            Discard
          </button>
        )}
      </div>
    </div>
  );
}

function AppearanceSection({ accent }: { accent: string }) {
  const { profile, updateProfile } = useUserProfile();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SectionHeading>Color theme</SectionHeading>
        <div className="grid grid-cols-3 gap-2.5">
          {APP_THEMES.map((theme) => {
            const isActive = profile.themeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => updateProfile({ themeId: theme.id })}
                className="group relative flex flex-col gap-2.5 rounded-2xl p-3.5 text-left transition-all duration-200"
                style={{
                  background: isActive ? `${theme.accent}14` : 'rgba(255,255,255,0.025)',
                  border: isActive
                    ? `1.5px solid ${theme.accent}50`
                    : '1.5px solid rgba(255,255,255,0.06)',
                  boxShadow: isActive ? `0 4px 24px ${theme.accent}20` : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.025)';
                }}
              >
                {/* Preview */}
                <div
                  className="relative h-10 w-full rounded-lg overflow-hidden"
                  style={{ background: theme.bg, border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {/* Fake sidebar */}
                  <div className="absolute left-0 top-0 bottom-0 w-5" style={{ background: `${theme.bg}ee`, borderRight: `1px solid rgba(255,255,255,0.05)` }} />
                  {/* Accent bar */}
                  <div className="absolute left-0 top-3 bottom-3 w-0.5" style={{ background: theme.accent, borderRadius: '0 2px 2px 0' }} />
                  {/* Fake messages */}
                  <div className="absolute right-2 top-2 h-1.5 w-8 rounded-full" style={{ background: `${theme.accent}60` }} />
                  <div className="absolute left-6 bottom-2 h-1.5 w-10 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  {/* Active check */}
                  {isActive && (
                    <div
                      className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full"
                      style={{ background: theme.accent }}
                    >
                      <Check className="h-2.5 w-2.5 text-white" style={{ strokeWidth: 3 }} />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium" style={{ color: isActive ? theme.accent : '#3d4f6e' }}>
                    {theme.label}
                  </span>
                  <div
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ background: theme.accent }}
                  />
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px]" style={{ color: '#1e2d42' }}>
          Theme applies instantly across the whole interface. Saved automatically.
        </p>
      </div>
    </div>
  );
}

function ChatSettingsSection({
  settings,
  onSettingsChange,
  accent,
}: {
  settings: ChatSettings;
  onSettingsChange: (s: ChatSettings) => void;
  accent: string;
}) {
  const up = <K extends keyof ChatSettings>(key: K, val: ChatSettings[K]) =>
    onSettingsChange({ ...settings, [key]: val });

  return (
    <div className="flex flex-col gap-8">
      {/* Text */}
      <div>
        <SectionHeading>Typography</SectionHeading>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium" style={{ color: '#8b99b5' }}>Font size</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#2d3d55' }}>Adjust message text size</p>
            </div>
            <div className="w-44">
              <SegmentedControl<FontSize>
                value={settings.fontSize}
                options={[
                  { value: 'sm', label: 'S' },
                  { value: 'md', label: 'M' },
                  { value: 'lg', label: 'L' },
                ]}
                onChange={(v) => up('fontSize', v)}
                accent={accent}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Behavior */}
      <div>
        <SectionHeading>Behavior</SectionHeading>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium" style={{ color: '#8b99b5' }}>Streaming speed</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#2d3d55' }}>How fast AI responses appear</p>
            </div>
            <div className="w-44">
              <SegmentedControl<ResponseSpeed>
                value={settings.responseSpeed}
                options={[
                  { value: 'fast', label: 'Fast' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'slow', label: 'Slow' },
                ]}
                onChange={(v) => up('responseSpeed', v)}
                accent={accent}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium" style={{ color: '#8b99b5' }}>Send shortcut</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#2d3d55' }}>Key to submit a message</p>
            </div>
            <div className="w-44">
              <SegmentedControl<SendKey>
                value={settings.sendKey}
                options={[
                  { value: 'enter', label: 'Enter' },
                  { value: 'cmd-enter', label: '⌘ Enter' },
                ]}
                onChange={(v) => up('sendKey', v)}
                accent={accent}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Display */}
      <div>
        <SectionHeading>Display</SectionHeading>
        <div className="flex flex-col" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <ToggleRow
            label="Timestamps"
            description="Show time on every message"
            icon={Clock3}
            checked={settings.showTimestamps}
            onChange={(v) => up('showTimestamps', v)}
            accent={accent}
          />
          <ToggleRow
            label="Compact mode"
            description="Reduce spacing between messages"
            icon={Minimize2}
            checked={settings.compactMode}
            onChange={(v) => up('compactMode', v)}
            accent={accent}
          />
          <ToggleRow
            label="Read time"
            description="Show estimated read time on long responses"
            icon={Wand2}
            checked={settings.showReadTime}
            onChange={(v) => up('showReadTime', v)}
            accent={accent}
          />
          <ToggleRow
            label="Auto-scroll"
            description="Follow the stream as it types"
            icon={ArrowDownToLine}
            checked={settings.autoScroll}
            onChange={(v) => up('autoScroll', v)}
            accent={accent}
          />
          <ToggleRow
            label="Reduce motion"
            description="Disable animations and transitions"
            icon={LayoutList}
            checked={settings.reduceMotion}
            onChange={(v) => up('reduceMotion', v)}
            accent={accent}
          />
        </div>
      </div>
    </div>
  );
}

function PlanSection({ accent }: { accent: string }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Current plan card */}
      <div
        className="flex items-center justify-between rounded-2xl p-4"
        style={{ background: `${accent}0d`, border: `1px solid ${accent}30` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}
          >
            <Zap className="h-4.5 w-4.5" style={{ color: accent }} />
          </div>
          <div>
            <p className="text-[14px] font-semibold" style={{ color: '#dde4f0' }}>Pro plan</p>
            <p className="text-[11px]" style={{ color: '#3d4f6e' }}>Renews Jun 1, 2026 · $18 / mo</p>
          </div>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}35` }}
        >
          Active
        </span>
      </div>

      {/* Token usage */}
      <TokenUsage accent={accent} />

      {/* Upgrade CTA */}
      <Link
        href="/upgrade"
        className="flex items-center justify-between rounded-2xl p-4 transition-all duration-150"
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.025)')}
      >
        <div>
          <p className="text-[13px] font-semibold" style={{ color: '#c8d3e8' }}>Upgrade to Team</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#2d3d55' }}>Shared workspaces, custom personas, analytics</p>
        </div>
        <ArrowRight className="h-4 w-4 flex-shrink-0" style={{ color: '#3d4f6e' }} />
      </Link>

      {/* Billing info rows */}
      <div>
        <SectionHeading>Billing details</SectionHeading>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {[
            { label: 'Payment method', value: '•••• 4242 (Visa)' },
            { label: 'Billing cycle', value: 'Monthly' },
            { label: 'Next invoice', value: 'Jun 1, 2026' },
            { label: 'Invoice history', value: 'View invoices →' },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              <span className="text-[12px]" style={{ color: '#3d4f6e' }}>{row.label}</span>
              <span className="text-[12px] font-medium" style={{ color: '#5a6a85' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutSection({ accent }: { accent: string }) {
  const items = [
    { label: 'Version', value: '1.0.0' },
    { label: 'Build', value: 'production' },
    { label: 'Framework', value: 'Next.js 16' },
    { label: 'Rendering', value: 'Frontend only' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
          style={{
            background: `linear-gradient(135deg, ${accent}30, ${accent}15)`,
            border: `1.5px solid ${accent}35`,
          }}
        >
          <Sparkles className="h-6 w-6" style={{ color: accent }} />
        </div>
        <div>
          <p className="text-[16px] font-bold" style={{ color: '#dde4f0', letterSpacing: '-0.02em' }}>HiveChat</p>
          <p className="text-[12px]" style={{ color: '#2d3d55' }}>AI Personas · Frontend Edition</p>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.05)' }}
      >
        {items.map((item, i) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-4 py-3"
            style={{
              borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            <span className="text-[12px]" style={{ color: '#3d4f6e' }}>{item.label}</span>
            <span className="text-[12px] font-medium" style={{ color: '#5a6a85' }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-4"
        style={{ background: `${accent}0a`, border: `1px solid ${accent}20` }}
      >
        <p className="text-[12px] leading-relaxed" style={{ color: '#4a5c78' }}>
          HiveChat is a frontend-only AI chat interface with 5 distinct AI personas. No backend, no API keys required — all responses are intelligently mocked with realistic streaming simulation.
        </p>
      </div>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSettingsChange: (s: ChatSettings) => void;
  initialSection?: Section;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  initialSection = 'profile',
}: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<Section>(initialSection);
  const { currentTheme } = useUserProfile();
  const accent = currentTheme.accent;

  // Reset to initialSection when opened
  useEffect(() => {
    if (isOpen) setActiveSection(initialSection);
  }, [isOpen, initialSection]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const SECTION_TITLES: Record<Section, string> = {
    profile: 'Profile',
    appearance: 'Appearance',
    chat: 'Chat settings',
    plan: 'Plan & billing',
    about: 'About',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80]"
            style={{ background: 'rgba(4,6,12,0.85)', backdropFilter: 'blur(12px)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[81] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto flex w-full max-w-[780px] overflow-hidden rounded-3xl"
              style={{
                height: 'min(640px, calc(100dvh - 48px))',
                background: '#07090f',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 40px 120px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.03)',
              }}
            >
              {/* ── Left nav ── */}
              <div
                className="flex w-52 flex-shrink-0 flex-col"
                style={{
                  borderRight: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.01)',
                }}
              >
                {/* Header */}
                <div className="flex-shrink-0 px-4 pt-5 pb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-lg text-xs"
                      style={{
                        background: `linear-gradient(135deg, ${accent}40, ${accent}20)`,
                        border: `1px solid ${accent}30`,
                      }}
                    >
                      <Sparkles className="h-3 w-3" style={{ color: accent }} />
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: '#c8d3e8', letterSpacing: '-0.01em' }}>
                      Settings
                    </span>
                  </div>
                </div>

                {/* Nav items */}
                <nav className="flex flex-col gap-0.5 px-2 flex-1 pb-4">
                  {NAV.map(({ id, label, icon: Icon }) => {
                    const isActive = activeSection === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveSection(id)}
                        className="relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all duration-150"
                        style={{
                          background: isActive ? `${accent}12` : 'transparent',
                          color: isActive ? accent : '#3d4f6e',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                            (e.currentTarget as HTMLButtonElement).style.color = '#5a6a85';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                            (e.currentTarget as HTMLButtonElement).style.color = '#3d4f6e';
                          }
                        }}
                      >
                        {isActive && (
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r-full"
                            style={{ height: '55%', background: accent }}
                          />
                        )}
                        <Icon
                          className="h-3.5 w-3.5 flex-shrink-0"
                          style={{ color: isActive ? accent : '#3d4f6e' }}
                        />
                        <span className="text-[13px] font-medium">{label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* ── Right content ── */}
              <div className="flex min-w-0 flex-1 flex-col">
                {/* Content header */}
                <div
                  className="flex flex-shrink-0 items-center justify-between px-6 py-4"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div>
                    <h2 className="text-[15px] font-semibold" style={{ color: '#c8d3e8', letterSpacing: '-0.01em' }}>
                      {SECTION_TITLES[activeSection]}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150"
                    style={{ color: '#2d3d55', background: 'rgba(255,255,255,0.04)' }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.color = '#8b99b5';
                      el.style.background = 'rgba(255,255,255,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.color = '#2d3d55';
                      el.style.background = 'rgba(255,255,255,0.04)';
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Scrollable content */}
                <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                      {activeSection === 'profile' && <ProfileSection accent={accent} />}
                      {activeSection === 'appearance' && <AppearanceSection accent={accent} />}
                      {activeSection === 'chat' && (
                        <ChatSettingsSection
                          settings={settings}
                          onSettingsChange={onSettingsChange}
                          accent={accent}
                        />
                      )}
                      {activeSection === 'plan' && <PlanSection accent={accent} />}
                      {activeSection === 'about' && <AboutSection accent={accent} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
