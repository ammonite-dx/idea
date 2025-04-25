import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Webpack 設定のカスタマイズ
  webpack: (
    config: any,
    { dev, isServer }: { dev: boolean; isServer: boolean }
  ) => {
    // 開発モードかつサーバー側ビルド時に、D1 アダプター周りを無視
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