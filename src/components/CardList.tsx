import CategoryCard from "@/components/CategoryCard";
import RecordCard from "@/components/RecordCard";
import { PrimaryRecord } from "@/types/types";

export default async function CardList ({title, records, category=false}: {title:string, records:PrimaryRecord[], category?:boolean}) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard title={title} hitNumber={records.length} />
            {records.map((record) => (
                <RecordCard key={record.id} record={record} category={category}/>
            ))}
        </div>
    );
}