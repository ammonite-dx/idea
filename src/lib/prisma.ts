import { PrismaClient } from "@prisma/client"
import { PrismaD1 } from "@prisma/adapter-d1"
import { D1Database } from "@cloudflare/workers-types"

export const runtime = "edge"

declare global {
  const DB: D1Database
}

export const prisma = new PrismaClient({
  adapter: new PrismaD1(DB),
})