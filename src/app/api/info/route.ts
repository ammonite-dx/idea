export const runtime = "edge";

import { NextResponse } from "next/server";
import { D1Database } from "@cloudflare/workers-types";
import { Info } from "@/types/types";
import getPrisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { env }: { env: { DB: D1Database } }
) {
    // prismaインスタンスを取得
    const prisma = getPrisma(env.DB);
    // URLから検索対象のidを取得
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    // 検索結果を取得
    const searchResult = await prisma.info.findUnique({where: {id: id}});
    if (!searchResult) return NextResponse.json({ error: "Info not found" }, { status: 404 });
    const info: Info = {
        kind: "info",
        id: id,
        title: searchResult.title,
        content: searchResult.content,
    };
    return NextResponse.json(info);
}