import type { NextConfig } from 'next';

const apiBaseUrl = process.env.API_BASE_URL?.replace(/\/$/, '');

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    if (!apiBaseUrl) {
      return [];
    }

    return [
      {
        source: '/backend-api/:path*',
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
