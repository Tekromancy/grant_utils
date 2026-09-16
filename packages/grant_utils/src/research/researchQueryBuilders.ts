import type { ResearchQuery } from '../types.js';

/**
 * Builds standard Grants.gov search URL with query parameters.
 */
export function buildGrantsGovSearchUrl(query: ResearchQuery): string {
  const base = 'https://www.grants.gov/search-grants';
  const params = new URLSearchParams();
  if (query.keywords.length > 0) {
    params.set('keywords', query.keywords.join(' '));
  }
  if (query.status && query.status !== 'All') {
    params.set('status', query.status.toLowerCase());
  }
  return `${base}?${params.toString()}`;
}

/**
 * Builds ProPublica Nonprofit Explorer search URL for researching foundation funders and 990s.
 */
export function buildProPublicaSearchUrl(query: string, state?: string): string {
  const base = 'https://projects.propublica.org/nonprofits/api/v2/search.json';
  const params = new URLSearchParams();
  params.set('q', query);
  if (state) {
    params.set('state[id]', state.toUpperCase());
  }
  return `${base}?${params.toString()}`;
}

/**
 * Generates targeted search engine queries ("Google Dorks") to find hidden RFPs,
 * NOFOs, foundation guidelines, and public funding announcements across the web.
 */
export function buildWebResearchQueries(topic: string, orgType: string = 'nonprofit', location?: string): string[] {
  const locTerm = location ? ` "${location}"` : '';
  const cleanTopic = topic.trim();

  return [
    // 1. Direct NOFO / RFP queries
    `"${cleanTopic}" ("Request for Proposals" OR "Notice of Funding Opportunity" OR "NOFO" OR "RFP" OR "Funding Opportunity Announcement")${locTerm}`,
    
    // 2. Federal / Municipal government solicitations
    `site:.gov "${cleanTopic}" ("grant opportunity" OR "grant application" OR "solicitation" OR "awards")${locTerm}`,
    
    // 3. Philanthropic foundations & giving priorities
    `"${cleanTopic}" ("foundation directory" OR "grant guidelines" OR "funding priorities" OR "letters of inquiry")${locTerm}`,
    
    // 4. IRS Form 990-PF research to discover who funds this topic
    `filetype:pdf "Form 990-PF" "${cleanTopic}" "Part XV" "Grants and Contributions Paid During the Year"`,
    
    // 5. Corporate philanthropy and CSR grant programs
    `"${cleanTopic}" ("corporate foundation" OR "community giving" OR "corporate grant program" OR "grant cycle")${locTerm}`,
    
    // 6. Organization-type specific eligibility search
    `"${cleanTopic}" ("eligible applicants" OR "who may apply") ("${orgType}" OR "community-based organization")${locTerm}`,

    // 7. Recent award recipients (competitor / partner benchmarking)
    `"${cleanTopic}" ("grant awarded" OR "announces recipients" OR "funded projects" OR "grantee cohort") (2025 OR 2026 OR 2027)${locTerm}`
  ];
}
