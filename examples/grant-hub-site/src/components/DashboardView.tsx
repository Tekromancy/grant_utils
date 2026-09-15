'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Calendar as CalendarIcon,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { 
  getKPISummary, 
  getUpcomingEvents, 
  calculateDaysRemaining,
  getGrantById,
  type CalendarEvent,
  type GrantRecord
} from '@tekromancy/grant_utils';
import { LiveExecutiveGraphic } from './LiveExecutiveGraphic';

interface Props {
  onSelectGrant: (grant: GrantRecord) => void;
  onNavigateToCalendar: () => void;
  onNavigateToEditor: (fileName?: string) => void;
}

export const DashboardView: React.FC<Props> = ({
  onSelectGrant,
  onNavigateToCalendar,
  onNavigateToEditor
}) => {
  const kpis = getKPISummary();
  const upcomingEvents = getUpcomingEvents('2026-09-10', 10);
  const [showGraphic, setShowGraphic] = useState(true);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Live Executive Board (Replaces static dashboard graphic) */}
      {showGraphic ? (
        <div className="space-y-2">
          <div className="flex justify-end">
            <button
              onClick={() => setShowGraphic(false)}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 transition shadow-sm"
              title="Collapse executive board"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Compact View</span>
            </button>
          </div>
          <LiveExecutiveGraphic
            onSelectGrant={onSelectGrant}
            onNavigateToCalendar={onNavigateToCalendar}
            onNavigateToEditor={onNavigateToEditor}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-white">
              Executive Capitalization Board • ${(kpis.totalPipelineAmount / 1_000_000).toFixed(2)}M Active Pipeline • 27 Proposals
            </span>
          </div>
          <button
            onClick={() => setShowGraphic(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Expand Live Graphic Board</span>
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Pipeline */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Pipeline</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">$3,610,000</p>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>27 Submission Packages Written</span>
          </div>
        </div>

        {/* 2027 Revenue Target */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">2027 Steady Target</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">$500,000</p>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-slate-400">
            <span>Min $300k | Stretch $700k</span>
          </div>
        </div>

        {/* Required Win Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Target Win Rate</span>
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">13.9%</p>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-purple-300">
            <span>Wins $505,400 to achieve steady state</span>
          </div>
        </div>

        {/* Expiring Replacements */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Expiring Replaced</span>
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white mt-2">Core Transition Secured</p>
          <div className="mt-2 text-xs text-slate-400 space-y-0.5">
            <p>• Legacy Pilot ➔ Metropolis Digital ($250k)</p>
            <p>• Agro Seed ➔ Evergreen Trust ($180k)</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown Bars */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white tracking-tight mb-4">Capitalization Pipeline by Funding Stream</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-cyan-300">Federal Grants</span>
              <span className="text-white">$2,400,000 (66.5%)</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: '66.5%' }}></div>
            </div>
            <p className="text-slate-400 mt-1">Energy Innovation, Resilient Infrastructure, Workforce Labs</p>
          </div>

          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-purple-300">National Foundations</span>
              <span className="text-white">$850,000 (23.5%)</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: '23.5%' }}></div>
            </div>
            <p className="text-slate-400 mt-1">Apex Climate, Pioneer Global Research, Summit Economic Fund</p>
          </div>

          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-emerald-300">Regional Foundations</span>
              <span className="text-white">$380,000 (10.5%)</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '10.5%' }}></div>
            </div>
            <p className="text-slate-400 mt-1">Evergreen Ecological Trust, Beacon Health Philanthropy</p>
          </div>

          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-blue-300">Municipal Innovation</span>
              <span className="text-white">$120,000 (3.3%)</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '3.3%' }}></div>
            </div>
            <p className="text-slate-400 mt-1">Metropolis Municipal Innovation Office, Digital Equity</p>
          </div>

          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-amber-300">Corporate Innovation</span>
              <span className="text-white">$250,000 (6.9%)</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '6.9%' }}></div>
            </div>
            <p className="text-slate-400 mt-1">Horizon Technology & Innovation Fund, Open Robotics</p>
          </div>

          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-semibold mb-1">
              <span className="text-pink-300">Community Enterprise</span>
              <span className="text-white">$300,000 (8.3%)</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-pink-500 h-full rounded-full" style={{ width: '8.3%' }}></div>
            </div>
            <p className="text-slate-400 mt-1">Summit Small Enterprise Capital Fund, Cooperative Revolving Pool</p>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines & Submission Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Upcoming Deadlines & Milestones</h3>
            <p className="text-xs text-slate-400 mt-0.5">Chronological countdown as laid out in CallToAction.md and calendar.ics</p>
          </div>
          <button
            onClick={onNavigateToCalendar}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>View Month Calendar</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
            <thead className="bg-slate-800/50 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Target Date</th>
                <th className="px-6 py-3.5">Countdown</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Grant / Milestone Event</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {upcomingEvents.map((evt) => {
                const daysRemaining = calculateDaysRemaining(evt.startDate, '2026-09-10');
                const grant = evt.grantFile ? getGrantById(evt.grantFile) : undefined;
                let badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-800';
                if (daysRemaining <= 14) badgeColor = 'bg-red-950 text-red-300 border-red-800';
                else if (daysRemaining <= 45) badgeColor = 'bg-amber-950 text-amber-300 border-amber-800';

                return (
                  <tr key={evt.uid} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-cyan-300 font-medium">
                      {evt.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                        {daysRemaining >= 0 ? `T-${daysRemaining}d` : `${Math.abs(daysRemaining)}d ago`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-emerald-400">
                      {evt.amount ? `$${evt.amount.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">
                        {evt.title.replace(/^\[(DEADLINE|SUBMISSION|COMPLIANCE)\]\s*/, '')}
                      </p>
                      <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">{evt.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {evt.categories[1] || evt.categories[0] || 'GENERAL'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      {grant ? (
                        <button
                          onClick={() => onSelectGrant(grant)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
                        >
                          <span>Open Proposal</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onNavigateToEditor('CallToAction.md')}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition"
                        >
                          <span>CallToAction.md</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
