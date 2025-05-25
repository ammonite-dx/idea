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
    ref_weapon?: Weapon | null,
    ref_armor?: Armor | null,
    refed_dlois?: Dlois | null,
    other_vers?: Power[],
    rel_powers?: Power[],
    rel_weapons?: Weapon[],
    rel_armors?: Armor[],
    rel_vehicles?: Vehicle[],
    rel_connections?: Connection[],
    rel_generals?: General[],
    rel_dloises?: Dlois[],
    rel_faqs?: Faq[],
    rel_infos?: Info[],
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
    refed_power?: Power | null,
    refed_armor?: Armor | null,
    refed_general?: General | null,
    other_vers?: Weapon[],
    rel_powers?: Power[],
    rel_weapons?: Weapon[],
    rel_armors?: Armor[],
    rel_vehicles?: Vehicle[],
    rel_connections?: Connection[],
    rel_generals?: General[],
    rel_dloises?: Dlois[],
    rel_faqs?: Faq[],
    rel_infos?: Info[],
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
    ref_weapon?: Weapon | null,
    refed_power?: Power | null,
    other_vers?: Armor[],
    rel_powers?: Power[],
    rel_weapons?: Weapon[],
    rel_armors?: Armor[],
    rel_vehicles?: Vehicle[],
    rel_connections?: Connection[],
    rel_generals?: General[],
    rel_dloises?: Dlois[],
    rel_faqs?: Faq[],
    rel_infos?: Info[],
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
    other_vers?: Vehicle[],
    rel_powers?: Power[],
    rel_weapons?: Weapon[],
    rel_armors?: Armor[],
    rel_vehicles?: Vehicle[],
    rel_connections?: Connection[],
    rel_generals?: General[],
    rel_dloises?: Dlois[],
    rel_faqs?: Faq[],
    rel_infos?: Info[],
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
    other_vers?: Connection[],
    rel_powers?: Power[],
    rel_weapons?: Weapon[],
    rel_armors?: Armor[],
    rel_vehicles?: Vehicle[],
    rel_connections?: Connection[],
    rel_generals?: General[],
    rel_dloises?: Dlois[],
    rel_faqs?: Faq[],
    rel_infos?: Info[],
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
    ref_weapon?: Weapon | null,
    other_vers?: General[],
    rel_powers?: Power[],
    rel_weapons?: Weapon[],
    rel_armors?: Armor[],
    rel_vehicles?: Vehicle[],
    rel_connections?: Connection[],
    rel_generals?: General[],
    rel_dloises?: Dlois[],
    rel_faqs?: Faq[],
    rel_infos?: Info[],
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
    ref_power?: Power | null,
    flavor_summary: string,
    effect_summary: string,
    rec_effect_summary: string | null,
    other_vers?: Dlois[],
    rel_powers?: Power[],
    rel_weapons?: Weapon[],
    rel_armors?: Armor[],
    rel_vehicles?: Vehicle[],
    rel_connections?: Connection[],
    rel_generals?: General[],
    rel_dloises?: Dlois[],
    rel_faqs?: Faq[],
    rel_infos?: Info[],
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
    other_vers?: Elois[],
    rel_eloises?: Elois[],
    rel_faqs?: Faq[],
    rel_infos?: Info[],
};

export type Work = {
    kind: "work",
    id: string,
    supplement: string,
    name: string,
    stat: string,
    skills: string,
    emblems: string | null,
}

export type Faq = {
    kind: "faq",
    id: string,
    q: string,
    a: string,
    rel_powers?: Power[],
    rel_weapons?: Weapon[],
    rel_armors?: Armor[],
    rel_vehicles?: Vehicle[],
    rel_connections?: Connection[],
    rel_generals?: General[],
    rel_dloises?: Dlois[],
    rel_eloises?: Elois[],
};

export type Info = {
    kind: "info",
    id: string,
    title: string,
    content: string,
    rel_powers?: Power[],
    rel_weapons?: Weapon[],
    rel_armors?: Armor[],
    rel_vehicles?: Vehicle[],
    rel_connections?: Connection[],
    rel_generals?: General[],
    rel_dloises?: Dlois[],
    rel_eloises?: Elois[],
};

export type User = {
    id: string;
    fav_powers?: Power[];
    fav_weapons?: Weapon[];
    fav_armors?: Armor[];
    fav_vehicles?: Vehicle[];
    fav_connections?: Connection[];
    fav_generals?: General[];
    fav_dloises?: Dlois[];
    fav_eloises?: Elois[];
};

export type PowerResponse = {
    id: string;
    supplement: string;
    category: string;
    type: string;
    name: string;
    ruby: string;
    maxlv: string;
    maxlv_int: number | null;
    timing: string;
    skill: string;
    dfclty: string;
    target: string;
    rng: string;
    encroach: string;
    restrict: string;
    premise: string | null;
    flavor: string | null;
    effect: string | null;
    ref_weapon?: WeaponResponse | null;
    ref_armor?: ArmorResponse | null;
    refed_dlois?: DloisResponse | null;
    other_vers?: PowerResponse[];
    update_supplement: string | null;
    rel_powers?: PowerResponse[];
    rel_weapons?: WeaponResponse[];
    rel_armors?: ArmorResponse[];
    rel_vehicles?: VehicleResponse[];
    rel_connections?: ConnectionResponse[];
    rel_generals?: GeneralResponse[];
    rel_dloises?: DloisResponse[];
    rel_faqs?: FaqResponse[];
    rel_infos?: InfoResponse[];
    favorited_by?: UserResponse[];
    type_restrict_order: number;
};

export type WeaponResponse = {
    id: string;
    supplement: string;
    category: string;
    name: string;
    ruby: string;
    type: string;
    skill: string;
    acc: string;
    acc_int: number | null;
    atk: string;
    atk_int: number | null;
    guard: string;
    guard_int: number | null;
    rng: string;
    rng_int: number | null;
    procure: string | null;
    procure_int: number | null;
    stock: string | null;
    stock_int: number | null;
    exp: string | null;
    exp_int: number | null;
    rec: string | null;
    flavor: string | null;
    effect: string | null;
    price: string | null;
    rec_effect: string | null;
    refed_power?: PowerResponse | null;
    refed_armor?: ArmorResponse | null;
    refed_general?: GeneralResponse | null;
    update_supplement: string | null;
    other_vers?: WeaponResponse[];
    rel_powers?: PowerResponse[];
    rel_weapons?: WeaponResponse[];
    rel_armors?: ArmorResponse[];
    rel_vehicles?: VehicleResponse[];
    rel_connections?: ConnectionResponse[];
    rel_generals?: GeneralResponse[];
    rel_dloises?: DloisResponse[];
    rel_faqs?: FaqResponse[];
    rel_infos?: InfoResponse[];
    favorited_by?: UserResponse[];
    type_order: number;
    cost_order: number;
};

export type ArmorResponse = {
    id: string;
    supplement: string;
    category: string;
    name: string;
    ruby: string;
    type: string;
    dodge: string;
    dodge_int: number | null;
    initiative: string;
    initiative_int: number | null;
    armor: string;
    armor_int: number | null;
    procure: string | null;
    procure_int: number | null;
    stock: string | null;
    stock_int: number | null;
    exp: string | null;
    exp_int: number | null;
    rec: string | null;
    flavor: string | null;
    effect: string | null;
    price: string | null;
    rec_effect: string | null;
    ref_weapon?: WeaponResponse | null;
    refed_power?: PowerResponse | null;
    update_supplement: string | null;
    other_vers?: ArmorResponse[];
    rel_powers?: PowerResponse[];
    rel_weapons?: WeaponResponse[];
    rel_armors?: ArmorResponse[];
    rel_vehicles?: VehicleResponse[];
    rel_connections?: ConnectionResponse[];
    rel_generals?: GeneralResponse[];
    rel_dloises?: DloisResponse[];
    rel_faqs?: FaqResponse[];
    rel_infos?: InfoResponse[];
    favorited_by?: UserResponse[];
    type_order: number;
    cost_order: number;
};

export type VehicleResponse = {
    id: string;
    supplement: string;
    category: string;
    name: string;
    ruby: string;
    type: string;
    skill: string;
    atk: string;
    atk_int: number | null;
    initiative: string;
    initiative_int: number | null;
    armor: string;
    armor_int: number | null;
    dash: string;
    dash_int: number | null;
    procure: string | null;
    procure_int: number | null;
    stock: string | null;
    stock_int: number | null;
    exp: string | null;
    exp_int: number | null;
    rec: string | null;
    flavor: string | null;
    effect: string | null;
    price: string | null;
    rec_effect: string | null;
    update_supplement: string | null;
    other_vers?: VehicleResponse[];
    rel_powers?: PowerResponse[];
    rel_weapons?: WeaponResponse[];
    rel_armors?: ArmorResponse[];
    rel_vehicles?: VehicleResponse[];
    rel_connections?: ConnectionResponse[];
    rel_generals?: GeneralResponse[];
    rel_dloises?: DloisResponse[];
    rel_faqs?: FaqResponse[];
    rel_infos?: InfoResponse[];
    favorited_by?: UserResponse[];
    cost_order: number;
};

export type ConnectionResponse = {
    id: string;
    supplement: string;
    category: string;
    name: string;
    ruby: string;
    type: string;
    skill: string;
    procure: string | null;
    procure_int: number | null;
    stock: string | null;
    stock_int: number | null;
    exp: string | null;
    exp_int: number | null;
    rec: string | null;
    flavor: string | null;
    effect: string | null;
    price: string | null;
    rec_effect: string | null;
    update_supplement: string | null;
    other_vers?: ConnectionResponse[];
    rel_powers?: PowerResponse[];
    rel_weapons?: WeaponResponse[];
    rel_armors?: ArmorResponse[];
    rel_vehicles?: VehicleResponse[];
    rel_connections?: ConnectionResponse[];
    rel_generals?: GeneralResponse[];
    rel_dloises?: DloisResponse[];
    rel_faqs?: FaqResponse[];
    rel_infos?: InfoResponse[];
    favorited_by?: UserResponse[];
    cost_order: number;
};

export type GeneralResponse = {
    id: string;
    supplement: string;
    category: string;
    name: string;
    ruby: string;
    type: string;
    procure: string | null;
    procure_int: number | null;
    stock: string | null;
    stock_int: number | null;
    exp: string | null;
    exp_int: number | null;
    rec: string | null;
    flavor: string | null;
    effect: string | null;
    price: string | null;
    rec_effect: string | null;
    ref_weapon?: WeaponResponse | null;
    update_supplement: string | null;
    other_vers?: GeneralResponse[];
    rel_powers?: PowerResponse[];
    rel_weapons?: WeaponResponse[];
    rel_armors?: ArmorResponse[];
    rel_vehicles?: VehicleResponse[];
    rel_connections?: ConnectionResponse[];
    rel_generals?: GeneralResponse[];
    rel_dloises?: DloisResponse[];
    rel_faqs?: FaqResponse[];
    rel_infos?: InfoResponse[];
    favorited_by?: UserResponse[];
    type_order: number;
    cost_order: number;
};

export type DloisResponse = {
    id: string;
    supplement: string;
    no: string;
    type: string;
    name: string;
    ruby: string;
    restrict: string;
    flavor: string;
    description: string;
    rec: string | null;
    effect: string;
    rec_effect: string | null;
    ref_power?: PowerResponse | null;
    update_supplement: string | null;
    other_vers?: DloisResponse[];
    rel_powers?: PowerResponse[];
    rel_weapons?: WeaponResponse[];
    rel_armors?: ArmorResponse[];
    rel_vehicles?: VehicleResponse[];
    rel_connections?: ConnectionResponse[];
    rel_generals?: GeneralResponse[];
    rel_dloises?: DloisResponse[];
    rel_faqs?: FaqResponse[];
    rel_infos?: InfoResponse[];
    favorited_by?: UserResponse[];
    flavor_summary: string;
    effect_summary: string;
    rec_effect_summary: string | null;
    type_order: number;
    restrict_order: number;
};

export type EloisResponse = {
    id: string;
    supplement: string;
    type: string;
    name: string;
    ruby: string;
    timing: string;
    skill: string;
    dfclty: string;
    target: string;
    rng: string;
    urge: string;
    flavor: string;
    effect: string;
    update_supplement: string | null;
    other_vers?: EloisResponse[];
    rel_eloises?: EloisResponse[];
    rel_faqs?: FaqResponse[];
    rel_infos?: InfoResponse[];
    favorited_by?: UserResponse[];
    type_order: number;
    urge_order: number;
};

export type WorkResponse = {
    id: string;
    supplement: string;
    name: string;
    stat: string;
    skills: string;
    emblems: string | null;
};

export type FaqResponse = {
    id: string;
    q: string;
    a: string;
    rel_powers?: PowerResponse[];
    rel_weapons?: WeaponResponse[];
    rel_armors?: ArmorResponse[];
    rel_vehicles?: VehicleResponse[];
    rel_connections?: ConnectionResponse[];
    rel_generals?: GeneralResponse[];
    rel_dloises?: DloisResponse[];
    rel_eloises?: EloisResponse[];
};

export type InfoResponse = {
    id: string;
    title: string;
    content: string;
    rel_powers?: PowerResponse[];
    rel_weapons?: WeaponResponse[];
    rel_armors?: ArmorResponse[];
    rel_vehicles?: VehicleResponse[];
    rel_connections?: ConnectionResponse[];
    rel_generals?: GeneralResponse[];
    rel_dloises?: DloisResponse[];
    rel_eloises?: EloisResponse[];
};

export type UserResponse = {
    id: string;
    fav_powers?: PowerResponse[];
    fav_weapons?: WeaponResponse[];
    fav_armors?: ArmorResponse[];
    fav_vehicles?: VehicleResponse[];
    fav_connections?: ConnectionResponse[];
    fav_generals?: GeneralResponse[];
    fav_dloises?: DloisResponse[];
    fav_eloises?: EloisResponse[];
};