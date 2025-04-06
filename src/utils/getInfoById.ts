import prisma from '@/lib/prisma';
import { Info } from '@/types/types';

export default async function getInfoById(id: string) {
    const searchResult = await prisma.info.findUnique({where: {id: id}});
    const info: Info|null = searchResult ? {
        kind: "info",
        id: searchResult.id,
        title: searchResult.title,
        content: searchResult.content,
    } : null;
    return info;
}