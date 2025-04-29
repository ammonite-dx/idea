import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import webpack from 'webpack';

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {

    // miniflare の読み込みを丸ごと無視
    config.plugins = config.plugins || []
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^miniflare$/,
      })
    )

    // 本番ビルドで Webpack ミニファイをスキップ
    if (!dev) {
      config.optimization = config.optimization || {}
      config.optimization.minimize = false
    }

    return config
  },
};

export default nextConfig;
