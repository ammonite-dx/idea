import { General } from "@/types/types";
import Card from "@/components/Card";
import CardHeader from "@/components/CardHeader";
import CardDivider from "@/components/CardDivider";
import CardBody from "@/components/CardBody";
import CardBodyRow from "@/components/CardBodyRow";
import PropDict from "@/components/PropDict";
import EffectDict from "@/components/EffectDict";

export default function GeneralCard ({ general, category, details=false }: { general:General, category?:boolean, details?:boolean }) {
    return (
      <Card>
        <CardHeader title={general.name} data={general} subtitle={""} />
        <CardDivider />
        <CardBody>
          {category && <CardBodyRow><PropDict name="カテゴリ" value={general.category} /></CardBodyRow>}
          <CardBodyRow>
            <PropDict name="出典" value={general.supplement} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="種別" value={general.type} />
          </CardBodyRow>
          {(general.procure && general.stock) && <CardBodyRow><PropDict name="購入/常備化" value={`${general.procure}/${general.stock}`} /></CardBodyRow>}
          {general.exp && <CardBodyRow><PropDict name="必要経験点" value={general.exp} /></CardBodyRow>}
          {general.rec && <CardBodyRow><PropDict name="REC" value={general.rec} /></CardBodyRow>}
          {general.flavor && <EffectDict name="解説" value={general.flavor} />}
          {general.effect && <EffectDict name={general.rec ? "通常効果" : "効果"} value={general.effect} />}
          {general.ref_weapon && 
            <>
              <CardBodyRow>
                <PropDict name="種別" value={general.ref_weapon.type} />
              </CardBodyRow>
              <CardBodyRow>
                <PropDict name="技能" value={general.ref_weapon.skill} />
              </CardBodyRow>
              <CardBodyRow>
                <PropDict name="命中" value={general.ref_weapon.acc} />
                <PropDict name="攻撃力" value={general.ref_weapon.atk} />
              </CardBodyRow>
              <CardBodyRow>
                <PropDict name="ガード値" value={general.ref_weapon.guard} />
                <PropDict name="射程" value={general.ref_weapon.rng} />
              </CardBodyRow>
            </>
          }
          {general.rec_effect && <EffectDict name="強化効果" value={general.rec_effect} />}
          {general.price && <EffectDict name="代償" value={general.price} />}
        </CardBody>
        {details && general.ref_faqs &&
          <>
            <CardDivider />
            <CardBody>
              {general.ref_faqs.map(faq => (
                <div key={faq.id} className="py-1">
                  <EffectDict name="Q" value={faq.q} />
                  <EffectDict name="A" value={faq.a} />
                </div>
              ))}
            </CardBody>
          </>
        }
        {details && general.ref_infos &&
          <>
            <CardDivider />
            <CardBody>
              {general.ref_infos.map(info => (
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
