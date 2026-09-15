import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { 
  AuthTokenConfig, 
  GrantRecord, 
  CalendarEvent, 
  GrantOpportunity, 
  GrantFitAssessment, 
  RfpAnalysis, 
  GrantResearchDossierOptions 
} from './types.js';
import { parseGrantMarkdown, serializeGrantMarkdown } from './markdownUtils.js';
import { parseRawIcs } from './calendarUtils.js';
import { generateGrantResearchDossier, convertOpportunityToGrantRecord } from './grantResearchUtils.js';

export function getConfigDir(customDir?: string): string {
  if (customDir) return customDir;
  if (process.env.GRANTWRITING_CONFIG_DIR) return process.env.GRANTWRITING_CONFIG_DIR;
  const standardDir = path.join(os.homedir(), '.config', 'grantwriting');
  const legacyDir = path.join(os.homedir(), '.config', 'acbf-grants');
  if (!fs.existsSync(standardDir) && fs.existsSync(legacyDir)) {
    return legacyDir;
  }
  return standardDir;
}

export function getLocalAuthToken(customConfigDir?: string): AuthTokenConfig | null {
  try {
    const configDir = getConfigDir(customConfigDir);
    const authFile = path.join(configDir, 'auth.json');
    if (!fs.existsSync(authFile)) return null;
    const data = fs.readFileSync(authFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveLocalAuthToken(config: AuthTokenConfig, customConfigDir?: string): void {
  try {
    const configDir = getConfigDir(customConfigDir);
    const authFile = path.join(configDir, 'auth.json');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
    }
    fs.writeFileSync(authFile, JSON.stringify(config, null, 2), { mode: 0o600, encoding: 'utf8' });
  } catch (err: any) {
    throw new Error(`Failed to save auth token: ${err.message}`);
  }
}

export function clearLocalAuthToken(customConfigDir?: string): void {
  try {
    const configDir = getConfigDir(customConfigDir);
    const authFile = path.join(configDir, 'auth.json');
    if (fs.existsSync(authFile)) {
      fs.unlinkSync(authFile);
    }
  } catch {
    // Ignore error
  }
}

export function readLocalMarkdownFile(repoRootDir: string, relativePath: string): string {
  const fullPath = path.resolve(repoRootDir, relativePath);
  return fs.readFileSync(fullPath, 'utf8');
}

export function saveLocalMarkdownFile(repoRootDir: string, relativePath: string, content: string): void {
  const fullPath = path.resolve(repoRootDir, relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content, 'utf8');
}

/**
 * Loads and parses all markdown grant proposals from a given directory.
 */
export function loadGrantsFromDirectory(grantsDir: string, rootDir: string = grantsDir): GrantRecord[] {
  const records: GrantRecord[] = [];
  if (!fs.existsSync(grantsDir)) return records;

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(currentDir, ent.name);
      if (ent.isDirectory()) {
        walk(fullPath);
      } else if (ent.isFile() && ent.name.endsWith('.md')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const { metadata, content: body } = parseGrantMarkdown(content);
          if (metadata && (metadata.id || metadata.title)) {
            const relPath = path.relative(rootDir, fullPath);
            const amount = Number(metadata.amount) || 0;
            records.push({
              id: String(metadata.id || ent.name.replace(/\.md$/, '')),
              funder: String(metadata.funder || ''),
              program: String(metadata.program || metadata.title || ''),
              amount,
              amountFormatted: String(metadata.amountFormatted || `$${amount.toLocaleString('en-US')}`),
              deadline: String(metadata.deadline || 'Rolling'),
              deadlineFormatted: String(metadata.deadlineFormatted || metadata.deadline || 'Rolling'),
              tier: metadata.tier || 'Rolling',
              category: metadata.category || 'Private Foundation',
              matchPercentage: Number(metadata.matchPercentage) || 0,
              grantType: String(metadata.grantType || ''),
              portalUrl: String(metadata.portalUrl || ''),
              strategicPriority: String(metadata.strategicPriority || ''),
              status: String(metadata.status || 'Drafting'),
              fileName: ent.name,
              filePath: relPath,
              title: String(metadata.title || ent.name.replace(/\.md$/, '')),
              summary: body.slice(0, 300),
              content,
              wordCount: body.split(/\s+/).filter(Boolean).length
            });
          }
        } catch {
          // Ignore unparseable markdown files
        }
      }
    }
  }

  walk(grantsDir);
  return records;
}

/**
 * Loads and parses calendar events from an RFC 5545 .ics file.
 */
export function loadCalendarFromFile(calendarPath: string): CalendarEvent[] {
  if (!fs.existsSync(calendarPath)) return [];
  const ics = fs.readFileSync(calendarPath, 'utf8');
  return parseRawIcs(ics);
}

/**
 * Saves a researched grant opportunity dossier directly into the target project grants folder.
 */
export function saveGrantResearchDossier(
  rootDir: string,
  opportunity: GrantOpportunity,
  assessment?: GrantFitAssessment,
  rfpAnalysis?: RfpAnalysis,
  options?: GrantResearchDossierOptions
): string {
  const dossierContent = generateGrantResearchDossier(opportunity, assessment, rfpAnalysis, options);
  const cleanId = opportunity.id.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const relPath = path.join('data', 'grants', `${cleanId}.md`);
  saveLocalMarkdownFile(rootDir, relPath, dossierContent);
  return path.resolve(rootDir, relPath);
}

/**
 * Saves a GrantRecord as a markdown proposal with frontmatter.
 */
export function saveGrantRecordToFile(rootDir: string, grant: GrantRecord): string {
  const { content, ...meta } = grant;
  const serialized = serializeGrantMarkdown(meta, content || `# ${grant.title}\n\n${grant.summary}`);
  const relPath = grant.filePath || path.join('data', 'grants', grant.fileName);
  saveLocalMarkdownFile(rootDir, relPath, serialized);
  return path.resolve(rootDir, relPath);
}
