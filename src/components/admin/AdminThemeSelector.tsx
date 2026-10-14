'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, ChevronDown } from 'lucide-react';
import { useAdminTheme, ADMIN_THEMES, AdminThemeMode } from '@/context/AdminThemeContext';

export default function AdminThemeSelector() {
  const { theme, setTheme, themes } = useAdminTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border border-[#403221]/50 bg-[#16120E] text-[#F8F3E9] hover:bg-[#1f1812] hover:border-[#E6AD35]/60 transition-all cursor-pointer shadow-2xs"
        title={`Current Theme: ${currentTheme.name}`}
      >
        <Palette className="w-3.5 h-3.5 text-[#E6AD35]" />
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
          style={{ backgroundColor: currentTheme.accentPreview }}
        />
        <span className="hidden md:inline-block text-[11px] font-bold text-[#F8F3E9]">
          {currentTheme.name}
        </span>
        <ChevronDown className="w-3 h-3 text-[#A59A88] hidden sm:block" />
      </button>

      {/* Theme Palette Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#16120E] rounded-2xl border border-[#403221] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1.5 border-b border-[#403221]/50 mb-2">
            <p className="font-bold text-xs text-[#F8F3E9] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E6AD35]" />
              <span>Workspace Theme Palette</span>
            </p>
            <p className="text-[10px] text-[#A59A88]">
              Select your preferred colors and workspace aesthetic
            </p>
          </div>

          <div className="space-y-1">
            {themes.map((t) => {
              const isSelected = t.id === theme;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-[#251e17] ring-1 ring-[#c9933a]/40 shadow-2xs'
                      : 'hover:bg-slate-50 dark:hover:bg-[#1c1611]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Visual Color Swatch */}
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border border-black/15 dark:border-white/10 shadow-xs"
                      style={{ backgroundColor: t.bgPreview }}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: t.accentPreview }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#0f172a] dark:text-[#f7f3eb]">
                          {t.name}
                        </span>
                        {t.id === 'pineapple' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-[#fbf5e6] text-[#b0782e] border border-[#f3e6c8]">
                            SaaS
                          </span>
                        )}
                        {t.id === 'sand' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                            Classic
                          </span>
                        )}
                        {t.id === 'gold' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-[#2d2217] text-[#c9933a] border border-[#c9933a]/30">
                            Luxury
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#64748b] dark:text-[#a89b88] line-clamp-1">
                        {t.desc}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#c9933a] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
