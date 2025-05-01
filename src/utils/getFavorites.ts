"use client";

import { CardRecordKind } from "@/types/types";

type Favorite = {
    id: string;
    user_id: string;
    record_kind: string;
    record_id: string;
};

export default async function getFavorites(
    kind: CardRecordKind,
): Promise<Favorite[]> {
    return (await (await fetch(`/api/favorite?record-kind=${kind}`,{method:"GET"})).json()) as Favorite[];
}