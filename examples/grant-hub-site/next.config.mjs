/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` : '/grant_utils';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.CI && process.env.GITHUB_ACTIONS ? repoName : '');

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
