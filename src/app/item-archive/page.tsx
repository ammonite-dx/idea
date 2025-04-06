import ItemSearchForm from "@/features/item-archive/ItemSearchForm";
import ItemSearchResults from "@/features/item-archive/ItemSearchResults";

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {

    const currSearchParams = await searchParams;

    return (
        <main>
            <ItemSearchForm searchParams={ currSearchParams } />
            <ItemSearchResults searchParams={ currSearchParams } />
        </main>
    );
}