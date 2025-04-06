import DloisSearchForm from "@/features/dlois-archive/DloisSearchForm";
import DloisSearchResults from "@/features/dlois-archive/DloisSearchResults";

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {

    const currSearchParams = await searchParams;

    return (
        <main>
            <DloisSearchForm searchParams={ currSearchParams } />
            <DloisSearchResults searchParams={ currSearchParams } />
        </main>
    );
}