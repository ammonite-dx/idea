import { Power, Weapon, Armor, Vehicle, Connection, General, Dlois, Elois, Work, Faq, Info, User, PowerResponse, WeaponResponse, ArmorResponse, VehicleResponse, ConnectionResponse, GeneralResponse, DloisResponse, EloisResponse, WorkResponse, FaqResponse, InfoResponse, UserResponse } from "@/types/types";

export function parsePower (response: PowerResponse): Power {
    try {
        const { id, supplement, category, type, name, maxlv, timing, skill, dfclty, target, rng, encroach, restrict, premise, flavor, effect } = response;
        const power_base: Power = { kind:"power", id, supplement, category, type, name, maxlv, timing, skill, dfclty, target, rng, encroach, restrict, premise, flavor, effect };
        const ref_weapon: Weapon|null = ("ref_weapon" in response && response.ref_weapon) ? parseWeapon(response.ref_weapon) : null;
        const ref_armor: Armor|null = ("ref_armor" in response && response.ref_armor) ? parseArmor(response.ref_armor) : null;
        const refed_dlois: Dlois|null = ("refed_dlois" in response && response.refed_dlois) ? {...parseDlois(response.refed_dlois), ref_power: power_base} : null;
        const other_vers: Power[] = ("other_vers" in response && response.other_vers) ? response.other_vers.map((res: PowerResponse) => parsePower(res)) : [];
        const rel_powers: Power[] = ("rel_powers" in response && response.rel_powers) ? response.rel_powers.map((res: PowerResponse) => parsePower(res)) : [];
        const rel_weapons: Weapon[] = ("rel_weapons" in response && response.rel_weapons) ? response.rel_weapons.map((res: WeaponResponse) => parseWeapon(res)) : [];
        const rel_armors: Armor[] = ("rel_armors" in response && response.rel_armors) ? response.rel_armors.map((res: ArmorResponse) => parseArmor(res)) : [];
        const rel_vehicles: Vehicle[] = ("rel_vehicles" in response && response.rel_vehicles) ? response.rel_vehicles.map((res: VehicleResponse) => parseVehicle(res)) : [];
        const rel_connections: Connection[] = ("rel_connections" in response && response.rel_connections) ? response.rel_connections.map((res: ConnectionResponse) => parseConnection(res)) : [];
        const rel_generals: General[] = ("rel_generals" in response && response.rel_generals) ? response.rel_generals.map((res: GeneralResponse) => parseGeneral(res)) : [];
        const rel_dloises: Dlois[] = ("rel_dloises" in response && response.rel_dloises) ? response.rel_dloises.map((res: DloisResponse) => parseDlois(res)) : [];
        const rel_faqs: Faq[] = ("rel_faqs" in response && response.rel_faqs) ? response.rel_faqs.map((res: FaqResponse) => parseFaq(res)) : [];
        const rel_infos: Info[] = ("rel_infos" in response && response.rel_infos) ? response.rel_infos.map((res: InfoResponse) => parseInfo(res)) : [];
        const favorited_by: User[] = ("favorited_by" in response && response.favorited_by) ? response.favorited_by.map((res: UserResponse) => parseUser(res)) : [];
        return {
            ...power_base,
            ref_weapon,
            ref_armor,
            refed_dlois,
            other_vers,
            rel_powers,
            rel_weapons,
            rel_armors,
            rel_vehicles,
            rel_connections,
            rel_generals,
            rel_dloises,
            rel_faqs,
            rel_infos,
            favorited_by
        };
    } catch (error) {
        console.error("[parsePower] Error:", error);
        throw error;
    }
}

export function parseWeapon (response: WeaponResponse): Weapon {
    const { id, supplement, category, name, type, skill, acc, atk, guard, rng, procure, stock, exp, rec, flavor, effect, price, rec_effect } = response;
    const weapon_base: Weapon = { kind:"weapon", id, supplement, category, name, type, skill, acc, atk, guard, rng, procure, stock, exp, rec, flavor, effect, price, rec_effect };
    const refed_power: Power|null = ("refed_power" in response && response.refed_power) ? {...parsePower(response.refed_power), ref_weapon: weapon_base} : null;
    const refed_armor: Armor|null = ("refed_armor" in response && response.refed_armor) ? {...parseArmor(response.refed_armor), ref_weapon: weapon_base} : null;
    const refed_general: General|null = ("refed_general" in response && response.refed_general) ? {...parseGeneral(response.refed_general), ref_weapon: weapon_base} : null;
    const other_vers: Weapon[] = ("other_vers" in response && response.other_vers) ? response.other_vers.map((res: WeaponResponse) => parseWeapon(res)) : [];
    const rel_powers: Power[] = ("rel_powers" in response && response.rel_powers) ? response.rel_powers.map((res: PowerResponse) => parsePower(res)) : [];
    const rel_weapons: Weapon[] = ("rel_weapons" in response && response.rel_weapons) ? response.rel_weapons.map((res: WeaponResponse) => parseWeapon(res)) : [];
    const rel_armors: Armor[] = ("rel_armors" in response && response.rel_armors) ? response.rel_armors.map((res: ArmorResponse) => parseArmor(res)) : [];
    const rel_vehicles: Vehicle[] = ("rel_vehicles" in response && response.rel_vehicles) ? response.rel_vehicles.map((res: VehicleResponse) => parseVehicle(res)) : [];
    const rel_connections: Connection[] = ("rel_connections" in response && response.rel_connections) ? response.rel_connections.map((res: ConnectionResponse) => parseConnection(res)) : [];
    const rel_generals: General[] = ("rel_generals" in response && response.rel_generals) ? response.rel_generals.map((res: GeneralResponse) => parseGeneral(res)) : [];
    const rel_dloises: Dlois[] = ("rel_dloises" in response && response.rel_dloises) ? response.rel_dloises.map((res: DloisResponse) => parseDlois(res)) : [];
    const rel_faqs: Faq[] = ("rel_faqs" in response && response.rel_faqs) ? response.rel_faqs.map((res: FaqResponse) => parseFaq(res)) : [];
    const rel_infos: Info[] = ("rel_infos" in response && response.rel_infos) ? response.rel_infos.map((res: InfoResponse) => parseInfo(res)) : [];
    const favorited_by: User[] = ("favorited_by" in response && response.favorited_by) ? response.favorited_by.map((res: UserResponse) => parseUser(res)) : [];
    return {
        ...weapon_base,
        refed_power,
        refed_armor,
        refed_general,
        other_vers,
        rel_powers,
        rel_weapons,
        rel_armors,
        rel_vehicles,
        rel_connections,
        rel_generals,
        rel_dloises,
        rel_faqs,
        rel_infos,
        favorited_by
    };
}

export function parseArmor (response: ArmorResponse): Armor {
    const { id, supplement, category, name, type, dodge, initiative, armor, procure, stock, exp, rec, flavor, effect, price, rec_effect } = response;
    const armor_base: Armor = { kind:"armor", id, supplement, category, name, type, dodge, initiative, armor, procure, stock, exp, rec, flavor, effect, price, rec_effect };
    const ref_weapon: Weapon|null = ("ref_weapon" in response && response.ref_weapon) ? parseWeapon(response.ref_weapon) : null;
    const refed_power: Power|null = ("refed_power" in response && response.refed_power) ? {...parsePower(response.refed_power), ref_armor: armor_base} : null;
    const other_vers: Armor[] = ("other_vers" in response && response.other_vers) ? response.other_vers.map((res: ArmorResponse) => parseArmor(res)) : [];
    const rel_powers: Power[] = ("rel_powers" in response && response.rel_powers) ? response.rel_powers.map((res: PowerResponse) => parsePower(res)) : [];
    const rel_weapons: Weapon[] = ("rel_weapons" in response && response.rel_weapons) ? response.rel_weapons.map((res: WeaponResponse) => parseWeapon(res)) : [];
    const rel_armors: Armor[] = ("rel_armors" in response && response.rel_armors) ? response.rel_armors.map((res: ArmorResponse) => parseArmor(res)) : [];
    const rel_vehicles: Vehicle[] = ("rel_vehicles" in response && response.rel_vehicles) ? response.rel_vehicles.map((res: VehicleResponse) => parseVehicle(res)) : [];
    const rel_connections: Connection[] = ("rel_connections" in response && response.rel_connections) ? response.rel_connections.map((res: ConnectionResponse) => parseConnection(res)) : [];
    const rel_generals: General[] = ("rel_generals" in response && response.rel_generals) ? response.rel_generals.map((res: GeneralResponse) => parseGeneral(res)) : [];
    const rel_dloises: Dlois[] = ("rel_dloises" in response && response.rel_dloises) ? response.rel_dloises.map((res: DloisResponse) => parseDlois(res)) : [];
    const rel_faqs: Faq[] = ("rel_faqs" in response && response.rel_faqs) ? response.rel_faqs.map((res: FaqResponse) => parseFaq(res)) : [];
    const rel_infos: Info[] = ("rel_infos" in response && response.rel_infos) ? response.rel_infos.map((res: InfoResponse) => parseInfo(res)) : [];
    const favorited_by: User[] = ("favorited_by" in response && response.favorited_by) ? response.favorited_by.map((res: UserResponse) => parseUser(res)) : [];
    return {
        ...armor_base,
        ref_weapon,
        refed_power,
        other_vers,
        rel_powers,
        rel_weapons,
        rel_armors,
        rel_vehicles,
        rel_connections,
        rel_generals,
        rel_dloises,
        rel_faqs,
        rel_infos,
        favorited_by
    };
}

export function parseVehicle (response: VehicleResponse): Vehicle {
    const { id, supplement, category, name, type, skill, atk, initiative, armor, dash, procure, stock, exp, rec, flavor, effect, price, rec_effect } = response;
    const vehicle_base: Vehicle = { kind:"vehicle", id, supplement, category, name, type, skill, atk, initiative, armor, dash, procure, stock, exp, rec, flavor, effect, price, rec_effect };
    const other_vers: Vehicle[] = ("other_vers" in response && response.other_vers) ? response.other_vers.map((res: VehicleResponse) => parseVehicle(res)) : [];
    const rel_powers: Power[] = ("rel_powers" in response && response.rel_powers) ? response.rel_powers.map((res: PowerResponse) => parsePower(res)) : [];
    const rel_weapons: Weapon[] = ("rel_weapons" in response && response.rel_weapons) ? response.rel_weapons.map((res: WeaponResponse) => parseWeapon(res)) : [];
    const rel_armors: Armor[] = ("rel_armors" in response && response.rel_armors) ? response.rel_armors.map((res: ArmorResponse) => parseArmor(res)) : [];
    const rel_vehicles: Vehicle[] = ("rel_vehicles" in response && response.rel_vehicles) ? response.rel_vehicles.map((res: VehicleResponse) => parseVehicle(res)) : [];
    const rel_connections: Connection[] = ("rel_connections" in response && response.rel_connections) ? response.rel_connections.map((res: ConnectionResponse) => parseConnection(res)) : [];
    const rel_generals: General[] = ("rel_generals" in response && response.rel_generals) ? response.rel_generals.map((res: GeneralResponse) => parseGeneral(res)) : [];
    const rel_dloises: Dlois[] = ("rel_dloises" in response && response.rel_dloises) ? response.rel_dloises.map((res: DloisResponse) => parseDlois(res)) : [];
    const rel_faqs: Faq[] = ("rel_faqs" in response && response.rel_faqs) ? response.rel_faqs.map((res: FaqResponse) => parseFaq(res)) : [];
    const rel_infos: Info[] = ("rel_infos" in response && response.rel_infos) ? response.rel_infos.map((res: InfoResponse) => parseInfo(res)) : [];
    const favorited_by: User[] = ("favorited_by" in response && response.favorited_by) ? response.favorited_by.map((res: UserResponse) => parseUser(res)) : [];
    return {
        ...vehicle_base,
        other_vers,
        rel_powers,
        rel_weapons,
        rel_armors,
        rel_vehicles,
        rel_connections,
        rel_generals,
        rel_dloises,
        rel_faqs,
        rel_infos,
        favorited_by
    };
}

export function parseConnection (response: ConnectionResponse): Connection {
    const { id, supplement, category, name, type, skill, procure, stock, exp, rec, flavor, effect, price, rec_effect } = response;
    const connection_base: Connection = { kind:"connection", id, supplement, category, name, type, skill, procure, stock, exp, rec, flavor, effect, price, rec_effect };
    const other_vers: Connection[] = ("other_vers" in response && response.other_vers) ? response.other_vers.map((res: ConnectionResponse) => parseConnection(res)) : [];
    const rel_powers: Power[] = ("rel_powers" in response && response.rel_powers) ? response.rel_powers.map((res: PowerResponse) => parsePower(res)) : [];
    const rel_weapons: Weapon[] = ("rel_weapons" in response && response.rel_weapons) ? response.rel_weapons.map((res: WeaponResponse) => parseWeapon(res)) : [];
    const rel_armors: Armor[] = ("rel_armors" in response && response.rel_armors) ? response.rel_armors.map((res: ArmorResponse) => parseArmor(res)) : [];
    const rel_vehicles: Vehicle[] = ("rel_vehicles" in response && response.rel_vehicles) ? response.rel_vehicles.map((res: VehicleResponse) => parseVehicle(res)) : [];
    const rel_connections: Connection[] = ("rel_connections" in response && response.rel_connections) ? response.rel_connections.map((res: ConnectionResponse) => parseConnection(res)) : [];
    const rel_generals: General[] = ("rel_generals" in response && response.rel_generals) ? response.rel_generals.map((res: GeneralResponse) => parseGeneral(res)) : [];
    const rel_dloises: Dlois[] = ("rel_dloises" in response && response.rel_dloises) ? response.rel_dloises.map((res: DloisResponse) => parseDlois(res)) : [];
    const rel_faqs: Faq[] = ("rel_faqs" in response && response.rel_faqs) ? response.rel_faqs.map((res: FaqResponse) => parseFaq(res)) : [];
    const rel_infos: Info[] = ("rel_infos" in response && response.rel_infos) ? response.rel_infos.map((res: InfoResponse) => parseInfo(res)) : [];
    const favorited_by: User[] = ("favorited_by" in response && response.favorited_by) ? response.favorited_by.map((res: UserResponse) => parseUser(res)) : [];
    return {
        ...connection_base,
        other_vers,
        rel_powers,
        rel_weapons,
        rel_armors,
        rel_vehicles,
        rel_connections,
        rel_generals,
        rel_dloises,
        rel_faqs,
        rel_infos,
        favorited_by
    };
}

export function parseGeneral (response: GeneralResponse): General {
    const { id, supplement, category, name, type, procure, stock, exp, rec, flavor, effect, price, rec_effect } = response;
    const general_base: General = { kind:"general", id, supplement, category, name, type, procure, stock, exp, rec, flavor, effect, price, rec_effect };
    const ref_weapon = ("ref_weapon" in response && response.ref_weapon) ? parseWeapon(response.ref_weapon) : null;
    const other_vers: General[] = ("other_vers" in response && response.other_vers) ? response.other_vers.map((res: GeneralResponse) => parseGeneral(res)) : [];
    const rel_powers: Power[] = ("rel_powers" in response && response.rel_powers) ? response.rel_powers.map((res: PowerResponse) => parsePower(res)) : [];
    const rel_weapons: Weapon[] = ("rel_weapons" in response && response.rel_weapons) ? response.rel_weapons.map((res: WeaponResponse) => parseWeapon(res)) : [];
    const rel_armors: Armor[] = ("rel_armors" in response && response.rel_armors) ? response.rel_armors.map((res: ArmorResponse) => parseArmor(res)) : [];
    const rel_vehicles: Vehicle[] = ("rel_vehicles" in response && response.rel_vehicles) ? response.rel_vehicles.map((res: VehicleResponse) => parseVehicle(res)) : [];
    const rel_connections: Connection[] = ("rel_connections" in response && response.rel_connections) ? response.rel_connections.map((res: ConnectionResponse) => parseConnection(res)) : [];
    const rel_generals: General[] = ("rel_generals" in response && response.rel_generals) ? response.rel_generals.map((res: GeneralResponse) => parseGeneral(res)) : [];
    const rel_dloises: Dlois[] = ("rel_dloises" in response && response.rel_dloises) ? response.rel_dloises.map((res: DloisResponse) => parseDlois(res)) : [];
    const rel_faqs: Faq[] = ("rel_faqs" in response && response.rel_faqs) ? response.rel_faqs.map((res: FaqResponse) => parseFaq(res)) : [];
    const rel_infos: Info[] = ("rel_infos" in response && response.rel_infos) ? response.rel_infos.map((res: InfoResponse) => parseInfo(res)) : [];
    const favorited_by: User[] = ("favorited_by" in response && response.favorited_by) ? response.favorited_by.map((res: UserResponse) => parseUser(res)) : [];
    return {
        ...general_base,
        ref_weapon,
        other_vers,
        rel_powers,
        rel_weapons,
        rel_armors,
        rel_vehicles,
        rel_connections,
        rel_generals,
        rel_dloises,
        rel_faqs,
        rel_infos,
        favorited_by
    };
}

export function parseDlois (response: DloisResponse): Dlois {
    const { id, supplement, type, name, restrict, flavor, description, rec, effect, rec_effect, flavor_summary, effect_summary, rec_effect_summary } = response;
    const dlois_base: Dlois = { kind:"dlois", id, supplement, type, name, restrict, flavor, description, rec, effect, rec_effect, flavor_summary, effect_summary, rec_effect_summary };
    const ref_power = ("ref_power" in response && response.ref_power) ? parsePower(response.ref_power) : null;
    const other_vers: Dlois[] = ("other_vers" in response && response.other_vers) ? response.other_vers.map((res: DloisResponse) => parseDlois(res)) : [];
    const rel_powers: Power[] = ("rel_powers" in response && response.rel_powers) ? response.rel_powers.map((res: PowerResponse) => parsePower(res)) : [];
    const rel_weapons: Weapon[] = ("rel_weapons" in response && response.rel_weapons) ? response.rel_weapons.map((res: WeaponResponse) => parseWeapon(res)) : [];
    const rel_armors: Armor[] = ("rel_armors" in response && response.rel_armors) ? response.rel_armors.map((res: ArmorResponse) => parseArmor(res)) : [];
    const rel_vehicles: Vehicle[] = ("rel_vehicles" in response && response.rel_vehicles) ? response.rel_vehicles.map((res: VehicleResponse) => parseVehicle(res)) : [];
    const rel_connections: Connection[] = ("rel_connections" in response && response.rel_connections) ? response.rel_connections.map((res: ConnectionResponse) => parseConnection(res)) : [];
    const rel_generals: General[] = ("rel_generals" in response && response.rel_generals) ? response.rel_generals.map((res: GeneralResponse) => parseGeneral(res)) : [];
    const rel_dloises: Dlois[] = ("rel_dloises" in response && response.rel_dloises) ? response.rel_dloises.map((res: DloisResponse) => parseDlois(res)) : [];
    const rel_faqs: Faq[] = ("rel_faqs" in response && response.rel_faqs) ? response.rel_faqs.map((res: FaqResponse) => parseFaq(res)) : [];
    const rel_infos: Info[] = ("rel_infos" in response && response.rel_infos) ? response.rel_infos.map((res: InfoResponse) => parseInfo(res)) : [];
    const favorited_by: User[] = ("favorited_by" in response && response.favorited_by) ? response.favorited_by.map((res: UserResponse) => parseUser(res)) : [];
    return {
        ...dlois_base,
        ref_power,
        other_vers,
        rel_powers,
        rel_weapons,
        rel_armors,
        rel_vehicles,
        rel_connections,
        rel_generals,
        rel_dloises,
        rel_faqs,
        rel_infos,
        favorited_by
    };
}

export function parseElois (response: EloisResponse): Elois {
    const { id, supplement, type, name, timing, skill, dfclty, target, rng, urge, flavor, effect } = response;
    const elois_base: Elois = { kind:"elois", id, supplement, type, name, timing, skill, dfclty, target, rng, urge, flavor, effect };
    const other_vers: Elois[] = ("other_vers" in response && response.other_vers) ? response.other_vers.map((res: EloisResponse) => parseElois(res)) : [];
    const rel_eloises: Elois[] = ("rel_eloises" in response && response.rel_eloises) ? response.rel_eloises.map((res: EloisResponse) => parseElois(res)) : [];
    const rel_faqs: Faq[] = ("rel_faqs" in response && response.rel_faqs) ? response.rel_faqs.map((res: FaqResponse) => parseFaq(res)) : [];
    const rel_infos: Info[] = ("rel_infos" in response && response.rel_infos) ? response.rel_infos.map((res: InfoResponse) => parseInfo(res)) : [];
    const favorited_by: User[] = ("favorited_by" in response && response.favorited_by) ? response.favorited_by.map((res: UserResponse) => parseUser(res)) : [];
    return {
        ...elois_base,
        other_vers,
        rel_eloises,
        rel_faqs,
        rel_infos,
        favorited_by
    };
}

export function parseWork (response: WorkResponse): Work {
    const { id, supplement, name, stat, skills, emblems } = response;
    const work_base: Work = { kind:"work", id, supplement, name, stat, skills, emblems };
    return {
        ...work_base
    };
}

export function parseFaq (response: FaqResponse): Faq {
    const { id, q, a } = response;
    const faq_base: Faq = { kind:"faq", id, q, a };
    const rel_powers: Power[] = ("rel_powers" in response && response.rel_powers) ? response.rel_powers.map((res: PowerResponse) => parsePower(res)) : [];
    const rel_weapons: Weapon[] = ("rel_weapons" in response && response.rel_weapons) ? response.rel_weapons.map((res: WeaponResponse) => parseWeapon(res)) : [];
    const rel_armors: Armor[] = ("rel_armors" in response && response.rel_armors) ? response.rel_armors.map((res: ArmorResponse) => parseArmor(res)) : [];
    const rel_vehicles: Vehicle[] = ("rel_vehicles" in response && response.rel_vehicles) ? response.rel_vehicles.map((res: VehicleResponse) => parseVehicle(res)) : [];
    const rel_connections: Connection[] = ("rel_connections" in response && response.rel_connections) ? response.rel_connections.map((res: ConnectionResponse) => parseConnection(res)) : [];
    const rel_generals: General[] = ("rel_generals" in response && response.rel_generals) ? response.rel_generals.map((res: GeneralResponse) => parseGeneral(res)) : [];
    const rel_dloises: Dlois[] = ("rel_dloises" in response && response.rel_dloises) ? response.rel_dloises.map((res: DloisResponse) => parseDlois(res)) : [];
    const rel_eloises: Elois[] = ("rel_eloises" in response && response.rel_eloises) ? response.rel_eloises.map((res: EloisResponse) => parseElois(res)) : [];
    return {
        ...faq_base,
        rel_powers,
        rel_weapons,
        rel_armors,
        rel_vehicles,
        rel_connections,
        rel_generals,
        rel_dloises,
        rel_eloises
    };
}

export function parseInfo (response: InfoResponse): Info {
    const { id, title, content } = response;
    const info_base: Info = { kind:"info", id, title, content };
    const rel_powers: Power[] = ("rel_powers" in response && response.rel_powers) ? response.rel_powers.map((res: PowerResponse) => parsePower(res)) : [];
    const rel_weapons: Weapon[] = ("rel_weapons" in response && response.rel_weapons) ? response.rel_weapons.map((res: WeaponResponse) => parseWeapon(res)) : [];
    const rel_armors: Armor[] = ("rel_armors" in response && response.rel_armors) ? response.rel_armors.map((res: ArmorResponse) => parseArmor(res)) : [];
    const rel_vehicles: Vehicle[] = ("rel_vehicles" in response && response.rel_vehicles) ? response.rel_vehicles.map((res: VehicleResponse) => parseVehicle(res)) : [];
    const rel_connections: Connection[] = ("rel_connections" in response && response.rel_connections) ? response.rel_connections.map((res: ConnectionResponse) => parseConnection(res)) : [];
    const rel_generals: General[] = ("rel_generals" in response && response.rel_generals) ? response.rel_generals.map((res: GeneralResponse) => parseGeneral(res)) : [];
    const rel_dloises: Dlois[] = ("rel_dloises" in response && response.rel_dloises) ? response.rel_dloises.map((res: DloisResponse) => parseDlois(res)) : [];
    const rel_eloises: Elois[] = ("rel_eloises" in response && response.rel_eloises) ? response.rel_eloises.map((res: EloisResponse) => parseElois(res)) : [];
    return {
        ...info_base,
        rel_powers,
        rel_weapons,
        rel_armors,
        rel_vehicles,
        rel_connections,
        rel_generals,
        rel_dloises,
        rel_eloises
    };
}

export function parseUser (response: UserResponse): User {
    const { id } = response;
    const user_base: User = { id };
    const fav_powers: Power[] = ("fav_powers" in response && response.fav_powers) ? response.fav_powers.map((res: PowerResponse) => parsePower(res)) : [];
    const fav_weapons: Weapon[] = ("fav_weapons" in response && response.fav_weapons) ? response.fav_weapons.map((res: WeaponResponse) => parseWeapon(res)) : [];
    const fav_armors: Armor[] = ("fav_armors" in response && response.fav_armors) ? response.fav_armors.map((res: ArmorResponse) => parseArmor(res)) : [];
    const fav_vehicles: Vehicle[] = ("fav_vehicles" in response && response.fav_vehicles) ? response.fav_vehicles.map((res: VehicleResponse) => parseVehicle(res)) : [];
    const fav_connections: Connection[] = ("fav_connections" in response && response.fav_connections) ? response.fav_connections.map((res: ConnectionResponse) => parseConnection(res)) : [];
    const fav_generals: General[] = ("fav_generals" in response && response.fav_generals) ? response.fav_generals.map((res: GeneralResponse) => parseGeneral(res)) : [];
    const fav_dloises: Dlois[] = ("fav_dloises" in response && response.fav_dloises) ? response.fav_dloises.map((res: DloisResponse) => parseDlois(res)) : [];
    const fav_eloises: Elois[] = ("fav_eloises" in response && response.fav_eloises) ? response.fav_eloises.map((res: EloisResponse) => parseElois(res)) : [];
    return {
        ...user_base,
        fav_powers,
        fav_weapons,
        fav_armors,
        fav_vehicles,
        fav_connections,
        fav_generals,
        fav_dloises,
        fav_eloises
    };
}
