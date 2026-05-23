'use client';

import { useUserProfile } from '@/lib/user-profile-context';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Cpu,
  Crown,
  Infinity,
  MessageSquare,
  Sparkles,
  Users,
  Zap,
  Brain,
  Globe,
  Lock,
  BarChart3,
  Download,
  Headphones,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    badge: null,
    price: { monthly: 0, annual: 0 },
    description: 'Explore HaxonChat with all 5 personas.',
    color: '#5a6a85',
    features: [
      '5 AI personas',
      '50 messages / day',
      '500k tokens / month',
      'Export as TXT',
      'Basic settings',
      'Browser history only',
    ],
    missing: [
      'Priority streaming',
      'Team workspaces',
      'API access',
      'Custom personas',
      'Analytics dashboard',
      'Dedicated support',
    ],
    cta: 'Current plan',
    current: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'Most popular',
    price: { monthly: 18, annual: 14 },
    description: 'Unlimited conversations, faster streaming, full exports.',
    color: '#6c8eff',
    features: [
      '5 AI personas',
      'Unlimited messages',
      '2M tokens / month',
      'Export TXT & JSON',
      'Advanced settings',
      'Conversation sync',
      'Priority streaming',
      'Read time analytics',
      'Keyboard shortcuts',
      'Email support',
    ],
    missing: [
      'Team workspaces',
      'API access',
      'Custom personas',
    ],
    cta: 'Upgrade to Pro',
    current: false,
  },
  {
    id: 'team',
    name: 'Team',
    badge: 'New',
    price: { monthly: 42, annual: 34 },
    description: 'Shared personas, admin controls, and usage analytics.',
    color: '#a78bfa',
    features: [
      'Everything in Pro',
      'Up to 25 members',
      'Shared workspaces',
      'Custom personas',
      'Admin dashboard',
      'Usage analytics',
      'API access',
      'SSO / SAML',
      'Priority support',
      'SLA guarantee',
    ],
    missing: [],
    cta: 'Start team trial',
    current: false,
  },
];

const FEATURE_ROWS = [
  { icon: MessageSquare, label: 'Daily messages', free: '50 / day', pro: 'Unlimited', team: 'Unlimited' },
  { icon: Cpu, label: 'Monthly tokens', free: '500k', pro: '2,000k', team: '10,000k' },
  { icon: Sparkles, label: 'AI personas', free: '5', pro: '5', team: '5 + custom' },
  { icon: Zap, label: 'Streaming speed', free: 'Standard', pro: 'Priority', team: 'Priority' },
  { icon: Download, label: 'Export formats', free: 'TXT', pro: 'TXT, JSON', team: 'TXT, JSON, PDF' },
  { icon: BarChart3, label: 'Analytics', free: null, pro: 'Basic', team: 'Full dashboard' },
  { icon: Users, label: 'Team members', free: null, pro: null, team: 'Up to 25' },
  { icon: Brain, label: 'Custom personas', free: null, pro: null, team: 'Yes' },
  { icon: Globe, label: 'API access', free: null, pro: null, team: 'Yes' },
  { icon: Lock, label: 'SSO / SAML', free: null, pro: null, team: 'Yes' },
  { icon: Headphones, label: 'Support', free: 'Community', pro: 'Email', team: 'Priority + SLA' },
];

export default function UpgradePage() {
  const { currentTheme } = useUserProfile();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <div
      className="min-h-dvh w-full flex flex-col"
      style={{ background: 'var(--background)' }}
    >
      {/* Top nav */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 transition-colors duration-150"
          style={{ color: '#3d4f6e' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#8b99b5')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#3d4f6e')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-[13px] font-medium">Back to HaxonChat</span>
        </Link>

        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-lg text-xs"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.accent}40, ${currentTheme.accent}20)`,
              border: `1px solid ${currentTheme.accent}30`,
            }}
          >
            <Sparkles className="h-3 w-3" style={{ color: currentTheme.accent }} />
          </div>
          <span className="text-[13px] font-semibold" style={{ color: '#c8d3e8', letterSpacing: '-0.01em' }}>
            HaxonChat
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-12">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 text-center"
          >
            <div
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.accent}30, ${currentTheme.accent}15)`,
                border: `1.5px solid ${currentTheme.accent}35`,
              }}
            >
              <Crown className="h-6 w-6" style={{ color: currentTheme.accent }} />
            </div>
            <h1
              className="mb-3 text-[32px] font-bold tracking-tight"
              style={{ color: '#dde4f0', letterSpacing: '-0.03em' }}
            >
              Choose your plan
            </h1>
            <p className="text-[15px]" style={{ color: '#3d4f6e' }}>
              All plans include 5 AI personas. Upgrade for more tokens, speed, and collaboration.
            </p>

            {/* Billing toggle */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <div
                className="flex items-center gap-1 rounded-xl p-1"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {(['monthly', 'annual'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBilling(b)}
                    className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[12px] font-medium transition-all duration-150"
                    style={
                      billing === b
                        ? { background: currentTheme.accent, color: '#fff' }
                        : { color: '#3d4f6e' }
                    }
                  >
                    {b === 'monthly' ? 'Monthly' : 'Annual'}
                    {b === 'annual' && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                        style={
                          billing === 'annual'
                            ? { background: 'rgba(255,255,255,0.2)', color: '#fff' }
                            : { background: `${currentTheme.accent}25`, color: currentTheme.accent }
                        }
                      >
                        −22%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Plan cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {PLANS.map((plan, idx) => {
              const isPopular = plan.id === 'pro';
              const isCurrent = plan.current;
              const price = billing === 'annual' ? plan.price.annual : plan.price.monthly;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => !isCurrent && setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  className="relative flex flex-col rounded-3xl p-6 transition-all duration-200"
                  style={{
                    background: isPopular
                      ? `linear-gradient(160deg, ${plan.color}12 0%, rgba(255,255,255,0.03) 100%)`
                      : 'rgba(255,255,255,0.025)',
                    border: isPopular
                      ? `1.5px solid ${plan.color}40`
                      : hoveredPlan === plan.id
                      ? '1.5px solid rgba(255,255,255,0.12)'
                      : '1.5px solid rgba(255,255,255,0.06)',
                    boxShadow: isPopular ? `0 8px 40px ${plan.color}15` : 'none',
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span
                        className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          background: plan.color,
                          color: '#fff',
                          boxShadow: `0 2px 12px ${plan.color}60`,
                        }}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-5">
                    <div className="mb-3 flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-xl"
                        style={{
                          background: `${plan.color}20`,
                          border: `1px solid ${plan.color}30`,
                        }}
                      >
                        {plan.id === 'free' && <Sparkles className="h-4 w-4" style={{ color: plan.color }} />}
                        {plan.id === 'pro' && <Zap className="h-4 w-4" style={{ color: plan.color }} />}
                        {plan.id === 'team' && <Users className="h-4 w-4" style={{ color: plan.color }} />}
                      </div>
                      <span className="text-[15px] font-bold" style={{ color: '#dde4f0' }}>{plan.name}</span>
                    </div>

                    <div className="mb-2 flex items-baseline gap-1">
                      {price === 0 ? (
                        <span className="text-[32px] font-bold" style={{ color: '#dde4f0', letterSpacing: '-0.03em' }}>
                          Free
                        </span>
                      ) : (
                        <>
                          <span className="text-[11px] font-medium" style={{ color: '#3d4f6e' }}>$</span>
                          <span className="text-[32px] font-bold" style={{ color: '#dde4f0', letterSpacing: '-0.03em' }}>
                            {price}
                          </span>
                          <span className="text-[12px]" style={{ color: '#3d4f6e' }}>/ mo</span>
                        </>
                      )}
                    </div>
                    {billing === 'annual' && price > 0 && (
                      <p className="text-[11px]" style={{ color: '#2d3d55' }}>
                        Billed ${price * 12} annually
                      </p>
                    )}
                    <p className="mt-2 text-[12px] leading-relaxed" style={{ color: '#3d4f6e' }}>
                      {plan.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    disabled={isCurrent}
                    className="mb-6 w-full rounded-xl py-2.5 text-[13px] font-semibold transition-all duration-150"
                    style={
                      isCurrent
                        ? {
                            background: 'rgba(255,255,255,0.05)',
                            color: '#2d3d55',
                            border: '1px solid rgba(255,255,255,0.07)',
                          }
                        : isPopular
                        ? {
                            background: plan.color,
                            color: '#fff',
                            boxShadow: `0 4px 20px ${plan.color}50`,
                          }
                        : {
                            background: `${plan.color}18`,
                            color: plan.color,
                            border: `1px solid ${plan.color}35`,
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!isCurrent && !isPopular) {
                        (e.currentTarget as HTMLButtonElement).style.background = `${plan.color}28`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent && !isPopular) {
                        (e.currentTarget as HTMLButtonElement).style.background = `${plan.color}18`;
                      }
                    }}
                  >
                    {isCurrent ? 'Current plan' : plan.cta}
                  </button>

                  {/* Features */}
                  <div className="flex flex-col gap-2.5">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2">
                        <div
                          className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                          style={{ background: `${plan.color}20` }}
                        >
                          <Check className="h-2.5 w-2.5" style={{ color: plan.color, strokeWidth: 3 }} />
                        </div>
                        <span className="text-[12px] leading-snug" style={{ color: '#6a7d95' }}>{feat}</span>
                      </div>
                    ))}
                    {plan.missing.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 opacity-30">
                        <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-0.5 w-2 rounded-full bg-current" style={{ color: '#3d4f6e' }} />
                        </div>
                        <span className="text-[12px] leading-snug" style={{ color: '#2d3d55' }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Feature comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-16"
          >
            <h2
              className="mb-6 text-center text-[18px] font-bold"
              style={{ color: '#c8d3e8', letterSpacing: '-0.02em' }}
            >
              Full comparison
            </h2>

            <div
              className="overflow-hidden rounded-2xl"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Header */}
              <div
                className="grid grid-cols-4 px-5 py-3"
                style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div />
                {PLANS.map((plan) => (
                  <div key={plan.id} className="text-center">
                    <span className="text-[12px] font-semibold" style={{ color: plan.color }}>{plan.name}</span>
                  </div>
                ))}
              </div>

              {/* Rows */}
              {FEATURE_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className="grid grid-cols-4 items-center px-5 py-3"
                  style={{
                    borderBottom: i < FEATURE_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <row.icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#2d3d55' }} />
                    <span className="text-[12px]" style={{ color: '#4a5c78' }}>{row.label}</span>
                  </div>
                  {[row.free, row.pro, row.team].map((val, ci) => (
                    <div key={ci} className="text-center">
                      {val === null ? (
                        <div className="mx-auto h-0.5 w-4 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
                      ) : (
                        <span className="text-[12px]" style={{ color: '#5a6a85' }}>{val}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-12 text-center"
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Infinity className="h-3.5 w-3.5" style={{ color: '#3d4f6e' }} />
              <span className="text-[12px]" style={{ color: '#3d4f6e' }}>
                Cancel anytime · No hidden fees · Instant access
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
