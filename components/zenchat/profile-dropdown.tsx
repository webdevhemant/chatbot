'use client';

import {
  APP_THEMES,
  getInitials,
  useUserProfile,
} from '@/lib/user-profile-context';
import { Check, Palette, Pencil, User, X, Mail, AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ProfileDropdownProps {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'profile' | 'theme';

function validateName(v: string): string | null {
  const trimmed = v.trim();
  if (!trimmed) return 'Name is required';
  if (trimmed.length < 2) return 'Name must be at least 2 characters';
  if (trimmed.length > 40) return 'Name must be 40 characters or fewer';
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) return 'Only letters, spaces, hyphens, and apostrophes';
  return null;
}

function validateEmail(v: string): string | null {
  const trimmed = v.trim();
  if (!trimmed) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Enter a valid email address';
  if (trimmed.length > 80) return 'Email is too long';
  return null;
}

export function ProfileDropdown({ anchorRef, isOpen, onClose }: ProfileDropdownProps) {
  const { profile, updateProfile, currentTheme } = useUserProfile();
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const [tab, setTab] = useState<Tab>('profile');

  // Edit form state
  const [nameVal, setNameVal] = useState(profile.name);
  const [emailVal, setEmailVal] = useState(profile.email);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Reset form when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setNameVal(profile.name);
      setEmailVal(profile.email);
      setNameError(null);
      setEmailError(null);
      setSaved(false);
      setIsEditing(false);
      setTab('profile');
    }
  }, [isOpen, profile.name, profile.email]);

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
  }, [isOpen, anchorRef]);

  const handleSave = useCallback(() => {
    const ne = validateName(nameVal);
    const ee = validateEmail(emailVal);
    setNameError(ne);
    setEmailError(ee);
    if (ne || ee) return;
    updateProfile({ name: nameVal.trim(), email: emailVal.trim() });
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 2000);
  }, [nameVal, emailVal, updateProfile]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSave();
      if (e.key === 'Escape') {
        setNameVal(profile.name);
        setEmailVal(profile.email);
        setNameError(null);
        setEmailError(null);
        setIsEditing(false);
      }
    },
    [handleSave, profile.name, profile.email],
  );

  if (!isOpen) return null;

  const initials = getInitials(profile.name);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60]" onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed z-[61] w-80 rounded-2xl overflow-hidden"
        style={{
          top: pos.top,
          right: pos.right,
          background: '#0a0f1c',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.03)',
        }}
      >
        {/* Header row */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Tab switcher */}
          <div
            className="flex rounded-lg overflow-hidden gap-px"
            style={{ background: 'rgba(255,255,255,0.05)', padding: '3px', borderRadius: '10px' }}
          >
            {([
              { id: 'profile' as Tab, label: 'Profile', icon: User },
              { id: 'theme' as Tab, label: 'Appearance', icon: Palette },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150"
                style={
                  tab === id
                    ? { background: 'rgba(255,255,255,0.1)', color: '#c8d3e8' }
                    : { color: '#3d4f6e' }
                }
              >
                <Icon className="h-3 w-3" />
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-lg transition-colors duration-150"
            style={{ color: '#3d4f6e' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#8b99b5')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#3d4f6e')}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="p-4 flex flex-col gap-4">
            {/* Avatar + name display */}
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-[15px] font-bold"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.accent}30, ${currentTheme.accent}18)`,
                  border: `2px solid ${currentTheme.accent}40`,
                  color: currentTheme.accent,
                  letterSpacing: '-0.02em',
                }}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold leading-tight" style={{ color: '#dde4f0' }}>
                  {profile.name}
                </p>
                <p className="text-[11px] leading-tight mt-0.5 truncate" style={{ color: '#3d4f6e' }}>
                  {profile.email}
                </p>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-150"
                  title="Edit profile"
                  style={{ color: '#3d4f6e', background: 'rgba(255,255,255,0.04)' }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.color = '#c8d3e8';
                    el.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.color = '#3d4f6e';
                    el.style.background = 'rgba(255,255,255,0.04)';
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Edit form */}
            {isEditing && (
              <div
                className="flex flex-col gap-3 rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: '#2d3d55' }}
                >
                  Edit profile
                </p>

                {/* Name field */}
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1.5">
                    <User className="h-3 w-3" style={{ color: '#3d4f6e' }} />
                    <span className="text-[11px]" style={{ color: '#4a5c78' }}>Display name</span>
                  </label>
                  <input
                    type="text"
                    value={nameVal}
                    onChange={(e) => { setNameVal(e.target.value); if (nameError) setNameError(validateName(e.target.value)); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Your name"
                    maxLength={40}
                    className="w-full rounded-lg px-3 py-2 text-[13px] outline-none transition-all duration-150"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: nameError
                        ? '1px solid rgba(239,68,68,0.5)'
                        : `1px solid rgba(255,255,255,0.09)`,
                      color: '#c8d3e8',
                    }}
                    onFocus={(e) => {
                      if (!nameError) (e.target as HTMLInputElement).style.borderColor = `${currentTheme.accent}60`;
                    }}
                    onBlur={(e) => {
                      if (!nameError) (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.09)';
                    }}
                    autoFocus
                  />
                  {nameError && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" style={{ color: '#ef4444' }} />
                      <span className="text-[11px]" style={{ color: '#ef4444' }}>{nameError}</span>
                    </div>
                  )}
                </div>

                {/* Email field */}
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3" style={{ color: '#3d4f6e' }} />
                    <span className="text-[11px]" style={{ color: '#4a5c78' }}>Email address</span>
                  </label>
                  <input
                    type="email"
                    value={emailVal}
                    onChange={(e) => { setEmailVal(e.target.value); if (emailError) setEmailError(validateEmail(e.target.value)); }}
                    onKeyDown={handleKeyDown}
                    placeholder="you@example.com"
                    maxLength={80}
                    className="w-full rounded-lg px-3 py-2 text-[13px] outline-none transition-all duration-150"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: emailError
                        ? '1px solid rgba(239,68,68,0.5)'
                        : '1px solid rgba(255,255,255,0.09)',
                      color: '#c8d3e8',
                    }}
                    onFocus={(e) => {
                      if (!emailError) (e.target as HTMLInputElement).style.borderColor = `${currentTheme.accent}60`;
                    }}
                    onBlur={(e) => {
                      if (!emailError) (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.09)';
                    }}
                  />
                  {emailError && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" style={{ color: '#ef4444' }} />
                      <span className="text-[11px]" style={{ color: '#ef4444' }}>{emailError}</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setNameVal(profile.name);
                      setEmailVal(profile.email);
                      setNameError(null);
                      setEmailError(null);
                      setIsEditing(false);
                    }}
                    className="flex-1 rounded-lg py-1.5 text-[12px] font-medium transition-all duration-150"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      color: '#4a5c78',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#8b99b5')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#4a5c78')}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12px] font-medium transition-all duration-150"
                    style={{
                      background: `${currentTheme.accent}22`,
                      color: currentTheme.accent,
                      border: `1px solid ${currentTheme.accent}40`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = `${currentTheme.accent}33`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = `${currentTheme.accent}22`;
                    }}
                  >
                    {saved ? <Check className="h-3.5 w-3.5" /> : null}
                    {saved ? 'Saved' : 'Save changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Saved confirmation (when not editing) */}
            {saved && !isEditing && (
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: `${currentTheme.accent}12`, border: `1px solid ${currentTheme.accent}25` }}
              >
                <Check className="h-3.5 w-3.5 flex-shrink-0" style={{ color: currentTheme.accent }} />
                <span className="text-[12px]" style={{ color: currentTheme.accent }}>Profile updated</span>
              </div>
            )}

            {/* Char count hint when editing */}
            {isEditing && (
              <p className="text-[10px]" style={{ color: '#1e2d42' }}>
                Press Enter to save · Esc to cancel
              </p>
            )}
          </div>
        )}

        {/* Theme Tab */}
        {tab === 'theme' && (
          <div className="p-4 flex flex-col gap-3">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: '#2d3d55' }}
            >
              App appearance
            </p>
            <div className="grid grid-cols-3 gap-2">
              {APP_THEMES.map((theme) => {
                const isActive = profile.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => updateProfile({ themeId: theme.id })}
                    className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-150"
                    style={{
                      background: isActive
                        ? `${theme.accent}18`
                        : 'rgba(255,255,255,0.03)',
                      border: isActive
                        ? `1px solid ${theme.accent}45`
                        : '1px solid rgba(255,255,255,0.06)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    {/* Color swatch */}
                    <div className="relative flex flex-col gap-0.5">
                      <div
                        className="h-5 w-10 rounded-md"
                        style={{ background: theme.bg, border: '1px solid rgba(255,255,255,0.08)' }}
                      />
                      <div
                        className="h-1.5 w-7 rounded-full mx-auto"
                        style={{ background: theme.accent }}
                      />
                      {isActive && (
                        <div
                          className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full"
                          style={{ background: theme.accent }}
                        >
                          <Check className="h-2 w-2 text-white" style={{ strokeWidth: 3 }} />
                        </div>
                      )}
                    </div>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: isActive ? theme.accent : '#3d4f6e' }}
                    >
                      {theme.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] leading-relaxed mt-1" style={{ color: '#1e2d42' }}>
              Changes apply instantly across the whole app.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
