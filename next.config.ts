import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // GitHub Pages 정적 export
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  turbopack: {
    root: path.resolve(__dirname),
  },

  // Ensure content directory is accessible at build time
  serverExternalPackages: ['gray-matter'],
}

export default nextConfig
