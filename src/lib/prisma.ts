import { PrismaClient }   from "@prisma/client";
import { PrismaD1 }        from "@prisma/adapter-d1";
import { D1Database }      from "@cloudflare/workers-types";

const cache: { [binding: string]: PrismaClient } = {};

export default function getPrismaClient(db: D1Database): PrismaClient {
  console.log("getPrismaClient called");
  const prisma = new PrismaClient({
    adapter: new PrismaD1(db),
  })
  console.log("PrismaClient created", prisma);
  return prisma;
}