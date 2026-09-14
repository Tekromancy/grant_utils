# Grant YAML Frontmatter Specification

Every grant proposal document in your repository must begin with a YAML frontmatter header demarcated by triple dashes (`---`). This document defines the schema, field types, and validation rules enforced by `@tekromancy/grant_utils`.

---

## 📋 Full Field Reference Table

| Field Name | Type | Required? | Default / Options | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | **Yes** | Alphanumeric snake_case | Unique identifier (e.g. `usda_cfp_2026`). |
| `title` | `string` | **Yes** | Text string | Official title of the grant application. |
| `funder` | `string` | **Yes** | Text string | Grantmaker or federal agency name. |
| `program` | `string` | **Yes** | Text string | Program or solicitation name. |
| `amount` | `number` | **Yes** | Positive integer | Total dollar amount requested (numeric). |
| `amountFormatted`| `string` | Optional | Auto-formatted `$XXX,XXX` | Human-readable funding string. |
| `deadline` | `string` | **Yes** | `YYYY-MM-DD` format | Application submission deadline date. |
| `deadlineFormatted`| `string` | Optional | E.g. `April 15, 2027` | Formatted calendar date string. |
| `tier` | `string` | Optional | E.g. `Tier 1 (Fall)`, `Priority 1` | Application submission window or priority. |
| `category` | `string` | Optional | `Federal`, `Regional Foundation`, etc. | Programmatic category for distribution charts. |
| `matchPercentage`| `number` | Optional | `0`–`100` (Default: `0`) | Statutory non-federal cost-share match percent. |
| `grantType` | `string` | Optional | E.g. `Cooperative Agreement` | Contractual mechanism or award type. |
| `portalUrl` | `string` | Optional | URL (e.g. `https://grants.gov`) | Official RFP or application portal link. |
| `strategicPriority`| `string` | Optional | Text string | Internal alignment or mission pillar. |
| `status` | `string` | Optional | `Planned`, `Drafting`, `Ready to Submit`, `Submitted`, `Awarded`, `Closed` | Lifecycle tracking stage. |

---

## 💡 Frontmatter Parsing & Safe Editing

`@tekromancy/grant_utils` exports the `splitFrontmatter` helper:

```typescript
import { splitFrontmatter } from '@tekromancy/grant_utils';

const fileContent = fs.readFileSync('data/grants/01_usda.md', 'utf8');
const { frontmatter, body } = splitFrontmatter(fileContent);

console.log(frontmatter); // Raw YAML block with triple dashes
console.log(body);        // Markdown narrative without frontmatter
```

This guarantees that WYSIWYG editors and rich-text tools can edit the proposal body without corrupting or stripping the YAML frontmatter.
