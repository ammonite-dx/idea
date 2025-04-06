import prisma from '@/lib/prisma';
import { Faq } from '@/types/types';

export default async function getFaqById(id: string) {
    const searchResult = await prisma.faq.findUnique({where: {id: id}});
    const faq: Faq|null = searchResult ? {
        kind: "faq",
        id: searchResult.id,
        q: searchResult.q,
        a: searchResult.a,
    } : null;
    return faq;
}