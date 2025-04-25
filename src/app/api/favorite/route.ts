export const runtime = "edge";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

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

export async function POST(request: Request) {
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

export async function DELETE(request: Request) {
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

export async function GET(request: Request) {
  const userId = await getUserIdFromCookie();
  // 未ログイン時はお気に入りにしていない扱い
  if (!userId) {
    return NextResponse.json({ isFavorite: false });
  }

  const url = new URL(request.url);
  const recordKind = url.searchParams.get("recordKind");
  const recordId   = url.searchParams.get("recordId");
  if (!recordKind || !recordId) {
    return NextResponse.json(
      { error: "Missing query parameters" },
      { status: 400 }
    );
  }

  const exists = await prisma.favorite.findFirst({
    where: { 
      user_id: userId,
      record_kind: recordKind,
      record_id: recordId },
  });

  return NextResponse.json({ isFavorite: Boolean(exists) });
}
