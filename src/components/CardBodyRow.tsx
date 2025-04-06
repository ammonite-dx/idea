import React from "react";

export default function CardBodyRow ({ children }: { children:React.ReactNode }) {
    if (React.Children.count(children) === 1) {
        return(
            <div className={`grid grid-cols-none pb-1`}>
                { children }
            </div>
        )
    } else {
        return(
            <div className={`grid grid-cols-${React.Children.count(children)} pb-1`}>
                { children }
            </div>
        )
    }
}