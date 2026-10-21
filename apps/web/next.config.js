const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    try {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.dirname(require.resolve('react/package.json')),
        'react-dom': path.dirname(require.resolve('react-dom/package.json')),
      };
    } catch (e) {
      // Fallback if not resolvable
    }
    return config;
  },
};

module.exports = nextConfig;