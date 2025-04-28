import type { D1Database } from '@prisma/adapter-d1'

declare global {
  const DB: D1Database
}

export {}