/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: process.env.NODE_ENV === 'production' ? false : false,
  },

  // Optimize for deployment
  compress: true,
  poweredByHeader: false,
  swcMinify: true,

  // Increase build timeout for static generation (in seconds)
  staticPageGenerationTimeout: 120,

  // Skip static generation for dynamic/slow pages
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

module.exports = nextConfig;
