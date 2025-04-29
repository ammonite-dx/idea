import type { NextConfig } from 'next'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import webpack from 'webpack'

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
  webpack(config, { dev }) {
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

    // 開発時にのみ miniflare を無視
    if (dev) {
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /^miniflare$/ })
      )
    }

    return config
  },
}

export default nextConfig