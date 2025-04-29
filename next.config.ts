import type { NextConfig } from 'next'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
  webpack(config) {
    // Edge Runtime 向けに Node.js ビルトインを除外
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
      crypto: false,
      http: false,
      https: false,
      net: false,
      tls: false,
      os: false,
      stream: false,
      util: false,
      url: false,
      assert: false,
    }

    return config
  },
}

export default nextConfig