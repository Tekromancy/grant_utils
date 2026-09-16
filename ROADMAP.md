# `@tekromancy/grant_utils` — Improvement & Enhancement Roadmap

> Examined: `packages/grant_utils/src/` (13 source files, ~40 kLOC), 8 test files (67 tests),
> `examples/grant-hub-site/` (16 components), and the deployed GitHub Pages site.
> Date: 2026-09-16

---

## Quick Summary

The library is genuinely well-structured — clean ESM exports, a strong type model, a real working CLI, and an RFC 5545 ICS engine. The biggest gap is that most "utility" functions are actually **heuristic / deterministic stubs** (RFP parsing, fit scoring) when real production value would come from richer rule systems or optional AI augmentation. There are also several architecture and DX rough edges.

---

## 🔴 High Priority — Bugs / Correctness Issues

### 1. Hard-coded "today" reference date in three places
`calculateDaysRemaining`, `getUpcomingEvents`, and `DashboardView` all default to `'2026-09-10'`. Once that date is in the past everything shows negative countdowns.

```ts
// grantsUtils.ts line 109
export function calculateDaysRemaining(deadlineDateStr: string, referenceDateStr: string = '2026-09-10')
```

**Fix:** Default to `new Date().toISOString().slice(0, 10)` — the live date. Add an override parameter for deterministic testing.

---

### 2. `GrantRecord.status` is `string`, not a union type
`status` is declared as `string` everywhere but only `'Drafting' | 'Submitted' | 'Awarded' | 'Declined' | 'Forecasted'` are ever produced. This allows silent drift (e.g., `status: 'draft'` vs `'Drafting'`).

**Fix:** Add a typed `GrantStatus` union to `types.ts` and enforce it on `GrantRecord`.

---

### 3. `getGrantById` falls back to singleton store, never takes explicit dataset for lookup from events
`DashboardView.tsx` line 250 calls `getGrantById(evt.grantFile)` — it reads from the singleton. When data is prop-threaded (as after the recent SSR fix), the store is empty and every "Open Proposal" button silently fails.

**Fix:** Accept an optional `dataset?: GrantRecord[]` param (already the signature) and thread grants from props into that call in `DashboardView`.

---

### 4. ICS generation: UID generated with `Math.random()` on each call
```ts
ics.push(`UID:${evt.uid || `${Math.random().toString(36).slice(2)}@grant-utils`}`);
```
Random UIDs on each export break calendar sync (Google Calendar, Apple Calendar treat each import as new events — duplicates accumulate). UIDs should be deterministic from event content.

**Fix:** Use a hash of `${evt.title}|${evt.startDate}|${evt.grantFile}` for the fallback UID.

---

### 5. `addCalendarEvents` mutation inconsistency
```ts
export function addCalendarEvents(events: CalendarEvent[]): void {
  if (!customCalendarEvents) {
    customCalendarEvents = [...CALENDAR_EVENTS, ...events]; // includes base empty array
  } else {
    customCalendarEvents.push(...events); // mutates in-place
  }
}
```
The first branch copies, the second mutates the same array that `getCalendarEvents()` returns via spread. Any caller holding a reference gets stale data.

**Fix:** Always create a new array in both branches.

---

## 🟠 Architecture / Design Improvements

### 6. Module-level singletons are an anti-pattern for SSR & testing
`customGrantsData`, `customCalendarEvents`, `customMarkdownDocs`, and `GLOBAL_RESEARCH_CATALOG` are all module-level `let` / class singletons. This caused the entire SSR bug that was just fixed. It also means tests that call `registerGrants()` can leak state across test files.

**Options (pick one):**
- **Recommended:** Export a `createGrantStore(initialData?)` factory that returns an isolated store object. The singleton is just the default instance. Tests get fresh stores; Next.js passes the store down as props.
- **Simpler:** Ensure all `get*` functions *always* accept an explicit dataset (they mostly do) and make the singleton purely optional. Drop the singleton fallback in the web component layer entirely.

---

### 7. `grantResearchUtils.ts` is 965 lines — split it
It contains 7 distinct sections that would each make clean standalone modules:

| Section | Suggested file |
|---------|---------------|
| URL/query builders | `researchQueryBuilders.ts` |
| ProPublica + Grants.gov API parsers | `researchApiParsers.ts` |
| Fit & eligibility assessment | `fitAssessment.ts` |
| RFP text analyzer | `rfpAnalyzer.ts` |
| Opportunity ↔ GrantRecord converters | `opportunityConverters.ts` |
| Dossier Markdown generator | `dossierGenerator.ts` |
| Catalog class & singletons | `researchCatalog.ts` |

This makes individual pieces tree-shakeable and independently testable.

---

### 8. `nodeFs.ts` is exported from the main bundle
`nodeFs.ts` imports `node:fs`, `node:path`, `node:os` — these crash in browsers. It's correctly in `./node` export condition, but `index.ts` does NOT re-export it. That's correct. However, the `cli.ts` imports from `./index.js` which chains to `grantResearchUtils.ts` which is fine — but `nodeFs.ts` is imported directly by tests, which is correct. **No change needed here**, but it should be clearly documented in the README: "Node.js-only functions are in the `@tekromancy/grant_utils/node` subpath export."

---

### 9. `filterGrantsByProject` is path-string based — fragile
```ts
return p.includes(`/${normalized}/`) || p.startsWith(`${normalized}/`);
```
File paths contain project IDs by convention only. Adding a `projectId` field directly to `GrantRecord` would make this lookup O(1) and remove the string-parsing fragility.

---

### 10. `KPISummary` has duplicated backwards-compat fields
```ts
confirmedRevenue: number;       // new
confirmedRevenue2027: number;   // alias for old ACBF-specific code
steadyStateTarget: number;
steadyStateTarget2027: number;  // alias
```
The 2027-suffixed fields no longer serve a purpose now that the org-specific data is removed. Deprecate them in the type with a JSDoc `@deprecated` and remove in the next major version.

---

## 🟡 Missing Features / Enhancements

### 11. Grant status lifecycle tracking
`GrantRecord.status` is a single string but there's no history or audit trail. A `statusHistory: Array<{ status: GrantStatus; date: string; note?: string }>` field on `GrantRecord` would allow timeline views and pipeline analytics.

---

### 12. `searchGrants()` doesn't support sorting or pagination
```ts
export function searchGrants(query: string, dataset?: GrantRecord[]): GrantRecord[]
```
Add sort options (`sortBy: 'deadline' | 'amount' | 'matchPercentage'`, `sortDir: 'asc' | 'desc'`) and a `paginate(results, page, pageSize)` utility.

---

### 13. `parseRawIcs` doesn't handle multi-line folding for all fields
ICS line folding (RFC 5545 §3.1) is handled in the main parse loop but only for the outer loop. Folded `DESCRIPTION:` values that contain embedded `\n` escapes in base64-encoded attachments would partially corrupt. Also, `X-GRANT-FILE:` and `X-GRANT-AMOUNT:` custom properties are parsed from the description via regex — they should be first-class ICS properties so they survive round-trip export/import.

---

### 14. No `sam.gov` / `grants.gov` live API integration with proper pagination
`searchGrantsGov()` makes a single POST with `rows: limit` and returns. The Grants.gov API paginates via offset. Add:
- `offset` / `page` params to `searchGrantsGov()`
- A `searchSamGov()` function mirroring the ProPublica pattern
- Response caching (simple `Map<string, {data, ts}>` with TTL)

---

### 15. No tagging / label system on `GrantRecord` or `CalendarEvent`
Adding `tags: string[]` to both types would allow arbitrary cross-cutting filters (e.g., `'climate'`, `'workforce'`, `'shovel-ready'`) that don't fit neatly into `category` or `tier`.

---

### 16. No budget template generation
`calculateMatchFunding()` produces a match breakdown but doesn't export a structured budget table. A `generateBudgetTemplate(grant: GrantRecord, matchCalc?: MatchCalculation): BudgetTemplate` function that produces SF-424A-compatible line-item categories would be very useful.

---

### 17. CLI: no `search` command, no `load-dir` command
The CLI has `dorks`, `analyze-rfp`, `assess`, and `create-dossier`. Missing:
- `grant-research search <keywords>` — call `searchGrantsGov()` and print results
- `grant-research load <directory>` — call `loadGrantsFromDirectory()` and print a KPI summary
- `grant-research calendar <directory>` — load `.ics`, print upcoming events
- JSON/CSV output flag (`--format json|csv|table`)

---

### 18. No Zod / schema validation on data ingestion
`loadGrantsFromDirectory()` silently ignores parse errors. `parseGrantMarkdown()` returns `Partial<GrantRecord>`. Adding optional runtime schema validation (via Zod or a lightweight hand-rolled checker) would surface data quality issues during CI instead of silently producing broken records.

---

## 🟢 Code Quality / DX

### 19. Test coverage gaps
| File | What's missing |
|------|---------------|
| `calendarUtils.test.ts` | No test for `parseRawIcs` round-trip (generate then parse), no test for `addCalendarEvents` mutation |
| `grantResearchUtils.test.ts` | `analyzeRfpText` has 3 tests — no test for multi-deadline RFP, no scoring rubric extraction |
| `grantsUtils.test.ts` | `calculateMatchRequirements` and `calculatePipelinePacing` untested |
| `nodeFs.ts` | Zero tests (needs integration test fixtures) |
| `gitPrUtils.ts` | Only mock tests — needs a mock fetch test for `createPullRequest` response shapes |

---

### 20. `diffUtils.ts` is underused in the UI
`diffUtils.ts` is well-written but only `VisualDiffViewer.tsx` uses it, and only for the `editor` tab. The Grant Modal and the PR wizard both show raw markdown without diff context. Adding a "diff vs. saved" view in the modal would significantly improve the edit→review flow.

---

### 21. `WysiwygEditor.tsx` has a `rawAny` escape hatch
`GrantModal.tsx` and `MarkdownEditorView.tsx` both pass content through as raw HTML strings. There's no sanitization before `dangerouslySetInnerHTML`. For a tool that will render user-supplied markdown + frontmatter from arbitrary files, XSS is a real concern.

**Fix:** Pass through a sanitizer like `DOMPurify` before any `innerHTML` rendering.

---

### 22. Package version is `0.1.4` but is missing a `CHANGELOG.md`
No changelog makes it impossible for downstream consumers to know what changed between versions. Add `CHANGELOG.md` at the package root and consider using `changesets` or `release-please` for automated changelog generation on publish.

---

### 23. `js-yaml@5.x` — verify API compatibility
`js-yaml@5.4.2` is installed and works. However, `5.x` is **not** the main published line on npm (the canonical version is `4.1.0`). The `5.x` fork may diverge from the documented API. Consider auditing whether `yaml.load` / `yaml.dump` have any signature differences vs. `4.1.0`, and document the version pinning rationale in `package.json` with a comment.

---

### 24. `next.config.mjs` `basePath` is hardcoded to `/grant_utils`
This couples the Next.js site to the GitHub repo name. Move it to an env var:
```js
basePath: process.env.NEXT_BASE_PATH || '/grant_utils'
```

---

## Implementation Status

All 24 roadmap enhancements have been implemented and verified with 10 passing test files (83 tests):

| Phase | Items | Status |
|-------|-------|--------|
| **v0.2 — Correctness** | 1, 2, 3, 4, 5, 23 | ✅ Completed |
| **v0.3 — Architecture** | 6, 7, 9, 10, 13 | ✅ Completed |
| **v0.4 — Feature Completeness** | 11, 12, 14, 15, 16, 17, 18 | ✅ Completed |
| **v1.0 — Production Ready** | 19, 20, 21, 22, 24 | ✅ Completed |

