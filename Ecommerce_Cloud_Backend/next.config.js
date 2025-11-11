/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',
  },
  // Removed rewrites - API routes are in the same Next.js app
};

module.exports = nextConfig;
