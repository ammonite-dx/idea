import { notFound } from "next/navigation";
import SearchForm from "@/features/search/SearchForm";
import SearchResults from "@/features/search/SearchResults";
import { SearchKind } from "@/types/types";

export const runtime = 'edge';

type PageProps = {
    params: Promise<{
        kind: string;
    }>;
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>;
}

export default async function Page({ params, searchParams }: PageProps) {

    const { kind } = await params;
    if (!isSearchKind(kind)) return notFound();
    const currSearchParams = await searchParams;

    return (
        <main>
            <SearchForm kind={kind} searchParams={ currSearchParams } />
            <SearchResults kind={kind} searchParams={ currSearchParams } />
        </main>
    );
}

function isSearchKind(value: string): value is SearchKind {
    return ["power", "item", "dlois", "elois", "work"].includes(value);
}