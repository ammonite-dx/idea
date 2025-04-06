import RhfGroupMultiSelectBox from "@/components/SelectBox";
import { CONNECTION_SKILLS } from "@/consts/connection";

export default function GeneralSearchForm ({control}: {control:any}) {
    return(
        <>
            <div className="grid-item col-span-12 lg:col-span-12"><RhfGroupMultiSelectBox control={control} name="connection-skill" label="技能" options={CONNECTION_SKILLS.map((s)=>({value:s,label:s}))} isMulti/></div>
        </>
    );
}