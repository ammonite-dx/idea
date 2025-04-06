import { Connection } from "@/types/types";
import Card from "@/components/Card";
import CardHeader from "@/components/CardHeader";
import CardDivider from "@/components/CardDivider";
import CardBody from "@/components/CardBody";
import CardBodyRow from "@/components/CardBodyRow";
import PropDict from "@/components/PropDict";
import EffectDict from "@/components/EffectDict";

export default function ConnectionCard ({ connection, category=false, details=false }: { connection:Connection, category?:boolean, details?:boolean }) {
    return (
      <Card>
        <CardHeader title={connection.name} data={connection} subtitle={""} />
        <CardDivider />
        <CardBody>
          {category && <CardBodyRow><PropDict name="カテゴリ" value={connection.category} /></CardBodyRow>}
          <CardBodyRow>
            <PropDict name="種別" value={connection.type} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="技能" value={connection.skill} />
          </CardBodyRow>
          {(connection.procure && connection.stock) && <CardBodyRow><PropDict name="購入/常備化" value={`${connection.procure}/${connection.stock}`} /></CardBodyRow>}
          {connection.exp && <CardBodyRow><PropDict name="必要経験点" value={connection.exp} /></CardBodyRow>}
          {connection.rec && <CardBodyRow><PropDict name="REC" value={connection.rec} /></CardBodyRow>}
          {connection.flavor && <EffectDict name="解説" value={connection.flavor} />}
          {connection.effect && <EffectDict name={connection.rec ? "通常効果" : "効果"} value={connection.effect} />}
          {connection.rec_effect && <EffectDict name="強化効果" value={connection.rec_effect} />}
          {connection.price && <EffectDict name="代償" value={connection.price} />}
        </CardBody>
        {details && connection.ref_faqs &&
          <>
            <CardDivider />
            <CardBody>
              {connection.ref_faqs.map(faq => (
                <div key={faq.id} className="py-1">
                  <EffectDict name="Q" value={faq.q} />
                  <EffectDict name="A" value={faq.a} />
                </div>
              ))}
            </CardBody>
          </>
        }
        {details && connection.ref_infos &&
          <>
            <CardDivider />
            <CardBody>
              {connection.ref_infos.map(info => (
                <div key={info.id} className="py-1">
                  <EffectDict name={info.title} value={info.content} />
                </div>
              ))}
            </CardBody>
          </>
        }
      </Card>
    );
}
