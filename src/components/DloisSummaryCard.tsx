import { Dlois } from "@/types/types";
import Card from "@/components/Card";
import CardHeader from "@/components/CardHeader";
import CardDivider from "@/components/CardDivider";
import CardBody from "@/components/CardBody";
import CardBodyRow from "@/components/CardBodyRow";
import PropDict from "@/components/PropDict";
import EffectDict from "@/components/EffectDict";
import OriginalRenegadeAd from "@/features/dlois-archive/OriginalRenegadeAd";
import OriginalRenegadeLM from "@/features/dlois-archive/OriginalRenegadeLM";

export default function DloisSummaryCard ({ dlois }: { dlois: Dlois }) {
    return (
      <Card>
        <CardHeader title={dlois.name} data={dlois}/>
        <CardDivider />
        <CardBody>
          <CardBodyRow>
            <PropDict name="出典" value={dlois.supplement} />
          </CardBodyRow>
          <CardBodyRow>
            <PropDict name="制限" value={dlois.restrict} />
          </CardBodyRow>
          <EffectDict name="解説" value={dlois.flavor_summary} />
          {dlois.rec && <CardBodyRow><PropDict name="REC" value={dlois.rec}/></CardBodyRow>}
          {dlois.rec ? <EffectDict name="通常効果" value={dlois.effect_summary}/> : <EffectDict name="効果" value={dlois.effect_summary}/>}
          {dlois.rec_effect_summary && <EffectDict name="強化効果" value={dlois.rec_effect_summary}/>}
        </CardBody>
        {dlois.ref_power && 
        <>
          <CardDivider />
          <CardBody>
            <div className="mr-1 lg:mr-2 text-left shrink-0 font-bold">《{dlois.ref_power.name}》</div>
            <CardBodyRow>
              <PropDict name="最大レベル" value={dlois.ref_power.maxlv} />
            </CardBodyRow>
            <CardBodyRow>
              <PropDict name="タイミング" value={dlois.ref_power.timing} />
            </CardBodyRow>
            <CardBodyRow>
              <PropDict name="技能" value={dlois.ref_power.skill} />
              <PropDict name="難易度" value={dlois.ref_power.dfclty} />
            </CardBodyRow>
            <CardBodyRow>
              <PropDict name="対象" value={dlois.ref_power.target} />
              <PropDict name="射程" value={dlois.ref_power.rng} />
            </CardBodyRow>
            <CardBodyRow>
              <PropDict name="侵蝕値" value={dlois.ref_power.encroach} />
              <PropDict name="制限" value={dlois.ref_power.restrict} />
            </CardBodyRow>
            {dlois.ref_power.effect && <EffectDict name="効果" value={dlois.ref_power.effect} />}
          </CardBody>
        </>
        }
        {dlois.id==="上級-起源種" && <CardBody><OriginalRenegadeAd/></CardBody>}
        {dlois.id==="LM-起源種" && <CardBody><OriginalRenegadeLM/></CardBody>}
      </Card>
    );
}
