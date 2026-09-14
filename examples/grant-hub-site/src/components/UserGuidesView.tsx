'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Edit3, 
  Calendar, 
  GitPullRequest, 
  PlusCircle, 
  Terminal, 
  Printer, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Keyboard,
  Sparkles
} from 'lucide-react';
import type { ActiveTab } from './Navbar';

interface Props {
  onNavigateTab: (tab: ActiveTab) => void;
}

interface ActivityGuide {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  targetTab?: ActiveTab;
  tabLabel?: string;
  steps: {
    title: string;
    description: string;
    tip?: string;
    code?: string;
  }[];
  keyShortcuts?: { key: string; description: string }[];
}

const GUIDES: ActivityGuide[] = [
  {
    id: 'discovery',
    title: '1. Grant Discovery & Portfolio Research',
    subtitle: 'Search, filter, and analyze the 27-grant funding pipeline ($4.5M+)',
    category: 'Research & Planning',
    icon: Search,
    targetTab: 'grants',
    tabLabel: 'Open Grants Explorer',
    steps: [
      {
        title: 'Review Executive Dashboard Metrics',
        description: 'Navigate to the Dashboard tab to view high-level KPIs: Total Pipeline Capital ($4.5M+), Active Applications count, and real-time countdown to the next upcoming submission deadline.'
      },
      {
        title: 'Filter & Search in Grants Explorer',
        description: 'Switch to the Grants tab. Use the search box to find specific funders or keywords (e.g. "USDA", "workforce", "agriculture", "loan capital"). Filter by lifecycle status (Planned, Drafting, Submitted, Awarded).'
      },
      {
        title: 'Inspect Detailed Budgets & Strategic Fit',
        description: 'Click any grant row to view the full modal. Review funder eligibility requirements, program officer contact info, line-item budget distributions, and alignment with ACBF cooperative goals.'
      },
      {
        title: 'Rapid Keyboard Navigation with Command Palette',
        description: 'Press Cmd+K (macOS) or Ctrl+K (Linux/Windows) from anywhere in the app to search grants, documentation, and tools instantly without touching your mouse.',
        tip: 'Type "TWC" or "USDA" in the Command Palette to jump directly to specific proposals.'
      }
    ],
    keyShortcuts: [
      { key: 'Cmd / Ctrl + K', description: 'Open Global Command Palette' },
      { key: 'Esc', description: 'Close modals & dialogs' }
    ]
  },
  {
    id: 'editor',
    title: '2. Writing & Editing Proposals (WYSIWYG & Markdown)',
    subtitle: 'Author narrative sections, protect YAML frontmatter, and review visual diffs',
    category: 'Proposal Authoring',
    icon: Edit3,
    targetTab: 'editor',
    tabLabel: 'Open Markdown / WYSIWYG Editor',
    steps: [
      {
        title: 'Select a Document to Edit',
        description: 'Navigate to the Editor tab and pick any of the 27 grant proposals from the sidebar selector (e.g. 01_usda_rbdg_2026.md or 05_twc_wioa_2026.md).'
      },
      {
        title: 'Toggle Between Visual WYSIWYG and Raw Markdown',
        description: 'Click the "WYSIWYG" button in the editor toolbar for rich text formatting (bold, italics, headings, lists, tables). Click "Raw Markdown" if you need direct control over syntax and YAML headers.'
      },
      {
        title: 'Safe YAML Frontmatter Preservation',
        description: 'In WYSIWYG mode, the editor uses splitFrontmatter() to isolate metadata into a protected badge panel. Your narrative formatting never alters or corrupts the YAML frontmatter block.'
      },
      {
        title: 'Inspect Changes in the Visual Diff Viewer',
        description: 'Click the "Review Diff" button before saving. A side-by-side pane highlights additions in green and deletions in red, providing confidence before saving or creating PRs.'
      },
      {
        title: 'Save Locally (Overlay vs Direct Filesystem)',
        description: 'In Web mode, edits are safely stored in browser localStorage. In Desktop mode, edits write atomically directly to repository files on disk.'
      }
    ],
    keyShortcuts: [
      { key: 'Cmd / Ctrl + S', description: 'Save current document edits' },
      { key: 'Tab', description: 'Indent in Raw Markdown mode' }
    ]
  },
  {
    id: 'calendar',
    title: '3. Calendar & Deadline Tracking',
    subtitle: 'Manage submission timelines, iCalendar (.ics) synchronization, and desktop alerts',
    category: 'Project Management',
    icon: Calendar,
    targetTab: 'calendar',
    tabLabel: 'Open Interactive Calendar',
    steps: [
      {
        title: 'Choose Your Calendar View Mode',
        description: 'Switch between Month Grid view (visual event distribution), Agenda List view (chronological countdowns), and Timeline view (Gantt-style multi-year funding waves).'
      },
      {
        title: 'Subscribe to Live RFC 5545 iCalendar Feed',
        description: 'Click the ".ICS Feed" button in the navbar or calendar header. Import calendar.ics into Apple Calendar, Google Calendar, or Microsoft Outlook for automatic calendar sync.',
        code: 'https://raw.githubusercontent.com/AustinCooperativeBusinessFoundation/grantwriting/main/calendar.ics'
      },
      {
        title: 'Desktop System Tray Notifications',
        description: 'When running the desktop application, a tray icon continuously displays the countdown to the nearest deadline and sends native OS notification warnings at 30, 14, 7, and 2 days before submission.'
      }
    ]
  },
  {
    id: 'git-prs',
    title: '4. Git Collaboration & Automated Pull Requests',
    subtitle: 'Authenticate with Codeberg/GitHub, create atomic branches, and open PRs',
    category: 'Collaboration & Review',
    icon: GitPullRequest,
    targetTab: 'git',
    tabLabel: 'Configure Git & PR Hub',
    steps: [
      {
        title: 'Generate a Personal Access Token (PAT)',
        description: 'Create a token on Codeberg (codeberg.org > Settings > Applications) or GitHub (github.com > Settings > Developer Settings > Tokens) with the "repo" scope.'
      },
      {
        title: 'Store Token Securely in the App',
        description: 'In the Git & PR Hub tab, paste your token, choose provider, and enter your Git username. Tokens are validated via regex and stored locally with 0600 POSIX permissions.'
      },
      {
        title: 'Stage Modified Documents & Branch',
        description: 'Pick a modified proposal. The wizard automatically generates a semantic branch name (e.g. acbf/update-01_usda_rbdg_2026-1715890000).'
      },
      {
        title: 'Submit 1-Click Pull Request',
        description: 'Fill out the structured PR template and click "Submit Pull Request". The engine commits the changes, pushes the branch, and opens the PR on Codeberg or GitHub.'
      }
    ]
  },
  {
    id: 'adding-grants',
    title: '5. Adding New Grant Opportunities to the Portfolio',
    subtitle: 'Author new proposal markdown, configure YAML schema, and run code-gen',
    category: 'Development & Monorepo',
    icon: PlusCircle,
    steps: [
      {
        title: 'Create New Markdown File in acbf/grants/',
        description: 'Follow the standard naming convention: XX_<funder>_<program>_<year>.md (e.g. 28_eda_build_to_scale_2027.md).'
      },
      {
        title: 'Add Required YAML Frontmatter Header',
        description: 'Ensure required fields are present: grant_title, funder, deadline (YYYY-MM-DD), amount, and status.',
        code: `---
grant_title: "EDA Build to Scale Venture Challenge 2027"
funder: "U.S. Economic Development Administration (EDA)"
deadline: "2027-04-15"
amount: "$300,000"
status: "Planned"
category: "Lending Capital"
budget_total: 300000
summary: "Revolving loan fund capitalization for worker co-ops."
---`
      },
      {
        title: 'Run Monorepo Code Generation',
        description: 'Re-scan markdown frontmatter, regenerate static datasets, and update calendar.ics automatically by running:',
        code: 'pnpm run generate'
      },
      {
        title: 'Verify Unit Tests & TypeScript Types',
        description: 'Confirm all tests pass and types are validated before committing changes:',
        code: 'pnpm test'
      }
    ]
  },
  {
    id: 'cli-workflows',
    title: '6. Terminal & CLI TUI Workflows',
    subtitle: 'Keyboard-driven terminal navigation, $EDITOR integration, and fast PR creation',
    category: 'Terminal Tools',
    icon: Terminal,
    steps: [
      {
        title: 'Launch the Terminal Interface',
        description: 'Open your terminal and run the Ink CLI TUI:',
        code: 'pnpm run cli'
      },
      {
        title: 'Navigate Between Numbered Tabs',
        description: 'Press keys [1] Dashboard, [2] Grants, [3] Markdown Docs, [4] Calendar, or [5] Git/PR Setup.'
      },
      {
        title: 'Edit Proposals in Your Shell Editor',
        description: 'Highlight any grant or markdown file and press "e". The TUI temporarily suspends and opens your configured $EDITOR (nano, vim, nvim, or micro). Save and exit to return.'
      },
      {
        title: 'One-Touch Pull Request Submission',
        description: 'Press "p" on any modified proposal to enter the quick PR prompt, specify a commit message, and submit directly from your terminal.'
      }
    ],
    keyShortcuts: [
      { key: '1 - 5', description: 'Switch between CLI tabs' },
      { key: '↑ / ↓ / j / k', description: 'Scroll through lists' },
      { key: 'Enter', description: 'Expand details view' },
      { key: 'e', description: 'Open file in $EDITOR' },
      { key: 'p', description: 'Create Pull Request' },
      { key: 'q', description: 'Quit CLI' }
    ]
  },
  {
    id: 'export-reporting',
    title: '7. Exporting, Printing & Board Reporting',
    subtitle: 'Generate clean PDF packets, print stylesheets, and tabular grant exports',
    category: 'Executive & Board',
    icon: Printer,
    steps: [
      {
        title: 'Executive Board Summaries',
        description: 'Navigate to the Dashboard tab to review aggregate pipeline totals, timeline waves, and funder distribution for quarterly board presentations.'
      },
      {
        title: 'Print / Export PDF with Clean Stylesheets',
        description: 'Press Cmd+P / Ctrl+P on any grant proposal or dashboard view. The dedicated @media print CSS automatically strips out navbars, buttons, and theme pickers, producing high-contrast, publication-grade PDFs.'
      },
      {
        title: 'Extracting Tabular Data for Spreadsheets',
        description: 'Export all grant data into JSON format for financial analysis, accounting reconciliation, or spreadsheet import:',
        code: `node -e "const { getAllGrantRecords } = require('@tekromancy/grant_utils'); console.log(JSON.stringify(getAllGrantRecords(), null, 2));" > grants_export.json`
      }
    ],
    keyShortcuts: [
      { key: 'Cmd / Ctrl + P', description: 'Print / Save as PDF' }
    ]
  }
];

export const UserGuidesView: React.FC<Props> = ({ onNavigateTab }) => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>('discovery');
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<string | null>(null);

  const activeGuide = GUIDES.find(g => g.id === selectedGuideId) || GUIDES[0];

  function copySnippet(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(id);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Step-by-Step Activity Guides</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              User Activity Documentation & Walkthroughs
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
              Practical, actionable instructions walking you through research, writing, calendar tracking, Git pull requests, and terminal workflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/AustinCooperativeBusinessFoundation/grantwriting/tree/main/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <span>View Markdown in /docs</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation: Activity List */}
        <div className="lg:col-span-4 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Select an Activity Walkthrough
          </h2>
          {GUIDES.map((guide) => {
            const Icon = guide.icon;
            const isSelected = guide.id === selectedGuideId;
            return (
              <button
                key={guide.id}
                onClick={() => setSelectedGuideId(guide.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start space-x-3.5 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-950/50 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-lg mt-0.5 ${
                  isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {guide.category}
                  </span>
                  <p className="text-sm font-semibold text-slate-100 truncate mt-0.5">
                    {guide.title}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {guide.subtitle}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Quick Keyboard Cheatsheet Card */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Keyboard className="w-4 h-4 text-emerald-400" />
              <span>Global Keyboard Shortcuts</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Command Palette</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                  ⌘K / Ctrl+K
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Save Edits</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                  ⌘S / Ctrl+S
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Print / Export PDF</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                  ⌘P / Ctrl+P
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">CLI Edit File</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                  e
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">CLI Quick PR</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                  p
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Right Detail Pane: Selected Activity Walkthrough */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
            {/* Guide Header */}
            <div className="border-b border-slate-800 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {activeGuide.category}
                  </span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {activeGuide.title}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {activeGuide.subtitle}
                  </p>
                </div>

                {activeGuide.targetTab && (
                  <button
                    onClick={() => onNavigateTab(activeGuide.targetTab!)}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 transition self-start sm:self-auto"
                  >
                    <span>{activeGuide.tabLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Step-by-Step Instructions</span>
              </h3>

              <div className="space-y-4">
                {activeGuide.steps.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-1 flex-1">
                        <h4 className="text-sm font-semibold text-slate-100">
                          {step.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {step.tip && (
                      <div className="ml-9 p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-start space-x-2">
                        <span className="font-bold">Pro Tip:</span>
                        <span>{step.tip}</span>
                      </div>
                    )}

                    {step.code && (
                      <div className="ml-9 relative group">
                        <pre className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                          {step.code}
                        </pre>
                        <button
                          onClick={() => copySnippet(`${activeGuide.id}-${idx}`, step.code!)}
                          className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition opacity-80 hover:opacity-100"
                          title="Copy snippet"
                        >
                          {copiedCodeIndex === `${activeGuide.id}-${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Relevant Shortcuts */}
            {activeGuide.keyShortcuts && activeGuide.keyShortcuts.length > 0 && (
              <div className="border-t border-slate-800 pt-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recommended Shortcuts for this Activity
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeGuide.keyShortcuts.map((sc, scIdx) => (
                    <div 
                      key={scIdx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs"
                    >
                      <span className="text-slate-300">{sc.description}</span>
                      <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-emerald-400 font-bold">
                        {sc.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
