import React from "react";

export default function CardBody ({ children }: { children:React.ReactNode }) {
    return (
        <div className="text-2xs lg:text-base px-1 lg:px-2">
            { children }
        </div>
    )
}