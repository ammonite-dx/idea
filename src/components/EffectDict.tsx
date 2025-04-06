import React from 'react';

export default function EffectDict ({ name, value }: { name:string, value:string}) {
    const lines = value.split("\\n");
    return(
        <div className="columns-1 pb-1 text-justify">
            <p><span className="font-bold">{name}: </span>{value}</p> 
        </div>
    );
}