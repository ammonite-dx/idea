export const runtime = "edge";

import { NextResponse } from "next/server";
import { D1Database } from "@cloudflare/workers-types";
import { Power,Weapon,Armor,Faq,Info } from "@/types/types";
import { toArray, toString } from '@/utils/utils';
import { POWER_CATEGORIES, POWER_TYPES, POWER_SUPPLEMENTS, POWER_TIMINGS, POWER_SKILLS, POWER_DFCLTIES, POWER_TARGETS, POWER_RNGS, POWER_ENCROACHES, POWER_RESTRICTS } from '@/consts/power';
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
    const searchResult = await prisma.power.findUnique({where: {id: id}});
    if (!searchResult) return NextResponse.json({ error: "Power not found" }, { status: 404 });
    const { ref_weapon_id, ref_armor_id, ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_weapon: Weapon|null = ref_weapon_id ? (await (await fetch(`/api/weapon?id=${ref_weapon_id}`,{method:"GET"})).json()) as Weapon : null;
    const ref_armor: Armor|null = ref_armor_id ? (await (await fetch(`/api/armor?id=${ref_armor_id}`,{method:"GET"})).json()) as Armor : null;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => (await (await fetch(`/api/faq?id=${id}`,{method:"GET"})).json()) as Faq))) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => (await (await fetch(`/api/info?id=${id}`,{method:"GET"})).json()) as Info))) : null;
    const power: Power = {
        kind: "power",
        ...base,
        ref_weapon: ref_weapon,
        ref_armor: ref_armor,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return NextResponse.json(power);
}

export async function POST(
    request: Request,
    { env }: { env: { DB: D1Database } }
) {
    // prismaインスタンスを取得
    const prisma = getPrisma(env.DB);
    // リクエストボディを取得
    const searchParams = await request.json();
    // 検索を実行
    const powers: {[key: string]: Power[]} = Object.fromEntries(await Promise.all(toArray(searchParams["category"], POWER_CATEGORIES).map(async category => {
        const searchCondition = {
            where: {
                AND: [
                    {category: category},
                    {OR: toArray(searchParams["type"], POWER_TYPES).map(type => ({type: type}))},
                    {OR: toArray(searchParams["supplement"], POWER_SUPPLEMENTS).map(supplement => ({supplement: supplement}))},
                    {OR: [
                        {update: null},
                        {NOT: toArray(searchParams["supplement"], POWER_SUPPLEMENTS).map(supplement => ({update: {contains: supplement}}))}
                    ]},
                    {name: {contains: toString(searchParams["name"], "")}},
                    {OR: [
                        {maxlv_int: null},
                        {maxlv_int: {gte: parseInt(toString(searchParams["maxlv"], "0"))}},
                    ]},
                    {OR: toArray(searchParams["timing"], POWER_TIMINGS).map(timing => ({timing: {contains: timing}}))}, 
                    {OR: toArray(searchParams["skill"], POWER_SKILLS).map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))},
                    {OR: toArray(searchParams["dfclty"], POWER_DFCLTIES).map(dfclty => ({dfclty: dfclty}))},
                    {OR: toArray(searchParams["target"], POWER_TARGETS).map(target => ({target: target}))},
                    {OR: toArray(searchParams["rng"], POWER_RNGS).map(rng => ({rng: rng}))},
                    {OR: toArray(searchParams["encroach"], POWER_ENCROACHES).map(encroach => ({encroach: encroach}))},
                    {OR: toArray(searchParams["restrict"], POWER_RESTRICTS).map(restrict => ({restrict: {contains: restrict}}))},
                    {effect: searchParams["effect"] && {contains: toString(searchParams["effect"], "")}},
                ]
            },
            orderBy: [
                {type_restrict_order: 'asc' as const},
                {ruby: 'asc' as const},
            ],
            select: { id: true },
        };
        const searchResultsInCategory = await prisma.power.findMany(searchCondition);
        const powersInCategory = await Promise.all(searchResultsInCategory.map(async ({id}: {id:string}) => (await (await fetch(`/api/power?id=${id}`,{method:"GET"})).json()) as Power));
        return [category, powersInCategory];
    })));
    return NextResponse.json(powers);
}