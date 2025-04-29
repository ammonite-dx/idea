import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {

    // 本番ビルドで Webpack ミニファイをスキップ
    if (!dev) {
      config.optimization = config.optimization || {}
      config.optimization.minimize = false
    }

    return config
  },
};

export default nextConfig;
