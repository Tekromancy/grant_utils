import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getAllMarkdownDocs, 
  getMarkdownDocById, 
  getDocsByCategory, 
  searchMarkdownDocs,
  splitFrontmatter,
  parseGrantMarkdown,
  serializeGrantMarkdown,
  setMarkdownDocs,
  clearMarkdownDocs
} from '../src/markdownUtils.js';
import type { MarkdownDoc } from '../src/types.js';

const MOCK_DOCS: MarkdownDoc[] = [
  {
    id: 'clean_energy_grant',
    fileName: 'clean_energy_grant.md',
    relativePath: 'data/grants/clean_energy_grant.md',
    title: 'Clean Energy Community Infrastructure',
    category: 'grant',
    excerpt: 'Solar microgrid and workforce training program.',
    content: '---\nid: clean_energy_grant\ntitle: Clean Energy Community Infrastructure\namount: 500000\n---\n# Clean Energy\nCommunity solar deployment.',
    lineCount: 10,
    wordCount: 50,
    frontmatter: { id: 'clean_energy_grant', amount: 500000 }
  },
  {
    id: 'sustainability_plan',
    fileName: 'sustainability_plan.md',
    relativePath: 'data/strategy/sustainability_plan.md',
    title: 'Organizational Sustainability Plan',
    category: 'strategy',
    excerpt: 'Multi-year financial diversification strategy.',
    content: '# Sustainability Plan\nDiversification blueprint.',
    lineCount: 15,
    wordCount: 80
  }
];

describe('markdownUtils', () => {
  beforeEach(() => {
    clearMarkdownDocs();
  });

  it('should return empty list by default when no markdown docs are loaded', () => {
    const docs = getAllMarkdownDocs();
    expect(docs.length).toBe(0);
  });

  it('should retrieve dynamically registered markdown documents', () => {
    setMarkdownDocs(MOCK_DOCS);
    const docs = getAllMarkdownDocs();
    expect(docs.length).toBe(2);
    expect(docs[0]).toHaveProperty('id');
    expect(docs[0]).toHaveProperty('title');
    expect(docs[0]).toHaveProperty('content');
  });

  it('should find documents by ID or relative path', () => {
    setMarkdownDocs(MOCK_DOCS);
    const doc = getMarkdownDocById('clean_energy_grant');
    expect(doc).toBeDefined();
    expect(doc?.title).toContain('Clean Energy');

    const byPath = getMarkdownDocById('data/grants/clean_energy_grant.md');
    expect(byPath).toBeDefined();
    expect(byPath?.id).toBe(doc?.id);
  });

  it('should filter documents by category', () => {
    setMarkdownDocs(MOCK_DOCS);
    const grants = getDocsByCategory('grant');
    expect(grants.length).toBe(1);
    expect(grants[0].category).toBe('grant');

    const strategy = getDocsByCategory('strategy');
    expect(strategy.length).toBe(1);
    expect(strategy[0].id).toBe('sustainability_plan');
  });

  it('should search documents accurately across title and content', () => {
    setMarkdownDocs(MOCK_DOCS);
    const results = searchMarkdownDocs('solar');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('clean_energy_grant');
  });

  describe('splitFrontmatter', () => {
    it('should split document with frontmatter correctly', () => {
      const doc = `---
id: test_doc
title: Test Title
amount: 50000
---

# Document Title
This is body text.`;

      const result = splitFrontmatter(doc);
      expect(result.frontmatter).toBe(`---
id: test_doc
title: Test Title
amount: 50000
---`);
      expect(result.body.trim()).toBe(`# Document Title\nThis is body text.`);
    });

    it('should handle document without frontmatter', () => {
      const doc = `# Document Without Frontmatter\nJust regular text here.`;
      const result = splitFrontmatter(doc);
      expect(result.frontmatter).toBeNull();
      expect(result.body).toBe(doc);
    });

    it('should handle empty or null content gracefully', () => {
      expect(splitFrontmatter('')).toEqual({ frontmatter: null, body: '' });
    });

    it('should handle document with internal horizontal rule without treating as frontmatter', () => {
      const doc = `# Title\n\nSome text\n\n---\n\nMore text below divider`;
      const result = splitFrontmatter(doc);
      expect(result.frontmatter).toBeNull();
      expect(result.body).toBe(doc);
    });
  });

  describe('parseGrantMarkdown and serializeGrantMarkdown', () => {
    it('should parse markdown frontmatter into typed object and body', () => {
      const doc = `---
id: usda_sdgg
title: "USDA SDGG"
amount: 175000
amountFormatted: "$175,000"
category: Federal
matchPercentage: 0
---

# Scope of Work
Detailed project description.`;

      const { metadata, content } = parseGrantMarkdown(doc);
      expect(metadata.id).toBe('usda_sdgg');
      expect(metadata.title).toBe('USDA SDGG');
      expect(metadata.amount).toBe(175000);
      expect(metadata.category).toBe('Federal');
      expect(content).toBe('# Scope of Work\nDetailed project description.');
    });

    it('should serialize metadata and markdown body into valid frontmatter markdown', () => {
      const meta = {
        id: 'city_coop_grant',
        title: 'City Cooperative Fund',
        amount: 50000
      };
      const content = '# Overview\nCity initiative funding.';

      const output = serializeGrantMarkdown(meta, content);
      expect(output).toContain('id: city_coop_grant');
      expect(output).toContain('title: City Cooperative Fund');
      expect(output).toContain('amount: 50000');
      expect(output).toContain('# Overview\nCity initiative funding.');

      // Roundtrip test
      const roundtrip = parseGrantMarkdown(output);
      expect(roundtrip.metadata.id).toBe('city_coop_grant');
      expect(roundtrip.metadata.amount).toBe(50000);
      expect(roundtrip.content).toBe('# Overview\nCity initiative funding.');
    });
  });
});
