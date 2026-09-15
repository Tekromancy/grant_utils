'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Download, 
  Bell, 
  DollarSign, 
  ExternalLink,
  Clock
} from 'lucide-react';
import { 
  getMonthMatrix, 
  getEventsForMonth, 
  getGrantById,
  type CalendarEvent,
  type GrantRecord
} from '@tekromancy/grant_utils';

interface Props {
  onSelectGrant: (grant: GrantRecord) => void;
  onNavigateToEditor: (fileName?: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CalendarView: React.FC<Props> = ({
  onSelectGrant,
  onNavigateToEditor
}) => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9); // September 2026
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[] | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-09-10');

  const monthMatrix = getMonthMatrix(year, month, '2026-09-10');
  const monthEvents = getEventsForMonth(year, month);

  function prevMonth() {
    if (month === 1) {
      setMonth(12);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
    setSelectedDayEvents(null);
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
    setSelectedDayEvents(null);
  }

  function handleDayClick(dateStr: string, events: CalendarEvent[]) {
    setSelectedDateStr(dateStr);
    setSelectedDayEvents(events);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Calendar Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {MONTH_NAMES[month - 1]} {year}
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              {monthEvents.length} Milestones & Audits
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            RFC 5545 iCalendar feed with automated 7-day and 1-day reminders
          </p>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setYear(2026);
                setMonth(9);
              }}
              className="px-3 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <a
            href="./calendar.ics"
            download="example-grant-calendar.ics"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .ICS</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 7-Column Calendar Grid */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-5">
          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-xs font-bold text-slate-400 py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="space-y-1">
            {monthMatrix.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-cols-7 gap-1">
                {week.map((cell, cIdx) => {
                  const hasEvents = cell.events.length > 0;
                  const isSelected = cell.dateStr === selectedDateStr;

                  return (
                    <div
                      key={cIdx}
                      onClick={() => handleDayClick(cell.dateStr, cell.events)}
                      className={`min-h-[85px] p-2 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                        cell.isCurrentMonth ? 'bg-slate-950/60' : 'bg-slate-950/20 text-slate-600'
                      } ${
                        cell.isToday ? 'border-amber-500 ring-1 ring-amber-500/50' : 'border-slate-800/80'
                      } ${
                        isSelected ? 'ring-2 ring-emerald-500 bg-slate-800/60' : 'hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${
                          cell.isToday ? 'text-amber-400' : cell.isCurrentMonth ? 'text-white' : 'text-slate-600'
                        }`}>
                          {cell.day}
                        </span>
                        {hasEvents && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        )}
                      </div>

                      {/* Event chips */}
                      <div className="space-y-1 mt-1">
                        {cell.events.slice(0, 2).map((evt) => (
                          <div
                            key={evt.uid}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 truncate"
                            title={evt.title}
                          >
                            {evt.amount ? `$${(evt.amount / 1000).toFixed(0)}k ` : ''}
                            {evt.title.replace(/^\[(DEADLINE|SUBMISSION|COMPLIANCE)\]\s*/, '')}
                          </div>
                        ))}
                        {cell.events.length > 2 && (
                          <div className="text-[10px] text-slate-400 pl-1">
                            +{cell.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Day Inspector / Month Milestones */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{selectedDateStr} Events</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedDayEvents && selectedDayEvents.length > 0
                ? `${selectedDayEvents.length} event(s) scheduled for this day`
                : 'Click any day on the calendar to inspect deadlines and alarms'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {(selectedDayEvents && selectedDayEvents.length > 0 ? selectedDayEvents : monthEvents).map((evt) => {
              const grant = evt.grantFile ? getGrantById(evt.grantFile) : undefined;
              return (
                <div
                  key={evt.uid}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-semibold">{evt.startDate}</span>
                    {evt.amount && (
                      <span className="font-bold text-emerald-400 text-sm">
                        ${evt.amount.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-white text-sm">
                    {evt.title.replace(/^\[(DEADLINE|SUBMISSION|COMPLIANCE)\]\s*/, '')}
                  </h4>

                  <p className="text-slate-400 leading-relaxed">
                    {evt.description}
                  </p>

                  {evt.alarms && evt.alarms.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 flex items-center space-x-2 text-[11px] text-amber-400">
                      <Bell className="w-3.5 h-3.5 shrink-0" />
                      <span>{evt.alarms.length} Automated Alarms (-7d, -1d) configured</span>
                    </div>
                  )}

                  {grant && (
                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => onSelectGrant(grant)}
                        className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition"
                      >
                        <span>Open Proposal Package</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
