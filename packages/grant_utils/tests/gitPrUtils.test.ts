import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  createGitHubPullRequest, 
  createGitLabMergeRequest, 
  createForgejoPullRequest,
  suggestBranchName,
  generateBranchName,
  generatePrTitle,
  generatePrTemplate
} from '../src/gitPrUtils.js';

describe('gitPrUtils', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('createGitHubPullRequest', () => {
    it('should fail if token is missing', async () => {
      const res = await createGitHubPullRequest({
        provider: 'github',
        token: '',
        owner: 'ACBF',
        repo: 'grantwriting',
        branchName: 'test-branch',
        title: 'Test PR',
        body: 'Body',
        files: [{ path: 'test.md', content: 'hello' }]
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain('token is required');
    });

    it('should complete GitHub pull request flow when API returns success', async () => {
      globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
        if (url.includes('/git/ref/heads/main')) {
          return { ok: true, json: async () => ({ object: { sha: 'base-sha-123' } }) } as Response;
        }
        if (url.includes('/git/refs')) {
          return { ok: true, json: async () => ({ ref: 'refs/heads/test-branch' }) } as Response;
        }
        if (url.includes('/contents/')) {
          return { ok: true, json: async () => ({ content: { sha: 'file-sha' } }) } as Response;
        }
        if (url.endsWith('/pulls')) {
          return { ok: true, json: async () => ({ html_url: 'https://github.com/ACBF/grantwriting/pull/1', number: 1 }) } as Response;
        }
        return { ok: false, statusText: 'Not Found' } as Response;
      });

      const res = await createGitHubPullRequest({
        provider: 'github',
        token: 'ghp_valid_token',
        owner: 'ACBF',
        repo: 'grantwriting',
        branchName: 'test-branch',
        title: 'Test PR',
        body: 'Body',
        files: [{ path: 'test.md', content: 'hello world' }]
      });

      expect(res.success).toBe(true);
      expect(res.url).toBe('https://github.com/ACBF/grantwriting/pull/1');
      expect(res.number).toBe(1);
    });
  });

  describe('createForgejoPullRequest', () => {
    it('should complete Forgejo / Codeberg PR flow when API returns success', async () => {
      globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
        if (url.includes('/branches')) {
          return { ok: true, json: async () => ({ name: 'test-branch' }) } as Response;
        }
        if (url.includes('/contents/')) {
          return { ok: true, json: async () => ({ content: { sha: 'file-sha' } }) } as Response;
        }
        if (url.endsWith('/pulls')) {
          return { 
            ok: true, 
            json: async () => ({ html_url: 'https://codeberg.org/ACBF/grantwriting/pulls/1', number: 1 }) 
          } as Response;
        }
        return { ok: false, statusText: 'Not Found' } as Response;
      });

      const res = await createForgejoPullRequest({
        provider: 'codeberg',
        instanceUrl: 'https://codeberg.org',
        token: 'codeberg_valid_token',
        owner: 'AustinCooperativeBusinessFoundation',
        repo: 'grantwriting',
        branchName: 'test-branch',
        title: 'Test Codeberg PR',
        body: 'Body text',
        files: [{ path: 'acbf/CallToAction.md', content: '# Updated Action Plan' }]
      });

      expect(res.success).toBe(true);
      expect(res.url).toBe('https://codeberg.org/ACBF/grantwriting/pulls/1');
    });
  });

  describe('branch naming and PR templates', () => {
    it('should generate clean branch names from paths or titles', () => {
      const b1 = suggestBranchName('data/grants/01_coop_revolving_loan_fund.md', 'dev');
      expect(b1).toBe('grants/01-coop-revolving-loan-fund-dev');

      const b2 = generateBranchName('USDA Rural Business Development', 'budget-update');
      expect(b2).toBe('grants/usda-rural-business-developmen-budget-update');
    });

    it('should format PR titles and markdown templates', () => {
      const title = generatePrTitle('USDA RBDG 2027', 'update');
      expect(title).toBe('docs(grants): update proposal for USDA RBDG 2027');

      const pr = generatePrTemplate({
        grantTitle: 'USDA RBDG 2027',
        summary: 'Updated personnel budget and match sources.',
        author: 'Grants Team <grants@example.coop>',
        changes: ['Adjusted salary rates', 'Added letters of support']
      });

      expect(pr.title).toBe('docs(grants): update proposal for USDA RBDG 2027');
      expect(pr.body).toContain('## 📝 Grant Proposal Update: USDA RBDG 2027');
      expect(pr.body).toContain('Adjusted salary rates');
      expect(pr.body).toContain('grants@example.coop');
      expect(pr.toString()).toBe(pr.body);
    });
  });
});
