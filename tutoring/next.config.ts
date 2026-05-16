import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/tutoring',
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
