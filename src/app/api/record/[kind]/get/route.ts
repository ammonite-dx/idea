export const runtime = "edge";

import { NextResponse } from "next/server";
import { D1Database } from "@cloudflare/workers-types";
import { Power,Weapon,Armor,Faq,Info } from "@/types/types";
import getPrisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

type PageProps = {
    request: Request;
    env: { DB: D1Database };
    params: Promise<{ kind: string }>;
};

export default async function ( { request, env, params }: PageProps ) {
    // prismaインスタンスを取得
    const prisma = getPrisma(env.DB);
    // kindを取得
    const { kind } = await params;
    // URLから検索対象のidを取得
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    // 検索結果を取得
    switch (kind) {
        case "power": return NextResponse.json(await getPower(id, prisma));
        default: return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    }
}

export async function getPower(id: string, prisma: PrismaClient) {
    // 検索結果を取得
    const searchResult = await prisma.power.findUnique({where: {id: id}});
    if (!searchResult) return NextResponse.json({ error: "Power not found" }, { status: 404 });
    const { ref_weapon_id, ref_armor_id, ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_weapon: Weapon|null = ref_weapon_id ? (await (await fetch(`/api/record/weapon/get?id=${ref_weapon_id}`,{method:"GET"})).json()) as Weapon : null;
    const ref_armor: Armor|null = ref_armor_id ? (await (await fetch(`/api/record/armor/get?id=${ref_armor_id}`,{method:"GET"})).json()) as Armor : null;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => (await (await fetch(`/api/record/faq/get?id=${id}`,{method:"GET"})).json()) as Faq))) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => (await (await fetch(`/api/record/info/get?id=${id}`,{method:"GET"})).json()) as Info))) : null;
    const power: Power = {
        kind: "power",
        ...base,
        ref_weapon: ref_weapon,
        ref_armor: ref_armor,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return power;
}

export async function getWeapon(id: string, prisma: PrismaClient) {
    // 検索結果を取得
    const searchResult = await prisma.weapon.findUnique({where: {id: id}});
    if (!searchResult) return NextResponse.json({ error: "Weapon not found" }, { status: 404 });
    const { ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => (await (await fetch(`/api/faq?id=${id}`,{method:"GET"})).json()) as Faq))) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => (await (await fetch(`/api/info?id=${id}`,{method:"GET"})).json()) as Info))) : null;
    const weapon: Weapon = {
        kind: "weapon",
        ...base,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return weapon;
}