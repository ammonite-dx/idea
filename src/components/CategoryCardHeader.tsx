import ScaledText from "./ScaledText"

export default function CategoryCardHeader ({ categoryName }: { categoryName:string }) {
    return (
        <div className="text-sm lg:text-lg font-black px-1 lg:px-2 pt-0 pb-1 lg:pb-2 text-center">
            <ScaledText text={categoryName}/>
        </div>
    )
}