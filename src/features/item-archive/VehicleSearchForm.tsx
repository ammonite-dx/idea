import RhfGroupMultiSelectBox from "@/components/SelectBox";
import RhfTextInput from "@/components/TextInput";
import { VEHICLE_SKILLS } from "@/consts/vehicle";

export default function VehicleSearchForm ({control}: {control:any}) {
    return(
        <>
            <div className="grid-item col-span-12 lg:col-span-4"><RhfGroupMultiSelectBox control={control} name="weapon-skill" label="技能" options={VEHICLE_SKILLS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-2"><RhfTextInput control={control} name="weapon-atk" label="攻撃力" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-2"><RhfTextInput control={control} name="weapon-initiative" label="行動" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-2"><RhfTextInput control={control} name="weapon-armor" label="装甲値" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-2"><RhfTextInput control={control} name="weapon-dash" label="全力移動" isNumber suffix="m以上"/></div>
        </>
    );
}