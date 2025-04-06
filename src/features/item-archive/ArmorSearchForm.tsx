import RhfGroupMultiSelectBox from "@/components/SelectBox";
import RhfTextInput from "@/components/TextInput";
import { ARMOR_TYPES } from "@/consts/armor";

export default function ArmorSearchForm ({control}: {control:any}) {
    return(
        <>
            <div className="grid-item col-span-12 lg:col-span-3"><RhfGroupMultiSelectBox control={control} name="armor-type" label="防具種別" options={ARMOR_TYPES.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><RhfTextInput control={control} name="armor-dodge" label="ドッジ" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><RhfTextInput control={control} name="armor-initiative" label="行動" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><RhfTextInput control={control} name="armor-armor" label="装甲値" isNumber suffix="以上"/></div>
        </>
    );
}