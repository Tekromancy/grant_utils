export interface DiffLine {
  type: 'equal' | 'add' | 'delete';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface DiffResult {
  lines: DiffLine[];
  additions: number;
  deletions: number;
  isIdentical: boolean;
}

/**
 * Computes line-by-line diff between two text strings using Longest Common Subsequence (LCS).
 */
export function computeLineDiff(oldText: string, newText: string): DiffResult {
  if (oldText === newText) {
    const lines: DiffLine[] = oldText.split(/\r?\n/).map((line, idx) => ({
      type: 'equal' as const,
      oldLineNumber: idx + 1,
      newLineNumber: idx + 1,
      content: line
    }));
    return {
      lines,
      additions: 0,
      deletions: 0,
      isIdentical: true
    };
  }

  const a = oldText.split(/\r?\n/);
  const b = newText.split(/\r?\n/);

  const n = a.length;
  const m = b.length;

  // Build 2D LCS matrix
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (a[i] === b[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack to assemble line diff
  let i = n;
  let j = m;
  const rawDiff: Array<{ type: 'equal' | 'add' | 'delete'; content: string }> = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      rawDiff.push({ type: 'equal', content: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawDiff.push({ type: 'add', content: b[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawDiff.push({ type: 'delete', content: a[i - 1] });
      i--;
    }
  }

  rawDiff.reverse();

  let oldNum = 1;
  let newNum = 1;
  let additions = 0;
  let deletions = 0;

  const lines: DiffLine[] = rawDiff.map(item => {
    if (item.type === 'equal') {
      return {
        type: 'equal',
        oldLineNumber: oldNum++,
        newLineNumber: newNum++,
        content: item.content
      };
    } else if (item.type === 'add') {
      additions++;
      return {
        type: 'add',
        newLineNumber: newNum++,
        content: item.content
      };
    } else {
      deletions++;
      return {
        type: 'delete',
        oldLineNumber: oldNum++,
        content: item.content
      };
    }
  });

  return {
    lines,
    additions,
    deletions,
    isIdentical: additions === 0 && deletions === 0
  };
}

export const computeDiff = computeLineDiff;

/**
 * Formats diff as a standard unified diff patch string.
 * Supports passing either (oldText, newText, oldFileName, newFileName)
 * or (diffResult, fileName).
 */
export function formatUnifiedDiff(
  oldTextOrDiffResult: string | DiffResult, 
  newTextOrFileName: string = 'modified', 
  oldFileName = 'original', 
  newFileName = 'modified'
): string {
  let diff: DiffResult;
  let oName = oldFileName;
  let nName = newFileName;

  if (typeof oldTextOrDiffResult === 'object' && 'lines' in oldTextOrDiffResult) {
    diff = oldTextOrDiffResult;
    nName = newTextOrFileName || 'modified';
    oName = oldFileName === 'original' ? nName : oldFileName;
  } else {
    diff = computeLineDiff(oldTextOrDiffResult, newTextOrFileName);
  }

  if (diff.isIdentical) {
    return `# Files are identical\n`;
  }

  const oldLines = diff.lines.filter(l => l.type !== 'add').length;
  const newLines = diff.lines.filter(l => l.type !== 'delete').length;

  const out: string[] = [
    `--- a/${oName}`,
    `+++ b/${nName}`,
    `@@ -1,${oldLines} +1,${newLines} @@`
  ];

  for (const line of diff.lines) {
    if (line.type === 'equal') {
      out.push(` ${line.content}`);
    } else if (line.type === 'add') {
      out.push(`+${line.content}`);
    } else if (line.type === 'delete') {
      out.push(`-${line.content}`);
    }
  }

  return out.join('\n');
}
