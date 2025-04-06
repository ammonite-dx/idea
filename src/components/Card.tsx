import React from "react";

export default function Card ({ children }: { children:React.ReactNode }) {
    return (
        <div className="border border-neutral-900 dark:border-neutral-200 rounded-lg p-1 lg:p-2 m-1 lg:m-2">
            { children }
        </div>
    )
}