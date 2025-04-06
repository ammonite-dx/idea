import prisma from '@/lib/prisma';
import getWeaponById from './getWeaponById';
import getArmorById from './getArmorById';
import getFaqById from './getFaqById';
import getInfoById from './getInfoById';
import { Power,Weapon,Armor,Faq,Info } from '@/types/types';

export default async function getPowerById(id: string) {
    const searchResult = await prisma.power.findUnique({where: {id: id}});
    const ref_weapon: Weapon|null = (searchResult && searchResult.ref_weapon_id) ? await getWeaponById(searchResult.ref_weapon_id) : null;
    const ref_armor: Armor|null = (searchResult && searchResult.ref_armor_id) ? await getArmorById(searchResult.ref_armor_id) : null;
    const ref_faqs: Faq[]|null = (searchResult && searchResult.ref_faq_id) ? (await Promise.all(searchResult.ref_faq_id.split(" ").map(async (id) => getFaqById(id)))).filter((faq) => faq !== null) as Faq[] : null;
    const ref_infos: Info[]|null = (searchResult && searchResult.ref_info_id) ? (await Promise.all(searchResult.ref_info_id.split(" ").map(async (id) => getInfoById(id)))).filter((info) => info !== null) as Info[] : null;
    const power: Power|null = searchResult ? {
        kind: "power",
        id: searchResult.id,
        supplement: searchResult.supplement,
        category: searchResult.category,
        type: searchResult.type,
        name: searchResult.name,
        maxlv: searchResult.maxlv,
        timing: searchResult.timing,
        skill: searchResult.skill,
        dfclty: searchResult.dfclty,
        target: searchResult.target,
        rng: searchResult.rng,
        encroach: searchResult.encroach,
        restrict: searchResult.restrict,
        premise: searchResult.premise,
        flavor: searchResult.flavor,
        effect: searchResult.effect,
        ref_weapon: ref_weapon,
        ref_armor: ref_armor,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
        other_ver_id: searchResult.other_ver_id,
        rel_power_id: searchResult.rel_power_id,
        rel_weapon_id: searchResult.rel_weapon_id,
        rel_armor_id: searchResult.rel_armor_id,
        rel_vehicle_id: searchResult.rel_vehicle_id,
        rel_connection_id: searchResult.rel_connection_id,
        rel_general_id: searchResult.rel_general_id,
        rel_dlois_id: searchResult.rel_dlois_id,
    } : null;
    return power;
}