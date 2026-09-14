import type { MarkdownDoc, GrantRecord } from './types.js';
import { MARKDOWN_DOCS } from './data/generatedDocs.js';
import * as yaml from 'js-yaml';

export function getAllMarkdownDocs(): MarkdownDoc[] {
  return [...MARKDOWN_DOCS];
}

export function getMarkdownDocById(idOrPath: string): MarkdownDoc | undefined {
  const normalized = idOrPath.replace(/^\.?\/?(data\/)?/, '');
  return MARKDOWN_DOCS.find(d => 
    d.id === idOrPath || 
    d.fileName === idOrPath || 
    d.relativePath === idOrPath ||
    d.relativePath.endsWith(idOrPath) ||
    d.relativePath.replace(/^data\//, '') === normalized
  );
}

export function getDocsByCategory(category: string): MarkdownDoc[] {
  return MARKDOWN_DOCS.filter(d => d.category === category);
}

export function searchMarkdownDocs(query: string): MarkdownDoc[] {
  if (!query || !query.trim()) return getAllMarkdownDocs();
  const q = query.toLowerCase();
  return MARKDOWN_DOCS.filter(d => 
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
