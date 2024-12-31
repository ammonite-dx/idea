import PowerSearchResults from "@/features/effect-archive/components/PowerSearchResults";

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {

    const currSearchParams = await searchParams;

    return (
        <main>
            <h1>エフェクトアーカイブ</h1>
            <PowerSearchResults searchParams={ currSearchParams } />
        </main>
    );
}