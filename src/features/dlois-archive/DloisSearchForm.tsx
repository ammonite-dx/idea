"use client";

import Form from 'next/form'
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormContainer from '@/components/FormContainer';
import TextBox from '@/components/TextInput';
import SelectBox from '@/components/SelectBox'
import SubmitButton from '@/components/SubmitButton';
import { toArray,toString,strToSelectObj } from '@/utils/utils';
import { DLOIS_SUPPLEMENTS, DLOIS_TYPES, DLOIS_RESTRICTS } from '@/consts/dlois';

export default function DloisSearchForm({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

  // パラメータの初期値を設定
  const initialName = toString(searchParams["name"], "");
  const initialSupplement = toArray(searchParams["supplement"], []).map(strToSelectObj);
  const initialType = toArray(searchParams["type"], []).map(strToSelectObj);
  const initialRestrict = toArray(searchParams["restrict"], []).map(strToSelectObj);
  const initialEffect = toString(searchParams["effect"], "");

  // フォームのcontrollを設定
  const { control } = useForm({
    defaultValues: {
      "name": initialName,
      "supplement": initialSupplement,
      "type": initialType,
      "restrict": initialRestrict,
      "effect": initialEffect,
    }
  });

    // submitの処理
    const router = useRouter()
    const handleSubmit = (formData:FormData) => {
      const queryParams = new URLSearchParams();
      formData.forEach((value, key) => typeof value === "string" && value !== "" && queryParams.append(key, value));    
      router.push(`/dlois-archive?${queryParams.toString()}`);
    }

  return (
    <FormContainer>
      <Form action={handleSubmit}>
        <div className='grid grid-cols-12 gap-x-4'>
          <div className="grid-item col-span-12 lg:col-span-12"><TextBox label="名称" name="name" control={control}/></div>
          <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="サプリメント" name="supplement" control={control} options={DLOIS_SUPPLEMENTS.map(strToSelectObj)} isMulti/></div>
          <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="分類" name="type" control={control} options={DLOIS_TYPES.map(strToSelectObj)} isMulti/></div>
          <div className="grid-item col-span-12 lg:col-span-4"><SelectBox label="制限" name="restrict" control={control} options={DLOIS_RESTRICTS.map(strToSelectObj)} isMulti/></div>
          <div className="grid-item col-span-12 lg:col-span-12"><TextBox label="効果" name="effect" control={control}/></div>
        </div>
        <div className="mt-6">
          <SubmitButton text="検索"/>
        </div>
      </Form>
    </FormContainer>
  )
}