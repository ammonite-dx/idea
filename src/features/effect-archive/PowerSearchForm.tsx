"use client";

import Form from 'next/form'
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormContainer from '@/components/FormContainer';
import TextBox from '@/components/TextInput';
import SelectBox from '@/components/SelectBox'
import SubmitButton from '@/components/SubmitButton';
import { toArray,toString,strToSelectObj } from '@/utils/utils';
import { POWER_TYPES, POWER_CATEGORIES, POWER_SUPPLEMENTS, POWER_TIMINGS, POWER_SKILLS, POWER_DFCLTIES, POWER_TARGETS, POWER_RNGS, POWER_RESTRICTS } from '@/consts/power';

export default function PowerSearchForm({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

  // パラメータの初期値を設定
  const initialName = toString(searchParams["name"], "");
  const initialType = toArray(searchParams["type"], []).map(strToSelectObj);
  const initialCategory = toArray(searchParams["category"], []).map(strToSelectObj);
  const initialSupplement = toArray(searchParams["supplement"], []).map(strToSelectObj);
  const initialMaxlv = toString(searchParams["maxlv"], "");
  const initialTiming = toArray(searchParams["timing"], []).map(strToSelectObj);
  const initialSkill = toArray(searchParams["skill"], []).map(strToSelectObj);
  const initialDfclty = toArray(searchParams["dfclty"], []).map(strToSelectObj);
  const initialTarget = toArray(searchParams["target"], []).map(strToSelectObj);
  const initialRng = toArray(searchParams["rng"], []).map(strToSelectObj);
  const initialEncroach = toString(searchParams["encroach"], "");
  const initialRestrict = toArray(searchParams["restrict"], []).map(strToSelectObj);
  const initialEffect = toString(searchParams["effect"], "");

  // フォームのcontrollを設定
  const { control } = useForm({
    defaultValues: {
      "name": initialName,
      "type": initialType,
      "category": initialCategory,
      "supplement": initialSupplement,
      "maxlv": initialMaxlv,
      "timing": initialTiming,
      "skill": initialSkill,
      "dfclty": initialDfclty,
      "target": initialTarget,
      "rng": initialRng,
      "encroach": initialEncroach,
      "restrict": initialRestrict,
      "effect": initialEffect,
    }
  });

    // submitの処理
    const router = useRouter()
    const handleSubmit = (formData:FormData) => {
      const queryParams = new URLSearchParams();
      formData.forEach((value, key) => typeof value === "string" && value !== "" && queryParams.append(key, value));    
      router.push(`/effect-archive?${queryParams.toString()}`);
    }

  return (
    <FormContainer>
      <Form action={handleSubmit}>
        <div className='grid grid-cols-4 gap-x-4'>
          <div className="grid-item col-span-4 lg:col-span-2"><TextBox label="名称" name="name" control={control}/></div>
          <div className="grid-item col-span-4 lg:col-span-2"><SelectBox label="分類" name="type" control={control} options={POWER_TYPES.map((s)=>({value:s,label:s}))} isMulti/></div>
          <div className="grid-item col-span-2 lg:col-span-1"><SelectBox label="カテゴリ" name="category" control={control} options={POWER_CATEGORIES.map((s)=>({value:s,label:s}))} isMulti/></div>
          <div className="grid-item col-span-2 lg:col-span-1"><SelectBox label="サプリメント" name="supplement" control={control} options={POWER_SUPPLEMENTS.map((s)=>({value:s,label:s}))} isMulti/></div>
          <div className="grid-item col-span-2 lg:col-span-1"><TextBox label="最大レベル" name="maxlv" control={control} isNumber suffix='以上'/></div>
          <div className="grid-item col-span-2 lg:col-span-1"><SelectBox label="タイミング" name="timing" control={control} options={POWER_TIMINGS.map((s)=>({value:s,label:s}))} isMulti/></div>
          <div className="grid-item col-span-2 lg:col-span-1"><SelectBox label="技能" name="skill" control={control} options={POWER_SKILLS.map((s)=>({value:s,label:s}))} isMulti/></div>
          <div className="grid-item col-span-2 lg:col-span-1"><SelectBox label="難易度" name="dfclty" control={control} options={POWER_DFCLTIES.map((s)=>({value:s,label:s}))} isMulti/></div>
          <div className="grid-item col-span-2 lg:col-span-1"><SelectBox label="対象" name="target" control={control} options={POWER_TARGETS.map((s)=>({value:s,label:s}))} isMulti/></div>
          <div className="grid-item col-span-2 lg:col-span-1"><SelectBox label="射程" name="rng" control={control} options={POWER_RNGS.map((s)=>({value:s,label:s}))} isMulti/></div>
          <div className="grid-item col-span-2 lg:col-span-1"><TextBox label="侵蝕値" name="encroach" control={control} isNumber suffix='以下'/></div>
          <div className="grid-item col-span-2 lg:col-span-1"><SelectBox label="制限" name="restrict" control={control} options={POWER_RESTRICTS.map((s)=>({value:s,label:s}))} isMulti/></div>
          <div className="grid-item col-span-4 lg:col-span-2"><TextBox label="効果" name="effect" control={control}/></div>
        </div>
        <div className="mt-6">
          <SubmitButton text="検索"/>
        </div>
      </Form>
    </FormContainer>
  )
}