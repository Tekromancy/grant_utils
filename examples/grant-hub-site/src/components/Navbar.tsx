'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Edit3, 
  Calendar as CalendarIcon, 
  GitPullRequest, 
  BookOpen,
  FileCode2,
  ShieldCheck, 
  ShieldAlert,
  Download,
  Search,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import type { AuthTokenConfig, ProjectConfig } from '@tekromancy/grant_utils';
import { ThemeChooser } from './ThemeChooser';
import { ProjectSwitcher } from './ProjectSwitcher';

export type ActiveTab = 'dashboard' | 'grants' | 'editor' | 'calendar' | 'git' | 'docs' | 'guides';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  authConfig: AuthTokenConfig | null;
  editedFilesCount: number;
  grantsCount?: number;
  currentProject: ProjectConfig;
  onSelectProject: (project: ProjectConfig) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  authConfig,
  editedFilesCount,
  grantsCount = 27,
  currentProject,
  onSelectProject,
  onOpenSearch
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800 shadow-md">
      {/* Top Banner with Quick Links */}
      <div className="bg-slate-950/80 border-b border-slate-850 px-4 sm:px-6 py-1 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
            <Sparkles className="w-3 h-3" />
            Live Example Hub & Interactive Docs
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-400">
            Powered by <code className="font-mono text-emerald-300">@tekromancy/grant_utils</code>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://www.npmjs.com/package/@tekromancy/grant_utils"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white flex items-center gap-1 transition"
          >
            <span>npm @tekromancy/grant_utils</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <a
            href="https://github.com/Tekromancy/grant_utils"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white flex items-center gap-1 transition"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Organization Preset */}
          <div className="flex items-center space-x-3">
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base shadow-md shadow-emerald-950/50 cursor-pointer"
            >
              TG
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span 
                  onClick={() => setActiveTab('dashboard')}
                  className="font-bold text-white text-base tracking-tight cursor-pointer hover:text-emerald-300 transition"
                >
                  {currentProject.shortName || currentProject.name}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                  Example Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[280px] sm:max-w-md">
                {currentProject.tagline || 'Institutional Grantwriting & Pipeline Management Hub'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('grants')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'grants'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Grants ({grantsCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition relative ${
                activeTab === 'editor'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Proposal Editor</span>
              {editedFilesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                  {editedFilesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'calendar'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('git')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'git'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>Git PRs</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'docs'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Docs & Specs</span>
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'guides'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>User Guides</span>
            </button>
          </nav>

          {/* Preset Switcher, Theme & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <ProjectSwitcher 
              currentProject={currentProject} 
              onSelectProject={onSelectProject} 
            />

            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition"
                title="Search grants, docs, events (Cmd+K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-slate-900 border border-slate-750 rounded text-slate-400">
                  ⌘K
                </kbd>
              </button>
            )}

            <button
              onClick={() => setActiveTab('git')}
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                authConfig?.isValid
                  ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-amber-950/40 border-amber-600/40 text-amber-300 hover:bg-amber-900/40'
              }`}
            >
              {authConfig?.isValid ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>@{authConfig.username}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Git Token</span>
                </>
              )}
            </button>

            <ThemeChooser />
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-800 space-x-1 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${
              activeTab === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('grants')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${
              activeTab === 'grants' ? 'bg-emerald-600 text-white' : 'text-slate-300'
            }`}
          >
            Grants ({grantsCount})
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${
              activeTab === 'editor' ? 'bg-emerald-600 text-white' : 'text-slate-300'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${
              activeTab === 'calendar' ? 'bg-emerald-600 text-white' : 'text-slate-300'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${
              activeTab === 'docs' ? 'bg-emerald-600 text-white' : 'text-slate-300'
            }`}
          >
            Docs & Specs
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-2.5 py-1 rounded-md shrink-0 ${
              activeTab === 'guides' ? 'bg-emerald-600 text-white' : 'text-slate-300'
            }`}
          >
            Guides
          </button>
        </div>
      </div>
    </header>
  );
};
