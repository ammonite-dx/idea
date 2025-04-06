import prisma from '@/lib/prisma';
import getEloisById from './getEloisById';
import { toArray, toString } from '@/utils/utils';
import { ELOIS_SUPPLEMENTS, ELOIS_TYPES, ELOIS_TIMINGS, ELOIS_SKILLS, ELOIS_DFCLTIES, ELOIS_TARGETS, ELOIS_RNGS, ELOIS_URGES } from '@/consts/elois';
import { Elois } from '@/types/types';

export default async function searchDloises(currSearchParams: { [key: string]: string | string[] | undefined }) {
  const whereConndition = {
    AND: [
      {OR: toArray(currSearchParams["supplement"], ELOIS_SUPPLEMENTS).map(supplement => ({supplement: supplement}))},
      {OR: [
        {update: null},
        {NOT: toArray(currSearchParams["supplement"], ELOIS_SUPPLEMENTS).map(supplement => ({update: {contains: supplement}}))}
      ]},
      {OR: toArray(currSearchParams["type"], ELOIS_TYPES).map(type => ({type: type}))},
      {name: {contains: toString(currSearchParams["name"], "")}},
      {OR: toArray(currSearchParams["restrict"], ELOIS_TIMINGS).map(timing => ({timing: {contains: timing}}))},
      {OR: toArray(currSearchParams["skill"], ELOIS_SKILLS).map(skill => ({skill: {contains: skill}}))},
      {OR: toArray(currSearchParams["dfclty"], ELOIS_DFCLTIES).map(dfclty => ({dfclty: {contains: dfclty}}))},
      {OR: toArray(currSearchParams["target"], ELOIS_TARGETS).map(target => ({target: {contains: target}}))},
      {OR: toArray(currSearchParams["rng"], ELOIS_RNGS).map(rng => ({rng: {contains: rng}}))},
      {OR: toArray(currSearchParams["urge"], ELOIS_URGES).map(urge => ({urge: {contains: urge}}))},
      {effect: currSearchParams["effect"] && {contains: toString(currSearchParams["effect"], "")}},
    ]
  };
  const searchResults = await prisma.elois.findMany({
    where: whereConndition,
    orderBy: [
      {urge_order: "asc"},
      {type_order: "asc"},
    ],
  })
  const eloises = (await Promise.all(searchResults.map(async searchResult => getEloisById(searchResult.id)))).filter((elois) => elois !== null) as Elois[];
  return eloises;
}