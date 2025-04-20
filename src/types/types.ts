export type Record = CardRecord | TableRecord | TextRecord;
export type CardRecord = Power | Item | Dlois | Elois;
export type Item = Weapon | Armor | Vehicle | Connection | General;
export type TableRecord = Work;
export type TextRecord = Faq | Info ;

export type RecordKind = CardRecordKind | TableRecordKind | TextRecordKind;
export type CardRecordKind = "power" | "weapon" | "armor" | "vehicle" | "connection" | "general" | "dlois" | "elois";
export type TableRecordKind = "works"
export type TextRecordKind = "faq" | "info";
export type SearchKind = "power" | "item" | "dlois" | "elois" | "work";

export type TypeMap = {
    power: Power;
    item: Item;
    weapon: Weapon;
    armor: Armor;
    vehicle: Vehicle;
    connection: Connection;
    general: General;
    dlois: Dlois;
    elois: Elois;
    work: Work;
    faq: Faq;
    info: Info;
};

export type Power = {
    kind: "power",
    id: string,
    supplement: string,
    category: string,
    type: string,
    name: string,
    maxlv: string,
    timing: string,
    skill: string,
    dfclty: string,
    target: string,
    rng: string,
    encroach: string,
    restrict: string,
    premise: string | null,
    flavor: string | null,
    effect: string | null,
    ref_weapon: Weapon | null,
    ref_armor: Armor | null,
    ref_faqs: Faq[] | null,
    ref_infos: Info[] | null,
    other_ver_id: string | null,
    rel_power_id: string | null,
    rel_weapon_id: string | null,
    rel_armor_id: string | null,
    rel_vehicle_id: string | null,
    rel_connection_id: string | null,
    rel_general_id: string | null,
    rel_dlois_id: string | null,
};

export type Weapon = {
    kind: "weapon",
    id: string,
    supplement: string,
    category: string,
    name: string,
    type: string,
    skill: string,
    acc: string,
    atk: string,
    guard: string,
    rng: string,
    procure: string | null,
    stock: string | null,
    exp: string | null,
    rec: string | null,
    flavor: string | null,
    effect: string | null,
    price: string | null,
    rec_effect: string | null,
    ref_faqs: Faq[] | null,
    ref_infos: Info[] | null,
    refed_power_id: string | null,
    refed_armor_id: string | null,
    refed_general_id: string | null,
    other_ver_id: string | null,
    rel_power_id: string | null,
    rel_weapon_id: string | null,
    rel_armor_id: string | null,
    rel_vehicle_id: string | null,
    rel_connection_id: string | null,
    rel_general_id: string | null,
    rel_dlois_id: string | null,
};

export type Armor = {
    kind: "armor",
    id: string,
    supplement: string,
    category: string,
    name: string,
    type: string,
    dodge: string,
    initiative: string,
    armor: string,
    procure: string | null,
    stock: string | null,
    exp: string | null,
    rec: string | null,
    flavor: string | null,
    effect: string | null,
    price: string | null,
    rec_effect: string | null,
    ref_weapon: Weapon | null,
    ref_faqs: Faq[] | null,
    ref_infos: Info[] | null,
    refed_power_id: string | null,
    other_ver_id: string | null,
    rel_power_id: string | null,
    rel_weapon_id: string | null,
    rel_armor_id: string | null,
    rel_vehicle_id: string | null,
    rel_connection_id: string | null,
    rel_general_id: string | null,
    rel_dlois_id: string | null,
};

export type Vehicle = {
    kind: "vehicle",
    id: string,
    supplement: string,
    category: string,
    name: string,
    type: string,
    skill: string,
    atk: string,
    initiative: string,
    armor: string,
    dash: string,
    procure: string | null,
    stock: string | null,
    exp: string | null,
    rec: string | null,
    flavor: string | null,
    effect: string | null,
    price: string | null,
    rec_effect: string | null,
    ref_faqs: Faq[] | null,
    ref_infos: Info[] | null,
    other_ver_id: string | null,
    rel_power_id: string | null,
    rel_weapon_id: string | null,
    rel_armor_id: string | null,
    rel_vehicle_id: string | null,
    rel_connection_id: string | null,
    rel_general_id: string | null,
    rel_dlois_id: string | null,
};

export type Connection = {
    kind: "connection",
    id: string,
    supplement: string,
    category: string,
    name: string,
    type: string,
    skill: string,
    procure: string | null,
    stock: string | null,
    exp: string | null,
    rec: string | null,
    flavor: string | null,
    effect: string | null,
    price: string | null,
    rec_effect: string | null,
    ref_faqs: Faq[] | null,
    ref_infos: Info[] | null,
    other_ver_id: string | null,
    rel_power_id: string | null,
    rel_weapon_id: string | null,
    rel_armor_id: string | null,
    rel_vehicle_id: string | null,
    rel_connection_id: string | null,
    rel_general_id: string | null,
    rel_dlois_id: string | null,
};

export type General = {
    kind: "general",
    id: string,
    supplement: string,
    category: string,
    name: string,
    type: string,
    procure: string | null,
    stock: string | null,
    exp: string | null,
    rec: string | null,
    flavor: string | null,
    effect: string | null,
    price: string | null,
    rec_effect: string | null,
    ref_weapon: Weapon | null,
    ref_faqs: Faq[] | null,
    ref_infos: Info[] | null,
    other_ver_id: string | null,
    rel_power_id: string | null,
    rel_weapon_id: string | null,
    rel_armor_id: string | null,
    rel_vehicle_id: string | null,
    rel_connection_id: string | null,
    rel_general_id: string | null,
    rel_dlois_id: string | null,
};

export type Dlois = {
    kind: "dlois",
    id: string,
    supplement: string,
    type: string,
    name: string,
    restrict: string,
    flavor: string,
    description: string,
    rec: string | null,
    effect: string,
    rec_effect: string | null,
    ref_power: Power | null,
    ref_faqs: Faq[] | null,
    ref_infos: Info[] | null,
    flavor_summary: string,
    effect_summary: string,
    rec_effect_summary: string | null,
    other_ver_id: string | null,
    rel_power_id: string | null,
    rel_weapon_id: string | null,
    rel_armor_id: string | null,
    rel_vehicle_id: string | null,
    rel_connection_id: string | null,
    rel_general_id: string | null,
    rel_dlois_id: string | null,
};

export type Elois = {
    kind: "elois",
    id: string,
    supplement: string,
    type: string,
    name: string,
    timing: string,
    skill: string,
    dfclty: string,
    target: string,
    rng: string,
    urge: string,
    flavor: string,
    effect: string,
    ref_faqs: Faq[] | null,
    ref_infos: Info[] | null,
    other_ver_id: string | null,
    rel_elois_id: string | null,
};

export type Faq = {
    kind: "faq",
    id: string,
    q: string,
    a: string,
};

export type Info = {
    kind: "info",
    id: string,
    title: string,
    content: string,
};

export type Work = {
    kind: "work",
    id: string,
    supplement: string,
    name: string,
    stat: string,
    skills: string[],
    emblems: string[] | null,
}