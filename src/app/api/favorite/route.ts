export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { jwtVerify }   from 'jose';
import getPrismaClient  from '@/lib/prisma';
import { getRequestContext } from "@cloudflare/next-on-pages";

/* ──────────────────────────────────────────────────────────── */
/* eslint-disable @typescript-eslint/no-explicit-any            */
/* ──────────────────────────────────────────────────────────── */

function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(';').reduce((acc, part) => {
    const [k, ...vs] = part.split('=');
    const v = vs.join('=');
    if (k && v) acc[k.trim()] = decodeURIComponent(v.trim());
    return acc;
  }, {} as Record<string, string>);
}

async function getUserIdFromRequest(
  request: Request,
  secret: Uint8Array
): Promise<string | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const token = cookies.session;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
) {
  const { env } = getRequestContext();
  console.log(request);

  // 1) SQL 文を準備
  const stmt = env.DB.prepare("SELECT 1 AS x");

  // 2) パラメータが無いなら bind() を呼び出し
  const bound = stmt.bind();

  // 3) all() で結果を取ってみる
  const { results } = await bound.all();

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });

  /*
  const { env } = getRequestContext();

  console.log("env.DB type:", typeof env.DB);
  console.log("env.DB.prepare type:", typeof (env.DB as any).prepare);
  const stmt = (env.DB as any).prepare("SELECT 1 as x");
  console.log("stmt.bind type:", typeof (stmt as any).bind);

  const secret = new TextEncoder().encode(env.JWT_SECRET);

  const userId = await getUserIdFromRequest(request, secret);
  if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url  = new URL(request.url);
  const kind = url.searchParams.get('record-kind');
  if (!kind) {
      return NextResponse.json(
      { error: 'Missing query parameter: record-kind' },
      { status: 400 }
      );
  }
  const recordId = url.searchParams.get('record-id') ?? undefined;

  const prisma = getPrismaClient(env.DB);
  const where  = recordId
      ? { user_id: userId, record_kind: kind, record_id: recordId }
      : { user_id: userId, record_kind: kind };
  const favs   = await prisma.favorite.findMany({ where });

  return NextResponse.json(favs);
  */
}

export async function POST(
    request: Request,
) {
    const { env } = getRequestContext();
    const secret = new TextEncoder().encode(env.JWT_SECRET);

    const userId = await getUserIdFromRequest(request, secret);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recordKind, recordId } = (await request.json()) as any;
    if (!recordKind || !recordId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const prisma   = getPrismaClient(env.DB);
    const favorite = await prisma.favorite.create({
      data: { user_id: userId, record_kind: recordKind, record_id: recordId },
    });

  return NextResponse.json({ ok: true, favorite });
}

export async function DELETE(
  request: Request,
) {
  const { env } = getRequestContext();
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  const userId = await getUserIdFromRequest(request, secret);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { recordKind, recordId } = (await request.json()) as any;
  if (!recordKind || !recordId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const prisma = getPrismaClient(env.DB);
  await prisma.favorite.deleteMany({
    where: { user_id: userId, record_kind: recordKind, record_id: recordId },
  });

  return NextResponse.json({ ok: true });
}
