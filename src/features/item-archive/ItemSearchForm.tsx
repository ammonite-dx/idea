"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormContainer from "@/components/FormContainer";
import SelectBox from "@/components/SelectBox";
import TextInput from "@/components/TextInput";
import SubmitButton from "@/components/SubmitButton";
import WeaponSearchForm from "./WeaponSearchForm";
import ArmorSearchForm from "./ArmorSearchForm";
import VehicleSearchForm from "./VehicleSearchForm";
import ConnectionSearchForm from "./ConnectionSearchForm";
import GeneralSearchForm from "./GeneralSearchForm";
import { toArray,toString,strToSelectObj } from '@/utils/utils';
import { ITEM_CATEGORIES,ITEM_SUPPLEMENTS,ITEM_TYPES } from "@/consts/item";

export default function ItemSearchForm ({searchParams} : {searchParams: {[key: string]: string | string[] | undefined}}) {

  // パラメータの初期値を設定
  // 共通
  const initialName = toString(searchParams["name"], "");
  const initialCategory = toArray(searchParams["category"], []).map(strToSelectObj);
  const initialSupplement = toArray(searchParams["supplement"], []).map(strToSelectObj);
  const initialItemType = strToSelectObj(toString(searchParams["item-type"], "指定なし"));
  const initialProcure = toString(searchParams["procure"], "");
  const initialStock = toString(searchParams["stock"], "");
  const initialExp = toString(searchParams["exp"], "");
  const initialEffect = toString(searchParams["effect"], "");
  // 武器
  const initialWeaponType = toArray(searchParams["weapon-type"], []).map(strToSelectObj);
  const initialWeaponSkill = toArray(searchParams["weapon-skill"], []).map(strToSelectObj);
  const initialWeaponAcc = toString(searchParams["weapon-acc"], "");
  const initialWeaponAtk = toString(searchParams["weapon-atk"], "");
  const initialWeaponRng = toString(searchParams["weapon-rng"], "");
  // 防具
  const initialArmorType = toArray(searchParams["armor-type"], []).map(strToSelectObj);
  const initialArmorDodge = toString(searchParams["armor-dodge"], "");
  const initialArmorInitiative = toString(searchParams["armor-initiative"], "");
  const initialArmorArmor = toString(searchParams["armor-armor"], "");
  // ヴィークル
  const initialVehicleSkill = toArray(searchParams["vehicle-skill"], []).map(strToSelectObj);
  const initialVehicleAtk = toString(searchParams["vehicle-atk"], "");
  const initialVehicleInitiative = toString(searchParams["vehicle-initiative"], "");
  const initialVehicleArmor = toString(searchParams["vehicle-armor"], "");
  const initialVehicleDash = toString(searchParams["vehicle-dash"], "");
  // コネ
  const initialConnectionSkill = toArray(searchParams["connection-skill"], []).map(strToSelectObj);
  // 一般
  const initialGeneralType = toArray(searchParams["general-type"], []).map(strToSelectObj);

  // フォームのcontrol, wachの設定
  const { control, watch } = useForm({
    defaultValues: {
      // 共通
      "name": initialName,
      "category": initialCategory,
      "supplement": initialSupplement,
      "item-type": initialItemType,
      "procure": initialProcure,
      "stock": initialStock,
      "exp": initialExp,
      // 武器
      "weapon-type": initialWeaponType,
      "weapon-skill": initialWeaponSkill,
      "weapon-acc": initialWeaponAcc,
      "weapon-atk": initialWeaponAtk,
      "weapon-rng": initialWeaponRng,
      // 防具
      "armor-type": initialArmorType,
      "armor-dodge": initialArmorDodge,
      "armor-initiative": initialArmorInitiative,
      "armor-armor": initialArmorArmor,
      // ヴィークル
      "vehicle-skill": initialVehicleSkill,
      "vehicle-atk": initialVehicleAtk,
      "vehicle-initiative": initialVehicleInitiative,
      "vehicle-armor": initialVehicleArmor,
      "vehicle-dash": initialVehicleDash,
      // コネ
      "connection-skill": initialConnectionSkill,
      // 一般アイテム
      "general-type": initialGeneralType,
      "effect": initialEffect,
    }
  });
  const itemType = watch("item-type");

  // submitの処理
  const router = useRouter()
  const handleSubmit = (formData:FormData) => {
    const queryParams = new URLSearchParams();
    formData.forEach((value, key) => typeof value === "string" && value !== "" && queryParams.append(key, value));    
    router.push(`/item-archive?${queryParams.toString()}`);
  }

  return (
    <FormContainer>
      <Form action={handleSubmit}>
        <div className='grid grid-cols-12 gap-x-4 gap-y-2'>
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
        </div>
        <div className="mt-6">
          <SubmitButton text="検索"/>
        </div>
      </Form>
    </FormContainer>
  );
};
