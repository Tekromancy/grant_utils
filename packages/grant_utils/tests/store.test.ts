import { describe, it, expect } from 'vitest';
import { createGrantStore, type GrantRecord, type CalendarEvent, type MarkdownDoc } from '../src/index.js';

const TEST_GRANTS: GrantRecord[] = [
  {
    id: 'store_grant_1',
    funder: 'Community Foundation',
    program: 'Urban Green Initiatives',
    amount: 120000,
    amountFormatted: '$120,000',
    deadline: '2026-11-15',
    deadlineFormatted: 'November 15, 2026',
    tier: 'Tier 1 (Fall Immediate)',
    category: 'Regional Foundation',
    matchPercentage: 0,
    grantType: 'Project Grant',
    portalUrl: 'https://example.org',
    strategicPriority: 'Sustainability',
    status: 'Drafting',
    fileName: 'store_grant_1.md',
    filePath: 'data/grants/store_grant_1.md',
    title: 'Urban Green Initiatives',
    summary: 'Community tree planting and urban agriculture.',
    content: '# Urban Green Initiatives',
    wordCount: 150
  }
];

const TEST_EVENTS: CalendarEvent[] = [
  {
    uid: 'store-evt-1',
    title: 'Urban Green Final Submission',
    description: 'Final submission deadline',
    startDate: '2026-11-15',
    endDate: '2026-11-15',
    location: 'Portal',
    categories: ['DEADLINE'],
    status: 'CONFIRMED',
    alarms: []
  }
];

describe('GrantStore (Isolated Store Architecture)', () => {
  it('should initialize empty store without polluting globals', () => {
    const store = createGrantStore();
    expect(store.getAllGrants().length).toBe(0);
    expect(store.getCalendarEvents().length).toBe(0);
    expect(store.getAllMarkdownDocs().length).toBe(0);
  });

  it('should initialize with provided data and allow independent mutations', () => {
    const store1 = createGrantStore({ grants: TEST_GRANTS, events: TEST_EVENTS });
    const store2 = createGrantStore();

    expect(store1.getAllGrants().length).toBe(1);
    expect(store1.getGrantById('store_grant_1')?.amount).toBe(120000);
    expect(store1.getCalendarEvents().length).toBe(1);

    // Store 2 remains completely isolated
    expect(store2.getAllGrants().length).toBe(0);
    expect(store2.getCalendarEvents().length).toBe(0);

    // Mutations in store 1 do not affect store 2
    store1.clearGrants();
    expect(store1.getAllGrants().length).toBe(0);
  });

  it('should compute KPI summary from store-managed grants', () => {
    const store = createGrantStore({ grants: TEST_GRANTS });
    const kpis = store.getKPISummary();
    expect(kpis.totalPipelineAmount).toBe(120000);
    expect(kpis.totalGrantsCount).toBe(1);
    expect(kpis.categoryTotals['Regional Foundation']).toBe(120000);
  });

  it('should manage markdown documents in store', () => {
    const doc: MarkdownDoc = {
      id: 'doc-1',
      fileName: 'Strategy.md',
      relativePath: 'docs/Strategy.md',
      title: 'Funding Strategy',
      category: 'Strategic',
      excerpt: 'Executive overview',
      content: '# Strategic Overview',
      lineCount: 10,
      wordCount: 50
    };

    const store = createGrantStore({ docs: [doc] });
    expect(store.getAllMarkdownDocs().length).toBe(1);
    expect(store.getMarkdownDocById('Strategy.md')).toBeDefined();
    expect(store.searchMarkdownDocs('Strategic').length).toBe(1);
  });
});
