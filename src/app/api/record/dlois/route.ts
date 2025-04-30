export const runtime = "edge";

import { NextResponse } from "next/server";
import { Power,Dlois,Faq,Info } from "@/types/types";
import { toArray,toString } from "@/utils/utils";
import { DLOIS_TYPES, DLOIS_RESTRICTS, DLOIS_SUPPLEMENTS } from '@/consts/dlois';
import getPrismaClient from "@/lib/prisma";

export async function GET(
    request: Request,
) {
    // prismaインスタンスを取得
    const prisma = await getPrismaClient();
    // URLから検索対象のidを取得
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    // 検索結果を取得
    const searchResult = await prisma.dlois.findUnique({where: {id: id}});
    if (!searchResult) return NextResponse.json({ error: "Dlois not found" }, { status: 404 });
    const { ref_power_id, ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_power: Power|null = ref_power_id ? (await (await fetch(`/api/record/power?id=${ref_power_id}`,{method:"GET"})).json()) as Power : null;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => (await (await fetch(`/api/record/faq?id=${id}`,{method:"GET"})).json()) as Faq))) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => (await (await fetch(`/api/record/info?id=${id}`,{method:"GET"})).json()) as Info))) : null;
    const dlois: Dlois = {
        kind: "dlois",
        ...base,
        ref_power: ref_power,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return NextResponse.json(dlois);
}

export async function POST(
    request: Request,
) {
    // prismaインスタンスを取得
    const prisma = await getPrismaClient();
    // リクエストボディを取得
    const searchParams = await request.json();
    // 検索結果を取得
    const searchCondition = {
        where: {
            AND: [
                {OR: toArray(searchParams["supplement"], DLOIS_SUPPLEMENTS).map(supplement => ({supplement: supplement}))},
                {OR: [
                    {update: null},
                    {NOT: toArray(searchParams["supplement"], DLOIS_SUPPLEMENTS).map(supplement => ({update: {contains: supplement}}))}
                ]},
                {OR: toArray(searchParams["type"], DLOIS_TYPES).map(type => ({type: type}))},
                {name: {contains: toString(searchParams["name"], "")}},
                {OR: toArray(searchParams["restrict"], DLOIS_RESTRICTS).map(restrict => ({restrict: {contains: restrict}}))},
                {effect: searchParams["effect"] && {contains: toString(searchParams["effect"], "")}},
            ],
        },
        orderBy: [
            {type_order: "asc" as const},
            {restrict_order: "asc" as const},
            {no: "asc" as const}
        ],
        select: {
            id: true
        },
        };
        const searchResults = await prisma.dlois.findMany(searchCondition);
        const dloises: { [key: string]: Dlois[] } = { "Dロイス": (await Promise.all(searchResults.map(async ({id}: {id:string}) => (await (await fetch(`/api/record/dlois?id=${id}`,{method:"GET"})).json()) as Dlois))) };
    return NextResponse.json(dloises);
}