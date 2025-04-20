import CategoryCard from "@/components/CategoryCard";
import RecordCard from "@/components/RecordCard";
import { CardRecord } from "@/types/types";

export default async function CardList ({title, records, category=false}: {title:string, records:CardRecord[], category?:boolean}) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-4 mb-4">
            <CategoryCard title={title} hitNumber={records.length} />
            {records.map((record) => (
                <RecordCard key={record.id} record={record} category={category}/>
            ))}
        </div>
    );
}