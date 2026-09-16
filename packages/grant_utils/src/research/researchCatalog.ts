import type {
  GrantOpportunity,
  ApplicantProfile,
  GrantFitAssessment,
  GrantRecord,
  CalendarEvent,
  ResearchQuery
} from '../types.js';
import { evaluateGrantFit } from './fitAssessment.js';
import { convertOpportunityToGrantRecord, convertOpportunityToCalendarEvents } from './opportunityConverters.js';

export class GrantResearchCatalog {
  private opportunities = new Map<string, GrantOpportunity>();

  constructor(initialOpportunities: GrantOpportunity[] = []) {
    this.addMany(initialOpportunities);
  }

  public add(opp: GrantOpportunity): void {
    this.opportunities.set(opp.id, opp);
  }

  public addMany(opps: GrantOpportunity[]): void {
    for (const opp of opps) {
      this.add(opp);
    }
  }

  public getById(id: string): GrantOpportunity | undefined {
    return this.opportunities.get(id);
  }

  public getAll(): GrantOpportunity[] {
    return Array.from(this.opportunities.values());
  }

  public filter(query: ResearchQuery): GrantOpportunity[] {
    let results = this.getAll();

    if (query.keywords && query.keywords.length > 0) {
      const q = query.keywords.join(' ').toLowerCase();
      results = results.filter(opp =>
        opp.title.toLowerCase().includes(q) ||
        opp.funder.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.focusAreas.some(fa => fa.toLowerCase().includes(q))
      );
    }

    if (query.funderType) {
      results = results.filter(opp => opp.funderType.toLowerCase() === query.funderType!.toLowerCase());
    }

    if (query.status && query.status !== 'All') {
      results = results.filter(opp => opp.status.toLowerCase() === query.status!.toLowerCase());
    }

    if (query.minAmount !== undefined) {
      results = results.filter(opp => (opp.fundingAmountMax || 0) >= query.minAmount!);
    }

    if (query.maxAmount !== undefined) {
      results = results.filter(opp => (opp.fundingAmountMax || 0) <= query.maxAmount!);
    }

    if (query.requiresMatch !== undefined) {
      results = results.filter(opp => query.requiresMatch ? (opp.costSharePercentage || 0) > 0 : (opp.costSharePercentage || 0) === 0);
    }

    if (query.limit && query.limit > 0) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  public evaluateAll(profile: ApplicantProfile): Array<{ opportunity: GrantOpportunity; assessment: GrantFitAssessment }> {
    return this.getAll().map(opp => ({
      opportunity: opp,
      assessment: evaluateGrantFit(opp, profile)
    }));
  }

  public toGrantRecords(profile?: ApplicantProfile): GrantRecord[] {
    return this.getAll().map(opp => {
      const assessment = profile ? evaluateGrantFit(opp, profile) : undefined;
      return convertOpportunityToGrantRecord(opp, assessment);
    });
  }

  public toCalendarEvents(referenceDate?: string): CalendarEvent[] {
    return this.getAll().flatMap(opp => convertOpportunityToCalendarEvents(opp, referenceDate));
  }

  public clear(): void {
    this.opportunities.clear();
  }
}

// Global catalog singleton
const GLOBAL_RESEARCH_CATALOG = new GrantResearchCatalog();

export function getResearchCatalog(): GrantResearchCatalog {
  return GLOBAL_RESEARCH_CATALOG;
}

export function registerResearchOpportunity(opp: GrantOpportunity): void {
  GLOBAL_RESEARCH_CATALOG.add(opp);
}

export function getAllResearchOpportunities(): GrantOpportunity[] {
  return GLOBAL_RESEARCH_CATALOG.getAll();
}

export function clearResearchCatalog(): void {
  GLOBAL_RESEARCH_CATALOG.clear();
}
