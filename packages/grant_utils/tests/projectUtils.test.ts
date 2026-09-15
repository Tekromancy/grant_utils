import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getProjectConfig, 
  getAllProjects, 
  registerProject, 
  getDefaultProject,
  filterGrantsByProject,
  filterDocsByProject,
  getKPISummary,
  registerGrants,
  clearGrants,
  type ProjectConfig,
  type GrantRecord,
  type MarkdownDoc
} from '../src/index.js';

const MOCK_GRANTS: GrantRecord[] = [
  {
    id: 'grant_example_1',
    title: 'Example Project Grant',
    funder: 'Example Funder',
    program: 'Community Innovation',
    amount: 300000,
    amountFormatted: '$300,000',
    deadline: '2027-04-15',
    deadlineFormatted: 'April 15, 2027',
    tier: 'Tier 3 (Spring Major)',
    category: 'Regional Foundation',
    matchPercentage: 0,
    grantType: 'Project Grant',
    portalUrl: 'https://example.org',
    strategicPriority: 'Innovation',
    status: 'Drafting',
    fileName: 'grant_example_1.md',
    filePath: 'data/example/grants/grant_example_1.md',
    summary: 'Innovation summary.',
    content: '# Content',
    wordCount: 100
  },
  {
    id: 'grant_vamos_1',
    title: 'Community Grocery Expansion',
    funder: 'USDA CFP',
    program: 'Community Food Projects',
    amount: 250000,
    amountFormatted: '$250,000',
    deadline: '2026-11-30',
    deadlineFormatted: 'Nov 30, 2026',
    tier: 'Priority 1 (USDA Food Access)',
    category: 'Federal/USDA',
    matchPercentage: 0,
    grantType: 'Competitive Federal',
    portalUrl: 'https://grants.gov',
    strategicPriority: 'High',
    status: 'Planned',
    fileName: '01_usda_cfp.md',
    filePath: 'data/vamos/grants/01_usda_cfp.md',
    summary: 'Community food retail grant.',
    content: '# Narrative',
    wordCount: 500
  }
];

const MOCK_DOCS: MarkdownDoc[] = [
  {
    id: 'doc_example_1',
    fileName: 'doc_example_1.md',
    relativePath: 'data/example/doc_example_1.md',
    title: 'Example Strategy',
    category: 'strategy',
    excerpt: 'Example excerpt',
    content: '# Example Strategy',
    lineCount: 10,
    wordCount: 50
  },
  {
    id: 'doc_vamos_1',
    fileName: 'doc_vamos_1.md',
    relativePath: 'data/vamos/doc_vamos_1.md',
    title: 'Vamos Plan',
    category: 'strategy',
    excerpt: 'Vamos excerpt',
    content: '# Vamos Plan',
    lineCount: 12,
    wordCount: 60
  }
];

describe('projectUtils & multi-project architecture', () => {
  beforeEach(() => {
    clearGrants();
  });

  it('retrieves default Example project configuration', () => {
    const defaultProject = getDefaultProject();
    expect(defaultProject.id).toBe('example');
    expect(defaultProject.shortName).toBe('Example.org');
    expect(defaultProject.financialTargets?.targetYear).toBe(2027);
    expect(defaultProject.financialTargets?.bareMinimum).toBe(300000);
  });

  it('retrieves ACBF project configuration for backward compatibility', () => {
    const acbf = getProjectConfig('acbf');
    expect(acbf).toBeDefined();
    expect(acbf?.id).toBe('acbf');
    expect(acbf?.shortName).toBe('ACBF');
    expect(acbf?.dataDir).toBe('data/acbf');
  });

  it('retrieves Vamos project configuration', () => {
    const vamos = getProjectConfig('vamos');
    expect(vamos).toBeDefined();
    expect(vamos?.id).toBe('vamos');
    expect(vamos?.shortName).toBe('Vamos');
    expect(vamos?.dataDir).toBe('data/vamos');
    expect(vamos?.financialTargets?.targetYear).toBe(2026);
    expect(vamos?.financialTargets?.bareMinimum).toBe(250000);
  });

  it('allows registration of third-party organization project configs', () => {
    const customOrg: ProjectConfig = {
      id: 'worker-tech-coop',
      name: 'Worker Technology Cooperative',
      shortName: 'WTC',
      tagline: 'Open source software and worker solidarity',
      taxStatus: '501(c)(3)',
      dataDir: 'data/wtc',
      financialTargets: {
        targetYear: 2027,
        confirmedRevenue: 50000,
        bareMinimum: 200000,
        steadyState: 400000,
        stretch: 800000
      }
    };

    registerProject(customOrg);
    const retrieved = getProjectConfig('worker-tech-coop');
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('Worker Technology Cooperative');
    expect(getAllProjects().some(p => p.id === 'worker-tech-coop')).toBe(true);
  });

  it('calculates KPIs dynamically with registered project grants', () => {
    registerGrants(MOCK_GRANTS);
    const kpis = getKPISummary('example');
    expect(kpis.totalGrantsCount).toBe(1);
    expect(kpis.totalPipelineAmount).toBe(300000);
    expect(kpis.targetYear).toBe(2027);
    expect(kpis.bareMinimumTarget).toBe(300000);
    expect(kpis.steadyStateTarget).toBe(500000);
    expect(kpis.stretchTarget).toBe(700000);
  });

  it('calculates dynamic KPIs for custom project configuration passed directly', () => {
    const mockGrants = [MOCK_GRANTS[1]];
    const vamosKpi = getKPISummary('vamos', mockGrants);
    expect(vamosKpi.totalGrantsCount).toBe(1);
    expect(vamosKpi.totalPipelineAmount).toBe(250000);
    expect(vamosKpi.targetYear).toBe(2026);
    expect(vamosKpi.bareMinimumTarget).toBe(250000);
    expect(vamosKpi.categoryTotals['Federal/USDA']).toBe(250000);
  });

  it('filters markdown documents by project id', () => {
    const exampleDocs = filterDocsByProject(MOCK_DOCS, 'example');
    const vamosDocs = filterDocsByProject(MOCK_DOCS, 'vamos');

    expect(exampleDocs.length).toBe(1);
    expect(exampleDocs[0].id).toBe('doc_example_1');
    expect(vamosDocs.length).toBe(1);
    expect(vamosDocs[0].id).toBe('doc_vamos_1');
  });

  it('filters grants by project id', () => {
    const exampleGrants = filterGrantsByProject(MOCK_GRANTS, 'example');
    const vamosGrants = filterGrantsByProject(MOCK_GRANTS, 'vamos');

    expect(exampleGrants.length).toBe(1);
    expect(exampleGrants[0].id).toBe('grant_example_1');
    expect(vamosGrants.length).toBe(1);
    expect(vamosGrants[0].id).toBe('grant_vamos_1');
  });
});
