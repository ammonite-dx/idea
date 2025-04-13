import WorkSearchForm from "@/features/works-archive/WorkSearchForm";
import WorkSearchResults from "@/features/works-archive/WorkSearchResults";

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {

    const currSearchParams = await searchParams;

    return (
        <main>
            <WorkSearchForm searchParams={ currSearchParams } />
            <WorkSearchResults searchParams={ currSearchParams } />
        </main>
    );
}