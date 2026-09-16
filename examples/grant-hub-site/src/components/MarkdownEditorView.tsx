'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Save, 
  Download, 
  RotateCcw, 
  GitPullRequest, 
  Check, 
  Eye, 
  Code,
  Folder,
  GitCompare,
  PenTool
} from 'lucide-react';
import { getAllMarkdownDocs, splitFrontmatter, sanitizeHtml, type MarkdownDoc } from '@tekromancy/grant_utils';
import { marked } from 'marked';
import { VisualDiffViewer } from './VisualDiffViewer';
import { WysiwygEditor } from './WysiwygEditor';

interface Props {
  initialFile?: string;
  editedFiles: Record<string, string>;
  onSaveFile: (relativePath: string, content: string) => void;
  onRevertFile: (relativePath: string) => void;
  onCreatePRForFile: (doc: MarkdownDoc, content: string) => void;
}

export const MarkdownEditorView: React.FC<Props> = ({
  initialFile,
  editedFiles,
  onSaveFile,
  onRevertFile,
  onCreatePRForFile
}) => {
  const docs = getAllMarkdownDocs();
  const [selectedDocId, setSelectedDocId] = useState<string>(
    initialFile ? (docs.find(d => d.fileName === initialFile || d.relativePath === initialFile)?.id || docs[0]?.id || '') : (docs[0]?.id || '')
  );
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'wysiwyg' | 'edit' | 'preview' | 'diff'>('wysiwyg');
  const [editorContent, setEditorContent] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentDoc = docs.find(d => d.id === selectedDocId) || docs[0];

  useEffect(() => {
    if (initialFile) {
      const match = docs.find(d => d.fileName === initialFile || d.relativePath === initialFile);
      if (match) {
        setSelectedDocId(match.id);
      }
    }
  }, [initialFile, docs]);

  useEffect(() => {
    if (currentDoc) {
      // Check if there is a saved local edit in props
      const localEdit = editedFiles[currentDoc.relativePath];
      setEditorContent(localEdit !== undefined ? localEdit : currentDoc.content);
    }
  }, [currentDoc, editedFiles]);

  const isModified = currentDoc && (editorContent !== currentDoc.content);

  const { frontmatter: previewFrontmatter, body: previewBody } = React.useMemo(() => {
    return splitFrontmatter(editorContent);
  }, [editorContent]);

  const previewHtml = React.useMemo(() => {
    try {
      return marked.parse(previewBody) as string;
    } catch {
      return previewBody;
    }
  }, [previewBody]);

  function handleSave() {
    if (!currentDoc) return;
    onSaveFile(currentDoc.relativePath, editorContent);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  }

  function handleDownload() {
    if (!currentDoc) return;
    const blob = new Blob([editorContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentDoc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleRevert() {
    if (!currentDoc) return;
    if (confirm(`Revert ${currentDoc.fileName} back to original repository version?`)) {
      onRevertFile(currentDoc.relativePath);
      setEditorContent(currentDoc.content);
    }
  }

  const filteredDocs = docs.filter(d => 
    d.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
    d.fileName.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
    d.relativePath.toLowerCase().includes(searchDocQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[780px]">
        {/* Document Directory Sidebar */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/60 flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-white font-bold text-sm mb-3">
              <Folder className="w-4 h-4 text-emerald-400" />
              <span>Example.org Document Vault</span>
              <span className="text-xs font-normal text-slate-400">({docs.length} files)</span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchDocQuery}
                onChange={(e) => setSearchDocQuery(e.target.value)}
                placeholder="Filter documents..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Document List */}
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {filteredDocs.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              const hasEdits = editedFiles[doc.relativePath] !== undefined;

              let catColor = 'text-slate-400';
              if (doc.category === 'grant') catColor = 'text-emerald-400';
              else if (doc.category === 'strategy') catColor = 'text-yellow-400';
              else if (doc.category === 'research') catColor = 'text-cyan-400';
              else if (doc.category === 'governance') catColor = 'text-purple-400';

              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex flex-col space-y-1 transition ${
                    isSelected 
                      ? 'bg-emerald-950/80 border border-emerald-700/60 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold truncate max-w-[190px]">{doc.title || doc.fileName}</span>
                    {hasEdits && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Locally modified" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-[10px]">
                    <span className={`font-mono ${catColor}`}>[{doc.category}]</span>
                    <span className="text-slate-500 truncate">{doc.fileName}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Editor Workspace */}
        <div className="flex-1 flex flex-col bg-slate-900">
          {/* Workspace Header & Actions */}
          <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base tracking-tight">{currentDoc?.title}</h3>
                {isModified && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-medium">
                    Unsaved Edits
                  </span>
                )}
                {editedFiles[currentDoc?.relativePath || ''] !== undefined && !isModified && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
                    Saved Locally
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">{currentDoc?.relativePath}</p>
            </div>

            {/* Editor Action Buttons */}
            <div className="flex items-center space-x-2 text-xs">
              {/* Toggle Mode */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  onClick={() => setActiveTab('wysiwyg')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium transition ${
                    activeTab === 'wysiwyg' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>WYSIWYG</span>
                </button>
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium transition ${
                    activeTab === 'edit' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Raw MD</span>
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium transition ${
                    activeTab === 'preview' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium transition ${
                    activeTab === 'diff' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Visual Diff</span>
                </button>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'Saved!' : 'Save Locally'}</span>
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Download Modified File"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Revert Button */}
              {editedFiles[currentDoc?.relativePath || ''] !== undefined && (
                <button
                  onClick={handleRevert}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-700 transition"
                  title="Revert to Original"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              {/* Create PR Button */}
              <button
                onClick={() => {
                  if (currentDoc) onCreatePRForFile(currentDoc, editorContent);
                }}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>Pull Request</span>
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex-1 p-4 flex flex-col">
            {activeTab === 'wysiwyg' ? (
              <WysiwygEditor
                content={editorContent}
                onChange={setEditorContent}
                fileName={currentDoc?.fileName}
              />
            ) : activeTab === 'edit' ? (
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="w-full flex-1 bg-slate-950 text-slate-100 font-mono text-sm p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed selection:bg-emerald-600"
                placeholder="Type markdown content here..."
                spellCheck={false}
              />
            ) : activeTab === 'preview' ? (
              <div className="w-full flex-1 bg-slate-950 p-6 md:p-8 rounded-xl border border-slate-800 overflow-y-auto">
                {previewFrontmatter && (
                  <div className="mb-6 p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre">
                    {previewFrontmatter}
                  </div>
                )}
                <div 
                  className="markdown-preview"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(previewHtml) }}
                />
              </div>
            ) : (
              <div className="w-full flex-1 overflow-y-auto">
                <VisualDiffViewer
                  originalContent={currentDoc?.content || ''}
                  modifiedContent={editorContent}
                  fileName={currentDoc?.fileName}
                />
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="px-6 py-2 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Lines: {editorContent.split('\n').length}</span>
              <span>Words: {editorContent.split(/\s+/).filter(Boolean).length}</span>
              <span>Chars: {editorContent.length}</span>
            </div>
            <div>
              <span>Offline Ready • Local Storage Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
