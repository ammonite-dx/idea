"use client";

import Form from 'next/form'
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import TextInput from '@/components/TextInput';
import SelectBox from '@/components/SelectBox'
import SubmitButton from '@/components/SubmitButton';
import { toArray,toString,strToSelectObj } from '@/utils/utils';
import { POWER_TYPES, POWER_CATEGORIES, POWER_SUPPLEMENTS, POWER_TIMINGS, POWER_SKILLS, POWER_DFCLTIES, POWER_TARGETS, POWER_RNGS, POWER_RESTRICTS, POWER_ENCROACHES } from '@/consts/power';
import { ITEM_TYPES, ITEM_CATEGORIES, ITEM_SUPPLEMENTS } from '@/consts/item';
import { WEAPON_TYPES, WEAPON_SKILLS } from '@/consts/weapon';
import { ARMOR_TYPES } from '@/consts/armor';
import { VEHICLE_SKILLS } from '@/consts/vehicle';
import { CONNECTION_SKILLS } from '@/consts/connection';
import { GENERAL_TYPES } from '@/consts/general';
import { DLOIS_SUPPLEMENTS, DLOIS_TYPES, DLOIS_RESTRICTS } from '@/consts/dlois';
import { ELOIS_SUPPLEMENTS, ELOIS_TYPES, ELOIS_TIMINGS, ELOIS_SKILLS, ELOIS_DFCLTIES, ELOIS_TARGETS, ELOIS_RNGS, ELOIS_URGES } from '@/consts/elois';
import { WORK_SUPPLEMENTS, WORK_STATS, WORK_SKILLS } from '@/consts/work';
import { SearchKind } from '@/types/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SearchFormValues = Record<string, any>;

export default function SearchForm({ kind, searchParams }: { kind: SearchKind, searchParams: { [key: string]: string | string[] | undefined } }) {
    
    // フォームのcontrol, wachの設定
    const defaultValues = getDefaultValues(kind, searchParams);
    const { control, watch } = useForm<SearchFormValues>({defaultValues: defaultValues});

    // submitの処理
    const router = useRouter()
    const handleSubmit = (formData:FormData) => {
        const queryParams = new URLSearchParams();
        formData.forEach((value, key) => typeof value === "string" && value !== "" && queryParams.append(key, value));    
        router.push(`/search/${kind}?${queryParams.toString()}`);
    }

    // 検索フォームの表示
    return (
        <FormContainer>
            <h2 className="headline-text text-neutral-900 dark:text-neutral-100 font-bold">検索条件</h2>
            <hr className="border-neutral-900 dark:border-neutral-200 lg:mb-2"/>
            <Form action={handleSubmit}>
                <div className='grid grid-cols-12 gap-x-4 lg:gap-y-2'>
                    {kind === "power" && <PowerSearchForm control={control}/>}
                    {kind === "item" && <ItemSearchForm control={control} watch={watch}/>}
                    {kind === "dlois" && <DloisSearchForm control={control}/>}
                    {kind === "elois" && <EloisSearchForm control={control}/>}
                    {kind === "work" && <WorkSearchForm control={control}/>}
                </div>
                <div className="mt-6"><SubmitButton text="検索"/></div>
            </Form>
        </FormContainer>
    )
}

function getDefaultValues(kind: SearchKind, searchParams: { [key: string]: string | string[] | undefined }) {
    switch (kind) {
        case "power": {
            return {
                "name": toString(searchParams["name"], ""),
                "type": toArray(searchParams["type"], []).map(strToSelectObj),
                "category": toArray(searchParams["category"], []).map(strToSelectObj),
                "supplement": toArray(searchParams["supplement"], []).map(strToSelectObj),
                "maxlv": toString(searchParams["maxlv"], ""),
                "timing": toArray(searchParams["timing"], []).map(strToSelectObj),
                "skill": toArray(searchParams["skill"], []).map(strToSelectObj),
                "dfclty": toArray(searchParams["dfclty"], []).map(strToSelectObj),
                "target": toArray(searchParams["target"], []).map(strToSelectObj),
                "rng": toArray(searchParams["rng"], []).map(strToSelectObj),
                "encroach": toString(searchParams["encroach"], ""),
                "restrict": toArray(searchParams["restrict"], []).map(strToSelectObj),
                "effect": toString(searchParams["effect"], ""),
            };
        }
        case "item": {
            return {
                // 共通
                "name": toString(searchParams["name"], ""),
                "category": toArray(searchParams["category"], []).map(strToSelectObj),
                "supplement": toArray(searchParams["supplement"], []).map(strToSelectObj),
                "item-type": strToSelectObj(toString(searchParams["item-type"], "指定なし")),
                "procure": toString(searchParams["procure"], ""),
                "stock": toString(searchParams["stock"], ""),
                "exp": toString(searchParams["exp"], ""),
                "effect": toString(searchParams["effect"], ""),
                // 武器
                "weapon-type": toArray(searchParams["weapon-type"], []).map(strToSelectObj),
                "weapon-skill": toArray(searchParams["weapon-skill"], []).map(strToSelectObj),
                "weapon-acc": toString(searchParams["weapon-acc"], ""),
                "weapon-atk": toString(searchParams["weapon-atk"], ""),
                "weapon-rng": toString(searchParams["weapon-rng"], ""),
                // 防具
                "armor-type": toArray(searchParams["armor-type"], []).map(strToSelectObj),
                "armor-dodge": toString(searchParams["armor-dodge"], ""),
                "armor-initiative": toString(searchParams["armor-initiative"], ""),
                "armor-armor": toString(searchParams["armor-armor"], ""),
                // ヴィークル
                "vehicle-skill": toArray(searchParams["vehicle-skill"], []).map(strToSelectObj),
                "vehicle-atk": toString(searchParams["vehicle-atk"], ""),
                "vehicle-initiative": toString(searchParams["vehicle-initiative"], ""),
                "vehicle-armor": toString(searchParams["vehicle-armor"], ""),
                "vehicle-dash": toString(searchParams["vehicle-dash"], ""),
                // コネ
                "connection-skill": toArray(searchParams["connection-skill"], []).map(strToSelectObj),
                // 一般アイテム
                "general-type": toArray(searchParams["general-type"], []).map(strToSelectObj),
            };
        }
        case "dlois": {
            return {
                "name": toString(searchParams["name"], ""),
                "supplement": toArray(searchParams["supplement"], []).map(strToSelectObj),
                "type": toArray(searchParams["type"], []).map(strToSelectObj),
                "restrict": toArray(searchParams["restrict"], []).map(strToSelectObj),
                "effect": toString(searchParams["effect"], ""),
            };
        }
        case "elois": {
            return {
                "name": toString(searchParams["name"], ""),
                "supplement": toArray(searchParams["supplement"], []).map(strToSelectObj),
                "type": toArray(searchParams["type"], []).map(strToSelectObj),
                "timing": toArray(searchParams["timing"], []).map(strToSelectObj),
                "skill": toArray(searchParams["skill"], []).map(strToSelectObj),
                "dfclty": toArray(searchParams["dfclty"], []).map(strToSelectObj),
                "target": toArray(searchParams["target"], []).map(strToSelectObj),
                "rng": toArray(searchParams["rng"], []).map(strToSelectObj),
                "urge": toArray(searchParams["urge"], []).map(strToSelectObj),
                "effect": toString(searchParams["effect"], ""),
            };
        }
        case "work": {
            return {
                "name": toString(searchParams["name"], ""),
                "supplement": toArray(searchParams["supplement"], []).map(strToSelectObj),
                "stat": toArray(searchParams["stat"], []).map(strToSelectObj),
                "skill": toArray(searchParams["skill"], []).map(strToSelectObj),
            };
        }
        default: {
            return {};
        }
    }
}

////////////////////////////////
// レコードの種別に応じたフォーム
////////////////////////////////

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PowerSearchForm({ control }: { control:any }) {
    return (
        <>
            <div className="grid-item col-span-12 lg:col-span-12"><TextInput label="名称" name="name" control={control}/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="分類" name="type" control={control} options={POWER_TYPES.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="カテゴリ" name="category" control={control} options={POWER_CATEGORIES.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="サプリメント" name="supplement" control={control} options={POWER_SUPPLEMENTS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><TextInput label="最大レベル" name="maxlv" control={control} isNumber suffix='以上'/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><SelectBox label="タイミング" name="timing" control={control} options={POWER_TIMINGS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><SelectBox label="技能" name="skill" control={control} options={POWER_SKILLS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><SelectBox label="難易度" name="dfclty" control={control} options={POWER_DFCLTIES.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><SelectBox label="対象" name="target" control={control} options={POWER_TARGETS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><SelectBox label="射程" name="rng" control={control} options={POWER_RNGS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><SelectBox label="侵蝕値" name="encroach" control={control} options={POWER_ENCROACHES.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><SelectBox label="制限" name="restrict" control={control} options={POWER_RESTRICTS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-12"><TextInput label="効果" name="effect" control={control}/></div>
        </>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ItemSearchForm ({ control, watch } : { control:any, watch:any }) {
    const itemType = watch("item-type");
    return (
        <>
            <div className="grid-item col-span-12 lg:col-span-12"><TextInput control={control} name="name" label="名称"/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox control={control} name="category" label="カテゴリ" options={ITEM_CATEGORIES.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox control={control} name="supplement" label="サプリメント" options={ITEM_SUPPLEMENTS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox control={control} name="item-type" label="アイテム種別" options={ITEM_TYPES.map((s)=>({value:s,label:s}))}/></div>
            {itemType.value=="武器" && <WeaponSearchForm control={control}/>}
            {itemType.value=="防具" && <ArmorSearchForm control={control}/>}
            {itemType.value=="ヴィークル" && <VehicleSearchForm control={control}/>}
            {itemType.value=="コネ" && <ConnectionSearchForm control={control}/>}
            {itemType.value=="一般アイテム" && <GeneralSearchForm control={control}/>}          
            <div className="grid-item col-span-12 lg:col-span-4"><TextInput control={control} name="procure" label="購入" isNumber suffix="以下"/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><TextInput control={control} name="stock" label="常備化" isNumber suffix="以下"/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><TextInput control={control} name="exp" label="必要経験点" isNumber suffix="以下"/></div>
            <div className="grid-item col-span-12 lg:col-span-12"><TextInput control={control} name="effect" label="効果"/></div>
        </>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WeaponSearchForm ({control}: {control:any}) {
    return(
        <>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox control={control} name="weapon-type" label="武器種別" options={WEAPON_TYPES.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox control={control} name="weapon-skill" label="技能" options={WEAPON_SKILLS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><TextInput control={control} name="weapon-acc" label="命中" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><TextInput control={control} name="weapon-atk" label="攻撃力" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><TextInput control={control} name="weapon-guard" label="ガード値" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><TextInput control={control} name="weapon-rng" label="射程" isNumber suffix="m以上"/></div>
        </>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ArmorSearchForm ({control}: {control:any}) {
    return(
        <>
            <div className="grid-item col-span-12 lg:col-span-3"><SelectBox control={control} name="armor-type" label="防具種別" options={ARMOR_TYPES.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><TextInput control={control} name="armor-dodge" label="ドッジ" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><TextInput control={control} name="armor-initiative" label="行動" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><TextInput control={control} name="armor-armor" label="装甲値" isNumber suffix="以上"/></div>
        </>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function VehicleSearchForm ({control}: {control:any}) {
    return(
        <>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox control={control} name="weapon-skill" label="技能" options={VEHICLE_SKILLS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-2"><TextInput control={control} name="weapon-atk" label="攻撃力" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-2"><TextInput control={control} name="weapon-initiative" label="行動" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-2"><TextInput control={control} name="weapon-armor" label="装甲値" isNumber suffix="以上"/></div>
            <div className="grid-item col-span-12 lg:col-span-2"><TextInput control={control} name="weapon-dash" label="全力移動" isNumber suffix="m以上"/></div>
        </>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ConnectionSearchForm ({control}: {control:any}) {
    return(
        <>
            <div className="grid-item col-span-12 lg:col-span-12"><SelectBox control={control} name="connection-skill" label="技能" options={CONNECTION_SKILLS.map((s)=>({value:s,label:s}))} isMulti/></div>
        </>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GeneralSearchForm ({control}: {control:any}) {
    return(
        <>
            <div className="grid-item col-span-12 lg:col-span-12"><SelectBox control={control} name="general-type" label="一般アイテム種別" options={GENERAL_TYPES.map((s)=>({value:s,label:s}))} isMulti/></div>
        </>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DloisSearchForm({ control }: {control:any}) {
    return (
        <>
            <div className="grid-item col-span-12 lg:col-span-12"><TextInput label="名称" name="name" control={control}/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="サプリメント" name="supplement" control={control} options={DLOIS_SUPPLEMENTS.map(strToSelectObj)} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="分類" name="type" control={control} options={DLOIS_TYPES.map(strToSelectObj)} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="制限" name="restrict" control={control} options={DLOIS_RESTRICTS.map(strToSelectObj)} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-12"><TextInput label="効果" name="effect" control={control}/></div>
        </>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EloisSearchForm({ control }: { control:any }) {
    return (
        <>
            <div className="grid-item col-span-12 lg:col-span-12"><TextInput label="名称" name="name" control={control}/></div>
            <div className="grid-item col-span-12 lg:col-span-6"><SelectBox label="サプリメント" name="supplement" control={control} options={ELOIS_SUPPLEMENTS.map(strToSelectObj)} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-6"><SelectBox label="分類" name="type" control={control} options={ELOIS_TYPES.map(strToSelectObj)} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="タイミング" name="timing" control={control} options={ELOIS_TIMINGS.map(strToSelectObj)} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="技能" name="skill" control={control} options={ELOIS_SKILLS.map(strToSelectObj)} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="難易度" name="dfclty" control={control} options={ELOIS_DFCLTIES.map(strToSelectObj)} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="対象" name="target" control={control} options={ELOIS_TARGETS.map(strToSelectObj)} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="射程" name="rng" control={control} options={ELOIS_RNGS.map(strToSelectObj)} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="衝動" name="urge" control={control} options={ELOIS_URGES.map(strToSelectObj)} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-12"><TextInput label="効果" name="effect" control={control}/></div>
        </>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WorkSearchForm({ control }: { control:any }) {
    return (
        <>
            <div className="grid-item col-span-12 lg:col-span-3"><TextInput label="名称" name="name" control={control}/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><SelectBox label="サプリメント" name="supplement" control={control} options={WORK_SUPPLEMENTS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><SelectBox label="能力値" name="stat" control={control} options={WORK_STATS.map((s)=>({value:s,label:s}))} isMulti/></div>
            <div className="grid-item col-span-12 lg:col-span-3"><SelectBox label="技能" name="skill" control={control} options={WORK_SKILLS.map((s)=>({value:s,label:s}))} isMulti/></div>
        </>
    )
  }

////////////////////////////////
// フォームを構成する基本要素
////////////////////////////////

function FormContainer ({ children }: { children:React.ReactNode }) {
    return (
        <div className='bg-light-dark border border-neutral-500 p-4 mb-8'>
            { children }
        </div>
    )
}