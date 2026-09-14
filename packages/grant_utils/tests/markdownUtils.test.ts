import { describe, it, expect } from 'vitest';
import { 
  getAllMarkdownDocs, 
  getMarkdownDocById, 
  getDocsByCategory, 
  searchMarkdownDocs,
  splitFrontmatter,
  parseGrantMarkdown,
  serializeGrantMarkdown
} from '../src/markdownUtils.js';

describe('markdownUtils', () => {
  it('should retrieve all markdown documents', () => {
    const docs = getAllMarkdownDocs();
    expect(docs.length).toBeGreaterThan(20);
    expect(docs[0]).toHaveProperty('id');
    expect(docs[0]).toHaveProperty('title');
    expect(docs[0]).toHaveProperty('content');
  });

  it('should find documents by ID or relative path', () => {
    const doc = getMarkdownDocById('cchd_economic_development');
    expect(doc).toBeDefined();
    expect(doc?.title).toContain('Catholic Campaign for Human Development');

    const byPath = getMarkdownDocById('acbf/grants/cchd_economic_development.md');
    expect(byPath).toBeDefined();
    expect(byPath?.id).toBe(doc?.id);
  });

  it('should filter documents by category', () => {
    const grants = getDocsByCategory('grant');
    expect(grants.length).toBeGreaterThan(15);
    grants.forEach(g => expect(g.category).toBe('grant'));
  });

  it('should search documents accurately across title and content', () => {
    const results = searchMarkdownDocs('Catholic Campaign');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.id === 'cchd_economic_development')).toBe(true);
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
