import { TypeMap } from '@/types/types';

export default async function getRecordById<K extends keyof TypeMap>(
    kind: K,
    id: string,
): Promise<TypeMap[K]> {
    return (await (await fetch(`/api/${kind}?id=${id}`,{method:"GET"})).json()) as TypeMap[K];
}