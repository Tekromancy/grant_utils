'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check, Moon, Sun, Flame, Sparkles, Trees } from 'lucide-react';
import { 
  AVAILABLE_THEMES, 
  getSavedTheme, 
  saveTheme, 
  type ThemeId 
} from '@tekromancy/grant_utils';

export const ThemeChooser: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('slate');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = getSavedTheme();
    setCurrentTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelectTheme(themeId: ThemeId) {
    setCurrentTheme(themeId);
    saveTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    setIsOpen(false);
  }

  function getThemeIcon(id: ThemeId) {
    switch (id) {
      case 'obsidian-oled':
        return <Moon className="w-3.5 h-3.5 text-white" />;
      case 'obsidian-vampire':
        return <Flame className="w-3.5 h-3.5 text-red-500" />;
      case 'coop-forest':
        return <Trees className="w-3.5 h-3.5 text-emerald-400" />;
      case 'light':
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  }

  const activeThemeConfig = AVAILABLE_THEMES.find(t => t.id === currentTheme) || AVAILABLE_THEMES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
        title="Change Visual Theme"
      >
        <Palette className="w-3.5 h-3.5 text-slate-300" />
        <span className="hidden sm:inline font-semibold">{activeThemeConfig.name}</span>
        <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded text-[10px] font-mono border ml-1"
          style={{
            backgroundColor: activeThemeConfig.background,
            color: activeThemeConfig.foreground,
            borderColor: activeThemeConfig.border
          }}
        >
          {activeThemeConfig.badge}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden py-1">
          <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Select Display Theme</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                OLED Optimized
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Custom palettes for standard & OLED display depth</p>
          </div>

          <div className="p-1.5 space-y-1">
            {AVAILABLE_THEMES.map((theme) => {
              const isSelected = theme.id === currentTheme;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`w-full text-left p-2 rounded-lg transition-all flex items-start space-x-3 ${
                    isSelected 
                      ? 'bg-slate-800/90 ring-1 ring-emerald-500' 
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  {/* Swatch preview */}
                  <div 
                    className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-inner mt-0.5"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.foreground }}
                    />
                  </div>

                  {/* Theme Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        {getThemeIcon(theme.id)}
                        <span className="text-xs font-bold text-white tracking-tight truncate">
                          {theme.name}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {theme.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
