'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Layers, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  BarChart3,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { 
  getAllGrants, 
  getKPISummary, 
  getUpcomingEvents,
  calculateDaysRemaining,
  type GrantRecord,
  type GrantCategory
} from '@tekromancy/grant_utils';

interface Props {
  onSelectGrant: (grant: GrantRecord) => void;
  onNavigateToCalendar: () => void;
  onNavigateToEditor: (fileName?: string) => void;
}

export const LiveExecutiveGraphic: React.FC<Props> = ({
  onSelectGrant,
  onNavigateToCalendar,
  onNavigateToEditor,
}) => {
  const kpis = getKPISummary();
  const allGrants = getAllGrants();
  const upcomingEvents = getUpcomingEvents('2026-09-10', 8);

  const [selectedQuarter, setSelectedQuarter] = useState<'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4'>('all');
  const [winRateSlider, setWinRateSlider] = useState<number>(14);

  // Group grants by execution quarter
  const q1Grants = allGrants.filter(g => 
    ['dell_foundation_economic_stability.md', 'kellogg_foundation_loi.md', 'austin_edd_coop_coaching.md', 'cdf_cooperative_development.md', 'rgk_foundation.md', 'cchd_economic_development.md', 'eox_state_center_capacity.md', 'bank_cra_cooperative_roots.md', 'love_titos_community_giving.md', 'credit_union_community_grants.md', 'texas_mutual_workforce.md'].includes(g.fileName)
  );
  const q2Grants = allGrants.filter(g => 
    ['texas_bar_foundation_legal_clinic.md', 'impact_austin_community.md', 'cdfi_fund_ta_emerging.md', 'workers_lab_innovation_fund.md', 'st_davids_economic_security.md'].includes(g.fileName)
  );
  const q3Grants = allGrants.filter(g => 
    ['acf_forever_austin.md', 'usda_lfpp_supply_chain.md', 'austin_project_connect_cis.md', 'sba_microloan_intermediary_ta.md'].includes(g.fileName)
  );
  const q4Grants = allGrants.filter(g => 
    ['usda_sdgg_ta.md', 'hhs_ced_job_creation.md', 'usda_rcdg_center.md', 'acf_hispanic_impact.md', 'sba_prime_microenterprise.md', 'dol_work_act_employee_ownership.md', 'epa_ejcps_coop_climate.md'].includes(g.fileName)
  );

  const q1Total = q1Grants.reduce((s, g) => s + g.amount, 0);
  const q2Total = q2Grants.reduce((s, g) => s + g.amount, 0);
  const q3Total = q3Grants.reduce((s, g) => s + g.amount, 0);
  const q4Total = q4Grants.reduce((s, g) => s + g.amount, 0);

  const displayedGrants = selectedQuarter === 'Q1' 
    ? q1Grants 
    : selectedQuarter === 'Q2' 
    ? q2Grants 
    : selectedQuarter === 'Q3' 
    ? q3Grants 
    : selectedQuarter === 'Q4' 
    ? q4Grants 
    : allGrants.slice(0, 8);

  // Revenue projection from win rate slider
  const projectedRevenue = Math.round(kpis.totalPipelineAmount * (winRateSlider / 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

      {/* Board Header & Live Synced Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-6 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE DATA ENGINE</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              EIN: 81-2782668 • 501(c)(3)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
              RFC 5545 46-Event Feed
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-950 text-purple-300 border border-purple-800">
              27 Master Proposal Packages
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Example.org Institutional Advancement & Master Capitalization Board
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Live programmatic dashboard replacing static graphic mocks with continuous multi-year financial modeling, 
            interactive quarterly pipeline milestones, and cliff-replacement telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateToCalendar}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Open Master Calendar</span>
          </button>
          <button
            onClick={() => onNavigateToEditor('CallToAction.md')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
          >
            <Layers className="w-4 h-4" />
            <span>Execution Manual</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {/* Pillar 1: Pipeline Value */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Active Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
            ${(kpis.totalPipelineAmount / 1_000_000).toFixed(2)}M
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-medium">27 Formatted Proposals</span>
            <span className="text-slate-400">$2.4M at 0% match</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Pillar 2: 2027 Revenue Targets */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>2027 Steady Target</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-cyan-400 mt-2 tracking-tight">
            $500,000
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-300">Min $300k • Stretch $700k</span>
            <span className="text-emerald-400 font-semibold">13.9% Win Target</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: '21.7%' }} title="Confirmed ($65k)"></div>
            <div className="bg-cyan-500 h-full" style={{ width: '58.3%' }} title="Target Gap"></div>
          </div>
        </div>

        {/* Pillar 3: Confirmed Liquidity & Runway */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Confirmed Cash Runway</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
            $65,000
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-purple-300 font-medium">2.6 Months Buffer</span>
            <span className="text-slate-400">@ $25,000/mo Burn</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '21.7%' }}></div>
          </div>
        </div>

        {/* Pillar 4: Workload Allocation */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Staff Time Allocation</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
            15 <span className="text-xl font-normal text-slate-400">hrs/wk</span>
          </p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-amber-300 font-medium">780 Staff Hours/Yr</span>
            <span className="text-slate-400">0.38 Dedicated FTE</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '62%' }}></div>
          </div>
        </div>
      </div>

      {/* Interactive 4-Quarter Pipeline Roadmap */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 relative z-10 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>4-Quarter Chronological Pipeline Roadmap (2026–2027)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any quarter card below to filter and inspect the exact proposal packages and dollar figures.
            </p>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedQuarter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${selectedQuarter === 'all' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              All Quarters
            </button>
            <button
              onClick={() => setSelectedQuarter('Q1')}
              className={`px-3 py-1 rounded-lg font-medium transition ${selectedQuarter === 'Q1' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Q1 Fall
            </button>
            <button
              onClick={() => setSelectedQuarter('Q2')}
              className={`px-3 py-1 rounded-lg font-medium transition ${selectedQuarter === 'Q2' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Q2 Winter
            </button>
            <button
              onClick={() => setSelectedQuarter('Q3')}
              className={`px-3 py-1 rounded-lg font-medium transition ${selectedQuarter === 'Q3' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Q3 Spring
            </button>
            <button
              onClick={() => setSelectedQuarter('Q4')}
              className={`px-3 py-1 rounded-lg font-medium transition ${selectedQuarter === 'Q4' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Q4 Summer
            </button>
          </div>
        </div>

        {/* 4 Quarter Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Q1 Card */}
          <div 
            onClick={() => setSelectedQuarter(selectedQuarter === 'Q1' ? 'all' : 'Q1')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedQuarter === 'Q1' 
                ? 'bg-slate-900 border-cyan-400 shadow-md ring-1 ring-cyan-400/50' 
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                Q1: Fall 2026
              </span>
              <span className="text-xs text-slate-400 font-mono">11 Streams</span>
            </div>
            <p className="text-2xl font-bold text-white mt-3">${(q1Total / 1000).toLocaleString()}k</p>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Dell LOI, Kellogg LOI, City EDD ACCT, CDF, RGK, CCHD Pre-App, EOX Capacity, St. David's LOI.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <span>Active Execution Window</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Q2 Card */}
          <div 
            onClick={() => setSelectedQuarter(selectedQuarter === 'Q2' ? 'all' : 'Q2')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedQuarter === 'Q2' 
                ? 'bg-slate-900 border-purple-400 shadow-md ring-1 ring-purple-400/50' 
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800">
                Q2: Winter 2026–27
              </span>
              <span className="text-xs text-slate-400 font-mono">5 Streams</span>
            </div>
            <p className="text-2xl font-bold text-white mt-3">${(q2Total / 1000).toLocaleString()}k</p>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Texas Bar, CCHD Full App, Workers Lab, Impact Austin ($80k GOS), St. David's Operating ($100k).
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-medium">
              <span>Core Operating Base</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Q3 Card */}
          <div 
            onClick={() => setSelectedQuarter(selectedQuarter === 'Q3' ? 'all' : 'Q3')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedQuarter === 'Q3' 
                ? 'bg-slate-900 border-emerald-400 shadow-md ring-1 ring-emerald-400/50' 
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Q3: Spring 2027
              </span>
              <span className="text-xs text-slate-400 font-mono">4 Streams</span>
            </div>
            <p className="text-2xl font-bold text-white mt-3">${(q3Total / 1000).toLocaleString()}k</p>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Forever Austin ($35k), USDA LFPP ($250k), Project Connect CIS ($250k), SBA Microloan TA ($75k).
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>Major Transit & Food Matches</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Q4 Card */}
          <div 
            onClick={() => setSelectedQuarter(selectedQuarter === 'Q4' ? 'all' : 'Q4')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedQuarter === 'Q4' 
                ? 'bg-slate-900 border-amber-400 shadow-md ring-1 ring-amber-400/50' 
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
                Q4: Summer 2027
              </span>
              <span className="text-xs text-slate-400 font-mono">7 Streams</span>
            </div>
            <p className="text-2xl font-bold text-white mt-3">${(q4Total / 1000).toLocaleString()}k</p>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              HHS CED ($800k), EPA EJCPS ($500k), USDA SDGG ($175k), USDA RCDG ($200k), DOL WORK ($200k).
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-medium">
              <span>Federal Mega-Grants</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Selected Quarter Grant List (Quick Explorer) */}
        {selectedQuarter !== 'all' && (
          <div className="mt-6 pt-6 border-t border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Active Proposals in {selectedQuarter} ({displayedGrants.length} items • ${(displayedGrants.reduce((s, g) => s + g.amount, 0) / 1000).toLocaleString()}k)
              </h4>
              <span className="text-xs text-slate-500">Click any grant to open full proposal</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {displayedGrants.map(g => (
                <div
                  key={g.id}
                  onClick={() => onSelectGrant(g)}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/60 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition truncate">
                      {g.funder}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{g.program}</p>
                    <p className="text-[10px] text-cyan-400 font-mono mt-0.5">Due: {g.deadlineFormatted}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="text-xs font-bold text-emerald-400">${g.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cliff Guardrails & Win-Rate Interactive Sensitivity Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Left: 2026 Cliff Replacement Matrix */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 text-white font-bold text-base mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Expiring 2026 Contracts Replaced</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Protecting Example.org against municipal & federal cliff expirations with secured institutional successors:
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">ARNL Housing Contract ($150,000)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">REPLACED</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Succeded by <strong className="text-white">Austin Project Connect CIS ($250,000 / 2 yrs)</strong>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Anti-displacement & housing cooperative coaching contract.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">HFFI Food Enterprise Grant ($75,000)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">REPLACED</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Succeded by <strong className="text-white">USDA Local Food Promotion Program ($250,000)</strong>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Local food supply chain & cooperative grocery market access.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-time Win-Rate & Revenue Sensitivity Calculator */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2 text-white font-bold text-base">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>Live Win-Rate Sensitivity Engine</span>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {winRateSlider}% Win Rate
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Simulate organizational revenue against our active $3.52M drafted pipeline:
            </p>

            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={winRateSlider}
              onChange={(e) => setWinRateSlider(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />

            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Conservative (5%)</span>
              <span>Steady Target (13.9%)</span>
              <span>Aggressive (40%)</span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Simulated Annual Revenue</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                ${projectedRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-400">Target Comparison</p>
              {projectedRevenue >= 700000 ? (
                <span className="text-xs font-bold text-purple-400">Exceeds Stretch Target ($700k)</span>
              ) : projectedRevenue >= 500000 ? (
                <span className="text-xs font-bold text-emerald-400">Meets Steady Target ($500k)</span>
              ) : projectedRevenue >= 300000 ? (
                <span className="text-xs font-bold text-cyan-400">Meets Bare Minimum ($300k)</span>
              ) : (
                <span className="text-xs font-bold text-red-400">Below $300k Minimum</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Immediate Execution Window (Next 4 Deadlines) */}
      <div className="border-t border-slate-800 pt-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Immediate High-Priority Submission Window (Next 60 Days)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Countdowns relative to active cycle</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {upcomingEvents.slice(0, 4).map((evt) => {
            const daysRemaining = calculateDaysRemaining(evt.startDate, '2026-09-10');
            const grant = evt.grantFile ? allGrants.find(g => g.fileName === evt.grantFile) : undefined;
            
            let badgeStyle = 'bg-emerald-950 text-emerald-300 border-emerald-800';
            if (daysRemaining <= 14) badgeStyle = 'bg-red-950 text-red-300 border-red-800';
            else if (daysRemaining <= 45) badgeStyle = 'bg-amber-950 text-amber-300 border-amber-800';

            return (
              <div 
                key={evt.uid}
                className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-400">{evt.startDate}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                      {daysRemaining >= 0 ? `T-${daysRemaining}d` : `${Math.abs(daysRemaining)}d ago`}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2 line-clamp-1">
                    {evt.title.replace(/^\[(DEADLINE|SUBMISSION|COMPLIANCE)\]\s*/, '')}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{evt.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">
                    {evt.amount ? `$${evt.amount.toLocaleString()}` : '-'}
                  </span>
                  {grant ? (
                    <button
                      onClick={() => onSelectGrant(grant)}
                      className="inline-flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      <span>Proposal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigateToEditor('CallToAction.md')}
                      className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white"
                    >
                      <span>Action Plan</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
