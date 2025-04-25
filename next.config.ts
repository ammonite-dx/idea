import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // これ以降の設定でミニファイを制御するので swcMinify は削除
  // swcMinify: true,  <-- removed, unsupported in v15 :contentReference[oaicite:0]{index=0}

  webpack: (config, { dev, isServer }) => {
    // 開発環境のサーバー側でだけ D1アダプター関連を無視
    if (dev && isServer) {
      const { IgnorePlugin } = require('webpack');
      config.plugins = config.plugins || [];
      config.plugins.push(
        new IgnorePlugin({
          resourceRegExp: /@prisma\/adapter-d1|miniflare|@cloudflare\/workerd-windows-64/,
        })
      );
    }

    // 本番ビルド時（dev === false）には Webpack のミニファイをオフ
    if (!dev) {
      config.optimization = config.optimization || {};
      config.optimization.minimize = false;
    }

    return config;
  },
};

export default nextConfig;