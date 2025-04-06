import { Armor } from "@/types/types";
import Card from "@/components/Card";
import CardHeader from "@/components/CardHeader";
import CardDivider from "@/components/CardDivider";
import CardBody from "@/components/CardBody";
import CardBodyRow from "@/components/CardBodyRow";
import PropDict from "@/components/PropDict";
import EffectDict from "@/components/EffectDict";

export default function ArmorCard ({ armor, category=false, details=false }: { armor:Armor, category?:boolean, details?:boolean }) {
    return (
      <Card>
        <CardHeader title={armor.name} data={armor} subtitle={""} />
        <CardDivider />
        <CardBody>
          {category && <CardBodyRow><PropDict name="カテゴリ" value={armor.category} /></CardBodyRow>}
          <CardBodyRow>
            <PropDict name="出典" value={armor.supplement} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="種別" value={armor.type} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="ドッジ" value={armor.dodge} />
            <PropDict name="行動" value={armor.initiative} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="装甲値" value={armor.armor} />
          </CardBodyRow>
          {(armor.procure && armor.stock) && <CardBodyRow><PropDict name="購入/常備化" value={`${armor.procure}/${armor.stock}`} /></CardBodyRow>}
          {armor.exp && <CardBodyRow><PropDict name="必要経験点" value={armor.exp} /></CardBodyRow>}
          {armor.rec && <CardBodyRow><PropDict name="REC" value={armor.rec} /></CardBodyRow>}
          {armor.flavor && <EffectDict name="解説" value={armor.flavor} />}
          {armor.effect && <EffectDict name={armor.rec ? "通常効果" : "効果"} value={armor.effect} />}
          {armor.ref_weapon && 
            <>
              <CardBodyRow>
                <PropDict name="種別" value={armor.ref_weapon.type} />
              </CardBodyRow>
              <CardBodyRow>
                <PropDict name="技能" value={armor.ref_weapon.skill} />
              </CardBodyRow>
              <CardBodyRow>
                <PropDict name="命中" value={armor.ref_weapon.acc} />
                <PropDict name="攻撃力" value={armor.ref_weapon.atk} />
              </CardBodyRow>
              <CardBodyRow>
                <PropDict name="ガード値" value={armor.ref_weapon.guard} />
                <PropDict name="射程" value={armor.ref_weapon.rng} />
              </CardBodyRow>
            </>
          }
          {armor.rec_effect && <EffectDict name="強化効果" value={armor.rec_effect} />}
          {armor.price && <EffectDict name="代償" value={armor.price} />}
        </CardBody>
        {details && armor.ref_faqs &&
          <>
            <CardDivider />
            <CardBody>
              {armor.ref_faqs.map(faq => (
                <div key={faq.id} className="py-1">
                  <EffectDict name="Q" value={faq.q} />
                  <EffectDict name="A" value={faq.a} />
                </div>
              ))}
            </CardBody>
          </>
        }
        {details && armor.ref_infos &&
          <>
            <CardDivider />
            <CardBody>
              {armor.ref_infos.map(info => (
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
