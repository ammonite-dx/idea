import PowerSearchForm from "@/features/effect-archive/PowerSearchForm";
import PowerSearchResults from "@/features/effect-archive/PowerSearchResults";

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {

    const currSearchParams = await searchParams;

    return (
        <main>
            <PowerSearchForm searchParams={ currSearchParams } />
            <PowerSearchResults searchParams={ currSearchParams } />
        </main>
    );
}