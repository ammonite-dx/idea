import prisma from '@/lib/prisma';
import getWeaponById from './getWeaponById';
import getArmorById from './getArmorById';
import getFaqById from './getFaqById';
import getInfoById from './getInfoById';
import { toArray, toString } from '@/utils/utils';
import { POWER_CATEGORIES, POWER_TYPES, POWER_SUPPLEMENTS, POWER_TIMINGS, POWER_SKILLS, POWER_DFCLTIES, POWER_TARGETS, POWER_RNGS, POWER_RESTRICTS } from '@/consts/power';
import { Power, Weapon, Armor, Faq, Info } from '@/types/types';

export default async function searchPowers(currSearchParams: { [key: string]: string | string[] | undefined }) {
  const powers: {[key: string]: Power[]} = Object.fromEntries(await Promise.all(toArray(currSearchParams["category"], POWER_CATEGORIES).map(async category => {
    const whereConndition = {
      AND: [
        {category: category},
        {OR: toArray(currSearchParams["type"], POWER_TYPES).map(type => ({type: type}))},
        {OR: toArray(currSearchParams["supplement"], POWER_SUPPLEMENTS).map(supplement => ({supplement: supplement}))},
        {OR: [
          {update: null},
          {NOT: toArray(currSearchParams["supplement"], POWER_SUPPLEMENTS).map(supplement => ({update: {contains: supplement}}))}
        ]},
        {name: {contains: toString(currSearchParams["name"], "")}},
        {OR: [
          {maxlv_int: null},
          {maxlv_int: {gte: parseInt(toString(currSearchParams["maxlv"], "0"))}},
        ]},
        {OR: toArray(currSearchParams["timing"], POWER_TIMINGS).map(timing => ({timing: {contains: timing}}))}, 
        {OR: toArray(currSearchParams["skill"], POWER_SKILLS).map(skill => ({skill: {contains: skill}}))},
        {OR: toArray(currSearchParams["dfclty"], POWER_DFCLTIES).map(dfclty => ({dfclty: dfclty}))},
        {OR: toArray(currSearchParams["target"], POWER_TARGETS).map(target => ({target: target}))},
        {OR: toArray(currSearchParams["rng"], POWER_RNGS).map(rng => ({rng: rng}))},
        {OR: [
          {encroach_int: null},
          {encroach_int: {lte: parseInt(toString(currSearchParams["encroach"], "999"))}},
        ]},
        {OR: toArray(currSearchParams["restrict"], POWER_RESTRICTS).map(restrict => ({restrict: {contains: restrict}}))},
        {effect: currSearchParams["effect"] && {contains: toString(currSearchParams["effect"], "")}},
      ]
    };
    const searchResultsInCategory = await prisma.power.findMany({
      where: whereConndition,
      orderBy: [
        {type_restrict_order: "asc"},
        {ruby: "asc"}
      ],
    })
    const powersInCategory = await Promise.all(searchResultsInCategory.map(async searchResult => {
      const ref_weapon: Weapon|null = searchResult.ref_weapon_id ? await getWeaponById(searchResult.ref_weapon_id) : null;
      const ref_armor: Armor|null = searchResult.ref_armor_id ? await getArmorById(searchResult.ref_armor_id) : null;
    const ref_faqs: Faq[]|null = (searchResult && searchResult.ref_faq_id) ? (await Promise.all(searchResult.ref_faq_id.split(" ").map(async (id) => getFaqById(id)))).filter((faq) => faq !== null) as Faq[] : null;
    const ref_infos: Info[]|null = (searchResult && searchResult.ref_info_id) ? (await Promise.all(searchResult.ref_info_id.split(" ").map(async (id) => getInfoById(id)))).filter((info) => info !== null) as Info[] : null;
      const power:Power = {
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
      };
      return power;
    }));
    return [category, powersInCategory];
  })));
  return powers;
}