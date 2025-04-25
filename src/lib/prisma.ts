import { PrismaClient } from '@prisma/client'

declare global {
  // Next.js のホットリロード対策でグローバルにキャッシュ
  var prisma: PrismaClient | undefined
}

// production では毎回新規、開発環境ではグローバルキャッシュ
export const prisma =
  global.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}