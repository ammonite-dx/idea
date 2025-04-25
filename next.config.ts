import type { NextConfig } from 'next'
import webpack from 'webpack'

const nextConfig: NextConfig = {
  // Next15 では swcMinify は非対応なので消しておく
  // swcMinify: true,

  webpack: (config, { dev }) => {
    // ────────────────────────────────────────────────
    // 1. エッジで不要な Node ビルトインはバンドルしない
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

    // 2. miniflare の読み込みを丸ごと無視
    config.plugins = config.plugins || []
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^miniflare$/,
      })
    )

    // 3. 本番ビルドで Webpack ミニファイはスキップ
    if (!dev) {
      config.optimization = config.optimization || {}
      config.optimization.minimize = false
    }

    return config
  },
}

export default nextConfig