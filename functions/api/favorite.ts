// functions/api/favorite.ts

import { jwtVerify } from "jose";
import getPrismaClient from "@/lib/prisma";
import type { PagesFunction, D1Database, Response as CFResponse } from "@cloudflare/workers-types";

type FavoriteRequest = {
  recordKind: string;
  recordId?:   string;
};

// ざっくり Cookie パース
function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(";").reduce((acc, part) => {
    const [k, v] = part.split("=").map((s) => s.trim());
    if (k && v) acc[k] = decodeURIComponent(v);
    return acc;
  }, {} as Record<string, string>);
}

export const onRequestGet: PagesFunction<{
  DB: D1Database;
  JWT_SECRET: string;
}> = async ({ request, env }) => {

  // 1) JWT_SECRET を env から取得
  const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

  // 2) Cookie → session トークン取得
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = parseCookies(cookieHeader);
  const token = cookies.session;
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }) as unknown as CFResponse;
  }

  // 3) トークン検証
  let userId: string;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (typeof payload.sub !== "string") throw new Error();
    userId = payload.sub;
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }) as unknown as CFResponse;
  }

  // 4) クエリパラメータ
  const url = new URL(request.url);
  const kind = url.searchParams.get("record-kind");
  if (!kind) {
    return new Response(
      JSON.stringify({ error: "Missing query parameter: record-kind" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    ) as unknown as CFResponse;
  }
  const id = url.searchParams.get("record-id") || undefined;

  // 5) Prisma
  const prisma = getPrismaClient(env);
  const favs = await prisma.favorite.findMany({
    where: { user_id: userId, record_kind: kind, ...(id ? { record_id: id } : {}) },
  });

  return new Response(JSON.stringify(favs), {
    headers: { "Content-Type": "application/json" },
  }) as unknown as CFResponse;
};

export const onRequestPost: PagesFunction<{
  DB: D1Database;
  JWT_SECRET: string;
}> = async ({ request, env }) => {
  // env から JWT_SECRET を取得
  const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

  // Cookie → session トークン
  const cookies = parseCookies(request.headers.get("Cookie") || "");
  const token   = cookies.session;
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }) as unknown as CFResponse;
  }

  // JWT 検証
  let userId: string;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (typeof payload.sub !== "string") throw new Error();
    userId = payload.sub;
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }) as unknown as CFResponse;
  }

  // リクエストボディ
  const { recordKind, recordId } = await request.json() as FavoriteRequest;
  if (!recordKind || !recordId) {
    return new Response(
      JSON.stringify({ error: "Missing parameters" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    ) as unknown as CFResponse;
  }

  // DB 操作
  const prisma   = getPrismaClient(env);
  const favorite = await prisma.favorite.create({
    data: {
      user_id:     userId,
      record_kind: recordKind,
      record_id:   recordId,
    },
  });

  return new Response(JSON.stringify({ ok: true, favorite }), {
    headers: { "Content-Type": "application/json" },
  }) as unknown as CFResponse;
};

// DELETE /api/favorite
export const onRequestDelete: PagesFunction<{
  DB: D1Database;
  JWT_SECRET: string;
}> = async ({ request, env }) => {
  // env から JWT_SECRET を取得
  const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

  // Cookie → session トークン
  const cookies = parseCookies(request.headers.get("Cookie") || "");
  const token   = cookies.session;
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }) as unknown as CFResponse;
  }

  // JWT 検証
  let userId: string;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (typeof payload.sub !== "string") throw new Error();
    userId = payload.sub;
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }) as unknown as CFResponse;
  }

  // リクエストボディ
  const { recordKind, recordId } = await request.json() as FavoriteRequest;
  if (!recordKind || !recordId) {
    return new Response(
      JSON.stringify({ error: "Missing parameters" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    ) as unknown as CFResponse;
  }

  // DB 操作
  const prisma = await getPrismaClient(env);
  await prisma.favorite.deleteMany({
    where: {
      user_id:     userId,
      record_kind: recordKind,
      record_id:   recordId,
    },
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  }) as unknown as CFResponse;
};
