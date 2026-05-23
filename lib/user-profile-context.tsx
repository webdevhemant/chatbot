'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface AppTheme {
  id: string;
  label: string;
  /** Primary accent color (hex) */
  accent: string;
  /** Background base color */
  bg: string;
  /** Card/surface color */
  surface: string;
  /** Subtle border color */
  border: string;
}

export const APP_THEMES: AppTheme[] = [
  {
    id: 'midnight',
    label: 'Midnight',
    accent: '#6c8eff',
    bg: '#080c14',
    surface: '#0d1220',
    border: 'rgba(255,255,255,0.07)',
  },
  {
    id: 'obsidian',
    label: 'Obsidian',
    accent: '#a78bfa',
    bg: '#090710',
    surface: '#110e1c',
    border: 'rgba(255,255,255,0.06)',
  },
  {
    id: 'emerald',
    label: 'Emerald',
    accent: '#34d399',
    bg: '#07100c',
    surface: '#0c1a13',
    border: 'rgba(255,255,255,0.07)',
  },
  {
    id: 'rose',
    label: 'Rose',
    accent: '#fb7185',
    bg: '#110810',
    surface: '#1a0d18',
    border: 'rgba(255,255,255,0.06)',
  },
  {
    id: 'amber',
    label: 'Amber',
    accent: '#fbbf24',
    bg: '#0f0b06',
    surface: '#1a1308',
    border: 'rgba(255,255,255,0.07)',
  },
  {
    id: 'slate',
    label: 'Slate',
    accent: '#94a3b8',
    bg: '#0a0c10',
    surface: '#111318',
    border: 'rgba(255,255,255,0.07)',
  },
];

export interface UserProfile {
  name: string;
  email: string;
  themeId: string;
}

interface UserProfileContextValue {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  currentTheme: AppTheme;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Hemant',
  email: '',
  themeId: 'midnight',
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

function applyTheme(theme: AppTheme) {
  const root = document.documentElement;
  root.style.setProperty('--background', theme.bg);
  root.style.setProperty('--card', theme.surface);
  root.style.setProperty('--popover', theme.surface);
  root.style.setProperty('--primary', theme.accent);
  root.style.setProperty('--ring', `${theme.accent}66`);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--input', theme.border.replace('0.07', '0.06').replace('0.06', '0.05'));
  root.style.setProperty('--sidebar', theme.bg);
  root.style.setProperty('--sidebar-primary', theme.accent);
  root.style.setProperty('--sidebar-accent', `${theme.accent}14`);
  root.style.setProperty('--sidebar-ring', `${theme.accent}4d`);
  // Store in body data attribute for CSS selectors if needed
  document.documentElement.setAttribute('data-theme', theme.id);
}

const STORAGE_KEY = 'hivechat-profile-v2';

function loadProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    // Clear old v1 key if present
    localStorage.removeItem('hivechat-profile');
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_PROFILE;
}

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadProfile();
    setProfile(stored);
    const theme = APP_THEMES.find((t) => t.id === stored.themeId) ?? APP_THEMES[0];
    applyTheme(theme);
  }, []);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      // Apply theme if changed
      if (patch.themeId && patch.themeId !== prev.themeId) {
        const theme = APP_THEMES.find((t) => t.id === patch.themeId) ?? APP_THEMES[0];
        applyTheme(theme);
      }
      return next;
    });
  }, []);

  const currentTheme = APP_THEMES.find((t) => t.id === profile.themeId) ?? APP_THEMES[0];

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, currentTheme }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used inside UserProfileProvider');
  return ctx;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
