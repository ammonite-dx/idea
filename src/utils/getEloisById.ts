import prisma from '@/lib/prisma';
import getFaqById from './getFaqById';
import getInfoById from './getInfoById';
import { Elois,Faq,Info } from '@/types/types';

export default async function getEloisById(id: string) {
    const searchResult = await prisma.elois.findUnique({where: {id: id}});
    const ref_faqs: Faq[]|null = (searchResult && searchResult.ref_faq_id) ? (await Promise.all(searchResult.ref_faq_id.split(" ").map(async (id) => getFaqById(id)))).filter((faq) => faq !== null) as Faq[] : null;
    const ref_infos: Info[]|null = (searchResult && searchResult.ref_info_id) ? (await Promise.all(searchResult.ref_info_id.split(" ").map(async (id) => getInfoById(id)))).filter((info) => info !== null) as Info[] : null;
    const elois: Elois|null = searchResult ? {
        kind: "elois",
        id: searchResult.id,
        supplement: searchResult.supplement,
        type: searchResult.type,
        name: searchResult.name,
        timing: searchResult.timing,
        skill: searchResult.skill,
        dfclty: searchResult.dfclty,
        target: searchResult.target,
        rng: searchResult.rng,
        urge: searchResult.urge,
        flavor: searchResult.flavor,
        effect: searchResult.effect,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
        other_ver_id: searchResult.other_ver_id,
        rel_elois_id: searchResult.rel_elois_id,
    } : null;
    return elois;
}