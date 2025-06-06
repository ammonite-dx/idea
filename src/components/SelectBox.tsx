"use client";

import clsx from 'clsx';
import Select from 'react-select';
import { Controller } from 'react-hook-form';

// オプションの型定義
interface Option {
    value: string;
    label: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SelectBox ({control, name, label, options, isMulti=false}: {control:any, name:string, label:string, options:(Option|{label:string,options:Option[]})[], isMulti?:boolean}) {
    return (
        <Controller 
            name = {name}
            control = {control}
            render = {({ field }) => (
                <label className='base-text'>
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
                            control: () => 'input-box rounded-sm bg-white dark:bg-neutral-900 ring-1 ring-inset ring-neutral-500 dark:ring-neutral-200 px-1 flex',
                                valueContainer: () => 'flex flex-wrap gap-1',
                                    singleValue: () => 'h-full mx-1',
                                    multiValue: () => 'h-full bg-neutral-200 dark:bg-neutral-500 rounded-sm px-1 items-center',
                                        multiValueLabel: () => 'base-text text-neutral-900 dark:text-neutral-100',
                                        multiValueRemove: () => 'base-text ml-1',
                                    input : () => 'h-full',
                                indicatorsContainer: () => 'flex self-stretch',
                                    indicatorSeparator: () => 'w-px m-1 bg-neutral-500 dark:bg-neutral-200',   
                                    dropdownIndicator: () => 'h-full flex items-center justify-center',
                            menu: () => 'border border-neutral-500 dark:border-neutral-200',
                                option: ({isFocused}) => clsx(
                                    'p-2 base-text cursor-pointer',
                                    isFocused ? 'bg-neutral-200 dark:bg-neutral-500' : 'bg-white dark:bg-neutral-900'
                                ),
                            noOptionsMessage: () => 'bg-white dark:bg-neutral-900 p-2 base-text',
                        }}
                        styles ={{
                            control: (base) => ({
                                ...base,
                                minHeight: '28px',
                                height: 'auto',
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                padding: '6px 2px',
                            }),
                        }}
                    />
                </label>
            )}
        />
    );
};

