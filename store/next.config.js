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
};

module.exports = nextConfig;
