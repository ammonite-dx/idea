import React from 'react';

export default function WrappedText ({ text }: { text:string}) {
    const lines = text.split("\\n");
    return(
        <div className="columns-1 pb-1 text-justify">
            {lines.map((line:string, index:number) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    );
}