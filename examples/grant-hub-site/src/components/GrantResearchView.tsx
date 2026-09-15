'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  FileText, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Building2, 
  DollarSign, 
  Calendar, 
  Layers, 
  BookmarkCheck,
  Compass,
  ArrowRight,
  HelpCircle,
  FileSearch,
  BookOpenCheck
} from 'lucide-react';
import { 
  evaluateGrantFit, 
  analyzeRfpText, 
  generateGrantResearchDossier, 
  buildWebResearchQueries,
  buildGrantsGovSearchUrl,
  buildProPublicaSearchUrl,
  type GrantOpportunity, 
  type ApplicantProfile, 
  type FunderProfile,
  type GrantFitAssessment,
  type RfpAnalysis
} from '@tekromancy/grant_utils';
import { 
  SAMPLE_FICTITIOUS_RESEARCH_OPPORTUNITIES, 
  SAMPLE_FICTITIOUS_FUNDERS_990, 
  SAMPLE_APPLICANT_PROFILES,
  SAMPLE_RAW_RFP_TEXT 
} from '../data/fictitiousData';

export const GrantResearchView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'opportunities' | 'fit' | 'rfp' | 'funders' | 'dorks'>('opportunities');
  
  // Opportunities state
  const [opportunities, setOpportunities] = useState<GrantOpportunity[]>(SAMPLE_FICTITIOUS_RESEARCH_OPPORTUNITIES);
  const [oppSearch, setOppSearch] = useState('');
  const [selectedOpp, setSelectedOpp] = useState<GrantOpportunity>(SAMPLE_FICTITIOUS_RESEARCH_OPPORTUNITIES[0]);

  // Fit Evaluator state
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantProfile>(SAMPLE_APPLICANT_PROFILES[0]);
  const [fitAssessment, setFitAssessment] = useState<GrantFitAssessment>(() => 
    evaluateGrantFit(SAMPLE_FICTITIOUS_RESEARCH_OPPORTUNITIES[0], SAMPLE_APPLICANT_PROFILES[0])
  );

  // RFP Analyzer state
  const [rawRfpText, setRawRfpText] = useState(SAMPLE_RAW_RFP_TEXT);
  const [rfpAnalysis, setRfpAnalysis] = useState<RfpAnalysis>(() => analyzeRfpText(SAMPLE_RAW_RFP_TEXT));

  // Dossier state
  const [generatedDossier, setGeneratedDossier] = useState<string>('');
  const [copiedDossier, setCopiedDossier] = useState(false);

  // Web Dorks state
  const [dorkKeywords, setDorkKeywords] = useState('clean energy microgrid');
  const [dorkApplicantType, setDorkApplicantType] = useState('501(c)(3) nonprofit');
  const [dorkLocation, setDorkLocation] = useState('Texas');

  // Handle Fit evaluation
  const handleEvaluateFit = (opp: GrantOpportunity, applicant: ApplicantProfile) => {
    setSelectedOpp(opp);
    const assessment = evaluateGrantFit(opp, applicant);
    setFitAssessment(assessment);
  };

  // Handle RFP analysis
  const handleAnalyzeRfp = () => {
    const analysis = analyzeRfpText(rawRfpText);
    setRfpAnalysis(analysis);
  };

  // Generate Dossier
  const handleGenerateDossier = (opp: GrantOpportunity) => {
    const assessment = evaluateGrantFit(opp, selectedApplicant);
    const dossier = generateGrantResearchDossier(opp, assessment, rfpAnalysis, {
      applicantName: selectedApplicant.name,
      targetTier: 'Tier 1 (Fall Immediate)',
      assignedLead: 'Grantwriting Research Team'
    });
    setGeneratedDossier(dossier);
    setActiveSubTab('rfp');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2000);
  };

  const filteredOpportunities = opportunities.filter(o => 
    o.title.toLowerCase().includes(oppSearch.toLowerCase()) ||
    o.funder.toLowerCase().includes(oppSearch.toLowerCase()) ||
    o.focusAreas.some(f => f.toLowerCase().includes(oppSearch.toLowerCase()))
  );

  const webQueries = buildWebResearchQueries(dorkKeywords, dorkApplicantType, dorkLocation);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Universal Grant Research & Discovery Suite
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Institutional Opportunity Intelligence</h1>
            <p className="text-slate-400 text-xs max-w-2xl mt-1">
              Research, score, and analyze any grant opportunity across Federal NOFOs, foundation 990 filings, and RFPs with automated fit scoring and dossier generation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveSubTab('dorks');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Search Dorks & 990s
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('opportunities')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeSubTab === 'opportunities' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Opportunities ({filteredOpportunities.length})
          </button>
          <button
            onClick={() => setActiveSubTab('fit')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeSubTab === 'fit' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Fit & Eligibility Evaluator
          </button>
          <button
            onClick={() => setActiveSubTab('rfp')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeSubTab === 'rfp' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            RFP Parser & Dossier Generator
          </button>
          <button
            onClick={() => setActiveSubTab('funders')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeSubTab === 'funders' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Funder 990 Database
          </button>
          <button
            onClick={() => setActiveSubTab('dorks')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeSubTab === 'dorks' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Web Search Queries & Dorks
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: OPPORTUNITY CATALOG */}
      {activeSubTab === 'opportunities' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Opportunities List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search opportunities by title, funder, or focus area..."
                  value={oppSearch}
                  onChange={e => setOppSearch(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <span className="text-xs text-slate-400 font-mono">{filteredOpportunities.length} found</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOpportunities.map(opp => {
                const isSelected = selectedOpp.id === opp.id;
                return (
                  <div 
                    key={opp.id}
                    onClick={() => {
                      setSelectedOpp(opp);
                      handleEvaluateFit(opp, selectedApplicant);
                    }}
                    className={`cursor-pointer bg-slate-900 border rounded-2xl p-5 transition flex flex-col justify-between hover:border-indigo-500/80 shadow-md ${
                      isSelected ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500/50' : 'border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                          {opp.funderType}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {opp.fundingAmountMax ? `$${opp.fundingAmountMax.toLocaleString()}` : 'Varies'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white tracking-tight line-clamp-2">{opp.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{opp.funder}</p>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{opp.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {opp.focusAreas.slice(0, 3).map((f, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Deadline: {opp.deadline || 'Rolling'}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateDossier(opp);
                        }}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                      >
                        Dossier
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Fit Summary Sidebar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 h-fit shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Instant Fit Score
              </h2>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                fitAssessment.fitGrade.startsWith('A') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                fitAssessment.fitGrade === 'B' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                Grade {fitAssessment.fitGrade} ({fitAssessment.overallScore}/100)
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Opportunity</p>
              <h3 className="text-sm font-bold text-white mt-0.5">{selectedOpp.title}</h3>
              <p className="text-xs text-indigo-300 mt-0.5">{selectedOpp.funder}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Applicant</p>
              <select
                value={selectedApplicant.name}
                onChange={e => {
                  const found = SAMPLE_APPLICANT_PROFILES.find(p => p.name === e.target.value);
                  if (found) {
                    setSelectedApplicant(found);
                    handleEvaluateFit(selectedOpp, found);
                  }
                }}
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {SAMPLE_APPLICANT_PROFILES.map((p, i) => (
                  <option key={i} value={p.name}>{p.name} ({p.taxStatus})</option>
                ))}
              </select>
            </div>

            {/* Dimensional Bars */}
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Mission Alignment</span>
                  <span className="font-mono text-white">{fitAssessment.dimensionScores.missionAlignment}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${fitAssessment.dimensionScores.missionAlignment}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Eligibility Check</span>
                  <span className="font-mono text-white">{fitAssessment.dimensionScores.eligibility}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${fitAssessment.dimensionScores.eligibility}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Funding Budget Fit</span>
                  <span className="font-mono text-white">{fitAssessment.dimensionScores.fundingFit}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${fitAssessment.dimensionScores.fundingFit}%` }} />
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800 text-xs space-y-1">
              <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Key Fit Strengths
              </p>
              {fitAssessment.strengths.slice(0, 2).map((s, idx) => (
                <p key={idx} className="text-slate-300">• {s}</p>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleGenerateDossier(selectedOpp)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-lg transition flex items-center justify-center gap-2"
              >
                <BookOpenCheck className="w-4 h-4" />
                Generate Full Markdown Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FIT & ELIGIBILITY EVALUATOR */}
      {activeSubTab === 'fit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Comprehensive Fit & Eligibility Matrix</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluates organizational alignment, cost-share match capacity, geographic criteria, and competitiveness.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Target Opportunity:</span>
              <select
                value={selectedOpp.id}
                onChange={e => {
                  const found = SAMPLE_FICTITIOUS_RESEARCH_OPPORTUNITIES.find(o => o.id === e.target.value);
                  if (found) {
                    setSelectedOpp(found);
                    handleEvaluateFit(found, selectedApplicant);
                  }
                }}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
              >
                {SAMPLE_FICTITIOUS_RESEARCH_OPPORTUNITIES.map(o => (
                  <option key={o.id} value={o.id}>{o.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 text-center">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Recommendation</p>
              <p className="text-base font-bold text-emerald-400 mt-1">{fitAssessment.recommendation}</p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 text-center">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Overall Fit Score</p>
              <p className="text-2xl font-black text-indigo-400 mt-0.5 font-mono">{fitAssessment.overallScore} / 100</p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 text-center">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Cost Share Required</p>
              <p className="text-base font-bold text-white mt-1 font-mono">{selectedOpp.costSharePercentage || 0}% Match</p>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 text-center">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Eligibility Check</p>
              <p className={`text-base font-bold mt-1 ${fitAssessment.eligibilityCheck.isEligible ? 'text-emerald-400' : 'text-rose-400'}`}>
                {fitAssessment.eligibilityCheck.isEligible ? 'Passed' : 'Ineligible'}
              </p>
            </div>
          </div>

          {/* Detailed Strengths & Red Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Strategic Strengths & Synergies
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {fitAssessment.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Risk Factors & Red Flags
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {fitAssessment.redFlags.length > 0 ? (
                  fitAssessment.redFlags.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">⚠</span>
                      <span>{r}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400">No critical red flags identified.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4" />
              Recommended Proposal Preparation Action Items
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {fitAssessment.suggestedActionItems.map((item, idx) => (
                <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-slate-300">
                  <span className="text-indigo-400 font-bold font-mono mr-1">0{idx + 1}.</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: RFP PARSER & DOSSIER GENERATOR */}
      {activeSubTab === 'rfp' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Raw RFP Text Input */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-indigo-400" />
                Raw Notice of Funding Opportunity (NOFO) / RFP
              </h2>
              <button
                onClick={handleAnalyzeRfp}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Analyze RFP Text
              </button>
            </div>

            <textarea
              rows={14}
              value={rawRfpText}
              onChange={e => setRawRfpText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
              placeholder="Paste raw grant RFP, NOFO, or call for proposals text here..."
            />

            {/* Extracted Overview */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Ceiling</span>
                <p className="text-sm font-bold text-white mt-0.5">
                  {rfpAnalysis.fundingOverview.awardCeiling ? `$${rfpAnalysis.fundingOverview.awardCeiling.toLocaleString()}` : 'N/A'}
                </p>
              </div>
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Match Req.</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">
                  {rfpAnalysis.fundingOverview.matchRequiredPercent ? `${rfpAnalysis.fundingOverview.matchRequiredPercent}%` : '0%'}
                </p>
              </div>
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Total Fund</span>
                <p className="text-sm font-bold text-white mt-0.5">
                  {rfpAnalysis.fundingOverview.totalProgramFunding ? `$${(rfpAnalysis.fundingOverview.totalProgramFunding / 1000000).toFixed(1)}M` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Generated Markdown Dossier */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Grant Research Dossier (Markdown)
                </h2>
                {generatedDossier && (
                  <button
                    onClick={() => copyToClipboard(generatedDossier)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedDossier ? 'Copied!' : 'Copy Markdown'}
                  </button>
                )}
              </div>

              <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 h-96 overflow-y-auto leading-relaxed">
                {generatedDossier ? (
                  <pre className="whitespace-pre-wrap">{generatedDossier}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                    <FileSearch className="w-8 h-8 text-slate-600" />
                    <p>Click "Generate Full Markdown Dossier" to create a complete specification dossier.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleGenerateDossier(selectedOpp)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Re-Generate Dossier for "{selectedOpp.title}"
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: FUNDER 990 DATABASE */}
      {activeSubTab === 'funders' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_FICTITIOUS_FUNDERS_990.map((funder, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {funder.type} • EIN {funder.ein}
                </span>
                <h3 className="text-base font-bold text-white mt-2">{funder.name}</h3>
                <p className="text-xs text-slate-400">{funder.city}, {funder.state}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Total Assets</span>
                  <p className="font-bold text-white mt-0.5">${(funder.totalAssets! / 1000000).toFixed(0)} Million</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Annual Giving</span>
                  <p className="font-bold text-emerald-400 mt-0.5">${(funder.annualGiving! / 1000000).toFixed(1)} Million</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-300 mb-1.5">Top Funding Focus Areas</p>
                <div className="flex flex-wrap gap-1">
                  {funder.topFocusAreas?.map((area, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {funder.topRecipients && (
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-1.5">Recent Sample Grants</p>
                  <div className="space-y-1.5 text-xs">
                    {funder.topRecipients.map((rec, i) => (
                      <div key={i} className="bg-slate-800/30 p-2 rounded-lg text-slate-300 flex justify-between items-center">
                        <span className="truncate max-w-[150px]">{rec.name}</span>
                        <span className="font-mono text-emerald-400 font-semibold">${rec.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <a
                href={buildProPublicaSearchUrl(funder.name, funder.state)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <span>Search 990-PF Filings</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 5: SEARCH QUERIES & DORKS */}
      {activeSubTab === 'dorks' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Institutional Research Query Generator</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generates targeted Google Dorks, Grants.gov parameters, and 990-PF search queries for universal opportunity discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-mono">Topic / Focus Keywords</label>
              <input
                type="text"
                value={dorkKeywords}
                onChange={e => setDorkKeywords(e.target.value)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-mono">Applicant Tax Entity</label>
              <input
                type="text"
                value={dorkApplicantType}
                onChange={e => setDorkApplicantType(e.target.value)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-mono">Target State / Region</label>
              <input
                type="text"
                value={dorkLocation}
                onChange={e => setDorkLocation(e.target.value)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Quick Direct Links */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={buildGrantsGovSearchUrl({ keywords: dorkKeywords.split(' ') })}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Search Grants.gov Live
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={buildProPublicaSearchUrl(dorkKeywords, dorkLocation)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-purple-400" />
              Search ProPublica 990 Database
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Generated Search Dorks */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">High-Yield Web Research Queries</h3>
            <div className="space-y-2">
              {webQueries.map((query, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                  <code className="font-mono text-indigo-300 truncate">{query}</code>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => copyToClipboard(query)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                    >
                      Copy
                    </button>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
