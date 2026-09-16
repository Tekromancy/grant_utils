import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  saveLocalMarkdownFile,
  readLocalMarkdownFile,
  loadGrantsFromDirectory,
  saveGrantRecordToFile,
  loadCalendarFromFile,
  saveLocalAuthToken,
  getLocalAuthToken,
  clearLocalAuthToken,
  type GrantRecord,
  type AuthTokenConfig
} from '../src/nodeFs.js';

describe('nodeFs (Filesystem & Node Utilities)', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'grant-utils-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  it('should write and read markdown files locally', () => {
    const relPath = 'docs/TestDoc.md';
    const content = '# Test Document\n\nContent here.';
    saveLocalMarkdownFile(tmpDir, relPath, content);

    const read = readLocalMarkdownFile(tmpDir, relPath);
    expect(read).toBe(content);
  });

  it('should save and load GrantRecord markdown proposals with frontmatter', () => {
    const grant: GrantRecord = {
      id: 'test_solar_expansion',
      funder: 'Clean Energy Trust',
      program: 'Solar Expansion Grant',
      amount: 150000,
      amountFormatted: '$150,000',
      deadline: '2026-11-30',
      deadlineFormatted: 'November 30, 2026',
      tier: 'Tier 1 (Fall Immediate)',
      category: 'Regional Foundation',
      matchPercentage: 20,
      grantType: 'Project Grant',
      portalUrl: 'https://cleanenergy.org',
      strategicPriority: 'Microgrids',
      status: 'Drafting',
      fileName: 'test_solar_expansion.md',
      filePath: 'grants/test_solar_expansion.md',
      title: 'Solar Expansion Grant',
      summary: 'Deployment of solar microgrid infrastructure.',
      content: '# Proposal Narrative\n\nFull scope.',
      wordCount: 120
    };

    saveGrantRecordToFile(tmpDir, grant);

    const loaded = loadGrantsFromDirectory(path.join(tmpDir, 'grants'), tmpDir);
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe('test_solar_expansion');
    expect(loaded[0].amount).toBe(150000);
    expect(loaded[0].funder).toBe('Clean Energy Trust');
  });

  it('should parse calendar events from .ics file', () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//EN
BEGIN:VEVENT
UID:evt-file-test@grant-utils
SUMMARY:[DEADLINE] Solar Microgrid LOI
DESCRIPTION:Submit LOI for solar expansion.\\ndata/grants/test_solar.md
DTSTART;VALUE=DATE:20261130
DTEND;VALUE=DATE:20261130
CATEGORIES:DEADLINE
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const icsPath = path.join(tmpDir, 'calendar.ics');
    fs.writeFileSync(icsPath, icsContent, 'utf8');

    const loadedEvents = loadCalendarFromFile(icsPath);
    expect(loadedEvents.length).toBe(1);
    expect(loadedEvents[0].uid).toBe('evt-file-test@grant-utils');
    expect(loadedEvents[0].startDate).toBe('2026-11-30');
    expect(loadedEvents[0].grantFile).toBe('test_solar.md');
  });

  it('should save, read, and clear local auth tokens with permissions', () => {
    const configDir = path.join(tmpDir, '.config', 'grantwriting');
    const authConfig: AuthTokenConfig = {
      provider: 'github',
      token: 'ghp_secret_token_1234567890',
      username: 'grantwriter',
      createdAt: '2026-09-16T00:00:00Z',
      isValid: true
    };

    saveLocalAuthToken(authConfig, configDir);
    const loaded = getLocalAuthToken(configDir);
    expect(loaded).toBeDefined();
    expect(loaded?.token).toBe('ghp_secret_token_1234567890');
    expect(loaded?.username).toBe('grantwriter');

    clearLocalAuthToken(configDir);
    const cleared = getLocalAuthToken(configDir);
    expect(cleared).toBeNull();
  });
});
