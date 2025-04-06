import RhfGroupMultiSelectBox from "@/components/SelectBox";
import RhfTextInput from "@/components/TextInput";
import { WEAPON_SKILLS, WEAPON_TYPES } from "@/consts/weapon";

export default function WeaponSearchForm ({control}: {control:any}) {
    return(
        <>
            <div className="grid-item col-span-12 lg:col-span-6"><RhfGroupMultiSelectBox control={control} name="weapon-type" label="武器種別" options={WEAPON_TYPES.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-6"><RhfGroupMultiSelectBox control={control} name="weapon-skill" label="技能" options={WEAPON_SKILLS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><RhfTextInput control={control} name="weapon-acc" label="命中" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><RhfTextInput control={control} name="weapon-atk" label="攻撃力" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><RhfTextInput control={control} name="weapon-guard" label="ガード値" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><RhfTextInput control={control} name="weapon-rng" label="射程" isNumber suffix="m以上"/></div>
        </>
    );
}