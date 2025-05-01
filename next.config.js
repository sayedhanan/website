/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure Turbopack (next.js 15 syntax)
    turbopack: {
      // Turbopack options if needed
    },
    // Make sure mdx files are processed properly
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  };
  
  module.exports = nextConfig;