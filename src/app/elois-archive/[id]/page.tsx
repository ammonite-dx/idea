import EloisCard from "@/components/EloisCard";
import EloisOtherVers from "@/features/elois-archive/EloisOtherVers";
import RelEloises from "@/components/RelEloises";
import getEloisById from "@/utils/getEloisById";

export default async function Page({params}: {params: {id: string}}) {

    const { id } = await params
    const elois = await getEloisById(decodeURIComponent(id));

    if (!elois) {
        return <div>Elois not found</div>;
    } else {
        return (
            <div>
                <EloisCard elois={elois} details/>
                {elois.other_ver_id && <EloisOtherVers other_ver_id={elois.other_ver_id} />}
                {elois.rel_elois_id && <RelEloises rel_elois_id={elois.rel_elois_id} />}
            </div>
        );
    }
}