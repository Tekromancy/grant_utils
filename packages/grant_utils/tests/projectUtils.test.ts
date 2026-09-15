import { describe, it, expect } from 'vitest';
import { 
  getProjectConfig, 
  getAllProjects, 
  registerProject, 
  getDefaultProject,
  filterGrantsByProject,
  filterDocsByProject,
  getKPISummary,
  getAllGrants,
  getAllMarkdownDocs,
  type ProjectConfig
} from '../src/index.js';

describe('projectUtils & multi-project architecture', () => {
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

  it('calculates KPIs dynamically for Example default', () => {
    const kpis = getKPISummary('example');
    expect(kpis.totalGrantsCount).toBe(27);
    expect(kpis.totalPipelineAmount).toBe(3990000);
    expect(kpis.targetYear).toBe(2027);
    expect(kpis.bareMinimumTarget).toBe(300000);
    expect(kpis.steadyStateTarget).toBe(500000);
    expect(kpis.stretchTarget).toBe(700000);
  });

  it('calculates dynamic KPIs for custom project configuration', () => {
    const mockGrants = [
      {
        id: 'grant_1',
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

    const vamosKpi = getKPISummary('vamos', mockGrants);
    expect(vamosKpi.totalGrantsCount).toBe(1);
    expect(vamosKpi.totalPipelineAmount).toBe(250000);
    expect(vamosKpi.targetYear).toBe(2026);
    expect(vamosKpi.bareMinimumTarget).toBe(250000);
    expect(vamosKpi.categoryTotals['Federal/USDA']).toBe(250000);
  });

  it('filters markdown documents by project id', () => {
    const allDocs = getAllMarkdownDocs();
    const exampleDocs = filterDocsByProject(allDocs, 'example');
    const acbfDocs = filterDocsByProject(allDocs, 'acbf');
    const vamosDocs = filterDocsByProject(allDocs, 'vamos');

    expect(allDocs.length).toBe(60);
    expect(exampleDocs.length).toBe(37);
    expect(acbfDocs.length).toBe(37);
    expect(vamosDocs.length).toBe(23);
  });

  it('calculates full Vamos pipeline KPIs with 13 grants', () => {
    const vamosKpis = getKPISummary('vamos');
    expect(vamosKpis.totalGrantsCount).toBe(13);
    expect(vamosKpis.totalPipelineAmount).toBe(3000000);
    expect(vamosKpis.targetYear).toBe(2026);
    expect(vamosKpis.bareMinimumTarget).toBe(250000);
    expect(vamosKpis.steadyStateTarget).toBe(600000);
    expect(vamosKpis.stretchTarget).toBe(1200000);
  });
});
