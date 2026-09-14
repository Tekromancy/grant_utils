import { describe, it, expect } from 'vitest';
import { computeLineDiff, formatUnifiedDiff } from '../src/diffUtils.js';

describe('diffUtils', () => {
  it('should detect identical content with zero additions and deletions', () => {
    const text = 'Line 1\nLine 2\nLine 3';
    const diff = computeLineDiff(text, text);
    expect(diff.isIdentical).toBe(true);
    expect(diff.additions).toBe(0);
    expect(diff.deletions).toBe(0);
    expect(diff.lines.length).toBe(3);
    expect(diff.lines.every(l => l.type === 'equal')).toBe(true);
  });

  it('should detect added lines correctly', () => {
    const original = 'Alpha\nBeta';
    const modified = 'Alpha\nGamma\nBeta';
    const diff = computeLineDiff(original, modified);

    expect(diff.isIdentical).toBe(false);
    expect(diff.additions).toBe(1);
    expect(diff.deletions).toBe(0);
    const added = diff.lines.find(l => l.type === 'add');
    expect(added).toBeDefined();
    expect(added?.content).toBe('Gamma');
    expect(added?.newLineNumber).toBe(2);
  });

  it('should detect deleted lines correctly', () => {
    const original = 'One\nTwo\nThree';
    const modified = 'One\nThree';
    const diff = computeLineDiff(original, modified);

    expect(diff.isIdentical).toBe(false);
    expect(diff.additions).toBe(0);
    expect(diff.deletions).toBe(1);
    const deleted = diff.lines.find(l => l.type === 'delete');
    expect(deleted).toBeDefined();
    expect(deleted?.content).toBe('Two');
    expect(deleted?.oldLineNumber).toBe(2);
  });

  it('should detect replaced/modified lines as delete and add', () => {
    const original = 'amount: 50000\nstatus: Draft';
    const modified = 'amount: 75000\nstatus: Draft';
    const diff = computeLineDiff(original, modified);

    expect(diff.additions).toBe(1);
    expect(diff.deletions).toBe(1);
    expect(diff.isIdentical).toBe(false);
  });

  it('should format a valid unified diff patch', () => {
    const original = 'Hello World\nFoo';
    const modified = 'Hello World\nBar';
    const patch = formatUnifiedDiff(original, modified, 'test.md', 'test.md');

    expect(patch).toContain('--- a/test.md');
    expect(patch).toContain('+++ b/test.md');
    expect(patch).toContain('-Foo');
    expect(patch).toContain('+Bar');
  });
});
