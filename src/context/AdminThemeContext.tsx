'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminThemeMode = 'sand' | 'pineapple' | 'gold' | 'sapphire' | 'emerald' | 'ivory';

export interface ThemeMeta {
  id: AdminThemeMode;
  name: string;
  label: string;
  desc: string;
  isDark: boolean;
  bgPreview: string;
  accentPreview: string;
}

export const ADMIN_THEMES: ThemeMeta[] = [
  {
    id: 'pineapple',
    name: 'Pineapple Tech',
    label: 'Modern Clean SaaS',
    desc: 'Creamy warm canvas, floating white cards, warm gold CTA & subtle accents',
    isDark: false,
    bgPreview: '#f5f3ec',
    accentPreview: '#e6ad35'
  },
  {
    id: 'sand',
    name: 'Executive Sand',
    label: 'Classic Linen & Gold',
    desc: 'Warm linen background with gold accents & crisp dark text',
    isDark: false,
    bgPreview: '#f5f4ef',
    accentPreview: '#c9933a'
  },
  {
    id: 'gold',
    name: 'Obsidian & Gold',
    label: 'Storefront Luxury Dark',
    desc: 'Signature warm dark velvet with Yah SABAB gold accents',
    isDark: true,
    bgPreview: '#0c0a09',
    accentPreview: '#c9933a'
  },
  {
    id: 'sapphire',
    name: 'Midnight Sapphire',
    label: 'Modern Tech Navy',
    desc: 'Deep executive navy with electric sapphire blue accents',
    isDark: true,
    bgPreview: '#080d1a',
    accentPreview: '#3b82f6'
  },
  {
    id: 'emerald',
    name: 'Royal Emerald',
    label: 'Haute Midnight Pine',
    desc: 'Rich dark forest emerald with gold & mint accents',
    isDark: true,
    bgPreview: '#06120c',
    accentPreview: '#10b981'
  },
  {
    id: 'ivory',
    name: 'Pure Ivory',
    label: 'Modern Clean Daylight',
    desc: 'Crisp minimal white paper with high-contrast slate typography',
    isDark: false,
    bgPreview: '#ffffff',
    accentPreview: '#0f172a'
  }
];

interface AdminThemeContextType {
  theme: AdminThemeMode;
  isDark: boolean;
  setTheme: (mode: AdminThemeMode) => void;
  cycleTheme: () => void;
  themes: ThemeMeta[];
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: 'gold',
  isDark: true,
  setTheme: () => {},
  cycleTheme: () => {},
  themes: ADMIN_THEMES
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to 'gold' or saved preference
  const [theme, setThemeState] = useState<AdminThemeMode>('gold');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('yahsabab_admin_theme') as any;
      if (['sand', 'pineapple', 'gold', 'emerald', 'sapphire', 'ivory'].includes(saved)) {
        setThemeState(saved);
      } else if (saved === 'dark') {
        setThemeState('gold');
      } else if (saved === 'light') {
        setThemeState('gold');
      } else {
        // Default to 'gold' (Obsidian & Gold Luxury)
        setThemeState('gold');
      }
    } catch {}
  }, []);

  const setTheme = (mode: AdminThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem('yahsabab_admin_theme', mode);
    } catch {}
  };

  const cycleTheme = () => {
    const ids: AdminThemeMode[] = ['pineapple', 'sand', 'gold', 'sapphire', 'emerald', 'ivory'];
    const currIndex = ids.indexOf(theme);
    const next = ids[(currIndex + 1) % ids.length];
    setTheme(next);
  };

  const currentMeta = ADMIN_THEMES.find((t) => t.id === theme) || ADMIN_THEMES[0];

  return (
    <AdminThemeContext.Provider
      value={{
        theme,
        isDark: currentMeta.isDark,
        setTheme,
        cycleTheme,
        themes: ADMIN_THEMES
      }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
