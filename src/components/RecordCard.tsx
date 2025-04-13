import React from "react";
import Link from "next/link";
import ScaledText from "./ScaledText";
import FavoriteButton from "./FavoriteButton";
import getDataById from "@/utils/getRecordById";
import { PrimaryRecord, Power, Weapon, Armor, Vehicle, Connection, General, Dlois, Elois, Faq, Info } from "@/types/types";

// データカード
export default function RecordCard ({ record, category=false, details=false }: { record:PrimaryRecord, category?:boolean , details?:boolean }) {
  switch (record.kind) {
    case "power":
      return <PowerCard power={record} category={category} details={details} />;
    case "weapon":
      return <WeaponCard weapon={record} category={category} details={details} />;
    case "armor":
      return <ArmorCard armor={record} category={category} details={details} />;
    case "vehicle":
      return <VehicleCard vehicle={record} category={category} details={details} />;
    case "connection":
      return <ConnectionCard connection={record} category={category} details={details} />;
    case "general":
      return <GeneralCard general={record} category={category} details={details} />;
    case "dlois":
      return <DloisCard dlois={record} details={details} />;
    case "elois":
      return <EloisCard elois={record} details={details} />;
    default:
      return null;
  }
}

////////////////////////////////
// 各カードのコンポーネント群
////////////////////////////////

// エフェクトカード
async function PowerCard ({ power, category, details }: { power:Power, category:boolean , details:boolean }) {
  return (
    <Card>
      <CardHeader title={power.name} record={power} subtitle={power.type === "一般" ? "" : power.type} />
      <CardDivider />
      <CardBody>
        {category && <CardBodyRow><PropDict name="カテゴリ" value={power.category} /></CardBodyRow>}
        <CardBodyRow><PropDict name="出典" value={power.supplement} /></CardBodyRow>
        <CardBodyRow><PropDict name="最大レベル" value={power.maxlv} /></CardBodyRow>
        <CardBodyRow><PropDict name="タイミング" value={power.timing} /></CardBodyRow>
        <CardBodyRow><PropDict name="技能" value={power.skill} /><PropDict name="難易度" value={power.dfclty} /></CardBodyRow>
        <CardBodyRow><PropDict name="対象" value={power.target} /><PropDict name="射程" value={power.rng} /></CardBodyRow>
        <CardBodyRow><PropDict name="侵蝕値" value={power.encroach} /><PropDict name="制限" value={power.restrict} /></CardBodyRow>
        {power.premise && <CardBodyRow><PropDict name="前提条件" value={power.premise} /></CardBodyRow>}
        {power.flavor && <EffectDict name="解説" value={power.flavor} />}
        {power.effect && <EffectDict name="効果" value={power.effect} />}
      </CardBody>
      {power.ref_weapon && 
        <CardBody>
          <CardBodyRow><PropDict name="種別" value={power.ref_weapon.type} /></CardBodyRow>
          <CardBodyRow><PropDict name="技能" value={power.ref_weapon.skill} /></CardBodyRow>
          <CardBodyRow><PropDict name="命中" value={power.ref_weapon.acc} /><PropDict name="攻撃力" value={power.ref_weapon.atk} /></CardBodyRow>
          <CardBodyRow><PropDict name="ガード値" value={power.ref_weapon.guard} /><PropDict name="射程" value={power.ref_weapon.rng} /></CardBodyRow>
        </CardBody>
      }
      {power.ref_armor && 
        <CardBody>
          <CardBodyRow><PropDict name="種別" value={power.ref_armor.type} /></CardBodyRow>
          <CardBodyRow><PropDict name="ドッジ" value={power.ref_armor.dodge} /><PropDict name="行動" value={power.ref_armor.initiative} /></CardBodyRow>
          <CardBodyRow><PropDict name="装甲値" value={power.ref_armor.armor} /></CardBodyRow>
        </CardBody>
      }
      {details && power.ref_faqs && <FaqBody faqs={power.ref_faqs} />}
      {details && power.ref_infos && <InfoBody infos={power.ref_infos} />}
    </Card>
  );
}

// 武器カード
async function WeaponCard ({ weapon, category, details }: { weapon:Weapon, category:boolean, details:boolean }) {
  if (weapon.refed_power_id) {
    const refed_power = await getDataById("power", weapon.refed_power_id)
    if (refed_power) {
      return PowerCard({ power:refed_power, category, details });
    }
  }
  if (weapon.refed_armor_id) {
    const refed_armor = await getDataById("armor", weapon.refed_armor_id)
    if (refed_armor) {
      return ArmorCard({ armor:refed_armor, category, details });
    }
  }
  if (weapon.refed_general_id) {
    const refed_general = await getDataById("general", weapon.refed_general_id)
    if (refed_general) {
      return GeneralCard({ general:refed_general, category, details });
    }
  }
  return (
    <Card>
      <CardHeader title={weapon.name} record={weapon} subtitle={""} />
      <CardDivider />
      <CardBody>
        {category && <CardBodyRow><PropDict name="カテゴリ" value={weapon.category} /></CardBodyRow>}
        <CardBodyRow><PropDict name="出典" value={weapon.supplement} /></CardBodyRow>
        <CardBodyRow><PropDict name="種別" value={weapon.type} /></CardBodyRow>
        <CardBodyRow><PropDict name="技能" value={weapon.skill} /></CardBodyRow>
        <CardBodyRow><PropDict name="命中" value={weapon.acc} /><PropDict name="攻撃力" value={weapon.atk} /></CardBodyRow>
        <CardBodyRow><PropDict name="ガード値" value={weapon.guard} /><PropDict name="射程" value={weapon.rng} /></CardBodyRow>
        {(weapon.procure && weapon.stock) && <CardBodyRow><PropDict name="購入/常備化" value={`${weapon.procure}/${weapon.stock}`} /></CardBodyRow>}
        {weapon.exp && <CardBodyRow><PropDict name="必要経験点" value={weapon.exp} /></CardBodyRow>}
        {weapon.rec && <CardBodyRow><PropDict name="REC" value={weapon.rec} /></CardBodyRow>}
        {weapon.flavor && <EffectDict name="解説" value={weapon.flavor} />}
        {weapon.effect && <EffectDict name={weapon.rec ? "通常効果" : "効果"} value={weapon.effect} />}
        {weapon.rec_effect && <EffectDict name="強化効果" value={weapon.rec_effect} />}
        {weapon.price && <EffectDict name="代償" value={weapon.price} />}
      </CardBody>
      {details && weapon.ref_faqs && <FaqBody faqs={weapon.ref_faqs} />}
      {details && weapon.ref_infos && <InfoBody infos={weapon.ref_infos} />}
    </Card>
  );
}

// 防具カード
async function ArmorCard ({ armor, category, details }: { armor:Armor, category:boolean, details:boolean }) {
  if (armor.refed_power_id) {
    const refed_power = await getDataById("power", armor.refed_power_id)
    if (refed_power) {
      return PowerCard({ power:refed_power, category, details });
    }
  }
  return (
    <Card>
      <CardHeader title={armor.name} record={armor} subtitle={""} />
      <CardDivider />
      <CardBody>
        {category && <CardBodyRow><PropDict name="カテゴリ" value={armor.category} /></CardBodyRow>}
        <CardBodyRow><PropDict name="出典" value={armor.supplement} /></CardBodyRow>
        <CardBodyRow><PropDict name="種別" value={armor.type} /></CardBodyRow>
        <CardBodyRow><PropDict name="ドッジ" value={armor.dodge} /><PropDict name="行動" value={armor.initiative} /></CardBodyRow>
        <CardBodyRow><PropDict name="装甲値" value={armor.armor} /></CardBodyRow>
        {(armor.procure && armor.stock) && <CardBodyRow><PropDict name="購入/常備化" value={`${armor.procure}/${armor.stock}`} /></CardBodyRow>}
        {armor.exp && <CardBodyRow><PropDict name="必要経験点" value={armor.exp} /></CardBodyRow>}
        {armor.rec && <CardBodyRow><PropDict name="REC" value={armor.rec} /></CardBodyRow>}
        {armor.flavor && <EffectDict name="解説" value={armor.flavor} />}
        {armor.effect && <EffectDict name={armor.rec ? "通常効果" : "効果"} value={armor.effect} />}
        {armor.ref_weapon && 
          <>
            <CardBodyRow><PropDict name="種別" value={armor.ref_weapon.type} /></CardBodyRow>
            <CardBodyRow><PropDict name="技能" value={armor.ref_weapon.skill} /></CardBodyRow>
            <CardBodyRow><PropDict name="命中" value={armor.ref_weapon.acc} /><PropDict name="攻撃力" value={armor.ref_weapon.atk} /></CardBodyRow>
            <CardBodyRow><PropDict name="ガード値" value={armor.ref_weapon.guard} /><PropDict name="射程" value={armor.ref_weapon.rng} /></CardBodyRow>
          </>
        }
        {armor.rec_effect && <EffectDict name="強化効果" value={armor.rec_effect} />}
        {armor.price && <EffectDict name="代償" value={armor.price} />}
      </CardBody>
      {details && armor.ref_faqs && <FaqBody faqs={armor.ref_faqs} />}
      {details && armor.ref_infos && <InfoBody infos={armor.ref_infos} />}
    </Card>
  );
}

// ヴィークルカード
async function VehicleCard ({ vehicle, category, details }: { vehicle:Vehicle, category:boolean, details:boolean }) {
  return (
    <Card>
      <CardHeader title={vehicle.name} record={vehicle} subtitle={""} />
      <CardDivider />
      <CardBody>
        {category && <CardBodyRow><PropDict name="カテゴリ" value={vehicle.category} /></CardBodyRow>}
        <CardBodyRow><PropDict name="出典" value={vehicle.supplement} /></CardBodyRow>
        <CardBodyRow><PropDict name="種別" value={vehicle.type} /></CardBodyRow>
        <CardBodyRow><PropDict name="技能" value={vehicle.skill} /></CardBodyRow>
        <CardBodyRow><PropDict name="攻撃力" value={vehicle.atk} /><PropDict name="行動" value={vehicle.initiative} /></CardBodyRow>
        <CardBodyRow><PropDict name="装甲値" value={vehicle.armor} /><PropDict name="全力移動" value={vehicle.dash} /></CardBodyRow>
        {(vehicle.procure && vehicle.stock) && <CardBodyRow><PropDict name="購入/常備化" value={`${vehicle.procure}/${vehicle.stock}`} /></CardBodyRow>}
        {vehicle.exp && <CardBodyRow><PropDict name="必要経験点" value={vehicle.exp} /></CardBodyRow>}
        {vehicle.rec && <CardBodyRow><PropDict name="REC" value={vehicle.rec} /></CardBodyRow>}
        {vehicle.flavor && <EffectDict name="解説" value={vehicle.flavor} />}
        {vehicle.effect && <EffectDict name={vehicle.rec ? "通常効果" : "効果"} value={vehicle.effect} />}
        {vehicle.rec_effect && <EffectDict name="強化効果" value={vehicle.rec_effect} />}
        {vehicle.price && <EffectDict name="代償" value={vehicle.price} />}
      </CardBody>
      {details && vehicle.ref_faqs && <FaqBody faqs={vehicle.ref_faqs} />}
      {details && vehicle.ref_infos && <InfoBody infos={vehicle.ref_infos} />}
    </Card>
  );
}

// コネカード
async function ConnectionCard ({ connection, category, details }: { connection:Connection, category:boolean, details:boolean }) {
  return (
    <Card>
      <CardHeader title={connection.name} record={connection} subtitle={""} />
      <CardDivider />
      <CardBody>
        {category && <CardBodyRow><PropDict name="カテゴリ" value={connection.category} /></CardBodyRow>}
        <CardBodyRow><PropDict name="種別" value={connection.type} /></CardBodyRow>
        <CardBodyRow><PropDict name="技能" value={connection.skill} /></CardBodyRow>
        {(connection.procure && connection.stock) && <CardBodyRow><PropDict name="購入/常備化" value={`${connection.procure}/${connection.stock}`} /></CardBodyRow>}
        {connection.exp && <CardBodyRow><PropDict name="必要経験点" value={connection.exp} /></CardBodyRow>}
        {connection.rec && <CardBodyRow><PropDict name="REC" value={connection.rec} /></CardBodyRow>}
        {connection.flavor && <EffectDict name="解説" value={connection.flavor} />}
        {connection.effect && <EffectDict name={connection.rec ? "通常効果" : "効果"} value={connection.effect} />}
        {connection.rec_effect && <EffectDict name="強化効果" value={connection.rec_effect} />}
        {connection.price && <EffectDict name="代償" value={connection.price} />}
      </CardBody>
      {details && connection.ref_faqs && <FaqBody faqs={connection.ref_faqs} />}
      {details && connection.ref_infos && <InfoBody infos={connection.ref_infos} />}
    </Card>
  );
}

// 一般アイテムカード
async function GeneralCard ({ general, category, details }: { general:General, category:boolean, details:boolean }) {
  return (
    <Card>
      <CardHeader title={general.name} record={general} subtitle={""} />
      <CardDivider />
      <CardBody>
        {category && <CardBodyRow><PropDict name="カテゴリ" value={general.category} /></CardBodyRow>}
        <CardBodyRow><PropDict name="出典" value={general.supplement} /></CardBodyRow>
        <CardBodyRow><PropDict name="種別" value={general.type} /></CardBodyRow>
        {(general.procure && general.stock) && <CardBodyRow><PropDict name="購入/常備化" value={`${general.procure}/${general.stock}`} /></CardBodyRow>}
        {general.exp && <CardBodyRow><PropDict name="必要経験点" value={general.exp} /></CardBodyRow>}
        {general.rec && <CardBodyRow><PropDict name="REC" value={general.rec} /></CardBodyRow>}
        {general.flavor && <EffectDict name="解説" value={general.flavor} />}
        {general.effect && <EffectDict name={general.rec ? "通常効果" : "効果"} value={general.effect} />}
        {general.ref_weapon && 
          <>
            <CardBodyRow><PropDict name="種別" value={general.ref_weapon.type} /></CardBodyRow>
            <CardBodyRow><PropDict name="技能" value={general.ref_weapon.skill} /></CardBodyRow>
            <CardBodyRow><PropDict name="命中" value={general.ref_weapon.acc} /><PropDict name="攻撃力" value={general.ref_weapon.atk} /></CardBodyRow>
            <CardBodyRow><PropDict name="ガード値" value={general.ref_weapon.guard} /><PropDict name="射程" value={general.ref_weapon.rng} /></CardBodyRow>
          </>
        }
        {general.rec_effect && <EffectDict name="強化効果" value={general.rec_effect} />}
        {general.price && <EffectDict name="代償" value={general.price} />}
      </CardBody>
      {details && general.ref_faqs && <FaqBody faqs={general.ref_faqs} />}
      {details && general.ref_infos && <InfoBody infos={general.ref_infos} />}
    </Card>
  );
}

// Dロイスカード
async function DloisCard ({ dlois, details }: { dlois:Dlois, details:boolean }) {
  return (
    <Card>
      <CardHeader title={dlois.name} record={dlois}/>
      <CardDivider />
      <CardBody>
        <CardBodyRow><PropDict name="出典" value={dlois.supplement} /></CardBodyRow>
        <CardBodyRow><PropDict name="制限" value={dlois.restrict} /></CardBodyRow>
        {details ?
          <>
            <div className="my-2"><WrappedText text={dlois.flavor} /></div>
            <div className="my-2"><span className="font-bold">●解説</span><WrappedText text={dlois.description} /></div>
            <div className="my-2">
              {dlois.rec && <CardBodyRow><PropDict name="REC" value={dlois.rec}/></CardBodyRow>}
              {dlois.rec ? <span className="font-bold">●通常効果</span> : <span className="font-bold">●効果</span>}<WrappedText text={dlois.effect}/>
              {dlois.rec_effect && <EffectDict name="強化効果" value={dlois.rec_effect}/>}
            </div>
          </>
        :
          <>
            <EffectDict name="解説" value={dlois.flavor_summary} />
            {dlois.rec && <CardBodyRow><PropDict name="REC" value={dlois.rec}/></CardBodyRow>}
            {dlois.rec ? <EffectDict name="通常効果" value={dlois.effect_summary}/> : <EffectDict name="効果" value={dlois.effect_summary}/>}
            {dlois.rec_effect_summary && <EffectDict name="強化効果" value={dlois.rec_effect_summary}/>}
          </>
        }
      </CardBody>
      {dlois.id==="上級-起源種" && <CardBody><OriginalRenegadeAd/></CardBody>}
      {dlois.id==="LM-起源種" && <CardBody><OriginalRenegadeLM/></CardBody>}
      {dlois.ref_power && 
        <>
          <CardDivider />
          <CardBody>
            <div className="mr-1 lg:mr-2 text-left shrink-0 font-bold">《{dlois.ref_power.name}》</div>
            <CardBodyRow><PropDict name="最大レベル" value={dlois.ref_power.maxlv} /></CardBodyRow>
            <CardBodyRow><PropDict name="タイミング" value={dlois.ref_power.timing} /></CardBodyRow>
            <CardBodyRow><PropDict name="技能" value={dlois.ref_power.skill} /><PropDict name="難易度" value={dlois.ref_power.dfclty} /></CardBodyRow>
            <CardBodyRow><PropDict name="対象" value={dlois.ref_power.target} /><PropDict name="射程" value={dlois.ref_power.rng} /></CardBodyRow>
            <CardBodyRow><PropDict name="侵蝕値" value={dlois.ref_power.encroach} /><PropDict name="制限" value={dlois.ref_power.restrict} /></CardBodyRow>
            {dlois.ref_power.effect && <EffectDict name="効果" value={dlois.ref_power.effect} />}
          </CardBody>
        </>
      }
      {details && dlois.ref_faqs && <FaqBody faqs={dlois.ref_faqs} />}
      {details && dlois.ref_infos && <InfoBody infos={dlois.ref_infos} />}
    </Card>
  );
}

// Eロイスカード
async function EloisCard ({ elois, details }: { elois:Elois, details:boolean }) {
  return (
    <Card>
      <CardHeader title={elois.name} record={elois} />
      <CardDivider />
      <CardBody>
        <CardBodyRow><PropDict name="出典" value={elois.supplement} /></CardBodyRow>
        <CardBodyRow><PropDict name="タイミング" value={elois.timing} /></CardBodyRow>
        <CardBodyRow><PropDict name="技能" value={elois.skill} /><PropDict name="難易度" value={elois.dfclty} /></CardBodyRow>
        <CardBodyRow><PropDict name="対象" value={elois.target} /><PropDict name="射程" value={elois.rng} /></CardBodyRow>
        <CardBodyRow><PropDict name="衝動" value={elois.urge} /></CardBodyRow>
        <EffectDict name="解説" value={elois.flavor} />
        <EffectDict name="効果" value={elois.effect} />
      </CardBody>
      {details && elois.ref_faqs && <FaqBody faqs={elois.ref_faqs} />}
      {details && elois.ref_infos && <InfoBody infos={elois.ref_infos} />}
    </Card>
  );
}

////////////////////////////////
// カード内で使う要素
////////////////////////////////

// FAQ
function FaqBody ({ faqs }: { faqs:Faq[] }) {
  return (
    <>
      <CardDivider />
      <CardBody>
        {faqs.map(faq => (
          <div key={faq.id} className="py-1">
            <EffectDict name="Q" value={faq.q} />
            <EffectDict name="A" value={faq.a} />
          </div>
        ))}
      </CardBody>
    </>
  );
}

// 補足情報
function InfoBody ({ infos }: { infos:Info[] }) {
  return (
    <>
      <CardDivider />
      <CardBody>
        {infos.map(info => (
          <div key={info.id} className="py-1">
            <EffectDict name={info.title} value={info.content} />
          </div>
        ))}
      </CardBody>
    </>
  );
}

////////////////////////////////
// 一部のカードで使う要素
////////////////////////////////

// 起源種用侵蝕率効果表(上級)
function OriginalRenegadeAd() {
  return (
    <table className="table-auto w-full border-collapse">
        <thead className="border-b border-neutral-900 dark:border-neutral-200">
            <tr><th className="text-center py-1">侵蝕率</th><th className="text-center py-1">エフェクトLV</th></tr>
        </thead>
        <tbody>
            <tr><td className="text-center py-1">0～79</td><td className="text-center py-1">±0</td></tr>
            <tr><td className="text-center py-1">80～99</td><td className="text-center py-1">+1</td></tr>
            <tr><td className="text-center py-1">100～149</td><td className="text-center py-1">+2</td></tr>
            <tr><td className="text-center py-1">150～</td><td className="text-center py-1">+3</td></tr>
        </tbody>
    </table>
  );
}

// 起源種用侵蝕率効果表(LM)
function OriginalRenegadeLM() {
  return (
    <table className="table-auto w-full border-collapse">
        <thead className="border-b border-neutral-900 dark:border-neutral-200">
            <tr><th className="text-center py-1">侵蝕率</th><th className="text-center py-1">エフェクトLV</th></tr>
        </thead>
        <tbody>
            <tr><td className="text-center py-1">0～79</td><td className="text-center py-1">±0</td></tr>
            <tr><td className="text-center py-1">80～99</td><td className="text-center py-1">+1</td></tr>
            <tr><td className="text-center py-1">100～149</td><td className="text-center py-1">+2</td></tr>
            <tr><td className="text-center py-1">150～199</td><td className="text-center py-1">+3</td></tr>
            <tr><td className="text-center py-1">200～</td><td className="text-center py-1">+4</td></tr>
        </tbody>
    </table>
  );
}

////////////////////////////////
// カードを構成する基本要素
////////////////////////////////

// カード本体
function Card ({ children }: { children:React.ReactNode }) {
  return (
    <div className="border border-neutral-900 dark:border-neutral-200 rounded-lg p-1 lg:p-2 m-1 lg:m-2">
      { children }
    </div>
  )
}

// カードのボディ
function CardBody ({ children }: { children:React.ReactNode }) {
  return (
    <div className="text-2xs lg:text-base px-1 lg:px-2">
      { children }
    </div>
  )
}

// カードボディ内の行
function CardBodyRow ({ children }: { children:React.ReactNode }) {
  // 子要素の数が1の場合は1列、2以上の場合はそれに応じた列数を指定する
  if (React.Children.count(children) === 1) {
    return(
      <div className={`grid grid-cols-none pb-1`}>
        { children }
      </div>
    )
  } else {
    return(
      <div className={`grid grid-cols-${React.Children.count(children)} pb-1`}>
        { children }
      </div>
    )
  }
}

// カードの区切り線
function CardDivider () {
  return (
      <div className="py-1 lg:py-2"><hr className="border-neutral-900 dark:border-neutral-200"/></div>
  )
}

// カードのヘッダー
function CardHeader ({ title, record, subtitle="" }: { title:string, record:PrimaryRecord, subtitle?:string }) {
  const link = `/record/${record.kind}/${record.id}`;
  return (
      <div className="flex items-center justify-between px-1 lg:px-2 py-0">
          <div className="flex-1 text-left text-sm lg:text-lg font-black overflow-hidden"><Link href={link}><ScaledText text={title}/></Link></div>
          <div className="text-right mx-1 lg:mx-2 text-xs lg:text-base font-black">{subtitle}</div>
          <FavoriteButton recordKind={record.kind} recordId={record.id} />
      </div>
  )
}



////////////////////////////////
// テキスト系の補助コンポーネント
////////////////////////////////

// プロパティ辞書
function PropDict ({ name, value }: { name:string, value:string}) {
  return(
    <div className="flex items-center min-w-0 w-full">
      <div className="mr-1 lg:mr-2 text-left shrink-0 font-bold">{name}:</div>
      <ScaledText text={value} />
    </div>
  );
}

// 効果の辞書
function EffectDict ({ name, value }: { name:string, value:string}) {
  const lines = value.split("\\n");
  return(
      <div className="columns-1 pb-1 text-justify">
          <p><span className="font-bold">{name}: </span>{value}</p> 
      </div>
  );
}

// 改行付きテキスト
function WrappedText ({ text }: { text:string}) {
  const lines = text.split("\\n");
  return(
      <div className="columns-1 pb-1 text-justify">
          {lines.map((line:string, index:number) => (
              <p key={index}>{line}</p>
          ))}
      </div>
  );
}