'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  FileText, 
  Calendar, 
  FileCode, 
  LayoutDashboard, 
  GitPullRequest, 
  Palette, 
  ChevronRight, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  getAllGrants, 
  getCalendarEvents, 
  getAllMarkdownDocs, 
  AVAILABLE_THEMES,
  saveTheme,
  type GrantRecord, 
  type CalendarEvent, 
  type MarkdownDoc,
  type ThemeId
} from '@tekromancy/grant_utils';
import type { ActiveTab } from './Navbar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectGrant: (grant: GrantRecord) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onOpenDoc: (fileName: string) => void;
}

type SearchCategory = 'grant' | 'event' | 'doc' | 'view' | 'theme';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  badge?: string;
  action: () => void;
}

export const CommandPalette: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectGrant,
  onNavigateToTab,
  onOpenDoc
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allGrants = getAllGrants();
  const allEvents = getCalendarEvents();
  const allDocs = getAllMarkdownDocs();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Compute search results
  const q = query.trim().toLowerCase();

  const results: SearchResultItem[] = [];

  // 1. Navigation Actions
  const navItems: SearchResultItem[] = [
    {
      id: 'nav-dashboard',
      title: 'Go to Executive Dashboard',
      subtitle: '2026–2028 Institutional Capitalization Board & Roadmap',
      category: 'view',
      badge: 'View',
      action: () => { onNavigateToTab('dashboard'); onClose(); }
    },
    {
      id: 'nav-grants',
      title: 'Go to Grants Explorer (27)',
      subtitle: 'Browse all active proposals, categories, and dollar requests',
      category: 'view',
      badge: 'View',
      action: () => { onNavigateToTab('grants'); onClose(); }
    },
    {
      id: 'nav-editor',
      title: 'Go to Markdown Document Editor',
      subtitle: 'Edit CallToAction.md, sustainability policy, bylaws, toolkits',
      category: 'view',
      badge: 'View',
      action: () => { onNavigateToTab('editor'); onClose(); }
    },
    {
      id: 'nav-calendar',
      title: 'Go to Deadline Calendar',
      subtitle: 'Monthly grid and RFC 5545 milestone countdowns',
      category: 'view',
      badge: 'View',
      action: () => { onNavigateToTab('calendar'); onClose(); }
    },
    {
      id: 'nav-git',
      title: 'Go to Git & PR Hub',
      subtitle: 'Manage tokens and submit PRs to GitHub, GitLab, Codeberg',
      category: 'view',
      badge: 'View',
      action: () => { onNavigateToTab('git'); onClose(); }
    },
    {
      id: 'nav-guides',
      title: 'Go to User Activity Guides & Documentation',
      subtitle: 'Step-by-step walkthroughs for research, editing, calendar & PRs',
      category: 'view',
      badge: 'Help',
      action: () => { onNavigateToTab('guides'); onClose(); }
    }
  ];

  for (const item of navItems) {
    if (!q || item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)) {
      results.push(item);
    }
  }

  // 2. Themes
  for (const theme of AVAILABLE_THEMES) {
    if (!q || theme.name.toLowerCase().includes(q) || theme.description.toLowerCase().includes(q)) {
      results.push({
        id: `theme-${theme.id}`,
        title: `Switch Theme: ${theme.name}`,
        subtitle: theme.description,
        category: 'theme',
        badge: theme.badge,
        action: () => {
          saveTheme(theme.id);
          window.dispatchEvent(new CustomEvent('grant:theme-changed', { detail: theme.id }));
          window.dispatchEvent(new CustomEvent('acbf:theme-changed', { detail: theme.id }));
          onClose();
        }
      });
    }
  }

  // 3. Grants
  for (const g of allGrants) {
    if (
      !q ||
      g.title.toLowerCase().includes(q) ||
      g.funder.toLowerCase().includes(q) ||
      g.program.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.amountFormatted.toLowerCase().includes(q) ||
      g.tier.toLowerCase().includes(q)
    ) {
      results.push({
        id: `grant-${g.id}`,
        title: `${g.funder} – ${g.program}`,
        subtitle: `${g.amountFormatted} • Due ${g.deadlineFormatted} • ${g.category}`,
        category: 'grant',
        badge: g.amountFormatted,
        action: () => { onSelectGrant(g); onClose(); }
      });
    }
  }

  // 4. Calendar Events
  for (const evt of allEvents) {
    if (
      !q ||
      evt.title.toLowerCase().includes(q) ||
      evt.startDate.toLowerCase().includes(q) ||
      evt.categories.some(c => c.toLowerCase().includes(q))
    ) {
      const cleanTitle = evt.title.replace(/^\[(DEADLINE|SUBMISSION|COMPLIANCE)\]\s*/, '');
      results.push({
        id: `evt-${evt.uid}`,
        title: cleanTitle,
        subtitle: `${evt.startDate} • ${evt.categories.join(', ')} • ${evt.description?.slice(0, 80)}...`,
        category: 'event',
        badge: evt.startDate,
        action: () => {
          if (evt.grantFile) {
            const matchGrant = allGrants.find(g => g.fileName === evt.grantFile);
            if (matchGrant) {
              onSelectGrant(matchGrant);
              onClose();
              return;
            }
          }
          onNavigateToTab('calendar');
          onClose();
        }
      });
    }
  }

  // 5. Documentation files
  for (const doc of allDocs) {
    if (
      !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.fileName.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: `doc-${doc.id}`,
        title: doc.title,
        subtitle: `${doc.relativePath} • ${doc.wordCount} words • Category: ${doc.category}`,
        category: 'doc',
        badge: doc.category,
        action: () => { onOpenDoc(doc.fileName); onClose(); }
      });
    }
  }

  const displayedResults = results.slice(0, 30);

  // Keyboard navigation inside palette
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < displayedResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : displayedResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (displayedResults[selectedIndex]) {
        displayedResults[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  if (!isOpen) return null;

  function renderCategoryIcon(category: SearchCategory) {
    switch (category) {
      case 'grant':
        return <FileText className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'doc':
        return <FileCode className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'view':
        return <LayoutDashboard className="w-4 h-4 text-purple-400 shrink-0" />;
      case 'theme':
        return <Palette className="w-4 h-4 text-pink-400 shrink-0" />;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search 27 grants, 46 calendar events, 37 documents, themes... (Cmd+K)"
            className="flex-1 bg-transparent border-none text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-slate-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-800/40">
          {displayedResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching grants, events, or documents found for &quot;{query}&quot;.
            </div>
          ) : (
            displayedResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-3 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-emerald-600/20 text-white border border-emerald-500/40' : 'hover:bg-slate-800/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-3">
                    {renderCategoryIcon(item.category)}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate leading-snug">{item.title}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Palette Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-mono text-emerald-400">
            {displayedResults.length} {displayedResults.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </div>
    </div>
  );
};
