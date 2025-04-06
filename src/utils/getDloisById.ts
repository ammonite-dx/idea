import prisma from '@/lib/prisma';
import getPowerById from './getPowerById';
import getFaqById from './getFaqById';
import getInfoById from './getInfoById';
import { Power,Dlois,Faq,Info } from '@/types/types';

export default async function getDloisById(id: string) {
    const searchResult = await prisma.dlois.findUnique({where: {id: id}});
    const ref_power: Power|null = (searchResult && searchResult.ref_power_id) ? await getPowerById(searchResult.ref_power_id) : null;
    const ref_faqs: Faq[]|null = (searchResult && searchResult.ref_faq_id) ? (await Promise.all(searchResult.ref_faq_id.split(" ").map(async (id) => getFaqById(id)))).filter((faq) => faq !== null) as Faq[] : null;
    const ref_infos: Info[]|null = (searchResult && searchResult.ref_info_id) ? (await Promise.all(searchResult.ref_info_id.split(" ").map(async (id) => getInfoById(id)))).filter((info) => info !== null) as Info[] : null;
    const dlois: Dlois|null = searchResult ? {
        kind: "dlois",
        id: searchResult.id,
        supplement: searchResult.supplement,
        type: searchResult.type,
        name: searchResult.name,
        restrict: searchResult.restrict,
        flavor: searchResult.flavor,
        description: searchResult.description,
        rec: searchResult.rec,
        effect: searchResult.effect,
        rec_effect: searchResult.rec_effect,
        ref_power: ref_power,
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
        flavor_summary: searchResult.flavor_summary,
        effect_summary: searchResult.effect_summary,
        rec_effect_summary: searchResult.rec_effect_summary,
    } : null;
    return dlois;
}