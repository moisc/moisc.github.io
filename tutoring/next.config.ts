import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  basePath: '/tutoring',
  outputFileTracingRoot: path.join(__dirname, '../'),
}

export default nextConfig
