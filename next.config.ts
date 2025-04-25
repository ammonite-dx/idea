import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // SWCベースのミニファイを有効化（Webpackのminifyプラグインをスキップ）
  swcMinify: true,

  // （既存のwebpack ignore設定があればそのまま）
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      const { IgnorePlugin } = require('webpack');
      config.plugins = config.plugins || [];
      config.plugins.push(
        new IgnorePlugin({
          resourceRegExp: /@prisma\/adapter-d1|miniflare|@cloudflare\/workerd-windows-64/,
        })
      );
    }
    return config;
  },
};

export default nextConfig;