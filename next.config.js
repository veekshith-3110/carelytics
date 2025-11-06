/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure proper error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  // Handle images and static assets
  images: {
    unoptimized: false,
  },
}

module.exports = nextConfig

