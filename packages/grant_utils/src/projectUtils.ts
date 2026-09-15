import type { ProjectConfig, GrantRecord, MarkdownDoc } from './types.js';

export const EXAMPLE_PROJECT_CONFIG: ProjectConfig = {
  id: 'example',
  name: 'Example Foundation',
  shortName: 'Example.org',
  tagline: 'Sample 501(c)(3) Institutional Grantwriting, RFC 5545 Calendar & Git PR Platform',
  taxStatus: '501(c)(3)',
  dataDir: 'data',
  grantsSubdir: 'grants',
  calendarPath: 'calendar.ics',
  financialTargets: {
    targetYear: 2027,
    confirmedRevenue: 65000,
    bareMinimum: 300000,
    steadyState: 500000,
    stretch: 700000
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
    repo: 'grantwriting',
    defaultBranch: 'main',
    provider: 'github'
  }
};

export const ACBF_PROJECT_CONFIG: ProjectConfig = {
  id: 'acbf',
  name: 'Austin Cooperative Business Foundation',
  shortName: 'ACBF',
  tagline: 'Worker-owned cooperative ecosystem & non-extractive revolving loan fund',
  taxStatus: '501(c)(3)',
  dataDir: 'data/acbf',
  grantsSubdir: 'grants',
  calendarPath: 'calendar.ics',
  financialTargets: {
    targetYear: 2027,
    confirmedRevenue: 65000,
    bareMinimum: 300000,
    steadyState: 500000,
    stretch: 700000
  },
  categories: [
    'Federal',
    'Regional Foundation',
    'National Foundation',
    'Municipal',
    'Corporate/CRA',
    'Movement/CDF'
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
    owner: 'AustinCooperativeBusinessFoundation',
    repo: 'grantwriting',
    defaultBranch: 'main',
    provider: 'github'
  }
};

export const VAMOS_PROJECT_CONFIG: ProjectConfig = {
  id: 'vamos',
  name: 'Go Austin / Vamos Austin (GAVA)',
  shortName: 'Vamos',
  tagline: 'Community-owned food retail, health equity & Eastern Crescent food access',
  taxStatus: '501(c)(3) & Community Enterprise',
  dataDir: 'data/vamos',
  grantsSubdir: 'grants',
  calendarPath: 'data/vamos/calendar.ics',
  financialTargets: {
    targetYear: 2026,
    confirmedRevenue: 100000,
    bareMinimum: 250000,
    steadyState: 600000,
    stretch: 1200000
  },
  categories: [
    'Federal/USDA',
    'State of Texas',
    'City of Austin',
    'Health & Equity Foundation',
    'Corporate Community Giving',
    'CDFI Lending & Capital'
  ],
  tiers: [
    'Priority 1 (USDA Food Access)',
    'Priority 2 (Texas & City Funds)',
    'Priority 3 (Health Equity Foundations)',
    'Priority 4 (Retail Corporate)',
    'Priority 5 (CDFI Debt/Capital)'
  ],
  gitConfig: {
    owner: 'AustinCooperativeBusinessFoundation',
    repo: 'vamos-grants',
    defaultBranch: 'main',
    provider: 'github'
  }
};

const PROJECT_REGISTRY = new Map<string, ProjectConfig>([
  ['example', EXAMPLE_PROJECT_CONFIG],
  ['acbf', ACBF_PROJECT_CONFIG],
  ['vamos', VAMOS_PROJECT_CONFIG]
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
    const p = g.filePath.toLowerCase();
    if (normalized === 'example' || normalized === 'acbf') {
      return p.includes('/example/') || p.startsWith('example/') || p.includes('/acbf/') || p.startsWith('data/acbf/');
    }
    return p.includes(`/${normalized}/`) || p.startsWith(`${normalized}/`);
  });
}

export function filterDocsByProject(docs: MarkdownDoc[], projectId: string): MarkdownDoc[] {
  const normalized = projectId.toLowerCase();
  return docs.filter(d => {
    const p = d.relativePath.toLowerCase();
    if (normalized === 'example' || normalized === 'acbf') {
      return p.includes('/example/') || p.startsWith('example/') || p.includes('/acbf/') || p.startsWith('data/acbf/');
    }
    return p.includes(`/${normalized}/`) || p.startsWith(`${normalized}/`);
  });
}
