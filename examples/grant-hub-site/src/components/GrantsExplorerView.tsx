'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  DollarSign, 
  Calendar, 
  Edit3, 
  GitPullRequest, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  getAllGrants, 
  searchGrants, 
  type GrantRecord, 
  type GrantCategory 
} from '@tekromancy/grant_utils';

interface Props {
  onSelectGrant: (grant: GrantRecord) => void;
  onEditGrant: (grant: GrantRecord) => void;
  onCreatePR: (grant: GrantRecord) => void;
}

const CATEGORIES: Array<GrantCategory | 'All'> = [
  'All',
  'Federal',
  'Regional Foundation',
  'National Foundation',
  'Municipal',
  'Corporate/CRA',
  'Movement/CDF'
];

export const GrantsExplorerView: React.FC<Props> = ({
  onSelectGrant,
  onEditGrant,
  onCreatePR
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GrantCategory | 'All'>('All');
  const [matchFilter, setMatchFilter] = useState<'All' | 'ZeroMatch' | 'MatchRequired'>('All');

  const all = searchGrants(searchQuery);
  const filtered = all.filter(g => {
    if (selectedCategory !== 'All' && g.category !== selectedCategory) return false;
    if (matchFilter === 'ZeroMatch' && g.matchPercentage > 0) return false;
    if (matchFilter === 'MatchRequired' && g.matchPercentage === 0) return false;
    return true;
  });

  const totalFilteredAmount = filtered.reduce((acc, g) => acc + g.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>All 27 Grant Proposals</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                ${totalFilteredAmount.toLocaleString()} Active Filter
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Every proposal is a fully developed, submission-ready package located in <code className="text-cyan-300">grants/</code>
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grants, funders, keywords..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 mr-1 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMatchFilter(m => m === 'All' ? 'ZeroMatch' : m === 'ZeroMatch' ? 'MatchRequired' : 'All')}
              className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
            >
              Match: <span className="font-semibold text-white">{matchFilter === 'ZeroMatch' ? '0% Only' : matchFilter === 'MatchRequired' ? 'Required Only' : 'All'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grants Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((grant) => (
          <div
            key={grant.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group hover:shadow-emerald-950/20"
          >
            <div>
              {/* Category & Match Badges */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                  {grant.category}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  grant.matchPercentage > 0 
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {grant.matchPercentage}% Match
                </span>
              </div>

              {/* Title & Funder */}
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                {grant.program}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{grant.funder}</p>

              {/* Amount & Deadline Banner */}
              <div className="mt-4 p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Request Amount</p>
                  <p className="text-lg font-extrabold text-emerald-400">{grant.amountFormatted}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Target Deadline</p>
                  <p className="text-xs font-semibold text-white">{grant.deadlineFormatted.split('/')[0]}</p>
                </div>
              </div>

              {/* Strategic Priority & Excerpt */}
              <div className="mt-3">
                <p className="text-xs text-purple-300 font-medium flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{grant.strategicPriority}</span>
                </p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {grant.summary || 'Full grant application narrative, statement of need, modular budget, and attachments checklist.'}
                </p>
              </div>
            </div>

            {/* Card Action Buttons */}
            <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectGrant(grant)}
                className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
              >
                <span>Read Full</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onEditGrant(grant)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 transition"
                title="Edit Proposal Markdown"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onCreatePR(grant)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-xs font-semibold bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-800/60 transition"
                title="Create Pull Request"
              >
                <GitPullRequest className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
