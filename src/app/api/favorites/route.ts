export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";           // ← 追加
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // JWT を検証してペイロードを取り出す
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const userId = token?.sub;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recordKind, recordId } = await req.json();
  if (!recordKind || !recordId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const result = await prisma.favorite.create({
    data: {
      user_id:     userId,
      record_kind: recordKind,
      record_id:   recordId,
    },
  });

  return NextResponse.json({ ok: true, favorite: result });
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const userId = token?.sub;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recordKind, recordId } = await req.json();
  if (!recordKind || !recordId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: {
      user_id:     userId,
      record_kind: recordKind,
      record_id:   recordId,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const userId = token?.sub;
  if (!userId) {
    return NextResponse.json({ isFavorite: false });
  }

  const { searchParams } = new URL(req.url);
  const recordKind = searchParams.get("recordKind");
  const recordId   = searchParams.get("recordId");
  if (!recordKind || !recordId) {
    return NextResponse.json(
      { error: "Missing query parameters" },
      { status: 400 }
    );
  }

  const exists = await prisma.favorite.findFirst({
    where: {
      user_id:     userId,
      record_kind: recordKind,
      record_id:   recordId,
    },
  });

  return NextResponse.json({ isFavorite: Boolean(exists) });
}