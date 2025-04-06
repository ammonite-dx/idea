import prisma from '@/lib/prisma';
import getWeaponById from './getWeaponById';
import getFaqById from './getFaqById';
import getInfoById from './getInfoById';
import { Weapon, Armor, Faq, Info } from '@/types/types';

export default async function getArmorById(id: string) {
    const searchResult = await prisma.armor.findUnique({where: {id: id},});
    const ref_weapon: Weapon|null = (searchResult && searchResult.ref_weapon_id) ? await getWeaponById(searchResult.ref_weapon_id) : null;
    const ref_faqs: Faq[]|null = (searchResult && searchResult.ref_faq_id) ? (await Promise.all(searchResult.ref_faq_id.split(" ").map(async (id) => getFaqById(id)))).filter((faq) => faq !== null) as Faq[] : null;
    const ref_infos: Info[]|null = (searchResult && searchResult.ref_info_id) ? (await Promise.all(searchResult.ref_info_id.split(" ").map(async (id) => getInfoById(id)))).filter((info) => info !== null) as Info[] : null;
    const armor: Armor|null = searchResult ? {
        kind: "armor",
        id: searchResult.id,
        supplement: searchResult.supplement,
        category: searchResult.category,
        name: searchResult.name,
        type: searchResult.type,
        dodge: searchResult.dodge,
        initiative: searchResult.initiative,
        armor: searchResult.armor,
        procure: searchResult.procure,
        stock: searchResult.stock,
        exp: searchResult.exp,
        rec: searchResult.rec,
        flavor: searchResult.flavor,
        effect: searchResult.effect,
        price: searchResult.price,
        rec_effect: searchResult.rec_effect,
        ref_weapon: ref_weapon,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
        refed_power_id: searchResult.refed_power_id,
        other_ver_id: searchResult.other_ver_id,
        rel_power_id: searchResult.rel_power_id,
        rel_weapon_id: searchResult.rel_weapon_id,
        rel_armor_id: searchResult.rel_armor_id,
        rel_vehicle_id: searchResult.rel_vehicle_id,
        rel_connection_id: searchResult.rel_connection_id,
        rel_general_id: searchResult.rel_general_id,
        rel_dlois_id: searchResult.rel_dlois_id,
    } : null;
    return armor;
}