import React from "react";

export default function FormContainer ({ children }: { children:React.ReactNode }) {
    return (
        <div className='bg-neutral-200 dark:bg-neutral-700 border border-neutral-500 p-4 m-4'>
            { children }
        </div>
    )
}