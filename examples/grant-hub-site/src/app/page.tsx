'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, type ActiveTab } from '../components/Navbar';
import { DashboardView } from '../components/DashboardView';
import { GrantsExplorerView } from '../components/GrantsExplorerView';
import { MarkdownEditorView } from '../components/MarkdownEditorView';
import { CalendarView } from '../components/CalendarView';
import { AuthAndPRWizard } from '../components/AuthAndPRWizard';
import { GrantModal } from '../components/GrantModal';
import { CommandPalette } from '../components/CommandPalette';
import { UserGuidesView } from '../components/UserGuidesView';
import { DocsView } from '../components/DocsView';
import { GrantResearchView } from '../components/GrantResearchView';
import { 
  EXAMPLE_PROJECT_CONFIG, 
  AVAILABLE_PROJECTS 
} from '../components/ProjectSwitcher';
import { 
  getBrowserAuthToken, 
  saveBrowserAuthToken, 
  clearBrowserAuthToken,
  getAllMarkdownDocs,
  getAllGrants,
  registerGrants,
  setCalendarEvents,
  setMarkdownDocs,
  type AuthTokenConfig,
  type GrantRecord,
  type MarkdownDoc,
  type ProjectConfig
} from '@tekromancy/grant_utils';
import { 
  SAMPLE_FICTITIOUS_GRANTS, 
  SAMPLE_FICTITIOUS_EVENTS, 
  SAMPLE_FICTITIOUS_DOCS 
} from '../data/fictitiousData';
import { Terminal, ExternalLink, Github } from 'lucide-react';

const EDITED_FILES_KEY = 'tekromancy_grant_hub_demo_edits_v1';
const PROJECT_PRESET_KEY = 'tekromancy_grant_hub_project_preset_v1';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [authConfig, setAuthConfig] = useState<AuthTokenConfig | null>(null);
  const [editedFiles, setEditedFiles] = useState<Record<string, string>>({});
  const [selectedGrantForModal, setSelectedGrantForModal] = useState<GrantRecord | null>(null);
  const [editorInitialFile, setEditorInitialFile] = useState<string | undefined>(undefined);
  const [prPreselectedDoc, setPrPreselectedDoc] = useState<MarkdownDoc | undefined>(undefined);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectConfig>(EXAMPLE_PROJECT_CONFIG);

  // Initialize sample fictitious datasets
  useEffect(() => {
    registerGrants(SAMPLE_FICTITIOUS_GRANTS);
    setCalendarEvents(SAMPLE_FICTITIOUS_EVENTS);
    setMarkdownDocs(SAMPLE_FICTITIOUS_DOCS);
  }, []);

  // Load auth, preset & edited files from browser localStorage
  useEffect(() => {
    const token = getBrowserAuthToken();
    if (token) setAuthConfig(token);

    try {
      const storedEdits = localStorage.getItem(EDITED_FILES_KEY);
      if (storedEdits) {
        setEditedFiles(JSON.parse(storedEdits));
      }
      const storedPreset = localStorage.getItem(PROJECT_PRESET_KEY);
      if (storedPreset) {
        const found = AVAILABLE_PROJECTS.find(p => p.id === storedPreset);
        if (found) setCurrentProject(found);
      }
    } catch {
      // ignore
    }

    function handleTabEvent(e: Event) {
      const customEvent = e as CustomEvent<ActiveTab>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    }

    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    }

    window.addEventListener('grant:navigate-tab', handleTabEvent);
    window.addEventListener('acbf:navigate-tab', handleTabEvent);
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('grant:navigate-tab', handleTabEvent);
      window.removeEventListener('acbf:navigate-tab', handleTabEvent);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  function handleSelectProject(proj: ProjectConfig) {
    setCurrentProject(proj);
    try {
      localStorage.setItem(PROJECT_PRESET_KEY, proj.id);
    } catch {
      // ignore
    }
  }

  function handleSaveToken(config: AuthTokenConfig) {
    saveBrowserAuthToken(config);
    setAuthConfig(config);
  }

  function handleClearToken() {
    clearBrowserAuthToken();
    setAuthConfig(null);
  }

  function handleSaveFile(relativePath: string, content: string) {
    const updated = { ...editedFiles, [relativePath]: content };
    setEditedFiles(updated);
    try {
      localStorage.setItem(EDITED_FILES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  function handleRevertFile(relativePath: string) {
    const updated = { ...editedFiles };
    delete updated[relativePath];
    setEditedFiles(updated);
    try {
      localStorage.setItem(EDITED_FILES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  function handleOpenGrantProposal(grant: GrantRecord) {
    setSelectedGrantForModal(grant);
  }

  function handleEditGrantProposal(grant: GrantRecord) {
    setSelectedGrantForModal(null);
    setEditorInitialFile(grant.fileName);
    setActiveTab('editor');
  }

  function handleCreatePRFromGrant(grant: GrantRecord) {
    setSelectedGrantForModal(null);
    const doc = getAllMarkdownDocs().find(d => d.fileName === grant.fileName);
    if (doc) setPrPreselectedDoc(doc);
    setActiveTab('git');
  }

  function handleCreatePRFromFile(doc: MarkdownDoc, content: string) {
    handleSaveFile(doc.relativePath, content);
    setPrPreselectedDoc(doc);
    setActiveTab('git');
  }

  const allGrants = getAllGrants();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        authConfig={authConfig}
        editedFilesCount={Object.keys(editedFiles).length}
        grantsCount={allGrants.length}
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
      />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectGrant={handleOpenGrantProposal}
        onNavigateToTab={(tab) => setActiveTab(tab as ActiveTab)}
        onOpenDoc={(fileName) => {
          setEditorInitialFile(fileName);
          setActiveTab('editor');
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {activeTab === 'dashboard' && (
          <DashboardView
            onSelectGrant={handleOpenGrantProposal}
            onNavigateToCalendar={() => setActiveTab('calendar')}
            onNavigateToEditor={(file) => {
              setEditorInitialFile(file);
              setActiveTab('editor');
            }}
          />
        )}

        {activeTab === 'research' && (
          <GrantResearchView />
        )}

        {activeTab === 'grants' && (
          <GrantsExplorerView
            onSelectGrant={handleOpenGrantProposal}
            onEditGrant={handleEditGrantProposal}
            onCreatePR={handleCreatePRFromGrant}
          />
        )}

        {activeTab === 'editor' && (
          <MarkdownEditorView
            initialFile={editorInitialFile}
            editedFiles={editedFiles}
            onSaveFile={handleSaveFile}
            onRevertFile={handleRevertFile}
            onCreatePRForFile={handleCreatePRFromFile}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            onSelectGrant={handleOpenGrantProposal}
            onNavigateToEditor={(file) => {
              setEditorInitialFile(file);
              setActiveTab('editor');
            }}
          />
        )}

        {activeTab === 'git' && (
          <AuthAndPRWizard
            authConfig={authConfig}
            onSaveToken={handleSaveToken}
            onClearToken={handleClearToken}
            editedFiles={editedFiles}
            preselectedDoc={prPreselectedDoc}
          />
        )}

        {activeTab === 'docs' && (
          <DocsView />
        )}

        {activeTab === 'guides' && (
          <UserGuidesView
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Grant Details Modal */}
      <GrantModal
        grant={selectedGrantForModal}
        onClose={() => setSelectedGrantForModal(null)}
        onEdit={handleEditGrantProposal}
        onCreatePR={handleCreatePRFromGrant}
      />

      {/* Global Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-semibold text-slate-300 flex items-center justify-center md:justify-start gap-2">
              <span>{currentProject.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono text-[11px]">@tekromancy/grant_utils</span>
            </p>
            <p className="text-slate-500 text-[11px]">
              {currentProject.name} • {currentProject.taxStatus || '501(c)(3)'} • Institutional Grantwriting, RFC 5545 Calendar & Git PR Platform
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('docs')} className="hover:text-emerald-400 transition">
              Documentation & Specs
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('guides')} className="hover:text-emerald-400 transition">
              User Guides
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('git')} className="hover:text-emerald-400 transition">
              Git PR Engine
            </button>
            <span>•</span>
            <a 
              href="https://www.npmjs.com/package/@tekromancy/grant_utils" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-red-400 flex items-center gap-1 transition"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>npm</span>
            </a>
            <span>•</span>
            <a 
              href="https://github.com/Tekromancy/grant_utils" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white flex items-center gap-1 transition"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
