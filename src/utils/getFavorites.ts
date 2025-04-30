import { TypeMap } from '@/types/types'

export default async function getFavorites<K extends keyof TypeMap>(
    kind: K,
): Promise<TypeMap[K][]> {
    return (await (await fetch(`/api/record/${kind}?record-kind=${kind}`,{method:"GET"})).json()) as TypeMap[K][];
}