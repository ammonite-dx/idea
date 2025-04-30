export const runtime = "edge";

import { NextResponse } from "next/server";
import { Weapon,Armor,Faq,Info } from "@/types/types";
import { ITEM_CATEGORIES, ITEM_SUPPLEMENTS } from "@/consts/item";
import { ARMOR_TYPES } from "@/consts/armor";
import { toArray, toString } from "@/utils/utils";
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
    const searchResult = await prisma.armor.findUnique({where: {id: id}});
    if (!searchResult) return NextResponse.json({ error: "Armor not found" }, { status: 404 });
    const { ref_weapon_id, ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_weapon: Weapon|null = ref_weapon_id ? (await (await fetch(`/api/record/weapon?id=${ref_weapon_id}`,{method:"GET"})).json()) as Weapon : null;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => (await (await fetch(`/api/record/faq?id=${id}`,{method:"GET"})).json()) as Faq))) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => (await (await fetch(`/api/record/info?id=${id}`,{method:"GET"})).json()) as Info))) : null;
    const armor: Armor = {
        kind: "armor",
        ...base,
        ref_weapon: ref_weapon,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return NextResponse.json(armor);
}

export async function POST(
    request: Request,
) {
    // prismaインスタンスを取得
    const prisma = await getPrismaClient();
    // リクエストボディを取得
    const searchParams = await request.json();
    // 検索結果を取得
    const armors: { [key: string]: Armor[] } = Object.fromEntries(await Promise.all(toArray(searchParams["category"], ITEM_CATEGORIES).map(async category => {
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
                { OR: toArray(searchParams["armor-type"], ARMOR_TYPES).map(type => (type==="防具" ? { type: { not: { contains: "補助" } } } : { type: { contains: "補助" } })) },
                { OR: [{ dodge_int: null }, { dodge_int: { gte: parseInt(toString(searchParams["armor-dodge"], "-999")) } }] },
                { OR: [{ initiative_int: null }, { initiative_int: { gte: parseInt(toString(searchParams["armor-initiative"], "-999")) } }] },
                { OR: [{ armor_int: null }, { armor_int: { gte: parseInt(toString(searchParams["armor-armor"], "0")) } }] },
            ],
          },
          orderBy: [
            {type_order: "asc" as const},
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
          select: { id: true },
        };
        const searchResultsInCategory = await prisma.armor.findMany(searchCondition);
        const armorsInCategory = await Promise.all(searchResultsInCategory.map(async ({id}: {id:string}) => (await (await fetch(`/api/record/armor?id=${id}`,{method:"GET"})).json()) as Armor));
        return [category, armorsInCategory]
    })));
    return NextResponse.json(armors);
}