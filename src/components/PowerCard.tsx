import { Power } from "@/types/types";
import Card from "@/components/Card";
import CardHeader from "@/components/CardHeader";
import CardDivider from "@/components/CardDivider";
import CardBody from "@/components/CardBody";
import CardBodyRow from "@/components/CardBodyRow";
import PropDict from "@/components/PropDict";
import EffectDict from "@/components/EffectDict";

export default function PowerCard ({ power, category=false, details=false }: { power:Power, category?:boolean , details?:boolean }) {
    return (
      <Card>
        <CardHeader title={power.name} data={power} subtitle={power.type === "一般" ? "" : power.type} />
        <CardDivider />
        <CardBody>
          {category && <CardBodyRow><PropDict name="カテゴリ" value={power.category} /></CardBodyRow>}
          <CardBodyRow>
            <PropDict name="出典" value={power.supplement} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="最大レベル" value={power.maxlv} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="タイミング" value={power.timing} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="技能" value={power.skill} />
            <PropDict name="難易度" value={power.dfclty} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="対象" value={power.target} />
            <PropDict name="射程" value={power.rng} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="侵蝕値" value={power.encroach} />
            <PropDict name="制限" value={power.restrict} />
          </CardBodyRow>
          {power.premise && <CardBodyRow><PropDict name="前提条件" value={power.premise} /></CardBodyRow>}
          {power.flavor && <EffectDict name="解説" value={power.flavor} />}
          {power.effect && <EffectDict name="効果" value={power.effect} />}
        </CardBody>
        {power.ref_weapon && 
          <CardBody>
            <CardBodyRow>
              <PropDict name="種別" value={power.ref_weapon.type} />
            </CardBodyRow>
            <CardBodyRow>
              <PropDict name="技能" value={power.ref_weapon.skill} />
            </CardBodyRow>
            <CardBodyRow>
              <PropDict name="命中" value={power.ref_weapon.acc} />
              <PropDict name="攻撃力" value={power.ref_weapon.atk} />
            </CardBodyRow>
            <CardBodyRow>
              <PropDict name="ガード値" value={power.ref_weapon.guard} />
              <PropDict name="射程" value={power.ref_weapon.rng} />
            </CardBodyRow>
          </CardBody>
        }
        {power.ref_armor && 
          <CardBody>
            <CardBodyRow>
              <PropDict name="種別" value={power.ref_armor.type} />
            </CardBodyRow>
            <CardBodyRow>
              <PropDict name="ドッジ" value={power.ref_armor.dodge} />
              <PropDict name="行動" value={power.ref_armor.initiative} />
            </CardBodyRow>
            <CardBodyRow>
              <PropDict name="装甲値" value={power.ref_armor.armor} />
            </CardBodyRow>
          </CardBody>
        }
        {details && power.ref_faqs &&
          <>
            <CardDivider />
            <CardBody>
              {power.ref_faqs.map(faq => (
                <div key={faq.id} className="py-1">
                  <EffectDict name="Q" value={faq.q} />
                  <EffectDict name="A" value={faq.a} />
                </div>
              ))}
            </CardBody>
          </>
        }
        {details && power.ref_infos &&
          <>
            <CardDivider />
            <CardBody>
              {power.ref_infos.map(info => (
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
