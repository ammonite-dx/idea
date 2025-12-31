import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import type { D1Database } from '@cloudflare/workers-types';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export function getPrismaClient(d1Binding: D1Database): PrismaClient {
  // 1. すでに作成済みのインスタンスがあれば、それを即座に返す (環境問わず！)
  if (global.prisma) {
    return global.prisma;
  }

  // 2. まだなければ作成する
  const adapter = new PrismaD1(d1Binding);
  
  const prisma = new PrismaClient({
    adapter,
    // ログ設定は必要に応じて調整（本番は error だけにする等も一般的ですが、元のままでもOK）
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
      { emit: 'event', level: 'error' }
    ]
  });

  // 3. 作成したインスタンスをグローバル変数に保存（キャッシュ）する
  global.prisma = prisma;

  return prisma;
}