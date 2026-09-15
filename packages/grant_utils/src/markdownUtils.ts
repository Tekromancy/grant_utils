import type { MarkdownDoc, GrantRecord } from './types.js';
import { MARKDOWN_DOCS } from './data/generatedDocs.js';
import * as yaml from 'js-yaml';

let customMarkdownDocs: MarkdownDoc[] | null = null;

export function setMarkdownDocs(docs: MarkdownDoc[]): void {
  customMarkdownDocs = [...docs];
}

export function addMarkdownDocs(docs: MarkdownDoc[]): void {
  if (!customMarkdownDocs) {
    customMarkdownDocs = [...MARKDOWN_DOCS, ...docs];
  } else {
    customMarkdownDocs.push(...docs);
  }
}

export function clearMarkdownDocs(): void {
  customMarkdownDocs = null;
}

export function getAllMarkdownDocs(dataset?: MarkdownDoc[]): MarkdownDoc[] {
  const source = dataset || customMarkdownDocs || MARKDOWN_DOCS;
  return [...source];
}

export function getMarkdownDocById(idOrPath: string, dataset?: MarkdownDoc[]): MarkdownDoc | undefined {
  const source = dataset || customMarkdownDocs || MARKDOWN_DOCS;
  const normalized = idOrPath.replace(/^\.?\/?(data\/)?/, '');
  const strippedPath = normalized.replace(/^(?:[a-zA-Z0-9_-]+)\//, '');
  return source.find(d => 
    d.id === idOrPath || 
    d.fileName === idOrPath || 
    d.relativePath === idOrPath ||
    d.relativePath.endsWith(idOrPath) ||
    d.relativePath.replace(/^data\//, '') === normalized ||
    d.relativePath.replace(/^data\/(?:[a-zA-Z0-9_-]+)\//, '') === strippedPath
  );
}

export function getDocsByCategory(category: string, dataset?: MarkdownDoc[]): MarkdownDoc[] {
  const source = dataset || customMarkdownDocs || MARKDOWN_DOCS;
  return source.filter(d => d.category === category);
}

export function searchMarkdownDocs(query: string, dataset?: MarkdownDoc[]): MarkdownDoc[] {
  const source = dataset || customMarkdownDocs || MARKDOWN_DOCS;
  if (!query || !query.trim()) return [...source];
  const q = query.toLowerCase();
  return source.filter(d => 
    d.title.toLowerCase().includes(q) ||
    d.fileName.toLowerCase().includes(q) ||
    d.content.toLowerCase().includes(q)
  );
}

/**
 * Safely separates YAML frontmatter from markdown body content,
 * ensuring metadata preservation during rich text or WYSIWYG editing.
 */
export function splitFrontmatter(content: string): { frontmatter: string | null; body: string } {
  if (!content || !content.startsWith('---')) {
    return { frontmatter: null, body: content || '' };
  }
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)?/);
  if (!match) return { frontmatter: null, body: content };
  return {
    frontmatter: match[0].trim(),
    body: content.slice(match[0].length)
  };
}

/**
 * Parses markdown proposal containing YAML frontmatter into typed metadata and body.
 */
export function parseGrantMarkdown(fileContent: string): { metadata: Partial<GrantRecord>; content: string } {
  const { frontmatter, body } = splitFrontmatter(fileContent);
  if (!frontmatter) {
    return { metadata: {}, content: fileContent };
  }
  const yamlText = frontmatter.replace(/^---\r?\n/, '').replace(/\r?\n---$/, '');
  const parsed = (yaml.load(yamlText) as Partial<GrantRecord>) || {};
  return { metadata: parsed, content: body.trim() };
}

/**
 * Serializes typed metadata and markdown body back into standard markdown with YAML frontmatter.
 */
export function serializeGrantMarkdown(metadata: Record<string, any>, content: string): string {
  const yamlText = yaml.dump(metadata, { lineWidth: -1 }).trim();
  const cleanBody = content.trim();
  return `---\n${yamlText}\n---\n\n${cleanBody}\n`;
}
