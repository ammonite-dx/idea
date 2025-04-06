import { Vehicle } from "@/types/types";
import Card from "@/components/Card";
import CardHeader from "@/components/CardHeader";
import CardDivider from "@/components/CardDivider";
import CardBody from "@/components/CardBody";
import CardBodyRow from "@/components/CardBodyRow";
import PropDict from "@/components/PropDict";
import EffectDict from "@/components/EffectDict";

export default function VehicleCard ({ vehicle, category=false, details=false }: { vehicle:Vehicle, category?:boolean, details?:boolean }) {
    return (
      <Card>
        <CardHeader title={vehicle.name} data={vehicle} subtitle={""} />
        <CardDivider />
        <CardBody>
          {category && <CardBodyRow><PropDict name="カテゴリ" value={vehicle.category} /></CardBodyRow>}
          <CardBodyRow>
            <PropDict name="出典" value={vehicle.supplement} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="種別" value={vehicle.type} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="技能" value={vehicle.skill} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="攻撃力" value={vehicle.atk} />
            <PropDict name="行動" value={vehicle.initiative} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="装甲値" value={vehicle.armor} />
            <PropDict name="全力移動" value={vehicle.dash} />
          </CardBodyRow>
          {(vehicle.procure && vehicle.stock) && <CardBodyRow><PropDict name="購入/常備化" value={`${vehicle.procure}/${vehicle.stock}`} /></CardBodyRow>}
          {vehicle.exp && <CardBodyRow><PropDict name="必要経験点" value={vehicle.exp} /></CardBodyRow>}
          
          {vehicle.rec && <CardBodyRow><PropDict name="REC" value={vehicle.rec} /></CardBodyRow>}
          {vehicle.flavor && <EffectDict name="解説" value={vehicle.flavor} />}
          {vehicle.effect && <EffectDict name={vehicle.rec ? "通常効果" : "効果"} value={vehicle.effect} />}
          {vehicle.rec_effect && <EffectDict name="強化効果" value={vehicle.rec_effect} />}
          {vehicle.price && <EffectDict name="代償" value={vehicle.price} />}
        </CardBody>
        {details && vehicle.ref_faqs &&
          <>
            <CardDivider />
            <CardBody>
              {vehicle.ref_faqs.map(faq => (
                <div key={faq.id} className="py-1">
                  <EffectDict name="Q" value={faq.q} />
                  <EffectDict name="A" value={faq.a} />
                </div>
              ))}
            </CardBody>
          </>
        }
        {details && vehicle.ref_infos &&
          <>
            <CardDivider />
            <CardBody>
              {vehicle.ref_infos.map(info => (
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
