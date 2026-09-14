'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Table,
  Link2,
  Minus,
  Undo,
  Redo,
  Code,
  FileCode,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { splitFrontmatter } from '@tekromancy/grant_utils';

interface Props {
  content: string;
  onChange: (newContent: string) => void;
  fileName?: string;
}

export const WysiwygEditor: React.FC<Props> = ({ content, onChange, fileName }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef<string>('');
  const [showFrontmatter, setShowFrontmatter] = useState(false);
  const [frontmatterEditMode, setFrontmatterEditMode] = useState(false);

  // Initialize Turndown service once with GFM plugin
  const turndownService = useMemo(() => {
    const td = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '*'
    });
    td.use(gfm);
    return td;
  }, []);

  const { frontmatter, body } = splitFrontmatter(content);
  const [localFrontmatter, setLocalFrontmatter] = useState(frontmatter || '');

  useEffect(() => {
    setLocalFrontmatter(frontmatter || '');
  }, [frontmatter]);

  // Convert markdown body to HTML and sync with editor DOM only when content differs
  useEffect(() => {
    if (!editorRef.current) return;
    const initialHtml = marked.parse(body) as string;

    // Avoid overwriting innerHTML while the user is actively typing to prevent cursor reset
    if (editorRef.current.innerHTML !== initialHtml && lastHtmlRef.current !== initialHtml) {
      editorRef.current.innerHTML = initialHtml;
      lastHtmlRef.current = initialHtml;
    }
  }, [body]);

  // Handle user input in contentEditable area
  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastHtmlRef.current = html;

    try {
      const markdownBody = turndownService.turndown(html);
      const updatedFull = localFrontmatter
        ? `${localFrontmatter}\n\n${markdownBody.replace(/^\n+/, '')}`
        : markdownBody;
      onChange(updatedFull);
    } catch (err) {
      console.error('Error converting HTML to Markdown:', err);
    }
  };

  // Helper to execute formatting commands
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (typeof document === 'undefined') return;
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  // Format block elements (h1, h2, h3, p, blockquote)
  const formatBlock = (tag: string) => {
    executeCommand('formatBlock', tag);
  };

  // Insert a clean GFM table
  const insertTable = () => {
    const tableHtml = `
      <table class="my-4 border-collapse border border-slate-700 w-full text-left">
        <thead>
          <tr class="bg-slate-800/80">
            <th class="border border-slate-700 p-2 font-semibold">Header 1</th>
            <th class="border border-slate-700 p-2 font-semibold">Header 2</th>
            <th class="border border-slate-700 p-2 font-semibold">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-700 p-2">Cell 1</td>
            <td class="border border-slate-700 p-2">Cell 2</td>
            <td class="border border-slate-700 p-2">Cell 3</td>
          </tr>
          <tr>
            <td class="border border-slate-700 p-2">Cell 4</td>
            <td class="border border-slate-700 p-2">Cell 5</td>
            <td class="border border-slate-700 p-2">Cell 6</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  // Insert a code block
  const insertCodeBlock = () => {
    const codeBlockHtml = `
      <pre class="bg-slate-950 p-3 rounded-lg border border-slate-800 my-3 font-mono text-xs"><code>// Insert code or text here</code></pre>
      <p><br></p>
    `;
    executeCommand('insertHTML', codeBlockHtml);
  };

  // Insert task list item
  const insertTaskListItem = () => {
    const taskHtml = `
      <p>&#9744; Task item description</p>
    `;
    executeCommand('insertHTML', taskHtml);
  };

  // Insert link
  const insertLink = () => {
    const url = window.prompt('Enter hyperlink URL (e.g. https://...):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  // Handle frontmatter save
  const handleSaveFrontmatter = (newFm: string) => {
    setLocalFrontmatter(newFm);
    const updatedFull = newFm ? `${newFm}\n\n${body.replace(/^\n+/, '')}` : body;
    onChange(updatedFull);
    setFrontmatterEditMode(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
      {/* Frontmatter Metadata Pill / Collapsible Banner */}
      {frontmatter && (
        <div className="border-b border-slate-800 bg-slate-900/60 transition-colors">
          <div className="px-4 py-2 flex items-center justify-between text-xs">
            <button
              onClick={() => setShowFrontmatter(!showFrontmatter)}
              className="flex items-center space-x-2 text-slate-300 hover:text-white font-medium transition"
            >
              {showFrontmatter ? (
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">YAML Frontmatter Header</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  Preserved Single-Source
                </span>
              </div>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFrontmatterEditMode(!frontmatterEditMode)}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 border border-slate-700 transition"
              >
                {frontmatterEditMode ? 'Close Raw Editor' : 'Edit Metadata'}
              </button>
            </div>
          </div>

          {showFrontmatter && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/80">
              {frontmatterEditMode ? (
                <div className="space-y-2">
                  <textarea
                    value={localFrontmatter}
                    onChange={(e) => setLocalFrontmatter(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="---&#10;title: Example&#10;---"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSaveFrontmatter(localFrontmatter)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium"
                    >
                      Update Metadata
                    </button>
                  </div>
                </div>
              ) : (
                <pre className="text-xs font-mono text-emerald-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 overflow-x-auto whitespace-pre">
                  {localFrontmatter}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      {/* WYSIWYG Rich-Text Formatting Toolbar */}
      <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center gap-1 text-xs select-none sticky top-0 z-10">
        {/* Headings & Block Formats */}
        <div className="flex items-center space-x-1 border-r border-slate-800 pr-2 mr-1">
          <select
            onChange={(e) => {
              if (e.target.value) formatBlock(e.target.value);
            }}
            defaultValue="p"
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            title="Text Style"
          >
            <option value="p">Normal Text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="blockquote">Quote Block</option>
          </select>
        </div>

        {/* Inline Formatting */}
        <div className="flex items-center space-x-0.5 border-r border-slate-800 pr-2 mr-1">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('strikeThrough')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Headings */}
        <div className="flex items-center space-x-0.5 border-r border-slate-800 pr-2 mr-1">
          <button
            type="button"
            onClick={() => formatBlock('h1')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => formatBlock('h2')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => formatBlock('h3')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center space-x-0.5 border-r border-slate-800 pr-2 mr-1">
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Bulleted List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => formatBlock('blockquote')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Structured Elements: Tables, Code, Links */}
        <div className="flex items-center space-x-0.5 border-r border-slate-800 pr-2 mr-1">
          <button
            type="button"
            onClick={insertTable}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Insert GFM Table"
          >
            <Table className="w-3.5 h-3.5 text-cyan-400" />
          </button>
          <button
            type="button"
            onClick={insertCodeBlock}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Insert Fenced Code Block"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
          </button>
          <button
            type="button"
            onClick={insertTaskListItem}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Insert Task List Item"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          </button>
          <button
            type="button"
            onClick={insertLink}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Insert Hyperlink"
          >
            <Link2 className="w-3.5 h-3.5 text-blue-400" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertHorizontalRule')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Insert Horizontal Divider"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center space-x-0.5 ml-auto">
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Redo (Ctrl+Shift+Z / Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* WYSIWYG Editable Canvas */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="wysiwyg-content min-h-[500px] outline-none text-slate-100 font-sans leading-relaxed focus:ring-0"
          data-placeholder="Start typing rich-text content here..."
        />
      </div>
    </div>
  );
};
