export const runtime = "edge";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import getPrismaClient from "@/lib/prisma";
import { D1Database } from "@cloudflare/workers-types";

// 環境変数からバイト配列を作成
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Cookie から JWT を取り出して userId を返すユーティリティ
async function getUserIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function onRequestPost(
  request: Request,
  { env }: { env: { DB: D1Database } }
) {
  const prisma = getPrismaClient(env);

  const userId = await getUserIdFromCookie();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recordKind, recordId } = await request.json();
  if (!recordKind || !recordId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const favorite = await prisma.favorite.create({
    data: {
      user_id: userId,
      record_kind: recordKind,
      record_id: recordId,
    },
  });

  return NextResponse.json({ ok: true, favorite });
}

export async function onRequestDelete(
  request: Request,
  { env }: { env: { DB: D1Database } }
) {
  const prisma = getPrismaClient(env);

  const userId = await getUserIdFromCookie();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recordKind, recordId } = await request.json();
  if (!recordKind || !recordId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: {
      user_id: userId,
      record_kind: recordKind,
      record_id: recordId,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function onRequestGet(
  request: Request,
  { env }: { env: { DB: D1Database } }
) {
  const prisma = getPrismaClient(env);

  // ユーザー情報を取得
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const recordKind = url.searchParams.get("record-kind");
  const recordId   = url.searchParams.get("record-id");
  if (!recordKind) {
    return NextResponse.json(
      { error: "Missing query parameters: record-kind" },
      { status: 400 }
    );
  }

  const favorites = await prisma.favorite.findMany({
    where: { 
      AND: [
        {user_id: userId},
        {record_kind: recordKind},
        (recordId === null) ? {} : { record_id: recordId },
      ],
    },
  });

  return NextResponse.json(favorites);
}
