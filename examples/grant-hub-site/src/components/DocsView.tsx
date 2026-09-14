'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  FileText, 
  Code2, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Terminal,
  ShieldCheck,
  Calendar,
  GitBranch,
  Layers,
  Cpu
} from 'lucide-react';
import { DOC_SECTIONS, type DocSection } from '../data/docsData';
import { splitFrontmatter } from '@tekromancy/grant_utils';

export const DocsView: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<string | null>(null);

  // Frontmatter playground state
  const [playgroundYaml, setPlaygroundYaml] = useState<string>(`---
id: demo_epa_ej_2027
title: "EPA Environmental Justice Small Grants Program"
funder: "Environmental Protection Agency (EPA)"
program: "EJ40 Community Resilience Initiative"
amount: 100000
deadline: "2027-08-30"
category: "Federal"
tier: "Summer Federal"
matchPercentage: 0
status: "Drafting"
---

# Narrative Body
Community air monitoring and urban canopy expansion proposal.`);

  const filteredSections = DOC_SECTIONS.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSection = DOC_SECTIONS.find(s => s.id === selectedSectionId) || DOC_SECTIONS[0];

  function handleCopy(text: string, indexId: string) {
    navigator.clipboard.writeText(text);
    setCopiedSnippetIndex(indexId);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  }

  // Live validator for playground
  const parsedPlayground = React.useMemo(() => {
    try {
      const { frontmatter, body } = splitFrontmatter(playgroundYaml);
      if (!frontmatter) {
        return {
          valid: false,
          missingRequired: ['Missing YAML frontmatter block (---)'],
          keys: {},
          hasBody: Boolean(body && body.trim().length > 0)
        };
      }
      const hasFrontmatter = frontmatter.trim().startsWith('---') && frontmatter.trim().endsWith('---');
      const lines = frontmatter.split('\n');
      const keys: Record<string, string> = {};
      lines.forEach(line => {
        const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
        if (match) {
          keys[match[1]] = match[2].replace(/^["']|["']$/g, '').trim();
        }
      });

      const missingRequired: string[] = [];
      ['id', 'title', 'funder', 'program', 'amount', 'deadline'].forEach(req => {
        if (!keys[req]) missingRequired.push(req);
      });

      return {
        valid: hasFrontmatter && missingRequired.length === 0,
        missingRequired,
        keys,
        hasBody: body.trim().length > 0
      };
    } catch {
      return {
        valid: false,
        missingRequired: ['Malformed YAML format'],
        keys: {},
        hasBody: false
      };
    }
  }, [playgroundYaml]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/50 border border-emerald-500/30 rounded-2xl p-6 lg:p-8 backdrop-blur-sm relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Developer Documentation & Library Specs
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              @tekromancy/grant_utils Documentation
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Complete reference manual for setting up Git-powered grantwriting hubs, authoring RFC 5545 calendar feeds, validating YAML frontmatter metadata, and executing multi-forge Git PR workflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a 
              href="https://www.npmjs.com/package/@tekromancy/grant_utils" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-200 text-xs font-semibold rounded-xl transition shadow-sm"
            >
              <Terminal className="w-4 h-4 text-red-400" />
              npm: v0.1.4
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
            <a 
              href="https://github.com/Tekromancy/grant_utils" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition shadow-sm"
            >
              <GitBranch className="w-4 h-4 text-emerald-400" />
              GitHub Repository
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Documentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg sticky top-24">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides, specs, functions..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="space-y-1">
              <div className="px-3 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Documentation Modules
              </div>
              {filteredSections.map(sec => {
                const isSelected = sec.id === selectedSectionId;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition flex items-start justify-between gap-2 ${
                      isSelected 
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold">{sec.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{sec.summary}</div>
                    </div>
                    {sec.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
                        {sec.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <button
                onClick={() => setSelectedSectionId('playground')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2.5 ${
                  selectedSectionId === 'playground'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-purple-400 bg-purple-950/20 border border-purple-500/20 hover:bg-purple-950/40'
                }`}
              >
                <Cpu className="w-4 h-4" />
                Interactive YAML Playground
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {selectedSectionId === 'playground' ? (
            /* Interactive YAML Playground */
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full text-xs font-semibold">
                  <Cpu className="w-3.5 h-3.5" />
                  Live Schema Validator
                </div>
                <h2 className="text-2xl font-bold text-white">Interactive Grant Frontmatter Playground</h2>
                <p className="text-sm text-slate-300">
                  Edit or paste your YAML frontmatter below. The validator tests syntax, extracts key-values using <code className="text-emerald-400 font-mono text-xs">splitFrontmatter()</code>, and verifies schema compliance in real time.
                </p>
              </div>

              {/* Status Badge */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                parsedPlayground.valid 
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              }`}>
                {parsedPlayground.valid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-sm">
                    {parsedPlayground.valid ? 'Valid Frontmatter Header' : 'Compliance Warnings Detected'}
                  </div>
                  <div className="text-xs opacity-90 mt-0.5">
                    {parsedPlayground.valid 
                      ? 'All mandatory metadata fields (id, title, funder, program, amount, deadline) are present and properly formatted.' 
                      : `Missing required fields: ${parsedPlayground.missingRequired.join(', ')}`}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Editable Document Input
                  </label>
                  <textarea
                    value={playgroundYaml}
                    onChange={(e) => setPlaygroundYaml(e.target.value)}
                    rows={14}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-500 transition leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Parsed Metadata Inspector
                  </label>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 h-[278px] overflow-y-auto space-y-2 font-mono text-xs">
                    {Object.keys(parsedPlayground.keys).length === 0 ? (
                      <div className="text-slate-500 italic p-4 text-center">No metadata extracted yet</div>
                    ) : (
                      Object.entries(parsedPlayground.keys).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                          <span className="text-purple-400">{k}:</span>
                          <span className="text-slate-200 truncate max-w-[180px]">{v}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Selected Guide Content */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
              <div className="space-y-2">
                {activeSection.badge && (
                  <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {activeSection.badge}
                  </span>
                )}
                <h2 className="text-3xl font-extrabold text-white tracking-tight">{activeSection.title}</h2>
                <p className="text-slate-300 text-sm">{activeSection.summary}</p>
              </div>

              {/* Main Content Body */}
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4 border-t border-slate-800 pt-6">
                {activeSection.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('### ')) {
                    return <h3 key={i} className="text-lg font-bold text-white mt-6 mb-2">{para.replace('### ', '')}</h3>;
                  }
                  if (para.startsWith('- ')) {
                    const items = para.split('\n- ');
                    return (
                      <ul key={i} className="list-disc pl-5 space-y-1.5 my-3">
                        {items.map((item, j) => (
                          <li key={j} className="text-slate-300 text-xs sm:text-sm">
                            {item.replace(/^- /, '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (para.startsWith('| ')) {
                    // Table rendering
                    const rows = para.split('\n').filter(r => r.includes('|') && !r.includes('---'));
                    if (rows.length === 0) return null;
                    const headers = rows[0].split('|').map(s => s.trim()).filter(Boolean);
                    const dataRows = rows.slice(1);
                    return (
                      <div key={i} className="overflow-x-auto my-4 rounded-xl border border-slate-800">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950 text-slate-200 border-b border-slate-800 font-semibold uppercase tracking-wider">
                            <tr>
                              {headers.map((h, hi) => (
                                <th key={hi} className="px-3.5 py-2.5">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850 bg-slate-900/60">
                            {dataRows.map((dr, dri) => {
                              const cols = dr.split('|').map(s => s.trim()).filter(Boolean);
                              return (
                                <tr key={dri} className="hover:bg-slate-800/40 transition">
                                  {cols.map((col, coli) => (
                                    <td key={coli} className="px-3.5 py-2 text-slate-300">{col}</td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return <p key={i} className="text-slate-300 text-sm leading-relaxed">{para}</p>;
                })}
              </div>

              {/* Code Snippets */}
              {activeSection.codeSnippets && activeSection.codeSnippets.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    Executable Code Reference
                  </div>
                  {activeSection.codeSnippets.map((snip, idx) => {
                    const snipId = `${activeSection.id}-${idx}`;
                    const isCopied = copiedSnippetIndex === snipId;
                    return (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                        <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300">{snip.label}</span>
                          <button
                            onClick={() => handleCopy(snip.code, snipId)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed">
                          {snip.code}
                        </pre>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
