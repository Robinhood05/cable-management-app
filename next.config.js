/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: [],
    unoptimized: false,
  },
  
  // Compress responses
  compress: true,
  
  // Optimize production builds
  swcMinify: true,
  
  // Output configuration - Netlify plugin handles this automatically
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
