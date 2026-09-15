import type { AuthTokenConfig } from './types.js';

export const TOKEN_SECURITY_NOTICE = `
================================================================================
🔒 CRITICAL SECURITY NOTICE: PROTECTING YOUR PERSONAL ACCESS TOKEN (PAT)
================================================================================

1. WHAT IS A PERSONAL ACCESS TOKEN?
   A Personal Access Token (PAT) is an OAuth secret that acts as your identity
   and password. It allows automated tools and scripts to authenticate with
   GitHub or GitLab on your behalf, bypassing Two-Factor Authentication (2FA).

2. RISKS OF EXPOSURE:
   Anyone possessing your token can modify source code, alter grant proposals,
   create or close pull requests, access organizational repositories, or push
   unauthorized commits under your name.

3. GOLDEN RULES OF TOKEN PROTECTION:
   ✓ LEAST PRIVILEGE: Never grant global admin or full account rights.
     - GitHub: Grant ONLY 'Contents (Read & Write)' and 'Pull Requests (Read & Write)'
       restricted to the specific repository.
     - GitLab: Grant ONLY 'write_repository' or 'api' on the specific project.
   ✓ SHORT EXPIRATION: Set an expiration date of 30 to 90 days. Never create
     tokens with 'No expiration'.
   ✓ NEVER COMMIT TO GIT: Never commit a token, paste it in markdown, or include
     it in screenshots. Keep it strictly in local ignored config files.
   ✓ LOCAL PROTECTION:
     - In CLI: Stored in '~/.config/grantwriting/auth.json' with 0600 permissions
       (readable ONLY by your Linux/Mac user account).
     - In Web Dashboard: Stored strictly in your browser's private localStorage.
       It is NEVER sent to any remote server, proxy, or analytics service; it
       only communicates directly with 'api.github.com' or 'gitlab.com' via HTTPS.
   ✓ IMMEDIATE REVOCATION: If a token is ever accidentally exposed or suspected
     compromised, revoke it immediately via GitHub or GitLab Settings!
================================================================================
`;

export const GITHUB_WALKTHROUGH_GUIDE = `
### How to Generate a GitHub Personal Access Token (PAT)

**Option A: Fine-Grained Token (Recommended)**
1. Open GitHub: [https://github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta)
2. Click **"Generate new token"**.
3. **Token name**: e.g., \`Example.org Grantwriting Dashboard - YourName\`
4. **Expiration**: Choose 30 days, 60 days, or 90 days.
5. **Repository access**: Select **"Only select repositories"** -> Choose your organization repo (e.g., \`ExampleOrg/grantwriting\` or your fork).
6. **Permissions**: Under "Repository permissions", set:
   - **Contents**: Access: \`Read and write\`
   - **Pull requests**: Access: \`Read and write\`
   - **Metadata**: Access: \`Read-only\` (auto-selected)
7. Click **"Generate token"** and copy the string immediately.

**Option B: Classic Token**
1. Open GitHub: [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)
2. Note: \`Example.org Grantwriting CLI & Web\`
3. Select scope: **\`repo\`** (Full control of private repositories)
4. Click **"Generate token"** and copy it.
`;

export const GITLAB_WALKTHROUGH_GUIDE = `
### How to Generate a GitLab Personal Access Token

1. Open GitLab Access Tokens: [https://gitlab.com/-/user_settings/personal_access_tokens](https://gitlab.com/-/user_settings/personal_access_tokens)
2. **Token name**: e.g., \`Example.org Grant Assistant\`
3. **Expiration date**: Pick a date 30–90 days ahead.
4. **Select scopes**:
   - Check **\`api\`** (Grants complete read/write access to the API)
   - OR check **\`write_repository\`** + **\`read_repository\`**
5. Click **"Create personal access token"** and copy the resulting string immediately.
`;

export const CODEBERG_WALKTHROUGH_GUIDE = `
### How to Generate a Codeberg / Forgejo Personal Access Token

1. Open Codeberg Applications: [https://codeberg.org/user/settings/applications](https://codeberg.org/user/settings/applications)
   *(Or visit your self-hosted Forgejo instance: \`https://<your-forgejo-domain>/user/settings/applications\`)*
2. In the **"Manage Access Tokens"** section:
   - **Token Name**: e.g., \`Example.org Grant Assistant\`
3. **Select Permissions**:
   - Under **repository**: check **\`read:repository\`** and **\`write:repository\`** (or check **\`repo\`**)
   - Under **issue**: check **\`read:issue\`** and **\`write:issue\`** (for pull requests)
4. Click **"Generate Token"** and copy the resulting secret string immediately.
`;

export async function validateGitHubToken(token: string): Promise<{
  valid: boolean;
  username?: string;
  name?: string;
  avatarUrl?: string;
  scopes?: string[];
  error?: string;
}> {
  if (!token || !token.trim()) {
    return { valid: false, error: 'Token is empty.' };
  }

  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Example-Grantwriting-Dashboard'
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { valid: false, error: 'Unauthorized: The GitHub token is invalid or has expired.' };
      }
      return { valid: false, error: `GitHub API error: ${res.status} ${res.statusText}` };
    }

    const data = await res.json() as { login: string; name: string; avatar_url: string };
    const rawScopes = res.headers.get('x-oauth-scopes') || '';
    const scopes = rawScopes ? rawScopes.split(',').map(s => s.trim()) : ['fine-grained'];

    return {
      valid: true,
      username: data.login,
      name: data.name || data.login,
      avatarUrl: data.avatar_url,
      scopes
    };
  } catch (err: any) {
    return { valid: false, error: `Network connection failed: ${err.message || String(err)}` };
  }
}

export async function validateGitLabToken(token: string, baseUrl: string = 'https://gitlab.com'): Promise<{
  valid: boolean;
  username?: string;
  name?: string;
  avatarUrl?: string;
  error?: string;
}> {
  if (!token || !token.trim()) {
    return { valid: false, error: 'Token is empty.' };
  }

  try {
    const normalizedBase = baseUrl.replace(/\/+$/, '');
    const res = await fetch(`${normalizedBase}/api/v4/user`, {
      headers: {
        'PRIVATE-TOKEN': token.trim(),
        'User-Agent': 'Example-Grantwriting-Dashboard'
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { valid: false, error: 'Unauthorized: The GitLab token is invalid or expired.' };
      }
      return { valid: false, error: `GitLab API error: ${res.status} ${res.statusText}` };
    }

    const data = await res.json() as { username: string; name: string; avatar_url: string };
    return {
      valid: true,
      username: data.username,
      name: data.name || data.username,
      avatarUrl: data.avatar_url
    };
  } catch (err: any) {
    return { valid: false, error: `Network connection failed: ${err.message || String(err)}` };
  }
}

export async function validateForgejoToken(token: string, instanceUrl: string = 'https://codeberg.org'): Promise<{
  valid: boolean;
  username?: string;
  name?: string;
  avatarUrl?: string;
  error?: string;
}> {
  if (!token || !token.trim()) {
    return { valid: false, error: 'Token is empty.' };
  }

  try {
    const normalizedBase = instanceUrl.replace(/\/+$/, '');
    const res = await fetch(`${normalizedBase}/api/v1/user`, {
      headers: {
        'Authorization': `token ${token.trim()}`,
        'Accept': 'application/json',
        'User-Agent': 'Example-Grantwriting-Dashboard'
      }
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return { valid: false, error: `Unauthorized: Token is invalid or expired on ${normalizedBase}.` };
      }
      return { valid: false, error: `Forgejo/Codeberg API error: ${res.status} ${res.statusText}` };
    }

    const data = await res.json() as { login: string; full_name?: string; avatar_url?: string };
    return {
      valid: true,
      username: data.login,
      name: data.full_name || data.login,
      avatarUrl: data.avatar_url
    };
  } catch (err: any) {
    return { valid: false, error: `Network connection to ${instanceUrl} failed: ${err.message || String(err)}` };
  }
}

// Browser localStorage adapter
const BROWSER_TOKEN_KEY = 'grant_auth_token_v1';
const LEGACY_BROWSER_TOKEN_KEY = 'acbf_grant_auth_token_v1';

export function getBrowserAuthToken(): AuthTokenConfig | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(BROWSER_TOKEN_KEY) || window.localStorage.getItem(LEGACY_BROWSER_TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveBrowserAuthToken(config: AuthTokenConfig): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.setItem(BROWSER_TOKEN_KEY, JSON.stringify(config));
}

export function clearBrowserAuthToken(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.removeItem(BROWSER_TOKEN_KEY);
  window.localStorage.removeItem(LEGACY_BROWSER_TOKEN_KEY);
}
