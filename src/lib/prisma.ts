import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import type { D1Database } from '@cloudflare/workers-types'; // 型定義をインポート

// グローバルスコープにPrismaClientのインスタンスをキャッシュするための変数
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// D1のバインディングを受け取ってPrismaClientを初期化または返す関数
export function getPrismaClient(d1Binding: D1Database): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    const adapter = new PrismaD1(d1Binding);
    return new PrismaClient({ adapter });
  } else {
    if (!global.prisma) {
      const adapter = new PrismaD1(d1Binding);
      global.prisma = new PrismaClient({ adapter });
    }
    return global.prisma;
  }
}