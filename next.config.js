/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Disable strict mode to avoid double renders in development
  reactStrictMode: false,
  // Using the optimized webpack config in Next.js 15
  webpack: (config, { isServer }) => {
    // Next.js 15 has better handling of these issues, but we'll keep some essentials
    if (!isServer) {
      // Modern handling of Node.js polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
