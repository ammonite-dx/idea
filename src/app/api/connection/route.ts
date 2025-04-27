export const runtime = "edge";

import { NextResponse } from "next/server";
import { D1Database } from "@cloudflare/workers-types";
import { Connection,Faq,Info } from "@/types/types";
import { toArray,toString } from "@/utils/utils";
import { ITEM_CATEGORIES, ITEM_SUPPLEMENTS } from "@/consts/item";
import { CONNECTION_SKILLS } from "@/consts/connection";
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
    const searchResult = await prisma.connection.findUnique({where: {id: id}});
    if (!searchResult) return NextResponse.json({ error: "Connection not found" }, { status: 404 });
    const { ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => (await (await fetch(`/api/faq?id=${id}`,{method:"GET"})).json()) as Faq))) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => (await (await fetch(`/api/info?id=${id}`,{method:"GET"})).json()) as Info))) : null;
    const connection: Connection = {
        kind: "connection",
        ...base,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return NextResponse.json(connection);
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
    const connections: { [key: string]: Connection[] } = Object.fromEntries(await Promise.all(toArray(searchParams["category"], ITEM_CATEGORIES).map(async category => {
        const searchCondition = {
          where: {
            AND: [
                {category: category},
                { name: { contains: toString(searchParams["name"], "") } },
                { OR: toArray(searchParams["supplement"], ITEM_SUPPLEMENTS).map(supplement => ({ supplement: supplement })) },
                { OR: [
                    { update: null },
                    { NOT: toArray(searchParams["supplement"], ITEM_SUPPLEMENTS).map(supplement => ({ update: { contains: supplement } })) }
                ] },
                (searchParams["procure"]==null && searchParams["stock"]==null && searchParams["exp"]==null) ? {}
                : (searchParams["procure"]!=null && searchParams["stock"]==null && searchParams["exp"]==null) ? {AND: [{procure_int: {lte: parseInt(toString(searchParams["procure"], "0"))}}, {exp_int: null}]} 
                : (searchParams["procure"]==null && searchParams["stock"]!=null && searchParams["exp"]==null) ? {AND: [{stock_int: {lte: parseInt(toString(searchParams["stock"], "0"))}}, {exp_int: null}]} 
                : (searchParams["procure"]!=null && searchParams["stock"]!=null && searchParams["exp"]==null) ? {AND: [{procure_int: {lte: parseInt(toString(searchParams["procure"], "0"))}}, {stock_int: {lte: parseInt(toString(searchParams["stock"], "0"))}}, {exp_int: null}]} 
                : (searchParams["procure"]==null && searchParams["stock"]==null && searchParams["exp"]!=null) ? {exp_int: {lte: parseInt(toString(searchParams["exp"], "0"))}} 
                : (searchParams["procure"]!=null && searchParams["stock"]==null && searchParams["exp"]!=null) ? {OR: [{procure_int: {lte: parseInt(toString(searchParams["procure"], "0"))}}, {exp_int: {lte: parseInt(toString(searchParams["exp"], "0"))}}]} 
                : (searchParams["procure"]==null && searchParams["stock"]!=null && searchParams["exp"]!=null) ? {OR: [{stock_int: {lte: parseInt(toString(searchParams["stock"], "0"))}}, {exp_int: {lte: parseInt(toString(searchParams["exp"], "0"))}}]} 
                : {OR: [{AND: [{procure_int: {lte: parseInt(toString(searchParams["procure"], "0"))}}, {stock_int: {lte: parseInt(toString(searchParams["stock"], "0"))}}]}, {exp_int: {lte: parseInt(toString(searchParams["exp"], "0"))}}]},
                { effect: searchParams["effect"] && { contains: toString(searchParams["effect"], "") } },
                { OR: toArray(searchParams["connection-skill"], CONNECTION_SKILLS).map(skill => ({ skill: { contains: skill } })) }
            ],
          },
          orderBy: [
            {type_order: "asc" as const},
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
          select: { id: true },
        };
        const searchResultsInCategory = await prisma.connection.findMany(searchCondition);
        const connectionsInCategory = await Promise.all(searchResultsInCategory.map(async ({id}: {id:string}) => (await (await fetch(`/api/connection?id=${id}`,{method:"GET"})).json()) as Connection));
        return [category, connectionsInCategory]
    })));
    return NextResponse.json(connections);
}