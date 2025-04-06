import { Weapon } from "@/types/types";
import Card from "@/components/Card";
import CardHeader from "@/components/CardHeader";
import CardDivider from "@/components/CardDivider";
import CardBody from "@/components/CardBody";
import CardBodyRow from "@/components/CardBodyRow";
import PropDict from "@/components/PropDict";
import EffectDict from "@/components/EffectDict";

export default function WeaponCard ({ weapon, category=false, details=false }: { weapon:Weapon, category?:boolean, details?:boolean }) {
    return (
      <Card>
        <CardHeader title={weapon.name} data={weapon} subtitle={""} />
        <CardDivider />
        <CardBody>
          {category && <CardBodyRow><PropDict name="カテゴリ" value={weapon.category} /></CardBodyRow>}
          <CardBodyRow>
            <PropDict name="出典" value={weapon.supplement} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="種別" value={weapon.type} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="技能" value={weapon.skill} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="命中" value={weapon.acc} />
            <PropDict name="攻撃力" value={weapon.atk} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="ガード値" value={weapon.guard} />
            <PropDict name="射程" value={weapon.rng} />
          </CardBodyRow>
          {(weapon.procure && weapon.stock) && <CardBodyRow><PropDict name="購入/常備化" value={`${weapon.procure}/${weapon.stock}`} /></CardBodyRow>}
          {weapon.exp && <CardBodyRow><PropDict name="必要経験点" value={weapon.exp} /></CardBodyRow>}
          {weapon.rec && <CardBodyRow><PropDict name="REC" value={weapon.rec} /></CardBodyRow>}
          {weapon.flavor && <EffectDict name="解説" value={weapon.flavor} />}
          {weapon.effect && <EffectDict name={weapon.rec ? "通常効果" : "効果"} value={weapon.effect} />}
          {weapon.rec_effect && <EffectDict name="強化効果" value={weapon.rec_effect} />}
          {weapon.price && <EffectDict name="代償" value={weapon.price} />}
        </CardBody>
        {details && weapon.ref_faqs &&
          <>
            <CardDivider />
            <CardBody>
              {weapon.ref_faqs.map(faq => (
                <div key={faq.id} className="py-1">
                  <EffectDict name="Q" value={faq.q} />
                  <EffectDict name="A" value={faq.a} />
                </div>
              ))}
            </CardBody>
          </>
        }
        {details && weapon.ref_infos &&
          <>
            <CardDivider />
            <CardBody>
              {weapon.ref_infos.map(info => (
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
