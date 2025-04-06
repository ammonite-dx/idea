import ScaledText from "./ScaledText"

export default function PropDict ({ name, value }: { name:string, value:string}) {
    return(
        <div className="flex items-center min-w-0 w-full">
            <div className="mr-1 lg:mr-2 text-left shrink-0 font-bold">{name}:</div>
            <ScaledText text={value} />
        </div>
    );
}