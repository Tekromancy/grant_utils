import type {
  GrantOpportunity,
  FunderProfile,
  ResearchQuery
} from '../types.js';
import { buildProPublicaSearchUrl } from './researchQueryBuilders.js';

// Simple in-memory response cache with TTL (10 minutes default)
const API_CACHE = new Map<string, { data: any; expiry: number }>();

function getCached<T>(key: string): T | undefined {
  const entry = API_CACHE.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiry) {
    API_CACHE.delete(key);
    return undefined;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T, ttlMs: number = 10 * 60 * 1000): void {
  API_CACHE.set(key, {
    data,
    expiry: Date.now() + ttlMs
  });
}

/**
 * Clears the research API response cache.
 */
export function clearApiCache(): void {
  API_CACHE.clear();
}

/**
 * Parses raw ProPublica Nonprofit Explorer search result item into a typed FunderProfile.
 */
export function parseProPublicaOrgResponse(item: any): FunderProfile {
  return {
    name: item.name || 'Unknown Organization',
    ein: item.ein ? String(item.ein).padStart(9, '0') : undefined,
    type: item.subsection_code === 3 ? 'Public Charity' : (item.subsection_code ? `501(c)(${item.subsection_code})` : 'Private Foundation'),
    city: item.city || '',
    state: item.state || '',
    totalAssets: Number(item.assets) || 0,
    annualGiving: Number(item.totrevenue) || 0,
    topFocusAreas: item.ntee_code ? [item.ntee_code] : [],
    sourceUrl: item.ein ? `https://projects.propublica.org/nonprofits/organizations/${item.ein}` : undefined
  };
}

/**
 * Searches ProPublica Nonprofit Explorer API for foundations, funders, and Form 990 tax records.
 */
export function asyncSearchFunder990(
  query: string, 
  state?: string, 
  options?: { fetchFn?: typeof fetch; cacheTtlMs?: number }
): Promise<FunderProfile[]> {
  const fetcher = options?.fetchFn || (typeof fetch !== 'undefined' ? fetch : undefined);
  if (!fetcher) {
    throw new Error('No fetch implementation available in current environment.');
  }

  const url = buildProPublicaSearchUrl(query, state);
  const cacheKey = `propublica:${url}`;
  const cached = getCached<FunderProfile[]>(cacheKey);
  if (cached) {
    return Promise.resolve(cached);
  }

  return fetcher(url)
    .then(res => {
      if (!res.ok) throw new Error(`ProPublica search failed: ${res.statusText}`);
      return res.json();
    })
    .then((data: any) => {
      const orgs = Array.isArray(data.organizations) ? data.organizations : [];
      const parsed = orgs.map(parseProPublicaOrgResponse);
      setCached(cacheKey, parsed, options?.cacheTtlMs);
      return parsed;
    });
}

export const searchFunder990 = asyncSearchFunder990;

/**
 * Parses raw Grants.gov API or search synopsis record into a typed GrantOpportunity.
 */
export function parseGrantsGovSynopsis(raw: any): GrantOpportunity {
  const id = raw.id || raw.opportunityId || raw.opportunityNumber || `grant_${Math.random().toString(36).slice(2, 9)}`;
  const title = raw.title || raw.opportunityTitle || 'Untitled Grant Opportunity';
  const funder = raw.agencyName || raw.agency || raw.funder || 'Federal Agency';
  const amountMax = Number(raw.awardCeiling) || Number(raw.fundingAmountMax) || Number(raw.estimatedTotalFunding) || 0;
  const amountMin = Number(raw.awardFloor) || Number(raw.fundingAmountMin) || 0;
  const deadline = raw.closeDate || raw.deadline || raw.responseDate || '';
  const postDate = raw.postDate || raw.postedDate || '';
  const matchPct = Number(raw.costSharingOrMatchingRequirement === 'Yes' ? (raw.costSharePercentage || 25) : 0);

  const eligibleApplicants: string[] = [];
  if (Array.isArray(raw.eligibleApplicants)) {
    eligibleApplicants.push(...raw.eligibleApplicants);
  } else if (typeof raw.eligibleApplicants === 'string') {
    eligibleApplicants.push(raw.eligibleApplicants);
  } else if (raw.eligibility) {
    eligibleApplicants.push(String(raw.eligibility));
  }

  return {
    id: String(id),
    title,
    funder,
    funderType: 'Federal',
    opportunityNumber: raw.opportunityNumber || raw.cfdaNumber,
    cfdaNumber: raw.cfdaNumber || raw.assistanceListingNumber,
    programUrl: raw.programUrl || (raw.opportunityId ? `https://www.grants.gov/search-results-detail/${raw.opportunityId}` : undefined),
    portalUrl: 'https://www.grants.gov',
    description: raw.description || raw.synopsisDesc || '',
    fundingAmountMin: amountMin > 0 ? amountMin : undefined,
    fundingAmountMax: amountMax > 0 ? amountMax : undefined,
    estimatedTotalFunding: Number(raw.estimatedTotalFunding) || undefined,
    expectedAwardsCount: Number(raw.expectedNumberOfAwards) || undefined,
    costSharePercentage: matchPct,
    deadline: deadline ? String(deadline).split('T')[0] : 'Rolling',
    closeDate: deadline,
    postDate,
    eligibleApplicantTypes: eligibleApplicants.length > 0 ? eligibleApplicants : ['501(c)(3) Nonprofits', 'Small Businesses'],
    focusAreas: Array.isArray(raw.focusAreas) ? raw.focusAreas : [raw.fundingActivityCategory || 'Community Development'],
    status: raw.opportunityStatus === 'Forecasted' ? 'Forecasted' : 'Open',
    submissionMethod: 'Grants.gov',
    source: 'grants.gov',
    rawSourceData: raw
  };
}

/**
 * Searches Grants.gov for open or forecasted federal opportunities with pagination and caching.
 */
export function searchGrantsGov(
  query: ResearchQuery | string,
  options?: { 
    fetchFn?: typeof fetch; 
    limit?: number; 
    offset?: number;
    cacheTtlMs?: number;
  }
): Promise<GrantOpportunity[]> {
  const fetcher = options?.fetchFn || (typeof fetch !== 'undefined' ? fetch : undefined);
  const qObj: ResearchQuery = typeof query === 'string' ? { keywords: [query] } : query;
  const limit = options?.limit || qObj.limit || 10;
  const offset = options?.offset || 0;

  if (!fetcher) {
    return Promise.resolve([]);
  }

  const payload = {
    keyword: qObj.keywords.join(' '),
    oppStatuses: qObj.status && qObj.status !== 'All' ? qObj.status.toLowerCase() : 'forecasted|posted',
    rows: limit,
    startRecordNum: offset
  };

  const cacheKey = `grantsgov:${JSON.stringify(payload)}`;
  const cached = getCached<GrantOpportunity[]>(cacheKey);
  if (cached) {
    return Promise.resolve(cached);
  }

  return fetcher('https://api.grants.gov/v1/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error(`Grants.gov search API returned ${res.status}`);
      return res.json();
    })
    .then((data: any) => {
      const hits = Array.isArray(data?.oppHits) ? data.oppHits : (Array.isArray(data?.data) ? data.data : []);
      const parsed = hits.map(parseGrantsGovSynopsis);
      setCached(cacheKey, parsed, options?.cacheTtlMs);
      return parsed;
    })
    .catch(() => {
      return [];
    });
}

/**
 * Searches SAM.gov for public assistance listings, federal agency solicitations, and UEI registrations.
 */
export function searchSamGov(
  query: ResearchQuery | string,
  options?: {
    fetchFn?: typeof fetch;
    apiKey?: string;
    limit?: number;
    offset?: number;
    cacheTtlMs?: number;
  }
): Promise<GrantOpportunity[]> {
  const fetcher = options?.fetchFn || (typeof fetch !== 'undefined' ? fetch : undefined);
  const qObj: ResearchQuery = typeof query === 'string' ? { keywords: [query] } : query;
  const limit = options?.limit || qObj.limit || 10;
  const offset = options?.offset || 0;
  const apiKey = options?.apiKey || (typeof process !== 'undefined' ? process.env?.SAM_GOV_API_KEY : undefined);

  if (!fetcher || !apiKey) {
    return Promise.resolve([]);
  }

  const params = new URLSearchParams();
  params.set('api_key', apiKey);
  params.set('q', qObj.keywords.join(' '));
  params.set('limit', String(limit));
  params.set('offset', String(offset));

  const url = `https://api.sam.gov/prod/opportunities/v2/search?${params.toString()}`;
  const cacheKey = `samgov:${url}`;
  const cached = getCached<GrantOpportunity[]>(cacheKey);
  if (cached) {
    return Promise.resolve(cached);
  }

  return fetcher(url)
    .then(res => {
      if (!res.ok) throw new Error(`SAM.gov search API returned ${res.status}`);
      return res.json();
    })
    .then((data: any) => {
      const opps = Array.isArray(data?.opportunitiesData) ? data.opportunitiesData : [];
      const parsed: GrantOpportunity[] = opps.map((o: any) => ({
        id: o.noticeId || o.solicitationNumber || `sam_${Math.random().toString(36).slice(2, 9)}`,
        title: o.title || 'SAM.gov Federal Opportunity',
        funder: o.department || o.agency || 'Federal Agency',
        funderType: 'Federal',
        opportunityNumber: o.solicitationNumber,
        description: o.description || '',
        deadline: o.responseDeadLine ? o.responseDeadLine.split('T')[0] : 'Rolling',
        eligibleApplicantTypes: ['501(c)(3) Nonprofits', 'Small Businesses', 'Tribal Nations'],
        focusAreas: [o.naicsCode || 'Federal Assistance'],
        status: 'Open',
        source: 'sam.gov',
        portalUrl: 'https://sam.gov',
        rawSourceData: o
      }));
      setCached(cacheKey, parsed, options?.cacheTtlMs);
      return parsed;
    })
    .catch(() => {
      return [];
    });
}
