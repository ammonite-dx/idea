"use client";

import { ChevronUp,ChevronDown } from 'lucide-react';
import { Controller, ControllerRenderProps, FieldValues } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TextInput ({control, name, label, isNumber=false, suffix=""}: {control:any, name:string, label:string, isNumber?:boolean, suffix?:string}) {
    
    const changeValue = (e:React.MouseEvent, field:ControllerRenderProps<FieldValues,string>, delta:number) => {
        e.preventDefault();
        field.onChange((prev:number) => Number(prev) + delta);
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <label className='base-text'>
                    {label}
                    <div className="relative">
                        <input
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                            type={isNumber ? 'number' : 'text'}
                            className='w-full min-h-7 input-box rounded-sm bg-white dark:bg-neutral-900 border border-neutral-500 dark:border-neutral-200 p-1 pl-2 text-left base-text text-neutral-900 dark:text-neutral-100'
                        />
                        <span className="absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none">
                            {suffix}
                        </span>
                        {isNumber &&
                            <>
                                <div className='absolute right-7 top-1 w-px h-[calc(100%-8px)] items-center bg-white'/>
                                <button className="absolute right-1.5 top-0 h-1/2 w-5 items-center justify-center" onClick = {(e) => changeValue(e, field, 1)}><ChevronUp className='h-full'/></button>
                                <button className="absolute right-1.5 top-1/2 h-1/2 w-5 items-center justify-center" onClick = {(e) => changeValue(e, field, -1)}><ChevronDown className='h-full'/></button>
                            </>
                        }
                    </div>
                </label>
            )}
        />
    );
};