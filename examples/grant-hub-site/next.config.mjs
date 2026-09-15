/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` : '/grant_utils';

// In production or CI, basePath MUST be '/grant_utils' for GitHub Pages to resolve assets.
// In local dev ('next dev'), keep basePath empty so http://localhost:3000 works directly.
let basePath = '';
if (process.env.NEXT_PUBLIC_BASE_PATH) {
  basePath = process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, '');
} else if (process.env.CI || process.env.GITHUB_ACTIONS || isProd) {
  basePath = repoName;
}

const nextConfig = {
  output: 'export',
  distDir: 'out',
  transpilePackages: ['@tekromancy/grant_utils'],
  images: {
    unoptimized: true,
  },
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
    };
    return config;
  },
};

export default nextConfig;
