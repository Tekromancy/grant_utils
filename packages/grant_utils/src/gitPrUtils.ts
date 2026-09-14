import type { PullRequestPayload, PRResult } from './types.js';

// Base64 helper compatible with both browser (btoa) and Node (Buffer)
function toBase64(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf8').toString('base64');
  } else if (typeof btoa !== 'undefined') {
    return btoa(unescape(encodeURIComponent(str)));
  }
  throw new Error('No base64 encoder available.');
}

export function suggestBranchName(grantTitleOrSlug: string, actionOrTopic: string = 'edit'): string {
  const base = grantTitleOrSlug.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, '');
  const cleanTitle = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
  const cleanAction = actionOrTopic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `grants/${cleanTitle}-${cleanAction}`;
}

export const generateBranchName = suggestBranchName;

export function generatePrTitle(grantTitle: string, action: string = 'update'): string {
  return `docs(grants): ${action} proposal for ${grantTitle}`;
}

export interface PRTemplateResult {
  title: string;
  body: string;
  toString(): string;
}

export function generatePrTemplate(
  optionsOrTitle: string | { grantTitle: string; summary: string; author?: string; changes?: string[] },
  summaryArg?: string,
  changesArg?: string[]
): PRTemplateResult {
  let grantTitle = '';
  let summary = '';
  let author: string | undefined;
  let changes: string[] | undefined;

  if (typeof optionsOrTitle === 'string') {
    grantTitle = optionsOrTitle;
    summary = summaryArg || '';
    changes = changesArg;
  } else {
    grantTitle = optionsOrTitle.grantTitle;
    summary = optionsOrTitle.summary;
    author = optionsOrTitle.author;
    changes = optionsOrTitle.changes;
  }

  const title = generatePrTitle(grantTitle);
  const changeList = changes && changes.length > 0
    ? changes.map(c => `- ${c}`).join('\n')
    : '- Updated narrative & proposal specifics.';

  const body = `## 📝 Grant Proposal Update: ${grantTitle}

### Summary
${summary}

### Changes Proposed
${changeList}

${author ? `**Submitted By:** ${author}\n` : ''}
---
*Automated review submission generated via \`@grantwriting/grant_utils\`*`;

  return {
    title,
    body,
    toString() {
      return body;
    }
  };
}

export const generatePrBody = (
  optionsOrTitle: string | { grantTitle: string; summary: string; author?: string; changes?: string[] },
  summaryArg?: string,
  changesArg?: string[]
): string => {
  return generatePrTemplate(optionsOrTitle, summaryArg, changesArg).body;
};

export async function createGitHubPullRequest(payload: PullRequestPayload): Promise<PRResult> {
  const {
    token,
    owner,
    repo,
    branchName,
    baseBranch = 'main',
    title,
    body,
    files
  } = payload;

  if (!token) {
    return { success: false, error: 'GitHub personal access token is required.' };
  }
  if (!files || files.length === 0) {
    return { success: false, error: 'No files specified for the pull request.' };
  }

  const headers = {
    'Authorization': `Bearer ${token.trim()}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'ACBF-Grantwriting-Dashboard'
  };

  try {
    // 1. Get SHA of base branch
    const baseRefRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`,
      { headers }
    );

    if (!baseRefRes.ok) {
      const errData = await baseRefRes.json().catch(() => ({}));
      return { 
        success: false, 
        error: `Could not find base branch '${baseBranch}': ${errData.message || baseRefRes.statusText}` 
      };
    }

    const baseRefData = await baseRefRes.json() as { object: { sha: string } };
    const baseSha = baseRefData.object.sha;

    // 2. Create new branch
    const createBranchRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: baseSha
        })
      }
    );

    if (!createBranchRes.ok && createBranchRes.status !== 422) {
      // 422 means branch might already exist
      const errData = await createBranchRes.json().catch(() => ({}));
      return { 
        success: false, 
        error: `Failed to create branch '${branchName}': ${errData.message || createBranchRes.statusText}` 
      };
    }

    // 3. Commit/update each file on the new branch
    for (const file of files) {
      // Check if file exists to obtain current SHA
      let currentSha: string | undefined;
      const fileCheckRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}?ref=${branchName}`,
        { headers }
      );
      if (fileCheckRes.ok) {
        const fileCheckData = await fileCheckRes.json() as { sha: string };
        currentSha = fileCheckData.sha;
      }

      const updatePayload: any = {
        message: `docs(grant): update ${file.path} via ACBF Grant Assistant`,
        content: toBase64(file.content),
        branch: branchName
      };
      if (currentSha) {
        updatePayload.sha = currentSha;
      }

      const filePutRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(updatePayload)
        }
      );

      if (!filePutRes.ok) {
        const errData = await filePutRes.json().catch(() => ({}));
        return { 
          success: false, 
          error: `Failed to write file '${file.path}': ${errData.message || filePutRes.statusText}` 
        };
      }
    }

    // 4. Create Pull Request
    const prRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title,
          body,
          head: branchName,
          base: baseBranch
        })
      }
    );

    if (!prRes.ok) {
      const errData = await prRes.json().catch(() => ({}));
      return { 
        success: false, 
        error: `Failed to create pull request: ${errData.message || prRes.statusText}` 
      };
    }

    const prData = await prRes.json() as { html_url: string; number: number };
    return {
      success: true,
      url: prData.html_url,
      number: prData.number,
      branch: branchName
    };

  } catch (err: any) {
    return { success: false, error: `GitHub API exception: ${err.message || String(err)}` };
  }
}

export async function createGitLabMergeRequest(payload: PullRequestPayload): Promise<PRResult> {
  const {
    token,
    owner,
    repo,
    branchName,
    baseBranch = 'main',
    title,
    body,
    files,
    gitlabProjectId,
    gitlabBaseUrl = 'https://gitlab.com'
  } = payload;

  if (!token) {
    return { success: false, error: 'GitLab personal access token is required.' };
  }
  if (!files || files.length === 0) {
    return { success: false, error: 'No files specified for the merge request.' };
  }

  const projectPath = gitlabProjectId || encodeURIComponent(`${owner}/${repo}`);
  const baseUrl = gitlabBaseUrl.replace(/\/+$/, '');
  const headers = {
    'PRIVATE-TOKEN': token.trim(),
    'Content-Type': 'application/json',
    'User-Agent': 'ACBF-Grantwriting-Dashboard'
  };

  try {
    // 1. Create branch
    const branchRes = await fetch(
      `${baseUrl}/api/v4/projects/${projectPath}/repository/branches`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          branch: branchName,
          ref: baseBranch
        })
      }
    );

    if (!branchRes.ok && branchRes.status !== 400) {
      const err = await branchRes.json().catch(() => ({}));
      return { success: false, error: `Failed to create branch: ${err.message || branchRes.statusText}` };
    }

    // 2. Commit files
    const actions = files.map(f => ({
      action: 'update',
      file_path: f.path,
      content: f.content
    }));

    const commitRes = await fetch(
      `${baseUrl}/api/v4/projects/${projectPath}/repository/commits`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          branch: branchName,
          commit_message: title,
          actions
        })
      }
    );

    if (!commitRes.ok) {
      const err = await commitRes.json().catch(() => ({}));
      return { success: false, error: `Failed to commit changes: ${err.message || commitRes.statusText}` };
    }

    // 3. Create Merge Request
    const mrRes = await fetch(
      `${baseUrl}/api/v4/projects/${projectPath}/merge_requests`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          source_branch: branchName,
          target_branch: baseBranch,
          title,
          description: body
        })
      }
    );

    if (!mrRes.ok) {
      const err = await mrRes.json().catch(() => ({}));
      return { success: false, error: `Failed to create Merge Request: ${err.message || mrRes.statusText}` };
    }

    const mrData = await mrRes.json() as { web_url: string; iid: number };
    return {
      success: true,
      url: mrData.web_url,
      number: mrData.iid,
      branch: branchName
    };
  } catch (err: any) {
    return { success: false, error: `GitLab API exception: ${err.message || String(err)}` };
  }
}

export async function createForgejoPullRequest(payload: PullRequestPayload): Promise<PRResult> {
  const {
    token,
    owner,
    repo,
    branchName,
    baseBranch = 'main',
    title,
    body,
    files,
    instanceUrl = 'https://codeberg.org'
  } = payload;

  if (!token) {
    return { success: false, error: 'Forgejo / Codeberg personal access token is required.' };
  }
  if (!files || files.length === 0) {
    return { success: false, error: 'No files specified for the pull request.' };
  }

  const baseUrl = instanceUrl.replace(/\/+$/, '');
  const headers = {
    'Authorization': `token ${token.trim()}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'ACBF-Grantwriting-Dashboard'
  };

  try {
    // 1. Create new branch
    const branchRes = await fetch(
      `${baseUrl}/api/v1/repos/${owner}/${repo}/branches`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          new_branch_name: branchName,
          old_branch_name: baseBranch
        })
      }
    );

    if (!branchRes.ok && branchRes.status !== 409 && branchRes.status !== 422) {
      const err = await branchRes.json().catch(() => ({}));
      return { success: false, error: `Failed to create branch on ${baseUrl}: ${err.message || branchRes.statusText}` };
    }

    // 2. Commit files
    for (const file of files) {
      let existingSha: string | undefined;
      const checkRes = await fetch(
        `${baseUrl}/api/v1/repos/${owner}/${repo}/contents/${file.path}?ref=${branchName}`,
        { headers }
      );
      if (checkRes.ok) {
        const fileData = await checkRes.json() as { sha: string };
        existingSha = fileData.sha;
      }

      const method = existingSha ? 'PUT' : 'POST';
      const filePayload: any = {
        branch: branchName,
        content: toBase64(file.content),
        message: `docs(grant): update ${file.path} via ACBF Grant Assistant`
      };
      if (existingSha) {
        filePayload.sha = existingSha;
      }

      const fileRes = await fetch(
        `${baseUrl}/api/v1/repos/${owner}/${repo}/contents/${file.path}`,
        {
          method,
          headers,
          body: JSON.stringify(filePayload)
        }
      );

      if (!fileRes.ok) {
        const err = await fileRes.json().catch(() => ({}));
        return { success: false, error: `Failed to commit file ${file.path}: ${err.message || fileRes.statusText}` };
      }
    }

    // 3. Create Pull Request
    const prRes = await fetch(
      `${baseUrl}/api/v1/repos/${owner}/${repo}/pulls`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          base: baseBranch,
          head: branchName,
          title,
          body
        })
      }
    );

    if (!prRes.ok) {
      const err = await prRes.json().catch(() => ({}));
      return { success: false, error: `Failed to create Pull Request on ${baseUrl}: ${err.message || prRes.statusText}` };
    }

    const prData = await prRes.json() as { html_url: string; number: number };
    return {
      success: true,
      url: prData.html_url,
      number: prData.number,
      branch: branchName
    };
  } catch (err: any) {
    return { success: false, error: `Forgejo/Codeberg API exception: ${err.message || String(err)}` };
  }
}

