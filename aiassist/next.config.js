/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  // Disable Next.js dev overlay to hide error notifications
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
}

module.exports = nextConfig

