import type { NextConfig } from 'next'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

// 開発環境で Cloudflare Pages コンテキストを有効化
initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {

  webpack(config, { dev, webpack }) {
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
    }

    // 開発時のみ miniflare を無視
    if (dev) {
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /^miniflare$/ })
      )
    }

    return config
  },
}

export default nextConfig
