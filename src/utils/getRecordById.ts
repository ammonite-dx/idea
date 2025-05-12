import { TypeMap } from '@/types/types';
import parseFetchResult from './parseFetchResult';

export default async function getRecordById<K extends keyof TypeMap>(
    kind: K,
    id: string
): Promise<TypeMap[K] | null> {
    const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${baseUrl}/api/prisma`;
    const fetchResult = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: kind,
            findOptions: { where: { id: id } },
        }),
    }).then((res) => res.json()).then((data) => data[0]);
    if (!fetchResult) return null;
    return await parseFetchResult(kind, fetchResult) as TypeMap[K];
}