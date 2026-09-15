import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');
const dataDir = path.join(rootDir, 'data');
const calendarPath = path.join(rootDir, 'calendar.ics');

// 1. Parse calendar.ics
function parseIcs(icsContent) {
  const events = [];
  const lines = icsContent.split(/\r?\n/);
  let currentEvent = null;
  let currentAlarm = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    while (i + 1 < lines.length && /^[ \t]/.test(lines[i + 1])) {
      line += lines[i + 1].slice(1);
      i++;
    }

    if (line.startsWith('BEGIN:VEVENT')) {
      currentEvent = {
        uid: '',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        categories: [],
        status: 'CONFIRMED',
        alarms: []
      };
    } else if (line.startsWith('END:VEVENT')) {
      if (currentEvent) {
        events.push(currentEvent);
        currentEvent = null;
      }
    } else if (line.startsWith('BEGIN:VALARM')) {
      currentAlarm = { trigger: '', description: '' };
    } else if (line.startsWith('END:VALARM')) {
      if (currentEvent && currentAlarm) {
        currentEvent.alarms.push(currentAlarm);
        currentAlarm = null;
      }
    } else if (currentAlarm) {
      if (line.startsWith('TRIGGER:')) {
        currentAlarm.trigger = line.substring('TRIGGER:'.length).trim();
      } else if (line.startsWith('DESCRIPTION:')) {
        currentAlarm.description = line.substring('DESCRIPTION:'.length).replace(/\\n/g, '\n').replace(/\\,/g, ',').trim();
      }
    } else if (currentEvent) {
      if (line.startsWith('UID:')) {
        currentEvent.uid = line.substring('UID:'.length).trim();
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.title = line.substring('SUMMARY:'.length).replace(/\\n/g, '\n').replace(/\\,/g, ',').trim();
      } else if (line.startsWith('DESCRIPTION:')) {
        currentEvent.description = line.substring('DESCRIPTION:'.length).replace(/\\n/g, '\n').replace(/\\,/g, ',').trim();
      } else if (line.startsWith('LOCATION:')) {
        currentEvent.location = line.substring('LOCATION:'.length).replace(/\\,/g, ',').trim();
      } else if (line.startsWith('CATEGORIES:')) {
        currentEvent.categories = line.substring('CATEGORIES:'.length).split(',').map(c => c.trim());
      } else if (line.startsWith('STATUS:')) {
        currentEvent.status = line.substring('STATUS:'.length).trim();
      } else if (line.startsWith('DTSTART')) {
        const parts = line.split(':');
        const rawDate = parts[1]?.trim();
        if (rawDate) {
          currentEvent.startDate = rawDate.length === 8
            ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
            : rawDate;
        }
      } else if (line.startsWith('DTEND')) {
        const parts = line.split(':');
        const rawDate = parts[1]?.trim();
        if (rawDate) {
          currentEvent.endDate = rawDate.length === 8
            ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
            : rawDate;
        }
      }
    }
  }

  events.forEach(evt => {
    const desc = evt.description || '';
    const matchFile = desc.match(/(?:data\/)?(?:[a-zA-Z0-9_-]+\/)?grants\/([a-zA-Z0-9_-]+\.md)/);
    if (matchFile) {
      evt.grantFile = matchFile[1];
    }
    const matchAmt = desc.match(/\$([0-9,]+)/);
    if (matchAmt) {
      evt.amount = parseInt(matchAmt[1].replace(/,/g, ''), 10);
    }
  });

  return events;
}

// 2. Scan all markdown files in data/ and extract YAML frontmatter
function scanMarkdownDocs(targetDir) {
  const docs = [];

  function walk(dir, category) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(fullPath, ent.name === 'grants' ? 'grants' : ent.name);
      } else if (ent.isFile() && ent.name.endsWith('.md')) {
        const relativePath = path.relative(rootDir, fullPath);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        let frontmatter = null;
        let bodyContent = content;
        const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
        if (fmMatch) {
          try {
            frontmatter = yaml.load(fmMatch[1]);
            bodyContent = fmMatch[2];
          } catch (err) {
            console.warn(`[generateData] Warning: failed to parse YAML frontmatter in ${ent.name}:`, err.message);
          }
        }

        let title = (frontmatter && frontmatter.title) ? String(frontmatter.title) : ent.name.replace(/\.md$/, '');
        if (!frontmatter || !frontmatter.title) {
          const titleMatch = content.match(/^#\s+(.+)$/m);
          if (titleMatch) {
            title = titleMatch[1].trim();
          }
        }

        const lines = bodyContent.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('#') && !l.startsWith('---'));
        const excerpt = (lines[0] || '').slice(0, 200);

        let docCat = category;
        if (relativePath.includes('grants/')) docCat = 'grant';

        docs.push({
          id: (frontmatter && frontmatter.id) ? String(frontmatter.id) : ent.name.replace(/\.md$/, ''),
          fileName: ent.name,
          relativePath,
          title,
          category: docCat,
          excerpt,
          content,
          lineCount: content.split('\n').length,
          wordCount: content.split(/\s+/).filter(Boolean).length,
          frontmatter: frontmatter || undefined
        });
      }
    }
  }

  if (fs.existsSync(targetDir)) {
    walk(targetDir, 'general');
  }
  return docs;
}

// Main execution
if (!fs.existsSync(calendarPath) && !fs.existsSync(dataDir)) {
  console.log('[generateData] No root calendar.ics or data/ folder found. Preserving clean placeholder data files in src/data/.');
  process.exit(0);
}

console.log('Reading calendar.ics...');
const icsContent = fs.existsSync(calendarPath) ? fs.readFileSync(calendarPath, 'utf8') : '';
const calendarEvents = icsContent ? parseIcs(icsContent) : [];
console.log(`Parsed ${calendarEvents.length} calendar events.`);

console.log('Scanning markdown documents & parsing YAML frontmatter...');
const allDocs = scanMarkdownDocs(dataDir);
console.log(`Scanned ${allDocs.length} markdown documents.`);

const grantDocs = allDocs.filter(d => 
  d.relativePath.includes('grants/') && 
  d.frontmatter && 
  d.frontmatter.id
);

grantDocs.sort((a, b) => {
  const dateA = a.frontmatter.deadline || '9999-99-99';
  const dateB = b.frontmatter.deadline || '9999-99-99';
  if (dateA !== dateB) return dateA.localeCompare(dateB);
  return a.fileName.localeCompare(b.fileName);
});

const grantRecords = grantDocs.map(doc => {
  const fm = doc.frontmatter;
  const amount = Number(fm.amount) || 0;
  return {
    id: String(fm.id),
    funder: String(fm.funder || ''),
    program: String(fm.program || ''),
    amount,
    amountFormatted: String(fm.amountFormatted || `$${amount.toLocaleString('en-US')}`),
    deadline: String(fm.deadline || 'Rolling'),
    deadlineFormatted: String(fm.deadlineFormatted || fm.deadline || 'Rolling'),
    tier: fm.tier || 'Rolling',
    category: fm.category || 'Private Foundation',
    matchPercentage: Number(fm.matchPercentage) || 0,
    grantType: String(fm.grantType || ''),
    portalUrl: String(fm.portalUrl || ''),
    strategicPriority: String(fm.strategicPriority || ''),
    status: String(fm.status || 'Drafting'),
    fileName: doc.fileName,
    filePath: doc.relativePath,
    title: String(fm.title || doc.title),
    summary: doc.excerpt,
    content: doc.content,
    wordCount: doc.wordCount
  };
});

console.log(`Assembled ${grantRecords.length} grant records from markdown frontmatter.`);

const generatedDir = path.resolve(__dirname, '../src/data');
fs.mkdirSync(generatedDir, { recursive: true });

const calendarTs = `// Auto-generated by generateData.js - DO NOT EDIT MANUALLY
import type { CalendarEvent } from '../types.js';

export const CALENDAR_EVENTS: CalendarEvent[] = ${JSON.stringify(calendarEvents, null, 2)};
`;
fs.writeFileSync(path.join(generatedDir, 'generatedCalendar.ts'), calendarTs, 'utf8');

const grantsTs = `// Auto-generated by generateData.js - DO NOT EDIT MANUALLY
import type { GrantRecord } from '../types.js';

export const GRANTS_DATA: GrantRecord[] = ${JSON.stringify(grantRecords, null, 2)};

export const TOTAL_PIPELINE_AMOUNT = ${grantRecords.reduce((acc, g) => acc + g.amount, 0)};
export const TOTAL_GRANTS_COUNT = ${grantRecords.length};
`;
fs.writeFileSync(path.join(generatedDir, 'generatedGrants.ts'), grantsTs, 'utf8');

const docsTs = `// Auto-generated by generateData.js - DO NOT EDIT MANUALLY
import type { MarkdownDoc } from '../types.js';

export const MARKDOWN_DOCS: MarkdownDoc[] = ${JSON.stringify(allDocs, null, 2)};
`;
fs.writeFileSync(path.join(generatedDir, 'generatedDocs.ts'), docsTs, 'utf8');

console.log('Successfully generated data files in packages/grant_utils/src/data/');
