import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { AuthTokenConfig } from './types.js';

export function getConfigDir(customDir?: string): string {
  if (customDir) return customDir;
  if (process.env.GRANTWRITING_CONFIG_DIR) return process.env.GRANTWRITING_CONFIG_DIR;
  const standardDir = path.join(os.homedir(), '.config', 'grantwriting');
  const legacyDir = path.join(os.homedir(), '.config', 'acbf-grants');
  if (!fs.existsSync(standardDir) && fs.existsSync(legacyDir)) {
    return legacyDir;
  }
  return standardDir;
}

export function getLocalAuthToken(customConfigDir?: string): AuthTokenConfig | null {
  try {
    const configDir = getConfigDir(customConfigDir);
    const authFile = path.join(configDir, 'auth.json');
    if (!fs.existsSync(authFile)) return null;
    const data = fs.readFileSync(authFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveLocalAuthToken(config: AuthTokenConfig, customConfigDir?: string): void {
  try {
    const configDir = getConfigDir(customConfigDir);
    const authFile = path.join(configDir, 'auth.json');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
    }
    fs.writeFileSync(authFile, JSON.stringify(config, null, 2), { mode: 0o600, encoding: 'utf8' });
  } catch (err: any) {
    throw new Error(`Failed to save auth token: ${err.message}`);
  }
}

export function clearLocalAuthToken(customConfigDir?: string): void {
  try {
    const configDir = getConfigDir(customConfigDir);
    const authFile = path.join(configDir, 'auth.json');
    if (fs.existsSync(authFile)) {
      fs.unlinkSync(authFile);
    }
  } catch {
    // Ignore error
  }
}

export function readLocalMarkdownFile(repoRootDir: string, relativePath: string): string {
  const fullPath = path.resolve(repoRootDir, relativePath);
  return fs.readFileSync(fullPath, 'utf8');
}

export function saveLocalMarkdownFile(repoRootDir: string, relativePath: string, content: string): void {
  const fullPath = path.resolve(repoRootDir, relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content, 'utf8');
}
