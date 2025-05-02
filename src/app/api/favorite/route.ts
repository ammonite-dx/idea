// src/app/api/favorite/route.ts
export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { jwtVerify }   from 'jose';
import getPrismaClient  from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';

// Workers ランタイムで自動的に注入される globals
declare const DB: D1Database;
declare const JWT_SECRET: string;

// ────────────────────────────────────────────────────────────
// ESLint の any 警告をこのファイルだけ無効化
/* eslint-disable @typescript-eslint/no-explicit-any */
// ────────────────────────────────────────────────────────────

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

export async function GET(request: Request) {
  const secret = new TextEncoder().encode(JWT_SECRET);

  const userId = await getUserIdFromRequest(request, secret);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const kind = url.searchParams.get('record-kind');
  if (!kind) {
    return NextResponse.json(
      { error: 'Missing query parameter: record-kind' },
      { status: 400 }
    );
  }
  const recordId = url.searchParams.get('record-id') ?? undefined;

  const prisma = getPrismaClient(DB);
  const where = recordId
    ? { user_id: userId, record_kind: kind, record_id: recordId }
    : { user_id: userId, record_kind: kind };
  const favorites = await prisma.favorite.findMany({ where });

  return NextResponse.json(favorites);
}

export async function POST(request: Request) {
  const secret = new TextEncoder().encode(JWT_SECRET);

  const userId = await getUserIdFromRequest(request, secret);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { recordKind, recordId } = (await request.json()) as any;
  if (!recordKind || !recordId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const prisma = getPrismaClient(DB);
  const favorite = await prisma.favorite.create({
    data: { user_id: userId, record_kind: recordKind, record_id: recordId },
  });

  return NextResponse.json({ ok: true, favorite });
}

export async function DELETE(request: Request) {
  const secret = new TextEncoder().encode(JWT_SECRET);

  const userId = await getUserIdFromRequest(request, secret);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { recordKind, recordId } = (await request.json()) as any;
  if (!recordKind || !recordId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const prisma = getPrismaClient(DB);
  await prisma.favorite.deleteMany({
    where: { user_id: userId, record_kind: recordKind, record_id: recordId },
  });

  return NextResponse.json({ ok: true });
}
