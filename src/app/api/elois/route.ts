export const runtime = "edge";

import { NextResponse } from "next/server";
import { D1Database } from "@cloudflare/workers-types";
import { Elois,Faq,Info } from "@/types/types";
import { toArray,toString } from "@/utils/utils";
import { ELOIS_TIMINGS,ELOIS_DFCLTIES,ELOIS_RNGS,ELOIS_SKILLS,ELOIS_SUPPLEMENTS,ELOIS_TARGETS,ELOIS_TYPES,ELOIS_URGES } from "@/consts/elois";
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
    const searchResult = await prisma.elois.findUnique({where: {id: id}});
    if (!searchResult) return NextResponse.json({ error: "Elois not found" }, { status: 404 });
    const { ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => (await (await fetch(`/api/faq?id=${id}`,{method:"GET"})).json()) as Faq))) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => (await (await fetch(`/api/info?id=${id}`,{method:"GET"})).json()) as Info))) : null;
    const elois: Elois = {
        kind: "elois",
        ...base,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return NextResponse.json(elois);
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
                {OR: toArray(searchParams["supplement"], ELOIS_SUPPLEMENTS).map(supplement => ({supplement: supplement}))},
                {OR: [
                  {update: null},
                  {NOT: toArray(searchParams["supplement"], ELOIS_SUPPLEMENTS).map(supplement => ({update: {contains: supplement}}))}
                ]},
                {OR: toArray(searchParams["type"], ELOIS_TYPES).map(type => ({type: type}))},
                {name: {contains: toString(searchParams["name"], "")}},
                {OR: toArray(searchParams["restrict"], ELOIS_TIMINGS).map(timing => ({timing: {contains: timing}}))},
                {OR: toArray(searchParams["skill"], ELOIS_SKILLS).map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))},
                {OR: toArray(searchParams["dfclty"], ELOIS_DFCLTIES).map(dfclty => ({dfclty: {contains: dfclty}}))},
                {OR: toArray(searchParams["target"], ELOIS_TARGETS).map(target => ({target: {contains: target}}))},
                {OR: toArray(searchParams["rng"], ELOIS_RNGS).map(rng => ({rng: {contains: rng}}))},
                {OR: toArray(searchParams["urge"], ELOIS_URGES).map(urge => ({urge: {contains: urge}}))},
                {effect: searchParams["effect"] && {contains: toString(searchParams["effect"], "")}},
              ],
        },
        orderBy: [
            {urge_order: "asc" as const},
            {type_order: "asc" as const},
        ],
        select: {
            id: true
        },
        };
        const searchResults = await prisma.elois.findMany(searchCondition);
        const eloises: { [key: string]: Elois[] } = { "Eロイス": (await Promise.all(searchResults.map(async ({id}: {id:string}) => (await (await fetch(`/api/elois?id=${id}`,{method:"GET"})).json()) as Elois))) };
    return NextResponse.json(eloises);
}