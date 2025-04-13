"use client";

import Form from 'next/form'
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormContainer from '@/components/FormContainer';
import TextBox from '@/components/TextInput';
import SelectBox from '@/components/SelectBox'
import SubmitButton from '@/components/SubmitButton';
import { toArray,toString,strToSelectObj } from '@/utils/utils';
import { WORK_SUPPLEMENTS, WORK_STATS, WORK_SKILLS } from '@/consts/work';

export default function WorkSearchForm({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {

  // パラメータの初期値を設定
  const initialName = toString(searchParams["name"], "");
  const initialSupplements = toArray(searchParams["supplement"], []).map(strToSelectObj);
  const initialStats = toArray(searchParams["stat"], []).map(strToSelectObj);
  const initialSkills = toArray(searchParams["skill"], []).map(strToSelectObj);

  // フォームのcontrollを設定
  const { control } = useForm({
    defaultValues: {
      "name": initialName,
      "supplement": initialSupplements,
      "stat": initialStats,
      "skill": initialSkills,
    }
  });

  // submitの処理
  const router = useRouter()
  const handleSubmit = (formData:FormData) => {
    const queryParams = new URLSearchParams();
    formData.forEach((value, key) => typeof value === "string" && value !== "" && queryParams.append(key, value));    
    router.push(`/works-archive?${queryParams.toString()}`);
  }

  return (
    <FormContainer>
      <Form action={handleSubmit}>
        <div className='grid grid-cols-4 gap-x-4'>
          <div className="grid-item col-span-4 lg:col-span-1"><TextBox label="名称" name="name" control={control}/></div>
          <div className="grid-item col-span-4 lg:col-span-1"><SelectBox label="サプリメント" name="supplement" control={control} options={WORK_SUPPLEMENTS.map((s)=>({value:s,label:s}))} isMulti/></div>
          <div className="grid-item col-span-4 lg:col-span-1"><SelectBox label="能力値" name="stat" control={control} options={WORK_STATS.map((s)=>({value:s,label:s}))} isMulti/></div>
          <div className="grid-item col-span-4 lg:col-span-1"><SelectBox label="技能" name="skill" control={control} options={WORK_SKILLS.map((s)=>({value:s,label:s}))} isMulti/></div>
        </div>
        <div className="mt-6">
          <SubmitButton text="検索"/>
        </div>
      </Form>
    </FormContainer>
  )
}