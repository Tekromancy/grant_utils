import { describe, it, expect } from 'vitest';
import { 
  parseIcsContent, 
  getKPISummary, 
  calculateMatchFunding, 
  calculateDaysRemaining,
  splitFrontmatter
} from '@tekromancy/grant_utils';

describe('sample-grant-hub verification', () => {
  it('correctly calculates match funding for a 50% match grant', () => {
    const match = calculateMatchFunding(300000, 50);
    expect(match.matchRequired).toBe(150000);
    expect(match.totalProjectBudget).toBe(450000);
  });

  it('parses calendar event dates and computes days remaining', () => {
    const days = calculateDaysRemaining('2026-11-30', '2026-11-20');
    expect(days).toBe(10);
  });

  it('splits frontmatter accurately', () => {
    const raw = `---\nid: test_grant\namount: 100000\n---\n# Title\nBody here`;
    const { frontmatter, body } = splitFrontmatter(raw);
    expect(frontmatter).toContain('amount: 100000');
    expect(body).toContain('# Title');
  });
});
