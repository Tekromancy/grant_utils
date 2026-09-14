'use client';

import React, { useState } from 'react';
import { 
  computeLineDiff, 
  formatUnifiedDiff, 
  type DiffResult, 
  type DiffLine 
} from '@tekromancy/grant_utils';
import { 
  Copy, 
  Check, 
  Split, 
  AlignJustify, 
  PlusCircle, 
  MinusCircle, 
  CheckCircle2 
} from 'lucide-react';

interface Props {
  originalContent: string;
  modifiedContent: string;
  fileName?: string;
}

export const VisualDiffViewer: React.FC<Props> = ({
  originalContent,
  modifiedContent,
  fileName = 'file.md'
}) => {
  const [viewMode, setViewMode] = useState<'unified' | 'split'>('unified');
  const [copied, setCopied] = useState(false);

  const diff: DiffResult = computeLineDiff(originalContent, modifiedContent);

  function handleCopyPatch() {
    const patch = formatUnifiedDiff(originalContent, modifiedContent, fileName, fileName);
    navigator.clipboard.writeText(patch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (diff.isIdentical) {
    return (
      <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-200">Files Are Identical</h4>
        <p className="text-xs text-slate-400">No local modifications detected against the repository version.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl text-xs font-mono">
      {/* Header Bar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-200">{fileName}</span>
          <div className="flex items-center space-x-1.5 text-[11px]">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-medium">
              <PlusCircle className="w-3 h-3 mr-1" />
              +{diff.additions}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60 font-medium">
              <MinusCircle className="w-3 h-3 mr-1" />
              -{diff.deletions}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px]">
            <button
              onClick={() => setViewMode('unified')}
              className={`px-2.5 py-1 rounded flex items-center space-x-1 transition ${
                viewMode === 'unified' 
                  ? 'bg-slate-800 text-white font-medium' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Unified diff list"
            >
              <AlignJustify className="w-3 h-3" />
              <span>Unified</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded flex items-center space-x-1 transition ${
                viewMode === 'split' 
                  ? 'bg-slate-800 text-white font-medium' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Side-by-side split comparison"
            >
              <Split className="w-3 h-3" />
              <span>Side-by-Side</span>
            </button>
          </div>

          <button
            onClick={handleCopyPatch}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center space-x-1 text-[11px] transition"
            title="Copy as Git patch"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            <span>{copied ? 'Copied!' : 'Copy Patch'}</span>
          </button>
        </div>
      </div>

      {/* Diff Table */}
      {viewMode === 'unified' ? (
        <div className="overflow-x-auto max-h-[540px] divide-y divide-slate-900/60">
          <table className="w-full border-collapse">
            <tbody>
              {diff.lines.map((line, idx) => {
                const isAdd = line.type === 'add';
                const isDel = line.type === 'delete';

                return (
                  <tr 
                    key={idx} 
                    className={`leading-5 ${
                      isAdd 
                        ? 'bg-emerald-950/30 text-emerald-200 border-l-2 border-emerald-500' 
                        : isDel 
                        ? 'bg-rose-950/30 text-rose-300 border-l-2 border-rose-500 line-through opacity-80' 
                        : 'hover:bg-slate-900/40 text-slate-300 border-l-2 border-transparent'
                    }`}
                  >
                    <td className="w-12 px-2 py-0.5 text-right text-slate-600 select-none border-r border-slate-900 shrink-0 text-[11px]">
                      {line.oldLineNumber || ''}
                    </td>
                    <td className="w-12 px-2 py-0.5 text-right text-slate-600 select-none border-r border-slate-900 shrink-0 text-[11px]">
                      {line.newLineNumber || ''}
                    </td>
                    <td className="w-6 px-1.5 py-0.5 text-center select-none font-bold shrink-0">
                      {isAdd ? '+' : isDel ? '-' : ' '}
                    </td>
                    <td className="px-3 py-0.5 whitespace-pre-wrap break-all select-text font-mono">
                      {line.content || '\u00A0'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Split view: Original Left vs Modified Right */
        <div className="grid grid-cols-2 divide-x divide-slate-800 max-h-[540px] overflow-y-auto">
          {/* Original Column */}
          <div className="overflow-x-auto bg-slate-950/80">
            <div className="sticky top-0 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
              Repository Original
            </div>
            <table className="w-full border-collapse">
              <tbody>
                {diff.lines.filter(l => l.type !== 'add').map((line, idx) => (
                  <tr 
                    key={idx} 
                    className={`leading-5 ${
                      line.type === 'delete' 
                        ? 'bg-rose-950/40 text-rose-300 line-through' 
                        : 'text-slate-300 hover:bg-slate-900/30'
                    }`}
                  >
                    <td className="w-10 px-2 py-0.5 text-right text-slate-600 select-none border-r border-slate-900 text-[11px]">
                      {line.oldLineNumber || ''}
                    </td>
                    <td className="px-3 py-0.5 whitespace-pre-wrap break-all font-mono">
                      {line.content || '\u00A0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modified Column */}
          <div className="overflow-x-auto bg-slate-950/80">
            <div className="sticky top-0 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 border-b border-slate-800">
              Local Modified
            </div>
            <table className="w-full border-collapse">
              <tbody>
                {diff.lines.filter(l => l.type !== 'delete').map((line, idx) => (
                  <tr 
                    key={idx} 
                    className={`leading-5 ${
                      line.type === 'add' 
                        ? 'bg-emerald-950/40 text-emerald-200' 
                        : 'text-slate-300 hover:bg-slate-900/30'
                    }`}
                  >
                    <td className="w-10 px-2 py-0.5 text-right text-slate-600 select-none border-r border-slate-900 text-[11px]">
                      {line.newLineNumber || ''}
                    </td>
                    <td className="px-3 py-0.5 whitespace-pre-wrap break-all font-mono">
                      {line.content || '\u00A0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
