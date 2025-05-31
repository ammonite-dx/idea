import { notFound } from "next/navigation";
import RecordResult from "@/features/record/RecordResult";
import { CardRecordKind } from "@/types/types";

export const runtime = 'edge';

type PageProps = {
    params: Promise<{
        kind: string;
        id: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    
    const { kind, id } = await params;
    const decodedKind = decodeURIComponent(kind) as CardRecordKind;
    const decodedId = decodeURIComponent(id);
    if (!isCardRecordKind(decodedKind)) return notFound();

    return (
        <main>
            <RecordResult kind={decodedKind} id={decodedId} />
        </main>
    );
} 

function isCardRecordKind(value: string): value is CardRecordKind {
    return ["power", "weapon", "armor", "vehicle", "connection", "general", "dlois", "elois", "work"].includes(value);
}