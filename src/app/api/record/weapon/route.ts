export const runtime = "edge";

import { NextResponse } from "next/server";
import { Weapon,Faq,Info } from "@/types/types";
import { toArray, toString } from '@/utils/utils';
import { ITEM_CATEGORIES, ITEM_SUPPLEMENTS } from "@/consts/item";
import { WEAPON_TYPES, WEAPON_SKILLS } from "@/consts/weapon";
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
    const searchResult = await prisma.weapon.findUnique({where: {id: id}});
    if (!searchResult) return NextResponse.json({ error: "Weapon not found" }, { status: 404 });
    const { ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => (await (await fetch(`/api/record/faq?id=${id}`,{method:"GET"})).json()) as Faq))) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => (await (await fetch(`/api/record/info?id=${id}`,{method:"GET"})).json()) as Info))) : null;
    const weapon: Weapon = {
        kind: "weapon",
        ...base,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return NextResponse.json(weapon);
}

export async function POST(
    request: Request,
) {
    // prismaインスタンスを取得
    const prisma = await getPrismaClient();
    // リクエストボディを取得
    const searchParams = await request.json();
    // 検索結果を取得
    const weapons: { [key: string]: Weapon[] } = Object.fromEntries(await Promise.all(toArray(searchParams["category"], ITEM_CATEGORIES).map(async category => {
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
                { OR: toArray(searchParams["weapon-type"], WEAPON_TYPES).map(type => ({ type: { contains: type }})) },
                { OR: toArray(searchParams["weapon-skill"], WEAPON_SKILLS).map(skill => ({ skill: { contains: skill.replace("〈","").replace("〉","").replace(":","") } })) },
                { OR: [{ acc_int: null }, { acc_int: { gte: parseInt(toString(searchParams["weapon-acc"], "-999")) } }] },
                { OR: [{ atk_int: null }, { atk_int: { gte: parseInt(toString(searchParams["weapon-atk"], "-999")) } }] },
                { OR: [{ guard_int: null }, { guard_int: { gte: parseInt(toString(searchParams["weapon-guard"], "0")) } }] },
                { OR: [{ rng_int: null }, { rng_int: { gte: parseInt(toString(searchParams["weapon-rng"], "0")) } }] },
                (toString(searchParams["item-type"], "指定なし") == "指定なし") ? { refed_armor_id: null } : {},
                (toString(searchParams["item-type"], "指定なし") == "指定なし") ? { refed_general_id: null } : {},
            ],
          },
          orderBy: [
            {type_order: "asc" as const},
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
          select: { id: true },
        };
        const searchResultsInCategory = await prisma.weapon.findMany(searchCondition);
        const weaponsInCategory = await Promise.all(searchResultsInCategory.map(async ({id}: {id:string}) => (await (await fetch(`/api/record/weapon?id=${id}`,{method:"GET"})).json()) as Weapon));
        return [category, weaponsInCategory]
    })));
    return NextResponse.json(weapons);
}