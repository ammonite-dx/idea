"use client";

import Form from 'next/form'
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormContainer from '@/components/FormContainer';
import TextBox from '@/components/TextInput';
import SelectBox from '@/components/SelectBox'
import SubmitButton from '@/components/SubmitButton';
import { toArray, toString, strToSelectObj } from '@/utils/utils';
import { ELOIS_SUPPLEMENTS, ELOIS_TYPES, ELOIS_TIMINGS, ELOIS_SKILLS, ELOIS_DFCLTIES, ELOIS_TARGETS, ELOIS_RNGS, ELOIS_URGES } from '@/consts/elois';

export default function EloisSearchForm({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

    // パラメータの初期値を設定
    const initialName = toString(searchParams["name"], "");
    const initialSupplement = toArray(searchParams["supplement"], []).map(strToSelectObj);
    const initialType = toArray(searchParams["type"], []).map(strToSelectObj);
    const initialTiming = toArray(searchParams["timing"], []).map(strToSelectObj);
    const initialSkill = toArray(searchParams["skill"], []).map(strToSelectObj);
    const initialDfclty = toArray(searchParams["dfclty"], []).map(strToSelectObj);
    const initialTarget = toArray(searchParams["target"], []).map(strToSelectObj);
    const initialRng = toArray(searchParams["rng"], []).map(strToSelectObj);
    const initialUrge = toArray(searchParams["urge"], []).map(strToSelectObj);
    const initialEffect = toString(searchParams["effect"], "");

  // フォームのcontrollを設定
  const { control } = useForm({
    defaultValues: {
        "name": initialName,
        "supplement": initialSupplement,
        "type": initialType,
        "timing": initialTiming,
        "skill": initialSkill,
        "dfclty": initialDfclty,
        "target": initialTarget,
        "rng": initialRng,
        "urge": initialUrge,
        "effect": initialEffect,
    }
  });

    // submitの処理
    const router = useRouter()
    const handleSubmit = (formData:FormData) => {
      const queryParams = new URLSearchParams();
      formData.forEach((value, key) => typeof value === "string" && value !== "" && queryParams.append(key, value));    
      router.push(`/elois-archive?${queryParams.toString()}`);
    }

  return (
    <FormContainer>
      <Form action={handleSubmit}>
        <div className='grid grid-cols-12 gap-x-4'>
          <div className="grid-item col-span-12 lg:col-span-12"><TextBox label="名称" name="name" control={control}/></div>
          <div className="grid-item col-span-12 lg:col-span-6"><SelectBox label="サプリメント" name="supplement" control={control} options={ELOIS_SUPPLEMENTS.map(strToSelectObj)} isMulti/></div>
          <div className="grid-item col-span-12 lg:col-span-6"><SelectBox label="分類" name="type" control={control} options={ELOIS_TYPES.map(strToSelectObj)} isMulti/></div>
          <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="タイミング" name="timing" control={control} options={ELOIS_TIMINGS.map(strToSelectObj)} isMulti/></div>
          <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="技能" name="skill" control={control} options={ELOIS_SKILLS.map(strToSelectObj)} isMulti/></div>
          <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="難易度" name="dfclty" control={control} options={ELOIS_DFCLTIES.map(strToSelectObj)} isMulti/></div>
          <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="対象" name="target" control={control} options={ELOIS_TARGETS.map(strToSelectObj)} isMulti/></div>
          <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="射程" name="rng" control={control} options={ELOIS_RNGS.map(strToSelectObj)} isMulti/></div>
          <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="衝動" name="urge" control={control} options={ELOIS_URGES.map(strToSelectObj)} isMulti/></div>
          <div className="grid-item col-span-12 lg:col-span-12"><TextBox label="効果" name="effect" control={control}/></div>
        </div>
        <div className="mt-6">
          <SubmitButton text="検索"/>
        </div>
      </Form>
    </FormContainer>
  )
}