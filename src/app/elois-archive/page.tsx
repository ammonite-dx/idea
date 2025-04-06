import EloisSearchForm from "@/features/elois-archive/EloisSearchForm";
import EloisSearchResults from "@/features/elois-archive/EloisSearchResults";

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {

    const currSearchParams = await searchParams;

    return (
        <main>
            <EloisSearchForm searchParams={ currSearchParams } />
            <EloisSearchResults searchParams={ currSearchParams } />
        </main>
    );
}