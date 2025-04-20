import { notFound } from "next/navigation";
import SearchForm from "@/features/search/SearchForm";
import SearchResults from "@/features/search/SearchResults";
import { SearchKind } from "@/types/types";

export default async function Page({ params, searchParams }: { params: { kind: SearchKind }; searchParams: { [key: string]: string | string[] | undefined } }) {

    const { kind } = params;
    if (!isSearchKind(kind)) return notFound();
    const currSearchParams = searchParams;

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