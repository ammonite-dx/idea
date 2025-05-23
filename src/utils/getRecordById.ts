import { TypeMap } from '@/types/types';

export default async function getRecordById<K extends keyof TypeMap>(
    kind: K,
    id: string
): Promise<TypeMap[K] | null> {
    const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${baseUrl}/api/prisma`;
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: kind,
            findOptions: JSON.stringify(getFindOptions(kind, id)),
        }),
    })
    .then((res) => res.json())
    .then((data) => data[0])
    .then((data) => ({kind:kind, ...data}));
    if (!response) return null;
    return response as TypeMap[K];
}

function getFindOptions( kind: string, id: string ) {
    switch (kind) {
        case "power":
            return { 
                where: { id: id },
                select: {
                    id: true,
                    supplement: true,
                    category: true,
                    type: true,
                    name: true,
                    maxlv: true,
                    timing: true,
                    skill: true,
                    dfclty: true,
                    target: true,
                    rng: true,
                    encroach: true,
                    restrict: true,
                    premise: true,
                    flavor: true,
                    effect: true,
                    ref_weapon: true,
                    ref_armor: true,
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                },
            };
        case "weapon":
            return {
                where: { id: id },
                select: {
                    id: true,
                    supplement: true,
                    category: true,
                    name: true,
                    type: true,
                    skill: true,
                    acc: true,
                    atk: true,
                    guard: true,
                    rng: true,
                    procure: true,
                    stock: true,
                    exp: true,
                    rec: true,
                    flavor: true,
                    effect: true,
                    price: true,
                    rec_effect: true,
                    refed_power: true,
                    refed_armor: true,
                    refed_general: true,
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                }
             };
        case "armor":
            return {
                where: { id: id },
                select: {
                    id: true,
                    supplement: true,
                    category: true,
                    name: true,
                    type: true,
                    dodge: true,
                    initiative: true,
                    armor: true,
                    procure: true,
                    stock: true,
                    exp: true,
                    rec: true,
                    flavor: true,
                    effect: true,
                    price: true,
                    rec_effect: true,
                    ref_weapon: true,
                    refed_power: true,
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                }
            };
        case "vehicle":
            return {
                where: { id: id },
                select: {
                    id: true,
                    supplement: true,
                    category: true,
                    name: true,
                    type: true,
                    skill: true,
                    atk: true,
                    initiative: true,
                    armor: true,
                    dash: true,
                    procure: true,
                    stock: true,
                    exp: true,
                    rec: true,
                    flavor: true,
                    effect: true,
                    price: true,
                    rec_effect: true,
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                }
            };
        case "connection":
            return {
                where: { id: id },
                select: {
                    id: true,
                    supplement: true,
                    category: true,
                    name: true,
                    type: true,
                    skill: true,
                    procure: true,
                    stock: true,
                    exp: true,
                    rec: true,
                    flavor: true,
                    effect: true,
                    price: true,
                    rec_effect: true,
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                }
            };
        case "general":
            return {
                where: { id: id },
                select: {
                    id: true,
                    supplement: true,
                    category: true,
                    name: true,
                    type: true,
                    procure: true,
                    stock: true,
                    exp: true,
                    rec: true,
                    flavor: true,
                    effect: true,
                    price: true,
                    rec_effect: true,
                    ref_weapon: true,
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                }
            };
        case "dlois":
            return {
                where: { id: id },
                select: {
                    id: true,
                    supplement: true,
                    type: true,
                    name: true,
                    restrict: true,
                    flavor: true,
                    description: true,
                    rec: true,
                    effect: true,
                    rec_effect: true,
                    ref_power: true,
                    flavor_summary: true,
                    effect_summary: true,
                    rec_effect_summary: true,
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                }
            };
        case "elois":
            return {
                where: { id: id },
                select: {
                    id: true,
                    supplement: true,
                    type: true,
                    name: true,
                    timing: true,
                    skill: true,
                    dfclty: true,
                    target: true,
                    rng: true,
                    urge: true,
                    flavor: true,
                    effect: true,
                    other_vers: true,
                    rel_eloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                }
            };
        case "work":
            return {
                where: { id: id },
                select: {
                    id: true,
                    supplement: true,
                    name: true,
                    stat: true,
                    skills: true,
                    emblems: true,
                }
            };
        default:
            throw new Error(`Unknown kind: ${kind}`);
    }
}