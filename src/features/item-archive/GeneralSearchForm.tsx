import RhfGroupMultiSelectBox from "@/components/SelectBox";
import { GENERAL_TYPES } from "@/consts/general";

export default function GeneralSearchForm ({control}: {control:any}) {
    return(
        <>
            <div className="grid-item col-span-12 lg:col-span-12"><RhfGroupMultiSelectBox control={control} name="general-type" label="一般アイテム種別" options={GENERAL_TYPES.map((s)=>({value:s,label:s}))} isMulti/></div>
        </>
    );
}