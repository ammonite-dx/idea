import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import webpack from 'webpack';

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {};

// 開発モードの場合のみCloudflareの開発プラットフォームをセットアップ
if (process.env.NODE_ENV === 'development') {
  (async () => {
    try {
      await setupDevPlatform();
      console.log("Cloudflare development platform (for local D1 access etc.) successfully set up for Next.js.");
      if (process.env.DB) {
        console.log("☑️ process.env.DB in next.config.ts IS DEFINED.");
        console.log("   Type of process.env.DB:", typeof process.env.DB);
      } else {
        console.error("‼️ process.env.DB in next.config.ts IS UNDEFINED after setupDevPlatform.");
      }
    } catch (e) {
      console.error('Failed to set up Cloudflare development platform:', e);
    }
  })();
}

export default nextConfig;
