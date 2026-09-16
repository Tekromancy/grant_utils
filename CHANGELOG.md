# Changelog
All notable changes to the `grant_utils` workspace and `@tekromancy/grant_utils` packages will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-09-16

### Added
- **Isolated GrantStore Architecture**: Introduced `createGrantStore()` factory and `GrantStore` class (`@tekromancy/grant_utils/store`) to completely eliminate module-level singleton state leakage in SSR and multi-tenant testing environments.
- **Modular Research Suite**: Split monolithic `grantResearchUtils.ts` into specialized submodules under `research/` (`researchQueryBuilders`, `researchApiParsers`, `fitAssessment`, `rfpAnalyzer`, `opportunityConverters`, `dossierGenerator`, `researchCatalog`).
- **SAM.gov Search & Grants.gov Pagination**: Added `searchSamGov()` API client and offset/page parameter support for federal solicitation lookups with in-memory TTL caching.
- **Budget Template Generator**: Added `generateBudgetTemplate()` computing SF-424A object-class categories (Personnel, Fringe Benefits, Travel, Equipment, Supplies, Contractual, Indirect Charges) with non-federal match allocation.
- **Data Ingestion Validation**: Added `validateGrantRecord()` runtime schema checker with typed errors and warnings.
- **Grant Lifecycle Audit Tracking**: Added `updateGrantStatus()` and `statusHistory` audit log to `GrantRecord`.
- **Search Sorting & Pagination**: Added `sortBy`, `sortDir`, and `paginate()` utilities to `searchGrants()`.
- **First-Class ICS Round-Tripping**: Added RFC 5545 support for `X-GRANT-FILE`, `X-GRANT-AMOUNT`, and `X-TAGS` custom properties in `parseRawIcs()` and `generateIcsString()`.
- **Deterministic Calendar UIDs**: Implemented `getDeterministicUid()` to prevent duplicate calendar events when re-exporting.
- **HTML Sanitization**: Added `sanitizeHtml()` utility stripping scripts, dangerous tags, and event handlers.
- **Expanded CLI**: Added `grant-research search`, `grant-research load`, and `grant-research calendar` commands with `--format json|table|csv`.

### Changed
- Default reference dates in `calculateDaysRemaining()`, `getUpcomingEvents()`, and `getDeadlineStatus()` now dynamically use the current live date (`new Date().toISOString().slice(0, 10)`) rather than a hard-coded date.
- `GrantRecord.status` is now strictly typed as `GrantStatus` union.
- `filterGrantsByProject()` now directly checks `grant.projectId` before falling back to filepath matching.
- `addCalendarEvents()` is now immutable, always returning a fresh array.
- Marked legacy ACBF 2027 KPI fields (`confirmedRevenue2027`, `bareMinimumTarget2027`, etc.) as `@deprecated`.

## [0.1.4] - 2026-09-15
- Props threading for static export compatibility.
- 69 fictitious calendar events with RFC 5545 VALARM compliance.
- Universal grant research and evaluation utilities.

## [0.1.0] - 2026-09-01
- Initial public release of grant utilities, markdown parsing, and git PR engine.
