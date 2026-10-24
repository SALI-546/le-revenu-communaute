import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The Docker image runs the standalone server; local `next start` keeps the default output.
  output: process.env.NEXT_STANDALONE === 'true' ? 'standalone' : undefined,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: path.join(__dirname),
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
