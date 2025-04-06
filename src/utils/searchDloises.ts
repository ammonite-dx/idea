import prisma from '@/lib/prisma';
import getPowerById from './getPowerById';
import getFaqById from './getFaqById';
import getInfoById from './getInfoById';
import { toArray, toString } from '@/utils/utils';
import { DLOIS_TYPES, DLOIS_RESTRICTS, DLOIS_SUPPLEMENTS } from '@/consts/dlois';
import { Dlois, Power, Faq, Info } from '@/types/types';

export default async function searchDloises(currSearchParams: { [key: string]: string | string[] | undefined }) {
  const whereConndition = {
    AND: [
      {OR: toArray(currSearchParams["supplement"], DLOIS_SUPPLEMENTS).map(supplement => ({supplement: supplement}))},
      {OR: [
        {update: null},
        {NOT: toArray(currSearchParams["supplement"], DLOIS_SUPPLEMENTS).map(supplement => ({update: {contains: supplement}}))}
      ]},
      {OR: toArray(currSearchParams["type"], DLOIS_TYPES).map(type => ({type: type}))},
      {name: {contains: toString(currSearchParams["name"], "")}},
      {OR: toArray(currSearchParams["restrict"], DLOIS_RESTRICTS).map(restrict => ({restrict: {contains: restrict}}))},
      {effect: currSearchParams["effect"] && {contains: toString(currSearchParams["effect"], "")}},
    ]
  };
  const searchResults = await prisma.dlois.findMany({
    where: whereConndition,
    orderBy: [
      {type_order: "asc"},
      {restrict_order: "asc"},
      {no: "asc"}
    ],
  })
  const dloises = await Promise.all(searchResults.map(async searchResult => {
    const ref_power: Power|null = searchResult.ref_power_id ? await getPowerById(searchResult.ref_power_id) : null;
    const ref_faqs: Faq[]|null = (searchResult && searchResult.ref_faq_id) ? (await Promise.all(searchResult.ref_faq_id.split(" ").map(async (id) => getFaqById(id)))).filter((faq) => faq !== null) as Faq[] : null;
    const ref_infos: Info[]|null = (searchResult && searchResult.ref_info_id) ? (await Promise.all(searchResult.ref_info_id.split(" ").map(async (id) => getInfoById(id)))).filter((info) => info !== null) as Info[] : null;
    const dlois:Dlois = {
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
    };
    return dlois;
  }));
  return dloises;
}