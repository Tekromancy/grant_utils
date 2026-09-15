'use client';

import React from 'react';
import { Building2, ChevronDown, Check, Sparkles } from 'lucide-react';
import { 
  EXAMPLE_PROJECT_CONFIG,
  RESILIENCE_PROJECT_CONFIG, 
  HEALTH_EQUITY_PROJECT_CONFIG, 
  type ProjectConfig 
} from '@tekromancy/grant_utils';

export { EXAMPLE_PROJECT_CONFIG, RESILIENCE_PROJECT_CONFIG, HEALTH_EQUITY_PROJECT_CONFIG };

export const AVAILABLE_PROJECTS: ProjectConfig[] = [
  EXAMPLE_PROJECT_CONFIG,
  RESILIENCE_PROJECT_CONFIG,
  HEALTH_EQUITY_PROJECT_CONFIG
];

interface Props {
  currentProject: ProjectConfig;
  onSelectProject: (project: ProjectConfig) => void;
}

export const ProjectSwitcher: React.FC<Props> = ({ currentProject, onSelectProject }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-slate-700/80 shadow-sm transition"
        title="Switch Organization / Project Configuration"
      >
        <Building2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="truncate max-w-[160px] sm:max-w-[200px]">
          {currentProject.shortName || currentProject.name}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl bg-slate-900 border border-slate-800 ring-1 ring-black ring-opacity-5 divide-y divide-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100 p-1.5">
          <div className="px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Organization Presets
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <Sparkles className="w-3 h-3" />
                Live Switcher
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Demonstrates multi-tenant support across distinct non-profit pipelines.
            </p>
          </div>

          <div className="py-1">
            {AVAILABLE_PROJECTS.map((proj) => {
              const isSelected = proj.id === currentProject.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => {
                    onSelectProject(proj);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-start justify-between gap-2 transition ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-medium text-slate-100">{proj.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{proj.tagline}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
