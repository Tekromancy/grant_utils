export interface GitFileStatus {
  status: string;
  path: string;
}

export interface GitStatusResult {
  isGitRepo: boolean;
  clean: boolean;
  branch: string;
  files: GitFileStatus[];
  raw: string;
  error?: string;
}

export interface GitCommitResult {
  success: boolean;
  output?: string;
  error?: string;
}

export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getPlatform: () => string;
  isDesktop: boolean;
  openExternal: (url: string) => Promise<void>;
  onThemeChanged: (callback: (theme: string) => void) => () => void;
  onNavigateTab: (callback: (tab: string) => void) => () => void;
  readLocalFile: (relativePath: string) => Promise<string | null>;
  writeLocalFile: (relativePath: string, content: string) => Promise<boolean>;
  getGitStatus: () => Promise<GitStatusResult>;
  gitCommitAndPush: (message: string) => Promise<GitCommitResult>;
  getStoredToken: () => Promise<any>;
  saveStoredToken: (config: any) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
