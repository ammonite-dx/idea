import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

// 開発モードの場合のみCloudflareの開発プラットフォームをセットアップ
if (process.env.NODE_ENV === 'development') {
  (async () => {
    try {
      await setupDevPlatform();
    } catch (e) {
      console.error('Failed to set up Cloudflare development platform:', e);
    }
  })();
}

export default nextConfig;
