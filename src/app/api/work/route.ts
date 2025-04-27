export const runtime = "edge";

import { NextResponse } from "next/server";
import { D1Database } from "@cloudflare/workers-types";
import { Work } from "@/types/types";
import { toArray,toString } from "@/utils/utils";
import { WORK_SUPPLEMENTS,WORK_STATS,WORK_SKILLS } from "@/consts/work";
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
    const searchResult = await prisma.works.findUnique({where: {id: id}});
    if (!searchResult) return NextResponse.json({ error: "Work not found" }, { status: 404 });
    const work: Work = {
        kind: "work",
        id: id,
        supplement: searchResult.supplement,
        name: searchResult.name,
        stat: searchResult.stat,
        skills: searchResult.skills.split(" "),
        emblems: searchResult.emblems ? searchResult.emblems.split(" ") : null,
    };
    return NextResponse.json(work);
}

export async function POST(
    request: Request,
    { env }: { env: { DB: D1Database } }
) {
    // prismaインスタンスを取得
    const prisma = getPrisma(env.DB);
    // リクエストボディを取得
    const searchParams = await request.json();
    // 検索結果を取得
    const searchCondition = {
        where: {
            AND: [
                { name: { contains: toString(searchParams["name"], "") } },
                {OR: toArray(searchParams["supplement"], WORK_SUPPLEMENTS).map(supplement => ({supplement: supplement}))},
                {OR: toArray(searchParams["stat"], WORK_STATS).map(stat => ({stat: {contains: stat}}))},
                {OR: toArray(searchParams["skill"], WORK_SKILLS).map(skill => ({skills: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))},
              ],
        },
        select: {
            id: true
        },
        };
        const searchResults = await prisma.works.findMany(searchCondition);
        const works: { [key: string]: Work[] } = { "ワークス": (await Promise.all(searchResults.map(async ({id}: {id:string}) => (await (await fetch(`/api/work?id=${id}`,{method:"GET"})).json()) as Work))) };
    return NextResponse.json(works);
}