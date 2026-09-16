import type {
  GrantRecord,
  GrantCategory,
  CalendarEvent,
  MarkdownDoc,
  ProjectConfig,
  KPISummary,
  SearchGrantsOptions
} from './types.js';
import {
  getAllGrants,
  getGrantById,
  getGrantsByCategory,
  getGrantsByTier,
  searchGrants,
  getKPISummary
} from './grantsUtils.js';
import {
  getCalendarEvents,
  getUpcomingEvents,
  getEventsForMonth,
  getMonthMatrix,
  type DayCell
} from './calendarUtils.js';
import {
  getAllMarkdownDocs,
  getMarkdownDocById,
  getDocsByCategory,
  searchMarkdownDocs
} from './markdownUtils.js';

export interface GrantStoreConfig {
  grants?: GrantRecord[];
  events?: CalendarEvent[];
  docs?: MarkdownDoc[];
  defaultProject?: ProjectConfig;
}

/**
 * Isolated in-memory Grant Store instance.
 * Avoids module-level singleton state leakage in SSR environments and unit test suites.
 */
export class GrantStore {
  private grants: GrantRecord[] = [];
  private events: CalendarEvent[] = [];
  private docs: MarkdownDoc[] = [];
  private defaultProject?: ProjectConfig;

  constructor(initial?: GrantStoreConfig) {
    if (initial?.grants) this.grants = [...initial.grants];
    if (initial?.events) this.events = [...initial.events];
    if (initial?.docs) this.docs = [...initial.docs];
    this.defaultProject = initial?.defaultProject;
  }

  // --- Grants ---
  public registerGrants(grants: GrantRecord[]): void {
    this.grants = [...grants];
  }

  public addGrants(grants: GrantRecord[]): void {
    this.grants.push(...grants);
  }

  public clearGrants(): void {
    this.grants = [];
  }

  public getAllGrants(projectId?: string): GrantRecord[] {
    return getAllGrants(projectId, this.grants);
  }

  public getGrantById(id: string): GrantRecord | undefined {
    return getGrantById(id, this.grants);
  }

  public getGrantsByCategory(category: GrantCategory): GrantRecord[] {
    return getGrantsByCategory(category, this.grants);
  }

  public getGrantsByTier(tier: string): GrantRecord[] {
    return getGrantsByTier(tier, this.grants);
  }

  public searchGrants(query: string, options?: SearchGrantsOptions): GrantRecord[] {
    return searchGrants(query, this.grants, options);
  }

  public getKPISummary(project?: string | ProjectConfig): KPISummary {
    const proj = project || this.defaultProject;
    return getKPISummary(proj, this.grants);
  }

  // --- Calendar ---
  public setCalendarEvents(events: CalendarEvent[]): void {
    this.events = [...events];
  }

  public addCalendarEvents(events: CalendarEvent[]): void {
    this.events = [...this.events, ...events];
  }

  public clearCalendarEvents(): void {
    this.events = [];
  }

  public getCalendarEvents(): CalendarEvent[] {
    return getCalendarEvents(this.events);
  }

  public getUpcomingEvents(referenceDateStr?: string, limit?: number): CalendarEvent[] {
    return getUpcomingEvents(referenceDateStr, limit, this.events);
  }

  public getEventsForMonth(year: number, month: number): CalendarEvent[] {
    return getEventsForMonth(year, month, this.events);
  }

  public getMonthMatrix(year: number, month: number, todayStr?: string): DayCell[][] {
    return getMonthMatrix(year, month, todayStr, this.events);
  }

  // --- Docs ---
  public setMarkdownDocs(docs: MarkdownDoc[]): void {
    this.docs = [...docs];
  }

  public addMarkdownDocs(docs: MarkdownDoc[]): void {
    this.docs = [...this.docs, ...docs];
  }

  public clearMarkdownDocs(): void {
    this.docs = [];
  }

  public getAllMarkdownDocs(): MarkdownDoc[] {
    return getAllMarkdownDocs(this.docs);
  }

  public getMarkdownDocById(idOrPath: string): MarkdownDoc | undefined {
    return getMarkdownDocById(idOrPath, this.docs);
  }

  public getDocsByCategory(category: string): MarkdownDoc[] {
    return getDocsByCategory(category, this.docs);
  }

  public searchMarkdownDocs(query: string): MarkdownDoc[] {
    return searchMarkdownDocs(query, this.docs);
  }
}

/**
 * Creates an isolated GrantStore instance.
 */
export function createGrantStore(initial?: GrantStoreConfig): GrantStore {
  return new GrantStore(initial);
}
