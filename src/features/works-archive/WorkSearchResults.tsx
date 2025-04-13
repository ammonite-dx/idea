import searchRecords from "@/utils/searchRecords";
import { Work } from "@/types/types";

export default async function WorkSearchResults ({
    searchParams,
  }: {
    searchParams: { [key:string]: string | string[] | undefined },
  }) {

    const works: { [key: string]: Work[] } | null = await searchRecords("work", searchParams);
    if (!works) return <div className="m-4">Error: WorkSearchResultsで、ワークスの検索結果がnullでした。</div>;

    return (
      <div className="m-4">
        {works["ワークス"].length >0 ?
          <table className="table-auto w-full border-collapse">
            <thead className="border-b border-neutral-900 dark:border-neutral-200">
              <tr><th className="text-center py-1">名称</th><th className="text-center py-1">能力値</th><th className="text-center py-1">技能1</th><th className="text-center py-1">技能2</th><th className="text-center py-1">技能3</th><th className="text-center py-1">技能4</th><th className="text-center py-1">技能5</th></tr>
            </thead>
            <tbody>
              {works["ワークス"].map((work) => (
                <tr key={work.id} className="border-b border-neutral-900 dark:border-neutral-200">
                  <td className="text-center py-1">{work.name}</td>
                  <td className="text-center py-1">{work.stat}</td>
                  {work.skills.map((skill, index) => (
                    <td key={index} className="text-center py-1">{skill}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table> 
        :
          <div className="m-4">条件に一致するワークスがありません。</div>
        }
      </div>
    );
  }