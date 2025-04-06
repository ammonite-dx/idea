"use client";

import clsx from 'clsx';
import Select from 'react-select';
import { Controller } from 'react-hook-form';

// オプションの型定義
interface Option {
    value: string;
    label: string;
}

export default function SelectBox ({control, name, label, options, isMulti=false}: {control:any, name:string, label:string, options:(Option|{label:string,options:Option[]})[], isMulti?:boolean}) {
    return (
        <Controller 
            name = {name}
            control = {control}
            render = {({ field }) => (
                <label className='text-xs lg:text-sm'>
                    {label}
                    <Select
                        {...field}
                        instanceId = {name}
                        options = {options}
                        isMulti = {isMulti}
                        onChange={(selected) => field.onChange(selected)}
                        placeholder=""
                        unstyled
                        classNames={{
                            control: () => 'w-full h-full rounded-md bg-white dark:bg-neutral-900 border border-neutral-500 dark:border-neutral-200 px-1 text-left text-xs lg:text-sm',
                            indicatorSeparator: () => 'w-px m-1 bg-neutral-500 dark:bg-neutral-200',
                            menu: () => 'border border-neutral-500 dark:border-neutral-200',
                            groupHeading: () => 'bg-white dark:bg-neutral-900 text-center font-bold text-2xs lg:text-xs pt-2 pb-1',
                            option: ({isFocused}) => clsx(
                                'p-2 text-xs lg:text-sm cursor-pointer',
                                isFocused ? 'bg-neutral-200 dark:bg-neutral-500' : 'bg-white dark:bg-neutral-900'
                            ),
                            noOptionsMessage: () => 'bg-white dark:bg-neutral-900 p-2 text-xs lg:text-sm',
                            singleValue: () => 'pl-1',
                            multiValue: () => 'bg-neutral-200 dark:bg-neutral-500 rounded-sm mx-1 px-1 m-1',
                        }}
                    />
                </label>
            )}
        />
    );
};