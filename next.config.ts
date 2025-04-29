import type { NextConfig } from 'next'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

// 開発環境で Cloudflare Pages コンテキストを有効化
initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {

  swcMinify: true,

  webpack( config ) {
    // Edge Runtime 向けに不要な Node.js ビルトインを除外
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
      zlib: false,
      child_process: false,
      readline: false,
      module: false,
      worker_threads: false,
      events: false,
    }

    config.optimization = config.optimization || {}
    config.optimization.minimize = false

    return config
  },
}

export default nextConfig
