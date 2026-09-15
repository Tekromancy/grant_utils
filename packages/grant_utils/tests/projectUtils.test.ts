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
    id: 'grant_resilience_1',
    title: 'Clean Microgrid Solar Hub',
    funder: 'Apex Climate Foundation',
    program: 'Community Resiliency Challenge',
    amount: 250000,
    amountFormatted: '$250,000',
    deadline: '2026-11-30',
    deadlineFormatted: 'Nov 30, 2026',
    tier: 'Tier 1 (Fall Immediate)',
    category: 'Federal',
    matchPercentage: 0,
    grantType: 'Competitive Federal',
    portalUrl: 'https://grants.gov',
    strategicPriority: 'Clean Energy',
    status: 'Planned',
    fileName: '01_resilience_microgrid.md',
    filePath: 'data/resilience/grants/01_resilience_microgrid.md',
    summary: 'Decentralized clean microgrid grant.',
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
    id: 'doc_resilience_1',
    fileName: 'doc_resilience_1.md',
    relativePath: 'data/resilience/doc_resilience_1.md',
    title: 'Resilience Plan',
    category: 'strategy',
    excerpt: 'Resilience excerpt',
    content: '# Resilience Plan',
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
    expect(defaultProject.financialTargets?.steadyState).toBe(550000);
    expect(defaultProject.financialTargets?.stretch).toBe(850000);
  });

  it('retrieves Resilience project configuration', () => {
    const resilience = getProjectConfig('resilience');
    expect(resilience).toBeDefined();
    expect(resilience?.id).toBe('resilience');
    expect(resilience?.shortName).toBe('Resilience Hub');
    expect(resilience?.dataDir).toBe('data/resilience');
    expect(resilience?.financialTargets?.targetYear).toBe(2027);
    expect(resilience?.financialTargets?.bareMinimum).toBe(350000);
  });

  it('retrieves Health Equity project configuration', () => {
    const health = getProjectConfig('health-equity');
    expect(health).toBeDefined();
    expect(health?.id).toBe('health-equity');
    expect(health?.shortName).toBe('Health Equity');
    expect(health?.dataDir).toBe('data/health-equity');
    expect(health?.financialTargets?.targetYear).toBe(2026);
    expect(health?.financialTargets?.bareMinimum).toBe(250000);
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
    expect(kpis.steadyStateTarget).toBe(550000);
    expect(kpis.stretchTarget).toBe(850000);
  });

  it('calculates dynamic KPIs for custom project configuration passed directly', () => {
    const mockGrants = [MOCK_GRANTS[1]];
    const resilienceKpi = getKPISummary('resilience', mockGrants);
    expect(resilienceKpi.totalGrantsCount).toBe(1);
    expect(resilienceKpi.totalPipelineAmount).toBe(250000);
    expect(resilienceKpi.targetYear).toBe(2027);
    expect(resilienceKpi.bareMinimumTarget).toBe(350000);
    expect(resilienceKpi.categoryTotals['Federal']).toBe(250000);
  });

  it('filters markdown documents by project id', () => {
    const exampleDocs = filterDocsByProject(MOCK_DOCS, 'example');
    const resilienceDocs = filterDocsByProject(MOCK_DOCS, 'resilience');

    expect(exampleDocs.length).toBe(1);
    expect(exampleDocs[0].id).toBe('doc_example_1');
    expect(resilienceDocs.length).toBe(1);
    expect(resilienceDocs[0].id).toBe('doc_resilience_1');
  });

  it('filters grants by project id', () => {
    const exampleGrants = filterGrantsByProject(MOCK_GRANTS, 'example');
    const resilienceGrants = filterGrantsByProject(MOCK_GRANTS, 'resilience');

    expect(exampleGrants.length).toBe(1);
    expect(exampleGrants[0].id).toBe('grant_example_1');
    expect(resilienceGrants.length).toBe(1);
    expect(resilienceGrants[0].id).toBe('grant_resilience_1');
  });
});
