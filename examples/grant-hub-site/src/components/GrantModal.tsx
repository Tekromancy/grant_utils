'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Edit3, 
  GitPullRequest, 
  DollarSign, 
  Calendar, 
  Target, 
  Award, 
  Printer, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Calculator, 
  CheckSquare, 
  AlertCircle, 
  HelpCircle,
  Coins
} from 'lucide-react';
import { 
  type GrantRecord, 
  type LifecycleStage, 
  calculateMatchFunding, 
  getGrantComplianceChecklist, 
  type ComplianceChecklistItem 
} from '@tekromancy/grant_utils';

interface Props {
  grant: GrantRecord | null;
  onClose: () => void;
  onEdit: (grant: GrantRecord) => void;
  onCreatePR: (grant: GrantRecord) => void;
}

const STAGES: LifecycleStage[] = [
  'Drafting',
  'Internal Review',
  'Board Approval',
  'Submitted',
  'Awarded',
  'Declined'
];

export const GrantModal: React.FC<Props> = ({
  grant,
  onClose,
  onEdit,
  onCreatePR,
}) => {
  if (!grant) return null;

  const [activeTab, setActiveTab] = useState<'proposal' | 'checklist' | 'calculator'>('proposal');
  
  // Lifecycle tracking state
  const [currentStage, setCurrentStage] = useState<LifecycleStage>('Drafting');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [trackingNotes, setTrackingNotes] = useState('');
  
  // Checklist checked state: Record<string, boolean>
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Match calculator state
  const [calcAmount, setCalcAmount] = useState<number>(grant.amount);
  const [calcMatchPct, setCalcMatchPct] = useState<number>(grant.matchPercentage);

  // Load persisted lifecycle & checklist states
  useEffect(() => {
    if (!grant) return;
    setCalcAmount(grant.amount);
    setCalcMatchPct(grant.matchPercentage);

    // Lifecycle
    try {
      const savedLife = localStorage.getItem(`grant_lifecycle_${grant.id}`) || localStorage.getItem(`acbf_lifecycle_${grant.id}`);
      if (savedLife) {
        const parsed = JSON.parse(savedLife);
        setCurrentStage(parsed.stage || 'Drafting');
        setConfirmationNumber(parsed.confirmationNumber || '');
        setSubmissionDate(parsed.submissionDate || '');
        setTrackingNotes(parsed.notes || '');
      } else {
        setCurrentStage('Drafting');
        setConfirmationNumber('');
        setSubmissionDate('');
        setTrackingNotes('');
      }
    } catch {
      // Fallback
    }

    // Checklist
    try {
      const savedChecklist = localStorage.getItem(`grant_checklist_${grant.id}`) || localStorage.getItem(`acbf_checklist_${grant.id}`);
      if (savedChecklist) {
        setCheckedItems(JSON.parse(savedChecklist));
      } else {
        setCheckedItems({});
      }
    } catch {
      // Fallback
    }
  }, [grant]);

  function handleSaveLifecycle(stage: LifecycleStage, conf = confirmationNumber, subDate = submissionDate, notes = trackingNotes) {
    setCurrentStage(stage);
    try {
      localStorage.setItem(`grant_lifecycle_${grant?.id}`, JSON.stringify({
        stage,
        confirmationNumber: conf,
        submissionDate: subDate,
        notes,
        updatedAt: new Date().toISOString()
      }));
    } catch {
      // ignore
    }
  }

  function handleToggleChecklist(id: string) {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    try {
      localStorage.setItem(`grant_checklist_${grant?.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  function handleSelectAllChecklist(items: ComplianceChecklistItem[]) {
    const updated: Record<string, boolean> = {};
    items.forEach(it => { updated[it.id] = true; });
    setCheckedItems(updated);
    try {
      localStorage.setItem(`grant_checklist_${grant?.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  function handleResetChecklist() {
    setCheckedItems({});
    try {
      localStorage.removeItem(`grant_checklist_${grant?.id}`);
      localStorage.removeItem(`acbf_checklist_${grant?.id}`);
    } catch {
      // ignore
    }
  }

  const checklistItems = getGrantComplianceChecklist(grant);
  const checkedCount = checklistItems.filter(it => checkedItems[it.id]).length;
  const checklistPercent = checklistItems.length > 0 ? Math.round((checkedCount / checklistItems.length) * 100) : 0;

  const matchCalc = calculateMatchFunding(calcAmount, calcMatchPct);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/50">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                {grant.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                {grant.tier}
              </span>
              {grant.matchPercentage > 0 && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  {grant.matchPercentage}% Match Required
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{grant.program}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{grant.funder}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lifecycle Progression Bar */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 no-print">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Grant Application Lifecycle</span>
            </span>
            <span className="text-xs font-semibold text-slate-300">
              Current Status: <strong className="text-emerald-400">{currentStage}</strong>
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {STAGES.map((st) => {
              const isCurrent = currentStage === st;
              let bg = 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700';
              if (isCurrent) {
                if (st === 'Awarded') bg = 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-md shadow-emerald-950';
                else if (st === 'Declined') bg = 'bg-rose-600 text-white font-bold border-rose-500 shadow-md shadow-rose-950';
                else if (st === 'Submitted') bg = 'bg-amber-600 text-white font-bold border-amber-500 shadow-md shadow-amber-950';
                else bg = 'bg-blue-600 text-white font-bold border-blue-500 shadow-md shadow-blue-950';
              }

              return (
                <button
                  key={st}
                  onClick={() => handleSaveLifecycle(st)}
                  className={`px-2 py-1.5 rounded-lg text-[11px] border transition text-center truncate ${bg}`}
                  title={`Set status to ${st}`}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Submission Details Form (when in Submitted or Awarded state) */}
          {(currentStage === 'Submitted' || currentStage === 'Awarded' || currentStage === 'Declined') && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-0.5">Confirmation Number</label>
                <input
                  type="text"
                  value={confirmationNumber}
                  onChange={(e) => {
                    setConfirmationNumber(e.target.value);
                    handleSaveLifecycle(currentStage, e.target.value, submissionDate, trackingNotes);
                  }}
                  placeholder="e.g. GRANTS-2026-98124"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-0.5">Submission Date</label>
                <input
                  type="date"
                  value={submissionDate}
                  onChange={(e) => {
                    setSubmissionDate(e.target.value);
                    handleSaveLifecycle(currentStage, confirmationNumber, e.target.value, trackingNotes);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-semibold mb-0.5">Notes / Reviewer Feedback</label>
                <input
                  type="text"
                  value={trackingNotes}
                  onChange={(e) => {
                    setTrackingNotes(e.target.value);
                    handleSaveLifecycle(currentStage, confirmationNumber, submissionDate, e.target.value);
                  }}
                  placeholder="Internal notes..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-4 bg-slate-800/30 border-b border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-slate-400">Request Amount</p>
              <p className="font-bold text-emerald-400 text-sm">{grant.amountFormatted}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <p className="text-slate-400">Target Deadline</p>
              <p className="font-semibold text-white">{grant.deadlineFormatted}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <p className="text-slate-400">Grant Type</p>
              <p className="font-semibold text-white truncate max-w-[130px]">{grant.grantType}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-yellow-400 shrink-0" />
            <div>
              <p className="text-slate-400">Strategic Priority</p>
              <p className="font-semibold text-white truncate max-w-[130px]">{grant.strategicPriority}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls (Proposal / Checklist / Match Calculator) */}
        <div className="px-6 pt-3 bg-slate-900 border-b border-slate-800 flex items-center space-x-2 text-xs no-print">
          <button
            onClick={() => setActiveTab('proposal')}
            className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-semibold transition ${
              activeTab === 'proposal'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Proposal Text</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-semibold transition ${
              activeTab === 'checklist'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Compliance Checklist</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              checklistPercent === 100 ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-300'
            }`}>
              {checkedCount}/{checklistItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 font-semibold transition ${
              activeTab === 'calculator'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Match Calculator</span>
            {grant.matchPercentage > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                {grant.matchPercentage}%
              </span>
            )}
          </button>
        </div>

        {/* Modal Body: Active Tab Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4 font-mono text-sm leading-relaxed text-slate-300 modal-content">
          {/* Print-Only Header */}
          <div className="hidden print-only mb-6 border-b-2 border-black pb-4 font-sans">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-black text-black tracking-tight">AUSTIN COOPERATIVE BUSINESS FOUNDATION</h1>
                <p className="text-xs text-gray-700">501(c)(3) Public Charity • EIN: 81-2782668 • Austin, Texas • acba.coop</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-black">{grant.amountFormatted}</p>
                <p className="text-xs text-gray-700">Target Deadline: {grant.deadlineFormatted}</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-800 grid grid-cols-2 gap-1 bg-gray-100 p-2 rounded">
              <div><strong>Funder:</strong> {grant.funder}</div>
              <div><strong>Program:</strong> {grant.program}</div>
              <div><strong>Category:</strong> {grant.category}</div>
              <div><strong>Match Required:</strong> {grant.matchPercentage}%</div>
            </div>
          </div>

          {/* TAB 1: Proposal Text */}
          {activeTab === 'proposal' && (
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap selection:bg-emerald-600">
              {grant.content}
            </div>
          )}

          {/* TAB 2: Compliance Checklist */}
          {activeTab === 'checklist' && (
            <div className="font-sans space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm">Pre-Submission Verification Checklist</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Clerical requirements for minimum wage staff & coordinators before portal upload
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSelectAllChecklist(checklistItems)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    Check All
                  </button>
                  <button
                    onClick={handleResetChecklist}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>Verification Progress</span>
                  <span>{checklistPercent}% Complete ({checkedCount}/{checklistItems.length})</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${checklistPercent}%` }}
                  />
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-2 pt-2">
                {checklistItems.map((item) => {
                  const isChecked = Boolean(checkedItems[item.id]);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-3 select-none ${
                        isChecked 
                          ? 'bg-emerald-950/30 border-emerald-700/60' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by container click
                        className="mt-1 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 shrink-0 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isChecked ? 'text-emerald-300 line-through' : 'text-white'}`}>
                            {item.label}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Match Calculator */}
          {activeTab === 'calculator' && (
            <div className="font-sans space-y-6">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Cost-Share & Matching Funds Modeling</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Calculates required non-federal cash or in-kind match for competitive federal and philanthropic grants, and identifies eligible Example.org funding pairings.
                </p>
              </div>

              {/* Interactive Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Grant Request Amount: <strong className="text-emerald-400">${calcAmount.toLocaleString('en-US')}</strong>
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cost-Share Match Percentage: <strong className="text-amber-400">{calcMatchPct}%</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={calcMatchPct}
                    onChange={(e) => setCalcMatchPct(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>0% (SDGG/CED)</span>
                    <span>25% (LFPP/RCDG)</span>
                    <span>50% (SBA PRIME)</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Match Calculation Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">Funder Award Share ({matchCalc.funderSharePercentage}%)</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono mt-1">
                    ${matchCalc.requestAmount.toLocaleString('en-US')}
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">Required Match Share ({matchCalc.applicantSharePercentage}%)</p>
                  <p className="text-lg font-bold text-amber-400 font-mono mt-1">
                    ${matchCalc.matchRequired.toLocaleString('en-US')}
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">Total Program Budget</p>
                  <p className="text-lg font-bold text-cyan-300 font-mono mt-1">
                    ${matchCalc.totalProjectBudget.toLocaleString('en-US')}
                  </p>
                </div>
              </div>

              {/* Recommended Example.org Match Pairing Sources */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Eligible Example.org Non-Federal Match Pairing Sources
                </h5>
                <div className="space-y-2">
                  {matchCalc.recommendedSources.map((src, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{src.name}</div>
                        <p className="text-slate-400 text-[11px] mt-0.5">{src.description}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className="font-mono font-bold text-emerald-400">
                          ${src.amount.toLocaleString('en-US')}
                        </span>
                        <p className="text-[10px] text-slate-500">Allocable Capacity</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>File: <code className="text-cyan-300">{grant.filePath}</code></span>
            <span>•</span>
            <span>{grant.wordCount} words</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              title="Print proposal or save to PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print / PDF</span>
            </button>

            {grant.portalUrl && grant.portalUrl.startsWith('http') && (
              <a
                href={grant.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              >
                <span>Portal Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => {
                onClose();
                onEdit(grant);
              }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Proposal</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onCreatePR(grant);
              }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>Create PR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
