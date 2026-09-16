import type { ProjectConfig, GrantRecord, MarkdownDoc } from './types.js';

export const EXAMPLE_PROJECT_CONFIG: ProjectConfig = {
  id: 'example',
  name: 'Example Community Foundation',
  shortName: 'Example.org',
  tagline: 'Sample 501(c)(3) Institutional Grantwriting, RFC 5545 Calendar & Git PR Platform',
  taxStatus: '501(c)(3)',
  dataDir: 'data',
  grantsSubdir: 'grants',
  calendarPath: 'calendar.ics',
  financialTargets: {
    targetYear: 2027,
    confirmedRevenue: 75000,
    bareMinimum: 300000,
    steadyState: 550000,
    stretch: 850000
  },
  categories: [
    'Federal',
    'Regional Foundation',
    'National Foundation',
    'Municipal',
    'Corporate Giving',
    'Community Foundation'
  ],
  tiers: [
    'Tier 1 (Fall Immediate)',
    'Tier 2 (Winter Core)',
    'Tier 3 (Spring Major)',
    'Tier 4 (Summer Major)',
    'Tier 4 (Summer Federal)',
    'Rolling'
  ],
  gitConfig: {
    owner: 'ExampleOrg',
    repo: 'grant-hub',
    defaultBranch: 'main',
    provider: 'github'
  }
};

export const RESILIENCE_PROJECT_CONFIG: ProjectConfig = {
  id: 'resilience',
  name: 'Community Resilience & Clean Energy Hub',
  shortName: 'Resilience Hub',
  tagline: 'Decentralized clean microgrids, workforce development, and climate adaptation',
  taxStatus: '501(c)(3)',
  dataDir: 'data/resilience',
  grantsSubdir: 'grants',
  calendarPath: 'calendar.ics',
  financialTargets: {
    targetYear: 2027,
    confirmedRevenue: 100000,
    bareMinimum: 350000,
    steadyState: 600000,
    stretch: 1000000
  },
  categories: [
    'Federal',
    'Regional Foundation',
    'National Foundation',
    'Municipal',
    'Corporate Giving',
    'Community Foundation'
  ],
  tiers: [
    'Tier 1 (Fall Immediate)',
    'Tier 2 (Winter Core)',
    'Tier 3 (Spring Major)',
    'Tier 4 (Summer Major)',
    'Tier 4 (Summer Federal)',
    'Rolling'
  ],
  gitConfig: {
    owner: 'CommunityResilienceHub',
    repo: 'grants-workspace',
    defaultBranch: 'main',
    provider: 'github'
  }
};

export const HEALTH_EQUITY_PROJECT_CONFIG: ProjectConfig = {
  id: 'health-equity',
  name: 'Community Health & Food Equity Alliance',
  shortName: 'Health Equity',
  tagline: 'Preventive healthcare, fresh food retail access, and health equity outreach',
  taxStatus: '501(c)(3)',
  dataDir: 'data/health-equity',
  grantsSubdir: 'grants',
  calendarPath: 'calendar.ics',
  financialTargets: {
    targetYear: 2026,
    confirmedRevenue: 80000,
    bareMinimum: 250000,
    steadyState: 500000,
    stretch: 900000
  },
  categories: [
    'Federal',
    'State Government',
    'Municipal',
    'Health & Equity Foundation',
    'Corporate Giving'
  ],
  tiers: [
    'Tier 1 (Immediate)',
    'Tier 2 (Core)',
    'Tier 3 (Major Spring)',
    'Tier 4 (Summer Federal)',
    'Rolling'
  ],
  gitConfig: {
    owner: 'HealthEquityAlliance',
    repo: 'funding-pipeline',
    defaultBranch: 'main',
    provider: 'github'
  }
};

const PROJECT_REGISTRY = new Map<string, ProjectConfig>([
  ['example', EXAMPLE_PROJECT_CONFIG],
  ['resilience', RESILIENCE_PROJECT_CONFIG],
  ['health-equity', HEALTH_EQUITY_PROJECT_CONFIG]
]);

export function registerProject(config: ProjectConfig): void {
  PROJECT_REGISTRY.set(config.id, config);
}

export function getProjectConfig(id: string): ProjectConfig | undefined {
  return PROJECT_REGISTRY.get(id);
}

export function getAllProjects(): ProjectConfig[] {
  return Array.from(PROJECT_REGISTRY.values());
}

export function getDefaultProject(): ProjectConfig {
  return EXAMPLE_PROJECT_CONFIG;
}

export function filterGrantsByProject(grants: GrantRecord[], projectId: string): GrantRecord[] {
  const normalized = projectId.toLowerCase();
  return grants.filter(g => {
    if (g.projectId) {
      return g.projectId.toLowerCase() === normalized;
    }
    const p = g.filePath.toLowerCase();
    if (normalized === 'example') {
      return p.includes('/example/') || p.startsWith('example/') || !p.includes('/');
    }
    return p.includes(`/${normalized}/`) || p.startsWith(`${normalized}/`);
  });
}

export function filterDocsByProject(docs: MarkdownDoc[], projectId: string): MarkdownDoc[] {
  const normalized = projectId.toLowerCase();
  return docs.filter(d => {
    const p = d.relativePath.toLowerCase();
    if (normalized === 'example') {
      return p.includes('/example/') || p.startsWith('example/') || !p.includes('/');
    }
    return p.includes(`/${normalized}/`) || p.startsWith(`${normalized}/`);
  });
}
