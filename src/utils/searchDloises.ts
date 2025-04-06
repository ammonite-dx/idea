import prisma from '@/lib/prisma';
import getDloisById from './getDloisById';
import { toArray, toString } from '@/utils/utils';
import { DLOIS_TYPES, DLOIS_RESTRICTS, DLOIS_SUPPLEMENTS } from '@/consts/dlois';
import { Dlois, Power, Faq, Info } from '@/types/types';
import { get } from 'http';

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
  const dloises = (await Promise.all(searchResults.map(async searchResult => getDloisById(searchResult.id)))).filter((dlois) => dlois !== null) as Dlois[];
  return dloises;
}