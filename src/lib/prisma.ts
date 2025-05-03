import { PrismaClient }   from "@prisma/client";
import { PrismaD1 }        from "@prisma/adapter-d1";
import { D1Database }      from "@cloudflare/workers-types";

export default function getPrismaClient(db: D1Database): PrismaClient {
  console.log("getPrismaClient called");
  db.prepare = db.prepare.bind(db);
  const prisma = new PrismaClient({ adapter: new PrismaD1(db) });
  console.log("PrismaClient created", prisma);
  return prisma;
}