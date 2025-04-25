// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // 本番／Edge ランタイム（Cloudflare Pages）では D1 アダプターを動的ロード
  // この行は開発モードでは実行されず、require も呼ばれません
  // └─ そのため webpack の IgnorePlugin によってバンドル外になっていても安全
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaD1HTTP } = require("@prisma/adapter-d1");

  prisma = new PrismaClient({
    adapter: new PrismaD1HTTP({
      CLOUDFLARE_D1_TOKEN:    process.env.CLOUDFLARE_D1_TOKEN!,
      CLOUDFLARE_ACCOUNT_ID:  process.env.CLOUDFLARE_ACCOUNT_ID!,
      CLOUDFLARE_DATABASE_ID: process.env.CLOUDFLARE_DATABASE_ID!,
    }),
  });
} else {
  // 開発モード: 普通の SQLite (または .env の DATABASE_URL) で動かす
  prisma = new PrismaClient();
}

export default prisma;