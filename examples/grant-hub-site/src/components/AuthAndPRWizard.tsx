'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  GitPullRequest, 
  Sparkles, 
  Trash2, 
  GitBranch, 
  FileCheck, 
  GitCompare, 
  ChevronDown, 
  ChevronUp,
  Terminal,
  RefreshCw,
  UploadCloud
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  validateGitHubToken, 
  validateGitLabToken, 
  validateForgejoToken,
  createGitHubPullRequest,
  createGitLabMergeRequest,
  createForgejoPullRequest,
  type AuthTokenConfig,
  type MarkdownDoc,
  getAllMarkdownDocs
} from '@tekromancy/grant_utils';
import { VisualDiffViewer } from './VisualDiffViewer';

interface Props {
  authConfig: AuthTokenConfig | null;
  onSaveToken: (config: AuthTokenConfig) => void;
  onClearToken: () => void;
  editedFiles: Record<string, string>;
  preselectedDoc?: MarkdownDoc;
}

export const AuthAndPRWizard: React.FC<Props> = ({
  authConfig,
  onSaveToken,
  onClearToken,
  editedFiles,
  preselectedDoc
}) => {
  const allDocs = getAllMarkdownDocs();
  const [provider, setProvider] = useState<'github' | 'gitlab' | 'codeberg'>(
    authConfig?.provider === 'forgejo' || authConfig?.provider === 'codeberg' ? 'codeberg' : authConfig?.provider || 'github'
  );
  const [instanceUrl, setInstanceUrl] = useState(authConfig?.instanceUrl || 'https://codeberg.org');
  const [tokenInput, setTokenInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  // PR Form
  const [repoOwner, setRepoOwner] = useState('ExampleOrg');
  const [repoName, setRepoName] = useState('grantwriting');
  const [branchName, setBranchName] = useState(`update-grants-${Date.now().toString().slice(-6)}`);
  const [selectedDocPath, setSelectedDocPath] = useState(
    preselectedDoc?.relativePath || Object.keys(editedFiles)[0] || 'data/example/CallToAction.md'
  );
  const [prTitle, setPrTitle] = useState(`docs(grants): update ${selectedDocPath.split('/').pop()} proposal`);
  const [prBody, setPrBody] = useState(
    `## Grant Proposal Update\n\nSubmitted via the **Example.org Grantwriting Interactive Web Dashboard**.\n\n- File: \`${selectedDocPath}\`\n- Aligned with Example.org Strategic Funding Strategy & Call to Action.`
  );
  const [isSubmittingPR, setIsSubmittingPR] = useState(false);
  const [prResultUrl, setPrResultUrl] = useState('');
  const [prError, setPrError] = useState('');
  const [showDiff, setShowDiff] = useState(true);

  // Desktop Native Git Mode
  const [isDesktop, setIsDesktop] = useState(false);
  const [gitStatus, setGitStatus] = useState<any>(null);
  const [isRefreshingGit, setIsRefreshingGit] = useState(false);
  const [desktopCommitMsg, setDesktopCommitMsg] = useState('docs(grants): update grant documentation');
  const [isDesktopCommitting, setIsDesktopCommitting] = useState(false);
  const [desktopCommitResult, setDesktopCommitResult] = useState<{ success: boolean; output?: string; error?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI?.isDesktop) {
      setIsDesktop(true);
      refreshDesktopGit();
    }
  }, []);

  async function refreshDesktopGit() {
    if (typeof window !== 'undefined' && window.electronAPI?.getGitStatus) {
      setIsRefreshingGit(true);
      try {
        const res = await window.electronAPI.getGitStatus();
        setGitStatus(res);
      } catch (err) {
        console.warn('Failed to get desktop git status:', err);
      } finally {
        setIsRefreshingGit(false);
      }
    }
  }

  async function handleDesktopCommitAndPush() {
    if (!window.electronAPI?.gitCommitAndPush) return;
    setIsDesktopCommitting(true);
    setDesktopCommitResult(null);
    try {
      const res = await window.electronAPI.gitCommitAndPush(desktopCommitMsg);
      setDesktopCommitResult(res);
      if (res.success) {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        refreshDesktopGit();
      }
    } catch (err: any) {
      setDesktopCommitResult({ success: false, error: err.message || String(err) });
    } finally {
      setIsDesktopCommitting(false);
    }
  }

  async function handleVerifyToken() {
    if (!tokenInput.trim()) {
      setValidationError('Please enter or paste your token.');
      return;
    }
    setIsValidating(true);
    setValidationError('');

    if (provider === 'github') {
      const res = await validateGitHubToken(tokenInput.trim());
      setIsValidating(false);
      if (res.valid) {
        const config: AuthTokenConfig = {
          provider: 'github',
          token: tokenInput.trim(),
          username: res.username,
          name: res.name,
          avatarUrl: res.avatarUrl,
          scopes: res.scopes,
          createdAt: new Date().toISOString(),
          isValid: true
        };
        onSaveToken(config);
        setTokenInput('');
      } else {
        setValidationError(res.error || 'GitHub validation failed.');
      }
    } else if (provider === 'gitlab') {
      const res = await validateGitLabToken(tokenInput.trim());
      setIsValidating(false);
      if (res.valid) {
        const config: AuthTokenConfig = {
          provider: 'gitlab',
          token: tokenInput.trim(),
          username: res.username,
          name: res.name,
          avatarUrl: res.avatarUrl,
          createdAt: new Date().toISOString(),
          isValid: true
        };
        onSaveToken(config);
        setTokenInput('');
      } else {
        setValidationError(res.error || 'GitLab validation failed.');
      }
    } else {
      const res = await validateForgejoToken(tokenInput.trim(), instanceUrl.trim());
      setIsValidating(false);
      if (res.valid) {
        const config: AuthTokenConfig = {
          provider: 'codeberg',
          token: tokenInput.trim(),
          instanceUrl: instanceUrl.trim(),
          username: res.username,
          name: res.name,
          avatarUrl: res.avatarUrl,
          createdAt: new Date().toISOString(),
          isValid: true
        };
        onSaveToken(config);
        setTokenInput('');
      } else {
        setValidationError(res.error || 'Codeberg / Forgejo validation failed.');
      }
    }
  }

  async function handleCreatePR() {
    if (!authConfig) return;
    setIsSubmittingPR(true);
    setPrError('');

    try {
      // Find content: either edited content or default doc content
      const editedContent = editedFiles[selectedDocPath];
      const doc = allDocs.find(d => d.relativePath === selectedDocPath);
      const contentToSubmit = editedContent !== undefined ? editedContent : (doc ? doc.content : '');

      if (authConfig.provider === 'github') {
        const res = await createGitHubPullRequest({
          provider: 'github',
          token: authConfig.token,
          owner: repoOwner.trim(),
          repo: repoName.trim(),
          branchName: branchName.trim(),
          baseBranch: 'main',
          title: prTitle.trim(),
          body: prBody.trim(),
          files: [{ path: selectedDocPath, content: contentToSubmit }]
        });

        setIsSubmittingPR(false);
        if (res.success && res.url) {
          setPrResultUrl(res.url);
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        } else {
          setPrError(res.error || 'Failed to create GitHub pull request.');
        }
      } else if (authConfig.provider === 'gitlab') {
        const res = await createGitLabMergeRequest({
          provider: 'gitlab',
          token: authConfig.token,
          owner: repoOwner.trim(),
          repo: repoName.trim(),
          branchName: branchName.trim(),
          baseBranch: 'main',
          title: prTitle.trim(),
          body: prBody.trim(),
          files: [{ path: selectedDocPath, content: contentToSubmit }]
        });

        setIsSubmittingPR(false);
        if (res.success && res.url) {
          setPrResultUrl(res.url);
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        } else {
          setPrError(res.error || 'Failed to create GitLab merge request.');
        }
      } else {
        const res = await createForgejoPullRequest({
          provider: 'codeberg',
          token: authConfig.token,
          instanceUrl: authConfig.instanceUrl || 'https://codeberg.org',
          owner: repoOwner.trim(),
          repo: repoName.trim(),
          branchName: branchName.trim(),
          baseBranch: 'main',
          title: prTitle.trim(),
          body: prBody.trim(),
          files: [{ path: selectedDocPath, content: contentToSubmit }]
        });

        setIsSubmittingPR(false);
        if (res.success && res.url) {
          setPrResultUrl(res.url);
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        } else {
          setPrError(res.error || 'Failed to create Codeberg / Forgejo pull request.');
        }
      }
    } catch (err: any) {
      setIsSubmittingPR(false);
      setPrError(`Exception: ${err.message || String(err)}`);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Desktop Local Git Direct Mode */}
      {isDesktop && (
        <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-blue-950/80 border-2 border-blue-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-white text-base">Desktop Native Git Sync</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/60">
                    Direct Filesystem
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Commit and push directly using your local machine Git credentials. No web API access tokens required!
                </p>
              </div>
            </div>
            <button
              onClick={refreshDesktopGit}
              disabled={isRefreshingGit}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Refresh Git Status"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshingGit ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {gitStatus && (
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Branch: <strong className="text-white">{gitStatus.branch || 'main'}</strong></span>
                <span>
                  Status: {gitStatus.clean ? (
                    <span className="text-emerald-400 font-bold">✓ Working tree clean</span>
                  ) : (
                    <span className="text-amber-400 font-bold">{gitStatus.files?.length || 0} modified files</span>
                  )}
                </span>
              </div>

              {!gitStatus.clean && gitStatus.files && gitStatus.files.length > 0 && (
                <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-900/60 p-2 rounded border border-slate-800">
                  {gitStatus.files.map((f: any, idx: number) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-amber-400 font-bold w-6">{f.status}</span>
                      <span className="text-slate-300 truncate">{f.path}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800/80">
                <input
                  type="text"
                  value={desktopCommitMsg}
                  onChange={(e) => setDesktopCommitMsg(e.target.value)}
                  placeholder="Commit message..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-sans focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleDesktopCommitAndPush}
                  disabled={isDesktopCommitting || gitStatus.clean}
                  className="px-5 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white transition flex items-center justify-center space-x-2 shrink-0 font-sans"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isDesktopCommitting ? 'Pushing...' : 'Commit & Push to Main'}</span>
                </button>
              </div>

              {desktopCommitResult && (
                <div className={`p-3 rounded-lg border font-sans text-xs ${
                  desktopCommitResult.success 
                    ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' 
                    : 'bg-rose-950/60 border-rose-600 text-rose-200'
                }`}>
                  {desktopCommitResult.success ? (
                    <div>✓ Committed and pushed successfully to origin!</div>
                  ) : (
                    <div>Error: {desktopCommitResult.error}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Critical Security Callout Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-2 border-amber-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            <h3 className="text-lg font-bold text-amber-400 tracking-tight flex items-center space-x-2">
              <span>Token Security & Protection Protocol</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700">
                Client-Side Sandbox
              </span>
            </h3>
            <p className="leading-relaxed">
              A <strong>Personal Access Token (PAT)</strong> acts as your password and bypasses Two-Factor Authentication (2FA).
              Treat it with the utmost confidentiality.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1 text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Stored Locally Only:</strong> Kept in your browser’s private <code>localStorage</code>.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>No Intermediary Server:</strong> Connects directly to <code>api.github.com</code> via TLS.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Least Privilege:</strong> Grant only <em>Contents</em> and <em>Pull Requests</em> write access.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Set Expiration:</strong> Pick 30 to 90 days. Never choose "No expiration".</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step 1: Authentication Status or Generation Walkthrough */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <Key className="w-5 h-5 text-emerald-400" />
              <span>Git Provider Authentication</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Connect your GitHub or GitLab token to enable one-click pull request generation
            </p>
          </div>

          {authConfig?.isValid && (
            <button
              onClick={onClearToken}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Disconnect & Revoke Local Token</span>
            </button>
          )}
        </div>

        {authConfig?.isValid ? (
          <div className="bg-slate-950 p-5 rounded-xl border border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {authConfig.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={authConfig.avatarUrl}
                  alt={authConfig.username}
                  className="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-lg">
                  {authConfig.username?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-base">@{authConfig.username}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-semibold uppercase">
                    {authConfig.provider}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scopes: {authConfig.scopes?.join(', ') || 'Fine-grained repo contents & pull requests'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Ready to Submit PRs</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Provider Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setProvider('github')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  provider === 'github'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                GitHub Setup
              </button>
              <button
                onClick={() => setProvider('gitlab')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  provider === 'gitlab'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                GitLab Setup
              </button>
              <button
                onClick={() => setProvider('codeberg')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  provider === 'codeberg'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Codeberg / Forgejo Setup
              </button>
            </div>

            {/* Walkthrough Instructions */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs space-y-3">
              {provider === 'github' ? (
                <>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">Create a Fine-Grained GitHub Token (Recommended)</h4>
                    <a
                      href="https://github.com/settings/tokens?type=beta"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      <span>Open GitHub Token Generator</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                    <li>Click <strong>"Generate new token"</strong> in the link above.</li>
                    <li>Token name: <code className="text-yellow-300">Example.org Grantwriting Dashboard</code></li>
                    <li>Expiration: Select <strong>30 days</strong> or <strong>60 days</strong>.</li>
                    <li>Repository access: Choose <strong>"Only select repositories"</strong> ➔ select <code>ExampleOrg/grantwriting</code> (or your organization repo / fork).</li>
                    <li>Under <strong>"Repository permissions"</strong>, grant:
                      <span className="text-emerald-400 font-semibold"> Contents: Read & write</span> and
                      <span className="text-emerald-400 font-semibold"> Pull requests: Read & write</span>.
                    </li>
                    <li>Click <strong>"Generate token"</strong> and paste the secret below:</li>
                  </ol>
                </>
              ) : provider === 'gitlab' ? (
                <>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">Create a GitLab Personal Access Token</h4>
                    <a
                      href="https://gitlab.com/-/user_settings/personal_access_tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      <span>Open GitLab Token Generator</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                    <li>Token name: <code className="text-yellow-300">Example.org Grant Assistant</code></li>
                    <li>Expiration date: Pick a date 30–60 days ahead.</li>
                    <li>Select scopes: Check <strong className="text-emerald-400">api</strong> or <strong className="text-emerald-400">write_repository</strong>.</li>
                    <li>Click <strong>"Create personal access token"</strong> and copy the token string:</li>
                  </ol>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">Create a Codeberg / Forgejo Access Token</h4>
                    <a
                      href="https://codeberg.org/user/settings/applications"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      <span>Open Codeberg Token Generator</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                    <li>Token name: <code className="text-yellow-300">Example.org Grant Assistant</code></li>
                    <li>Permissions: Under <strong>repository</strong>, check <strong className="text-emerald-400">read:repository</strong> and <strong className="text-emerald-400">write:repository</strong> (or check <strong>repo</strong>). Under <strong>issue</strong>, check <strong className="text-emerald-400">read:issue</strong> and <strong className="text-emerald-400">write:issue</strong>.</li>
                    <li>Click <strong>"Generate Token"</strong> and copy the token string.</li>
                  </ol>
                  <div className="pt-2">
                    <label className="block text-slate-400 text-[11px] mb-1 font-medium">Forgejo Instance Base URL:</label>
                    <input
                      type="text"
                      value={instanceUrl}
                      onChange={(e) => setInstanceUrl(e.target.value)}
                      placeholder="https://codeberg.org"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </>
              )}

              {/* Input and Verify Button */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder={`Paste your ${provider === 'github' ? 'ghp_ or github_pat_' : provider === 'gitlab' ? 'glpat-' : 'Codeberg/Forgejo'} token here...`}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <button
                  onClick={handleVerifyToken}
                  disabled={isValidating}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white transition shadow-sm flex items-center justify-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isValidating ? 'Validating Token...' : 'Verify & Store Securely'}</span>
                </button>
              </div>

              {validationError && (
                <p className="text-red-400 text-xs font-semibold mt-2 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{validationError}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Pull Request Creation Wizard */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <GitPullRequest className="w-5 h-5 text-blue-400" />
            <span>Pull Request Submission Wizard</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit grant edits directly as a reviewed branch and pull request in Git
          </p>
        </div>

        {prResultUrl ? (
          <div className="bg-emerald-950/60 border border-emerald-600 rounded-xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Pull Request Created Successfully!</h4>
            <p className="text-xs text-slate-300">
              Your updates to <code className="text-emerald-300">{selectedDocPath}</code> have been committed to branch <code>{branchName}</code> and opened for team review.
            </p>
            <div className="pt-2">
              <a
                href={prResultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm shadow-lg transition"
              >
                <span>View Pull Request on {authConfig?.provider === 'github' ? 'GitHub' : 'GitLab'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <button
              onClick={() => {
                setPrResultUrl('');
                setBranchName(`update-grants-${Date.now().toString().slice(-6)}`);
              }}
              className="text-xs text-slate-400 hover:text-white underline pt-2 block mx-auto"
            >
              Create another pull request
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Target File & Repository */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Markdown File</label>
                <select
                  value={selectedDocPath}
                  onChange={(e) => {
                    setSelectedDocPath(e.target.value);
                    setPrTitle(`docs(grants): update ${e.target.value.split('/').pop()} proposal`);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {allDocs.map(doc => (
                    <option key={doc.relativePath} value={doc.relativePath}>
                      {doc.fileName} {editedFiles[doc.relativePath] !== undefined ? '★ (Locally Modified)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Branch Name</label>
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3 py-2">
                  <GitBranch className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="bg-transparent w-full text-white focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* PR Title */}
            <div className="text-xs">
              <label className="block text-slate-400 font-medium mb-1">Pull Request Title</label>
              <input
                type="text"
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold"
              />
            </div>

            {/* PR Description */}
            <div className="text-xs">
              <label className="block text-slate-400 font-medium mb-1">Pull Request Description</label>
              <textarea
                rows={4}
                value={prBody}
                onChange={(e) => setPrBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-mono leading-relaxed"
              />
            </div>

            {/* File status notice & Diff Review */}
            <div className="space-y-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {editedFiles[selectedDocPath] !== undefined 
                      ? 'Submitting with your in-browser saved edits' 
                      : 'Submitting repository standard version'}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowDiff(prev => !prev)}
                  className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold px-2 py-1 rounded bg-slate-900 border border-slate-800 transition"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>{showDiff ? 'Hide Diff' : 'Review Diff'}</span>
                  {showDiff ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showDiff && (
                <VisualDiffViewer
                  originalContent={allDocs.find(d => d.relativePath === selectedDocPath)?.content || ''}
                  modifiedContent={editedFiles[selectedDocPath] !== undefined ? editedFiles[selectedDocPath] : (allDocs.find(d => d.relativePath === selectedDocPath)?.content || '')}
                  fileName={selectedDocPath}
                />
              )}
            </div>

            {prError && (
              <p className="text-red-400 text-xs font-semibold flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{prError}</span>
              </p>
            )}

            {/* Submit PR Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCreatePR}
                disabled={!authConfig || isSubmittingPR}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white transition shadow-lg flex items-center space-x-2"
              >
                <GitPullRequest className="w-4 h-4" />
                <span>{isSubmittingPR ? 'Committing & Opening PR...' : 'Submit Pull Request to Main'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
