import { Elois } from "@/types/types";
import Card from "@/components/Card";
import CardHeader from "@/components/CardHeader";
import CardDivider from "@/components/CardDivider";
import CardBody from "@/components/CardBody";
import CardBodyRow from "@/components/CardBodyRow";
import PropDict from "@/components/PropDict";
import EffectDict from "@/components/EffectDict";

export default function EloisCard ({ elois, details=false }: { elois:Elois, details?:boolean }) {
    return (
      <Card>
        <CardHeader title={elois.name} data={elois} />
        <CardDivider />
        <CardBody>
          <CardBodyRow>
            <PropDict name="出典" value={elois.supplement} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="タイミング" value={elois.timing} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="技能" value={elois.skill} />
            <PropDict name="難易度" value={elois.dfclty} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="対象" value={elois.target} />
            <PropDict name="射程" value={elois.rng} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="衝動" value={elois.urge} />
          </CardBodyRow>
          <EffectDict name="解説" value={elois.flavor} />
          <EffectDict name="効果" value={elois.effect} />
        </CardBody>
          {details && elois.ref_faqs &&
            <>
              <CardDivider />
              <CardBody>
                {elois.ref_faqs.map(faq => (
                  <div key={faq.id} className="py-1">
                    <EffectDict name="Q" value={faq.q} />
                    <EffectDict name="A" value={faq.a} />
                  </div>
                ))}
              </CardBody>
            </>
          }
          {details && elois.ref_infos &&
            <>
              <CardDivider />
              <CardBody>
                {elois.ref_infos.map(info => (
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
